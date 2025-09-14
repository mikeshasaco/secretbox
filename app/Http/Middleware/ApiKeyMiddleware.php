<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-Api-Key');
        $projectId = $request->header('X-Project-Id');

        if (!$apiKey || !$projectId) {
            return response()->json(['error' => 'Missing API key or project ID'], 401);
        }

        $apiKeyModel = ApiKey::where('secret_hash', hash('sha256', $apiKey))
            ->where('is_active', true)
            ->first();

        if (!$apiKeyModel) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        $project = Project::where('id', $projectId)
            ->where('is_active', true)
            ->first();

        if (!$project || $apiKeyModel->project_id !== $project->id) {
            return response()->json(['error' => 'Invalid project or API key mismatch'], 401);
        }

        // Update last used timestamp
        $apiKeyModel->update(['last_used_at' => now()]);
        $project->update(['last_used_at' => now()]);

        // Add project to request for use in controllers
        $request->merge(['project' => $project]);

        return $next($request);
    }
}
