<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Session;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $project = $request->get('project');
        
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
            'selector' => 'nullable|string',
            'scroll_pct' => 'nullable|numeric|min:0|max:100',
            'x' => 'nullable|integer',
            'y' => 'nullable|integer',
            'meta' => 'nullable|array',
        ]);

        $project = $request->get('project');

        // Find or create visitor
        $visitor = $this->findOrCreateVisitor($project, $request);

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

        // Update session last activity
        $session->update(['last_activity_at' => now()]);

        return response()->json(['success' => true], 201);
    }

    private function findOrCreateVisitor($project, Request $request)
    {
        $visitorKey = $request->header('X-Visitor-Key', Str::random(32));
        
        return Visitor::firstOrCreate(
            [
                'project_id' => $project->id,
                'visitor_key' => $visitorKey,
            ],
            [
                'first_seen_at' => now(),
                'last_seen_at' => now(),
                'sessions_count' => 0,
                'is_bot' => $this->isBot($request),
                'timezone' => $request->header('X-Timezone'),
                'viewport_w' => $request->header('X-Viewport-Width'),
                'viewport_h' => $request->header('X-Viewport-Height'),
                'user_agent' => $request->userAgent(),
                'first_utm' => $this->extractUtmParams($request),
                'last_utm' => $this->extractUtmParams($request),
            ]
        );
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
                'landing_referrer' => $request->header('Referer'),
                'utm_source' => $request->get('utm_source'),
                'utm_medium' => $request->get('utm_medium'),
                'utm_campaign_id' => $request->get('utm_campaign_id'),
                'utm_campaign_name' => $request->get('utm_campaign_name'),
                'utm_adset_id' => $request->get('utm_adset_id'),
                'utm_adset_name' => $request->get('utm_adset_name'),
                'utm_ad_id' => $request->get('utm_ad_id'),
                'utm_ad_name' => $request->get('utm_ad_name'),
                'utm_placement' => $request->get('utm_placement'),
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
            'utm_source' => $request->get('utm_source'),
            'utm_medium' => $request->get('utm_medium'),
            'utm_campaign' => $request->get('utm_campaign'),
            'utm_campaign_id' => $request->get('utm_campaign_id'),
            'utm_campaign_name' => $request->get('utm_campaign_name'),
            'utm_adset_id' => $request->get('utm_adset_id'),
            'utm_adset_name' => $request->get('utm_adset_name'),
            'utm_ad_id' => $request->get('utm_ad_id'),
            'utm_ad_name' => $request->get('utm_ad_name'),
            'utm_placement' => $request->get('utm_placement'),
        ];
    }
}
