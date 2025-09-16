<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Project;
use App\Models\Session;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);
        
        $query = $project->events()->with(['session', 'visitor']);

        // Apply filters
        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        if ($request->has('from')) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->where('created_at', '<=', $request->to);
        }
        if ($request->has('path')) {
            $query->where('path', 'like', '%' . $request->path . '%');
        }

        $events = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json([
            'data' => $events->items(),
            'meta' => [
                'pagination' => [
                    'current_page' => $events->currentPage(),
                    'last_page' => $events->lastPage(),
                    'per_page' => $events->perPage(),
                    'total' => $events->total(),
                ],
                'filters' => $request->only(['event_type', 'name', 'from', 'to', 'path']),
            ],
        ]);
    }

    public function storeIngest(Request $request): JsonResponse
    {
        $request->validate([
            'session_key' => 'required|string',
            'event_type' => 'required|string',
            'name' => 'required|string',
            'url' => 'nullable|url',
            'path' => 'nullable|string',
            'title' => 'nullable|string',
            'referrer' => 'nullable|string',
            'selector' => 'nullable|string',
            'scroll_pct' => 'nullable|numeric|min:0|max:100',
            'x' => 'nullable|integer',
            'y' => 'nullable|integer',
            'meta' => 'nullable|array',
            // UTM parameters
            'utm_source' => 'nullable|string',
            'utm_medium' => 'nullable|string',
            'utm_campaign_id' => 'nullable|string',
            'utm_campaign_name' => 'nullable|string',
            'utm_adset_id' => 'nullable|string',
            'utm_adset_name' => 'nullable|string',
            'utm_ad_id' => 'nullable|string',
            'utm_ad_name' => 'nullable|string',
            'utm_placement' => 'nullable|string',
            // Click IDs
            'fbclid' => 'nullable|string',
            'gclid' => 'nullable|string',
            'msclkid' => 'nullable|string',
            'ttclid' => 'nullable|string',
            'clid' => 'nullable|string',
        ]);

        $project = $request->get('project');
        $visitorKey = $request->get('visitor_key');

        // Find or create visitor
        $visitor = $this->findOrCreateVisitor($project, $visitorKey, $request);

        // Find or create session
        $session = $this->findOrCreateSession($project, $visitor, $request);

        // Create event
        $event = Event::create([
            'project_id' => $project->id,
            'session_id' => $session->id,
            'visitor_id' => $visitor->id,
            'event_type' => $request->event_type,
            'name' => $request->name,
            'url' => $request->url,
            'path' => $request->path,
            'selector' => $request->selector,
            'scroll_pct' => $request->scroll_pct,
            'x' => $request->x,
            'y' => $request->y,
            'meta' => $request->meta,
            'created_at' => now(),
        ]);

        // Update session last activity and scroll percentage
        $session->update([
            'last_activity_at' => now(),
            'scroll_pct' => max($session->scroll_pct ?? 0, $request->scroll_pct ?? 0),
            'duration_seconds' => abs(now()->diffInSeconds($session->started_at))
        ]);

        return response()->json(['ok' => true], 200);
    }

    private function findOrCreateVisitor($project, $visitorKey, Request $request)
    {
        $visitor = Visitor::where('project_id', $project->id)
            ->where('visitor_key', $visitorKey)
            ->first();

        $utmParams = $this->extractUtmParams($request);
        $isNewVisitor = !$visitor;

        if ($isNewVisitor) {
            $visitor = Visitor::create([
                'project_id' => $project->id,
                'visitor_key' => $visitorKey,
                'first_seen_at' => now(),
                'last_seen_at' => now(),
                'sessions_count' => 0,
                'is_bot' => $this->isBot($request),
                'timezone' => $request->header('X-Timezone'),
                'viewport_w' => $request->header('X-Viewport-Width'),
                'viewport_h' => $request->header('X-Viewport-Height'),
                'user_agent' => $request->userAgent(),
                'first_utm' => $utmParams,
                'last_utm' => $utmParams,
            ]);
        } else {
            // Update existing visitor
            $visitor->update([
                'last_seen_at' => now(),
                'user_agent' => $request->userAgent(),
                'viewport_w' => $request->header('X-Viewport-Width'),
                'viewport_h' => $request->header('X-Viewport-Height'),
                'last_utm' => $utmParams,
            ]);
        }

        return $visitor;
    }

    private function findOrCreateSession($project, $visitor, Request $request)
    {
        $sessionKey = $request->session_key;
        
        $session = Session::where('project_id', $project->id)
            ->where('session_key', $sessionKey)
            ->first();

        if (!$session) {
            $session = Session::create([
                'project_id' => $project->id,
                'visitor_id' => $visitor->id,
                'session_key' => $sessionKey,
                'started_at' => now(),
                'last_activity_at' => now(),
                'landing_url' => $request->url,
                'landing_referrer' => $request->referrer,
                'utm_source' => $request->utm_source,
                'utm_medium' => $request->utm_medium,
                'utm_campaign_id' => $request->utm_campaign_id,
                'utm_campaign_name' => $request->utm_campaign_name,
                'utm_adset_id' => $request->utm_adset_id,
                'utm_adset_name' => $request->utm_adset_name,
                'utm_ad_id' => $request->utm_ad_id,
                'utm_ad_name' => $request->utm_ad_name,
                'utm_placement' => $request->utm_placement,
                'scroll_pct' => $request->scroll_pct ?? 0,
            ]);

            // Update visitor session count
            $visitor->increment('sessions_count');
        }

        return $session;
    }

    private function isBot(Request $request): bool
    {
        $userAgent = $request->userAgent();
        $botPatterns = ['bot', 'crawler', 'spider', 'scraper'];
        
        foreach ($botPatterns as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }

    private function extractUtmParams(Request $request): array
    {
        return [
            'utm_source' => $request->utm_source,
            'utm_medium' => $request->utm_medium,
            'utm_campaign' => $request->utm_campaign,
            'utm_campaign_id' => $request->utm_campaign_id,
            'utm_campaign_name' => $request->utm_campaign_name,
            'utm_adset_id' => $request->utm_adset_id,
            'utm_adset_name' => $request->utm_adset_name,
            'utm_ad_id' => $request->utm_ad_id,
            'utm_ad_name' => $request->utm_ad_name,
            'utm_placement' => $request->utm_placement,
            // Click IDs
            'fbclid' => $request->fbclid,
            'gclid' => $request->gclid,
            'msclkid' => $request->msclkid,
            'ttclid' => $request->ttclid,
            'clid' => $request->clid,
        ];
    }
}
