<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\SeoLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SeoLogController extends Controller
{
    public function index()
    {
        $seoLogs = SeoLog::with(['project', 'provider'])
            ->when(auth()->user()->role === 'provider', function ($query) {
                $query->where('provider_id', auth()->id());
            })
            ->latest()
            ->get();

        \Log::info('SEO Logs Data:', [
            'user_id' => auth()->id(),
            'user_role' => auth()->user()->role,
            'logs_count' => $seoLogs->count(),
            'logs' => $seoLogs->toArray()
        ]);

        return Inertia::render('SeoLogs/Index', [
            'auth' => [
                'user' => auth()->user()
            ],
            'seoLogs' => $seoLogs
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

        $projects = Project::when(auth()->user()->role === 'provider', function ($query) {
                $query->whereHas('providers', function ($q) {
                    $q->where('users.id', auth()->id());
                });
            })
            ->get();

        return Inertia::render('SeoLogs/Edit', [
            'seoLog' => $seoLog,
            'projects' => $projects,
            'workTypes' => SeoLog::workTypes()
        ]);
    }

    public function update(Request $request, SeoLog $seoLog)
    {
        $this->authorize('update', $seoLog);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'work_date' => 'required|date',
            'work_type' => 'required|string',
            'description' => 'required|string',
            'attachment' => 'nullable|file|max:10240'
        ]);

        if ($request->hasFile('attachment')) {
            // Delete old attachment
            if ($seoLog->attachment_path) {
                Storage::delete('public/' . $seoLog->attachment_path);
            }
            $path = $request->file('attachment')->store('seo-log-attachments', 'public');
            $validated['attachment_path'] = $path;
        }

        $seoLog->update($validated);

        return redirect()->route('seo-logs.index')
            ->with('success', 'SEO log updated successfully.');
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
