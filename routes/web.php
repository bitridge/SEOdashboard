<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Provider\DashboardController as ProviderDashboardController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SeoLogController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
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

    // Admin Routes
    Route::middleware(['auth', CheckRole::class.':admin'])->group(function () {
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('customers', CustomerController::class);
        Route::resource('users', UserController::class);
        Route::resource('projects', ProjectController::class);
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    });

    // Provider Routes
    Route::middleware(['auth', CheckRole::class.':provider'])->group(function () {
        Route::get('/provider/dashboard', [ProviderDashboardController::class, 'index'])->name('provider.dashboard');
    });

    // Routes accessible by both Admin and Provider
    Route::middleware(['auth', CheckRole::class.':admin,provider'])->group(function () {
        Route::resource('seo-logs', SeoLogController::class);
        Route::resource('reports', ReportController::class)->except(['create']);
        Route::get('projects/{project}/reports/create', [ReportController::class, 'create'])->name('reports.create');
        Route::get('reports/{report}/download', [ReportController::class, 'download'])->name('reports.download');
        Route::post('reports/{project}/generate-pdf', [ReportController::class, 'generatePdf'])->name('reports.generate-pdf');
    });

    // Customer Routes
    Route::middleware(['auth', CheckRole::class.':customer'])->group(function () {
        Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    });

    require __DIR__.'/auth.php';
});
