<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Models\Visitor;
use App\Models\Session;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IngestEventTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->project = Project::factory()->create([
            'owner_user_id' => $this->user->id,
            'public_key' => 'pk_test_1234567890abcdef',
            'secret_key' => 'sk_test_1234567890abcdef',
            'is_active' => true,
        ]);
    }

    public function test_ingest_event_with_valid_headers_creates_visitor_and_session()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
            'url' => 'https://example.com/test',
            'path' => '/test',
            'title' => 'Test Page',
            'referrer' => 'https://google.com',
            'scroll_pct' => 25,
            'utm_source' => 'facebook',
            'utm_campaign_id' => '123',
            'utm_ad_id' => '456',
            'fbclid' => 'FB123456789',
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
            'X-Timezone' => 'America/New_York',
            'X-Viewport-Width' => '1920',
            'X-Viewport-Height' => '1080',
        ]);

        $response->assertStatus(200)
            ->assertJson(['ok' => true]);

        // Assert visitor was created
        $this->assertDatabaseHas('visitors', [
            'project_id' => $this->project->id,
            'visitor_key' => 'vis_test123',
        ]);

        $visitor = Visitor::where('visitor_key', 'vis_test123')->first();
        $this->assertNotNull($visitor);
        $this->assertEquals('facebook', $visitor->first_utm['utm_source']);
        $this->assertEquals('123', $visitor->first_utm['utm_campaign_id']);
        $this->assertEquals('456', $visitor->first_utm['utm_ad_id']);
        $this->assertEquals('FB123456789', $visitor->first_utm['fbclid']);

        // Assert session was created
        $this->assertDatabaseHas('tracking_sessions', [
            'project_id' => $this->project->id,
            'visitor_id' => $visitor->id,
            'session_key' => 'sess_test123',
        ]);

        $session = Session::where('session_key', 'sess_test123')->first();
        $this->assertNotNull($session);
        $this->assertEquals('https://example.com/test', $session->landing_url);
        $this->assertEquals('https://google.com', $session->landing_referrer);
        $this->assertEquals('facebook', $session->utm_source);
        $this->assertEquals('123', $session->utm_campaign_id);
        $this->assertEquals('456', $session->utm_ad_id);
        $this->assertEquals(25, $session->scroll_pct);

        // Assert event was created
        $this->assertDatabaseHas('events', [
            'project_id' => $this->project->id,
            'visitor_id' => $visitor->id,
            'session_id' => $session->id,
            'event_type' => 'page_view',
            'name' => 'Page View',
            'url' => 'https://example.com/test',
            'path' => '/test',
            'scroll_pct' => 25,
        ]);
    }

    public function test_ingest_event_with_invalid_api_key_returns_401()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
        ], [
            'X-Api-Key' => 'invalid_key',
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Invalid API key or project ID']);
    }

    public function test_ingest_event_with_missing_headers_returns_401()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Missing required headers: X-Api-Key, X-Project-Id, X-Visitor-Key']);
    }

    public function test_ingest_event_with_inactive_project_returns_401()
    {
        $this->project->update(['is_active' => false]);

        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Invalid API key or project ID']);
    }

    public function test_ingest_event_updates_existing_visitor()
    {
        // Create existing visitor
        $visitor = Visitor::create([
            'project_id' => $this->project->id,
            'visitor_key' => 'vis_test123',
            'first_seen_at' => now()->subDays(1),
            'last_seen_at' => now()->subHours(1),
            'sessions_count' => 0,
            'is_bot' => false,
            'first_utm' => ['utm_source' => 'google'],
            'last_utm' => ['utm_source' => 'google'],
        ]);

        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
            'utm_source' => 'facebook',
            'utm_campaign_id' => '789',
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(200);

        // Assert visitor was updated
        $visitor->refresh();
        $this->assertEquals('facebook', $visitor->last_utm['utm_source']);
        $this->assertEquals('789', $visitor->last_utm['utm_campaign_id']);
        $this->assertEquals('google', $visitor->first_utm['utm_source']); // Should not change
    }

    public function test_ingest_event_updates_existing_session()
    {
        // Create visitor and session
        $visitor = Visitor::create([
            'project_id' => $this->project->id,
            'visitor_key' => 'vis_test123',
            'first_seen_at' => now(),
            'last_seen_at' => now(),
            'sessions_count' => 0,
            'is_bot' => false,
        ]);

        $session = Session::create([
            'project_id' => $this->project->id,
            'visitor_id' => $visitor->id,
            'session_key' => 'sess_test123',
            'started_at' => now()->subSeconds(30),
            'last_activity_at' => now()->subSeconds(10),
            'scroll_pct' => 10,
        ]);

        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'scroll',
            'name' => 'Scroll 50%',
            'scroll_pct' => 50,
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(200);

        // Assert session was updated
        $session->refresh();
        $this->assertEquals(50, $session->scroll_pct); // Should update to max
        $this->assertGreaterThan(0, $session->duration_seconds);
    }

    public function test_ingest_event_handles_click_events()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'click',
            'name' => 'Click',
            'selector' => '#button-1',
            'x' => 100,
            'y' => 200,
            'meta' => [
                'element_text' => 'Click Me',
                'element_tag' => 'button',
            ],
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('events', [
            'project_id' => $this->project->id,
            'event_type' => 'click',
            'name' => 'Click',
            'selector' => '#button-1',
            'x' => 100,
            'y' => 200,
            'meta' => json_encode([
                'element_text' => 'Click Me',
                'element_tag' => 'button',
            ]),
        ]);
    }

    public function test_ingest_event_handles_custom_events()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'custom',
            'name' => 'Form Submit',
            'meta' => [
                'form_id' => 'contact-form',
                'form_name' => 'Contact Us',
                'fields_completed' => 5,
            ],
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('events', [
            'project_id' => $this->project->id,
            'event_type' => 'custom',
            'name' => 'Form Submit',
            'meta' => json_encode([
                'form_id' => 'contact-form',
                'form_name' => 'Contact Us',
                'fields_completed' => 5,
            ]),
        ]);
    }

    public function test_ingest_event_validates_required_fields()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            // Missing required fields
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['session_key', 'event_type', 'name']);
    }

    public function test_ingest_event_validates_scroll_percentage()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
            'scroll_pct' => 150, // Invalid: > 100
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['scroll_pct']);
    }

    public function test_ingest_event_handles_all_click_ids()
    {
        $response = $this->postJson('/api/v1/ingest/event', [
            'session_key' => 'sess_test123',
            'event_type' => 'page_view',
            'name' => 'Page View',
            'fbclid' => 'FB123456789',
            'gclid' => 'GA123456789',
            'msclkid' => 'MS123456789',
            'ttclid' => 'TT123456789',
            'clid' => 'CL123456789',
        ], [
            'X-Api-Key' => $this->project->public_key,
            'X-Project-Id' => $this->project->id,
            'X-Visitor-Key' => 'vis_test123',
        ]);

        $response->assertStatus(200);

        $visitor = Visitor::where('visitor_key', 'vis_test123')->first();
        $this->assertNotNull($visitor);
        $this->assertEquals('FB123456789', $visitor->first_utm['fbclid']);
        $this->assertEquals('GA123456789', $visitor->first_utm['gclid']);
        $this->assertEquals('MS123456789', $visitor->first_utm['msclkid']);
        $this->assertEquals('TT123456789', $visitor->first_utm['ttclid']);
        $this->assertEquals('CL123456789', $visitor->first_utm['clid']);
    }
}
