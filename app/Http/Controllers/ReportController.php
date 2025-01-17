<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Project;
use App\Models\SeoLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\PdfService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
        try {
            \Log::info('Creating report for project:', ['project_id' => $project->id]);
            
            // Get the query builder instance
            $query = SeoLog::where('project_id', $project->id)
                ->with('provider')
                ->latest();
            
            // Log the SQL query
            \Log::info('SQL Query:', ['sql' => $query->toSql(), 'bindings' => $query->getBindings()]);
            
            // Execute the query
            $seoLogs = $query->get();
            
            \Log::info('Found SEO logs:', [
                'count' => $seoLogs->count(),
                'logs' => $seoLogs->toArray()
            ]);
            
            return Inertia::render('Reports/Create', [
                'project' => $project,
                'seoLogs' => $seoLogs
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in ReportController@create:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function store(Request $request)
    {
        \Log::info('Attempting to save report with data:', [
            'project_id' => $request->project_id,
            'title' => $request->title,
            'description_length' => strlen($request->description),
            'sections' => json_decode($request->sections, true),
            'seo_logs' => json_decode($request->seo_logs, true)
        ]);

        try {
            // First validate the basic fields
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'sections' => 'required|json',
                'seo_logs' => 'nullable|json',
                'generate_pdf' => 'nullable|in:0,1'
            ]);

            // Decode and validate sections
            $sections = json_decode($validated['sections'], true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                \Log::error('JSON decode error for sections:', ['error' => json_last_error_msg()]);
                return back()->withErrors(['sections' => 'Invalid section data format']);
            }

            if (empty($sections)) {
                \Log::warning('No sections provided in the report');
                return back()->withErrors(['sections' => 'At least one section is required']);
            }

            // Validate each section
            foreach ($sections as $index => $section) {
                if (empty($section['title'])) {
                    \Log::warning("Section {$index} missing title");
                    return back()->withErrors(['sections' => "Section " . ($index + 1) . " title is required"]);
                }
                if (empty($section['content'])) {
                    \Log::warning("Section {$index} missing content");
                    return back()->withErrors(['sections' => "Section " . ($index + 1) . " content is required"]);
                }
            }

            DB::beginTransaction();

            try {
                // Create the report
                $report = Report::create([
                    'project_id' => $validated['project_id'],
                    'title' => $validated['title'],
                    'description' => $validated['description']
                ]);

                \Log::info('Created report:', ['report_id' => $report->id]);

                // Process sections
                foreach ($sections as $index => $sectionData) {
                    $section = $report->sections()->create([
                        'title' => $sectionData['title'],
                        'content' => $sectionData['content'],
                        'priority' => $sectionData['priority'] ?? ($index + 1)
                    ]);

                    // Handle section image if present
                    $imageKey = "section_images.{$section->id}";
                    if ($request->hasFile($imageKey)) {
                        $image = $request->file($imageKey);
                        $path = $image->store('section-images', 'public');
                        $section->update(['image_path' => $path]);
                        \Log::info("Saved image for section {$section->id}");
                    }
                }

                // Handle SEO logs if present
                if (!empty($validated['seo_logs'])) {
                    $seoLogs = json_decode($validated['seo_logs'], true);
                    if (is_array($seoLogs) && !empty($seoLogs)) {
                        $report->seoLogs()->attach($seoLogs);
                        \Log::info('Attached SEO logs to report:', ['log_count' => count($seoLogs)]);
                    }
                }

                DB::commit();
                \Log::info('Successfully saved report with all sections and attachments');

                if ($request->input('generate_pdf') === '1') {
                    return $this->generatePdf($request, $report);
                }

                return redirect()->route('reports.show', $report->id)
                               ->with('success', 'Report created successfully');

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            \Log::error('Error saving report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['general' => 'An error occurred while saving the report. Please try again.']);
        }
    }

    public function show(Report $report)
    {
        $report->load(['project', 'sections', 'seoLogs' => function($query) {
            $query->orderBy('work_date', 'desc');
        }]);

        $reportData = [
            'id' => $report->id,
            'title' => $report->title,
            'description' => $report->content,
            'type' => $report->type ?? 'custom',
            'created_at' => $report->created_at,
            'project' => [
                'id' => $report->project->id,
                'name' => $report->project->name,
            ],
            'sections' => $report->sections->map(function($section) {
                return [
                    'id' => $section->id,
                    'title' => $section->title,
                    'content' => $section->content,
                    'image_path' => $section->image_path,
                ];
            })->values()->all(),
            'seo_logs' => $report->seoLogs->map(function($log) {
                return [
                    'id' => $log->id,
                    'work_type' => $log->work_type,
                    'work_date' => $log->work_date,
                    'description' => $log->description,
                    'attachment_path' => $log->attachment_path,
                ];
            })->values()->all()
        ];

        return Inertia::render('Reports/Show', [
            'auth' => [
                'user' => auth()->user(),
                'settings' => auth()->user()->settings ?? []
            ],
            'report' => $reportData
        ]);
    }

    public function download(Report $report, PdfService $pdfService)
    {
        $report->load(['project', 'sections', 'seoLogs']);
        
        $reportData = [
            'report' => [
                'title' => $report->title,
                'project' => [
                    'name' => $report->project->name,
                ],
                'description' => $report->content,
                'type' => $report->type ?? 'custom',
                'generatedAt' => now()->format('F j, Y'),
                'sections' => $report->sections->map(function($section) {
                    return [
                        'title' => $section->title,
                        'content' => $section->content,
                        'image_path' => $section->image_path
                    ];
                })->values()->all(),
                'seoLogs' => $report->seoLogs->map(function($log) {
                    return [
                        'work_type' => $log->work_type,
                        'work_date' => \Carbon\Carbon::parse($log->work_date)->format('M j, Y'),
                        'description' => $log->description,
                        'attachment_path' => $log->attachment_path
                    ];
                })->values()->all()
            ]
        ];

        $pdfData = $pdfService->generatePdf('reports.pdf', $reportData);

        return response($pdfData['content'])
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $report->title . '.pdf"');
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
