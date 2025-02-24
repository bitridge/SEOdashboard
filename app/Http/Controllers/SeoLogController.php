<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\SeoLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SeoLogController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = SeoLog::with(['project', 'provider'])
            ->when(auth()->user()->role === 'provider', function ($query) {
                $query->whereHas('project', function ($q) {
                    $q->whereHas('providers', function ($q) {
                        $q->where('users.id', auth()->id());
                    });
                });
            })
            ->when($request->project_id, function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->when($request->work_type, function ($query, $workType) {
                $query->where('work_type', $workType);
            })
            ->when($request->date_range, function ($query, $dateRange) {
                // Handle date range filtering
                if ($dateRange === 'today') {
                    $query->whereDate('work_date', today());
                } elseif ($dateRange === 'week') {
                    $query->whereBetween('work_date', [now()->startOfWeek(), now()->endOfWeek()]);
                } elseif ($dateRange === 'month') {
                    $query->whereBetween('work_date', [now()->startOfMonth(), now()->endOfMonth()]);
                }
            })
            ->latest('work_date');

        $seoLogs = $query->get();

        // Get available projects based on user role
        $projects = Project::when(auth()->user()->role === 'provider', function ($query) {
                $query->whereHas('providers', function ($q) {
                    $q->where('users.id', auth()->id());
                });
            })
            ->get();

        return Inertia::render('SeoLogs/Index', [
            'seoLogs' => $seoLogs,
            'projects' => $projects,
            'workTypes' => SeoLog::workTypes(),
            'filters' => $request->only(['project_id', 'work_type', 'date_range']),
        ]);
    }

    public function create()
    {
        $projects = Project::when(auth()->user()->role === 'provider', function ($query) {
                $query->whereHas('providers', function ($q) {
                    $q->where('users.id', auth()->id());
                });
            })
            ->get();

        return Inertia::render('SeoLogs/Create', [
            'projects' => $projects,
            'workTypes' => SeoLog::workTypes()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'work_date' => 'required|date',
            'work_type' => 'required|string',
            'description' => 'required|string',
            'attachment' => 'nullable|file|max:10240' // 10MB max
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('seo-log-attachments', 'public');
            $validated['attachment_path'] = $path;
        }

        $validated['provider_id'] = auth()->id();

        SeoLog::create($validated);

        return redirect()->route('seo-logs.index')
            ->with('success', 'SEO log created successfully.');
    }

    public function show(SeoLog $seoLog)
    {
        return Inertia::render('SeoLogs/Show', [
            'seoLog' => $seoLog->load(['project', 'provider'])
        ]);
    }

    public function edit(SeoLog $seoLog)
    {
        $this->authorize('update', $seoLog);
        
        return Inertia::render('SeoLogs/Edit', [
            'seoLog' => [
                'id' => $seoLog->id,
                'work_type' => $seoLog->work_type,
                'work_date' => $seoLog->work_date,
                'description' => $seoLog->description,
                'attachment_path' => $seoLog->attachment_path,
                'project_id' => $seoLog->project_id,
            ]
        ]);
    }

    public function update(Request $request, SeoLog $seoLog)
    {
        $this->authorize('update', $seoLog);

        $validated = $request->validate([
            'work_type' => 'required|string|in:on_page,off_page,technical,content,analytics',
            'work_date' => 'required|date',
            'description' => 'required|string',
            'attachment' => 'nullable|file|max:2048'
        ]);

        // Handle file upload if present
        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($seoLog->attachment_path) {
                Storage::disk('public')->delete($seoLog->attachment_path);
            }
            
            $attachmentPath = $request->file('attachment')->store('seo-log-attachments', 'public');
            $validated['attachment_path'] = $attachmentPath;
        }

        $seoLog->update($validated);

        return redirect()->route('seo-logs.show', $seoLog)
            ->with('success', 'SEO Log updated successfully.');
    }

    public function destroy(SeoLog $seoLog)
    {
        $this->authorize('delete', $seoLog);

        if ($seoLog->attachment_path) {
            Storage::delete('public/' . $seoLog->attachment_path);
        }

        $seoLog->delete();

        return redirect()->route('seo-logs.index')
            ->with('success', 'SEO log deleted successfully.');
    }
}
