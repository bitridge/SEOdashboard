<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')->get();
        return Inertia::render('Customers/Index', [
            'customers' => $customers
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'website' => 'required|url|max:255',
            'logo' => 'nullable|image|max:1024', // max 1MB
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('customer-logos', 'public');
        }

        $customer = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'website' => $validated['website'],
            'logo' => $logoPath ? Storage::url($logoPath) : null,
            'password' => Hash::make('password'), // Default password
            'role' => 'customer',
        ]);

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function edit(User $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer
        ]);
    }

    public function update(Request $request, User $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $customer->id,
            'website' => 'required|url|max:255',
            'logo' => 'nullable|image|max:1024',
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($customer->logo) {
                Storage::delete(str_replace('/storage/', 'public/', $customer->logo));
            }
            $logoPath = $request->file('logo')->store('customer-logos', 'public');
            $validated['logo'] = Storage::url($logoPath);
        }

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(User $customer)
    {
        if ($customer->logo) {
            Storage::delete(str_replace('/storage/', 'public/', $customer->logo));
        }
        
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    public function show(User $customer)
    {
        return Inertia::render('Customers/Show', [
            'customer' => $customer->load(['projects' => function($query) {
                $query->latest();
            }])
        ]);
    }
}
