<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Report;
use App\Models\SeoLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['project'])
            ->latest()
            ->get();

        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function create(Request $request)
    {
        $project = Project::findOrFail($request->project);
        $seoLogs = SeoLog::where('project_id', $project->id)
            ->latest()
            ->get();

        return Inertia::render('Reports/Create', [
            'project' => $project,
            'seoLogs' => $seoLogs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'sections' => 'required|array',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.content' => 'required|string',
            'sections.*.priority' => 'required|integer|min:1',
            'seo_logs' => 'required|array',
            'seo_logs.*' => 'exists:seo_logs,id'
        ]);

        $report = Report::create([
            'project_id' => $request->project_id,
            'title' => $request->title,
            'content' => $request->description,
            'type' => 'custom',
            'status' => 'draft'
        ]);

        // Save report sections
        foreach ($request->sections as $section) {
            $report->sections()->create([
                'title' => $section['title'],
                'content' => $section['content'],
                'priority' => $section['priority']
            ]);
        }

        // Attach SEO logs to the report
        $report->seoLogs()->attach($request->seo_logs);

        if ($request->generate_pdf) {
            return $this->generatePdf($report);
        }

        return redirect()->route('reports.show', $report->id);
    }

    public function show(Report $report)
    {
        $report->load(['project', 'sections' => function($query) {
            $query->orderBy('priority');
        }, 'seoLogs']);

        return Inertia::render('Reports/Show', [
            'report' => $report
        ]);
    }

    public function generatePdf(Report $report)
    {
        $report->load(['project', 'sections' => function($query) {
            $query->orderBy('priority');
        }, 'seoLogs']);

        $pdf = PDF::loadView('reports.pdf', [
            'report' => $report
        ]);

        return $pdf->download($report->title . '.pdf');
    }

    public function edit(Report $report)
    {
        //
    }

    public function update(Request $request, Report $report)
    {
        //
    }

    public function destroy(Report $report)
    {
        $report->sections()->delete();
        $report->seoLogs()->detach();
        $report->delete();

        return redirect()->route('reports.index');
    }
}
