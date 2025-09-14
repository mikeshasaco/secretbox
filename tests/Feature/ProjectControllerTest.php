<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $projectData = [
            'name' => 'Test Project',
            'description' => 'A test project',
            'website_url' => 'https://example.com',
        ];

        $response = $this->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'website_url',
                'public_key',
                'secret_key',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'description' => 'A test project',
            'website_url' => 'https://example.com',
            'owner_user_id' => $user->id,
        ]);
    }

    public function test_user_can_list_their_projects()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Project::factory()->count(3)->create(['owner_user_id' => $user->id]);
        Project::factory()->create(); // Another user's project

        $response = $this->getJson('/api/v1/projects');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_update_their_project()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::factory()->create(['owner_user_id' => $user->id]);

        $updateData = [
            'name' => 'Updated Project Name',
            'description' => 'Updated description',
        ];

        $response = $this->putJson("/api/v1/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Project Name',
                'description' => 'Updated description',
            ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
            'description' => 'Updated description',
        ]);
    }

    public function test_user_can_rotate_project_keys()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::factory()->create(['owner_user_id' => $user->id]);
        $oldPublicKey = $project->public_key;
        $oldSecretKey = $project->secret_key;

        $response = $this->postJson("/api/v1/projects/{$project->id}/rotate-keys");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'public_key',
                'secret_key',
                'masked_secret_key',
            ]);

        $project->refresh();
        $this->assertNotEquals($oldPublicKey, $project->public_key);
        $this->assertNotEquals($oldSecretKey, $project->secret_key);
    }

    public function test_user_cannot_access_other_users_projects()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        $project = Project::factory()->create(['owner_user_id' => $otherUser->id]);

        $response = $this->getJson("/api/v1/projects/{$project->id}");

        $response->assertStatus(403);
    }

    public function test_project_creation_requires_authentication()
    {
        $projectData = [
            'name' => 'Test Project',
        ];

        $response = $this->postJson('/api/v1/projects', $projectData);

        $response->assertStatus(401);
    }
}