<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['customer', 'providers'])->get();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = User::where('role', 'customer')->get();
        $providers = User::where('role', 'provider')->get();
        
        return Inertia::render('Projects/Create', [
            'customers' => $customers,
            'providers' => $providers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'customer_id' => 'required|exists:users,id',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'provider_ids' => 'required|array',
            'provider_ids.*' => 'exists:users,id',
            'status' => 'required|in:active,inactive'
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'customer_id' => $validated['customer_id'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status']
        ]);

        $project->providers()->attach($validated['provider_ids']);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::with(['customer', 'providers'])->findOrFail($id);
        
        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $customers = User::where('role', 'customer')->get();
        $providers = User::where('role', 'provider')->get();
        
        return Inertia::render('Projects/Edit', [
            'project' => $project->load('providers'),
            'customers' => $customers,
            'providers' => $providers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'customer_id' => 'required|exists:users,id',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'provider_ids' => 'required|array',
            'provider_ids.*' => 'exists:users,id',
            'status' => 'required|in:active,inactive'
        ]);

        $project->update([
            'name' => $validated['name'],
            'customer_id' => $validated['customer_id'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status']
        ]);

        $project->providers()->sync($validated['provider_ids']);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->providers()->detach();
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
