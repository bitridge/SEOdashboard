<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'projects' => Project::where('user_id', $request->user()->id)->count(),
            'seo_score' => 'N/A', // We'll implement this later
            'keywords' => 0, // We'll implement this later
        ];

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats
        ]);
    }
}
