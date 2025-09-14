<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class VisitorController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $query = Visitor::where('project_id', $project->id);

        // Apply filters
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $visitors = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($visitors);
    }

    public function show(Visitor $visitor)
    {
        $this->authorize('view', $visitor->project);

        return response()->json($visitor);
    }
}
