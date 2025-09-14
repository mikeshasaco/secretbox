<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdsDim;
use Illuminate\Http\Request;

class AdsController extends Controller
{
    public function dimIndex(Request $request)
    {
        $query = AdsDim::query();

        // Apply filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $ads = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($ads);
    }

    public function engagementByRange(Request $request)
    {
        // This would typically use a materialized view or complex query
        // For now, return a simple response
        return response()->json([
            'data' => [],
            'message' => 'Engagement data not yet implemented'
        ]);
    }
}
