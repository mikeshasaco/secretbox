<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Auth::user()->projects()->paginate(15);

        return response()->json([
            'data' => $projects->items(),
            'meta' => [
                'pagination' => [
                    'current_page' => $projects->currentPage(),
                    'last_page' => $projects->lastPage(),
                    'per_page' => $projects->perPage(),
                    'total' => $projects->total(),
                ],
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:projects,name,NULL,id,owner_user_id,' . Auth::id(),
        ]);

        $project = Auth::user()->projects()->create([
            'name' => $request->name,
        ]);

        return response()->json($project, 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json($project);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'name' => 'required|string|max:255|unique:projects,name,' . $project->id . ',id,owner_user_id,' . Auth::id(),
        ]);

        $project->update($request->only('name'));

        return response()->json($project);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function rotateKeys(Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->rotateKeys();

        return response()->json([
            'message' => 'API keys rotated successfully',
            'public_key' => $project->public_key,
            'secret_prefix' => $project->secret_prefix,
            'secret_last4' => $project->secret_last4,
        ]);
    }
}
