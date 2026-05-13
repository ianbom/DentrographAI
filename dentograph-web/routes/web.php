<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PublicVerificationController;
use App\Http\Controllers\RadiographController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/verify/{radiograph}', [PublicVerificationController::class, 'show'])
    ->name('public.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class);

    Route::get('patients/{patient}/history', [PatientController::class, 'history'])
        ->name('patients.history');
    Route::resource('patients', PatientController::class);

    Route::post('radiographs/{radiograph}/analyze', [RadiographController::class, 'analyze'])
        ->name('radiographs.analyze');
    Route::post('radiographs/{radiograph}/finalize', [RadiographController::class, 'finalize'])
        ->name('radiographs.finalize');
    Route::get('radiographs/{radiograph}/history', [RadiographController::class, 'history'])
        ->name('radiographs.history');
    Route::resource('radiographs', RadiographController::class)
        ->except(['edit', 'update']);

    Route::get('verification/tasks', [VerificationController::class, 'tasks'])
        ->name('verification.tasks');

    Route::get('reports/radiographs/{radiograph}/pdf', [ReportController::class, 'radiographPdf'])
        ->name('reports.radiographs.pdf');
});

require __DIR__.'/settings.php';
