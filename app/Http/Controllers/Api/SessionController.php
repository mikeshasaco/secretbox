<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SessionController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $query = Session::where('project_id', $project->id);

        // Apply filters
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $sessions = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($sessions);
    }

    public function show(Session $session)
    {
        $this->authorize('view', $session->project);

        return response()->json($session);
    }
}
