<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\DailyRollup;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RollupController extends Controller
{
    use AuthorizesRequests;
    public function indexByRange(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $query = DailyRollup::where('project_id', $project->id);

        // Apply date range filters
        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $rollups = $query->orderBy('date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($rollups);
    }
}
