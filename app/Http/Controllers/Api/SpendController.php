<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SpendController extends Controller
{
    public function uploadCsv(Request $request)
    {
        // This would handle CSV upload for spend data
        // For now, return a simple response
        return response()->json([
            'message' => 'CSV upload not yet implemented'
        ]);
    }
}
