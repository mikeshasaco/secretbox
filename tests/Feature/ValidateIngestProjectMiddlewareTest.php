<?php

namespace Tests\Feature;

use App\Http\Middleware\ValidateIngestProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;

class ValidateIngestProjectMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_middleware_passes_with_valid_api_key_and_project_id()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'owner_user_id' => $user->id,
            'public_key' => 'pk_test123',
            'is_active' => true,
        ]);

        $request = Request::create('/test', 'POST');
        $request->headers->set('X-Api-Key', 'pk_test123');
        $request->headers->set('X-Project-Id', $project->id);

        $middleware = new ValidateIngestProject();
        $response = $middleware->handle($request, function ($req) {
            return new Response('OK', 200);
        });

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($project->id, $request->get('project')->id);
    }

    public function test_middleware_rejects_missing_api_key()
    {
        $request = Request::create('/test', 'POST');
        $request->headers->set('X-Project-Id', '1');

        $middleware = new ValidateIngestProject();
        $response = $middleware->handle($request, function ($req) {
            return new Response('OK', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    public function test_middleware_rejects_missing_project_id()
    {
        $request = Request::create('/test', 'POST');
        $request->headers->set('X-Api-Key', 'pk_test123');

        $middleware = new ValidateIngestProject();
        $response = $middleware->handle($request, function ($req) {
            return new Response('OK', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    public function test_middleware_rejects_invalid_api_key()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'owner_user_id' => $user->id,
            'public_key' => 'pk_test123',
            'is_active' => true,
        ]);

        $request = Request::create('/test', 'POST');
        $request->headers->set('X-Api-Key', 'pk_invalid');
        $request->headers->set('X-Project-Id', $project->id);

        $middleware = new ValidateIngestProject();
        $response = $middleware->handle($request, function ($req) {
            return new Response('OK', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    public function test_middleware_rejects_inactive_project()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'owner_user_id' => $user->id,
            'public_key' => 'pk_test123',
            'is_active' => false,
        ]);

        $request = Request::create('/test', 'POST');
        $request->headers->set('X-Api-Key', 'pk_test123');
        $request->headers->set('X-Project-Id', $project->id);

        $middleware = new ValidateIngestProject();
        $response = $middleware->handle($request, function ($req) {
            return new Response('OK', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }
}