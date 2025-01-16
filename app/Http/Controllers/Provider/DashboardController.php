<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'active_projects' => Project::whereHas('providers', function($query) use ($request) {
                $query->where('users.id', $request->user()->id);
            })->count(),
            'total_scans' => 0, // We'll implement this later
            'keywords_tracked' => 0, // We'll implement this later
        ];

        return Inertia::render('Provider/Dashboard', [
            'stats' => $stats
        ]);
    }
}
