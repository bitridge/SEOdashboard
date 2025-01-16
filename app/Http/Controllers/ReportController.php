<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Project;
use App\Models\SeoLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['project'])->latest()->get();
        return Inertia::render('Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function create(Project $project)
    {
        $seoLogs = SeoLog::where('project_id', $project->id)->latest()->get();
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
            'seo_logs' => 'array'
        ]);

        $report = Report::create([
            'project_id' => $request->project_id,
            'title' => $request->title,
            'content' => $request->description,
            'type' => 'custom',
            'status' => 'draft'
        ]);

        // Handle sections with images
        $sections = json_decode($request->sections, true);
        foreach ($sections as $index => $section) {
            $imagePath = null;
            if ($request->hasFile("section_images.{$section['id']}")) {
                $file = $request->file("section_images.{$section['id']}");
                $imagePath = $file->store('report-images', 'public');
            }

            $report->sections()->create([
                'title' => $section['title'],
                'content' => $section['content'],
                'priority' => $index + 1,
                'image_path' => $imagePath
            ]);
        }

        // Attach SEO logs if any
        if ($request->seo_logs) {
            $seoLogIds = json_decode($request->seo_logs, true);
            $report->seoLogs()->attach($seoLogIds);
        }

        return redirect()->route('reports.show', $report)
            ->with('success', 'Report created successfully.');
    }

    public function show(Report $report)
    {
        $report->load(['project', 'sections', 'seoLogs' => function($query) {
            $query->orderBy('work_date', 'desc');
        }]);

        return Inertia::render('Reports/Show', [
            'report' => $report->toArray()
        ]);
    }

    public function download(Report $report)
    {
        $report->load(['project', 'sections', 'seoLogs' => function($query) {
            $query->orderBy('work_date', 'desc');
        }]);

        $pdf = PDF::loadView('reports.pdf', [
            'report' => $report
        ]);

        return $pdf->download($report->title . '.pdf');
    }

    public function edit(Report $report)
    {
        $report->load(['project', 'sections', 'seoLogs']);
        
        // Get all SEO logs for the project
        $seoLogs = $report->project->seoLogs()
            ->orderBy('work_date', 'desc')
            ->get();
        
        return Inertia::render('Reports/Edit', [
            'report' => $report,
            'seoLogs' => $seoLogs
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|in:monthly,weekly,custom',
            'sections' => 'array',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.content' => 'required|string',
            'sections.*.image' => 'nullable|image|max:2048',
            'seo_log_ids' => 'array'
        ]);

        // Update report basic info
        $report->update([
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type
        ]);

        // Handle sections
        if ($request->has('sections')) {
            foreach ($request->sections as $index => $sectionData) {
                $section = $report->sections[$index] ?? null;

                // Handle image upload if present
                if (isset($sectionData['image']) && $sectionData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    // Delete old image if exists
                    if ($section && $section->image_path) {
                        Storage::disk('public')->delete($section->image_path);
                    }
                    $imagePath = $sectionData['image']->store('report-images', 'public');
                    $sectionData['image_path'] = $imagePath;
                }

                if ($section) {
                    $section->update([
                        'title' => $sectionData['title'],
                        'content' => $sectionData['content'],
                        'image_path' => $sectionData['image_path'] ?? $section->image_path
                    ]);
                } else {
                    $report->sections()->create([
                        'title' => $sectionData['title'],
                        'content' => $sectionData['content'],
                        'image_path' => $sectionData['image_path'] ?? null
                    ]);
                }
            }
        }

        // Update SEO log associations
        if ($request->has('seo_log_ids')) {
            $report->seoLogs()->sync($request->seo_log_ids);
        }

        if ($request->generate_pdf) {
            return redirect()->route('reports.download', $report);
        }

        return redirect()->route('reports.show', $report)
            ->with('success', 'Report updated successfully.');
    }

    public function generatePdf(Project $project, Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'sometimes|string|in:monthly,weekly,custom',
            'sections' => 'required|array',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.content' => 'required|string',
            'seo_logs' => 'array'
        ]);

        // Create temporary report data
        $reportData = [
            'title' => $request->title,
            'description' => $request->description,
            'project' => (object)$project->toArray(),
            'type' => $request->type ?? 'custom',
            'sections' => is_string($request->sections) ? json_decode($request->sections, true) : $request->sections,
            'seoLogs' => $request->seo_logs 
                ? SeoLog::whereIn('id', is_string($request->seo_logs) ? json_decode($request->seo_logs, true) : $request->seo_logs)
                    ->get()
                    ->map(function($log) {
                        return (object)$log->toArray();
                    })
                : [],
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ];

        // Handle section images for PDF
        $sections = collect($reportData['sections'])->map(function ($section) use ($request) {
            if ($request->hasFile("section_images.{$section['id']}")) {
                $file = $request->file("section_images.{$section['id']}");
                $section['image_path'] = $file->store('temp-report-images', 'public');
            }
            return (object)$section;
        });
        $reportData['sections'] = $sections->all();

        // Generate PDF
        $pdf = PDF::loadView('reports.pdf', [
            'report' => (object)$reportData
        ]);

        // Clean up temporary images
        foreach ($sections as $section) {
            if (!empty($section->image_path) && str_starts_with($section->image_path, 'temp-report-images/')) {
                Storage::disk('public')->delete($section->image_path);
            }
        }

        return $pdf->download("report_{$project->id}_{$request->title}.pdf");
    }

    public function destroy(Report $report)
    {
        // Delete section images
        foreach ($report->sections as $section) {
            if ($section->image_path) {
                Storage::disk('public')->delete($section->image_path);
            }
        }

        $report->delete();
        return redirect()->route('reports.index')
            ->with('success', 'Report deleted successfully.');
    }
}
