<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\SeoLog;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get statistics
        $stats = [
            'total_customers' => User::where('role', 'customer')->count(),
            'active_projects' => Project::where('status', 'active')->count(),
            'seo_logs_today' => SeoLog::whereDate('work_date', today())->count(),
            'total_reports' => Report::count(),
        ];

        // Get recent activity
        $recentLogs = SeoLog::with(['project', 'provider'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($log) {
                return [
                    'type' => 'seo_log',
                    'title' => "New SEO Log - {$log->project->name}",
                    'description' => $log->description,
                    'created_at' => $log->created_at,
                    'time_ago' => $log->created_at->diffForHumans(),
                ];
            });

        // Add recent reports
        $recentReports = Report::with(['project'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($report) {
                return [
                    'type' => 'report',
                    'title' => "New Report - {$report->project->name}",
                    'description' => $report->title,
                    'created_at' => $report->created_at,
                    'time_ago' => $report->created_at->diffForHumans(),
                ];
            });

        $recentActivity = $recentLogs->concat($recentReports)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        // Get project status for progress bars
        $projectStatus = Project::get()
            ->map(function($project) {
                return [
                    'name' => $project->name,
                    'progress' => 0, // You'll need to implement your progress calculation logic
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'projectStatus' => $projectStatus,
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
            'currentTime' => now()->format('l, F j, Y \a\t h:i:s A'),
        ]);
    }
}
