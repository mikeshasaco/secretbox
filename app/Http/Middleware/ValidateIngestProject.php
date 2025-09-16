<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateIngestProject
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
        $visitorKey = $request->header('X-Visitor-Key');

        if (!$apiKey || !$projectId || !$visitorKey) {
            return response()->json(['error' => 'Missing required headers: X-Api-Key, X-Project-Id, X-Visitor-Key'], 401);
        }

        $project = Project::where('id', $projectId)
            ->where('public_key', $apiKey)
            ->where('is_active', true)
            ->first();

        if (!$project) {
            return response()->json(['error' => 'Invalid API key or project ID'], 401);
        }

        // Update last used timestamp
        $project->update(['last_used_at' => now()]);

        // Add project and visitor key to request for use in controllers
        $request->merge([
            'project' => $project,
            'visitor_key' => $visitorKey
        ]);

        return $next($request);
    }
}