<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Provider\DashboardController as ProviderDashboardController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SeoLogController;
use App\Http\Middleware\CheckRole;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['web'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    // Common authenticated routes (accessible to all authenticated users)
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Admin Routes
    Route::middleware(['auth', CheckRole::class.':admin'])->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('customers', CustomerController::class);
        Route::resource('users', UserController::class);
        Route::resource('projects', ProjectController::class);
    });

    // Provider Routes
    Route::middleware(['auth', CheckRole::class.':provider'])->group(function () {
        Route::get('/provider/dashboard', [ProviderDashboardController::class, 'index'])->name('provider.dashboard');
    });

    // Routes accessible by both Admin and Provider
    Route::middleware(['auth', CheckRole::class.':admin,provider'])->group(function () {
        Route::resource('seo-logs', SeoLogController::class);
    });

    // Customer Routes
    Route::middleware(['auth', CheckRole::class.':customer'])->group(function () {
        Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    });

    // Default redirect after login based on role
    Route::get('/dashboard', function () {
        if (auth()->check()) {
            $user = auth()->user();
            
            if ($user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            } elseif ($user->isProvider()) {
                return redirect()->route('provider.dashboard');
            } else {
                return redirect()->route('customer.dashboard');
            }
        }
        
        return redirect('/');
    })->middleware(['auth'])->name('dashboard');

    require __DIR__.'/auth.php';
});
