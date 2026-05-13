<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/verify/{radiograph}', 'public/verify-result')
    ->name('public.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard/index')->name('dashboard');

    Route::inertia('users', 'users/index')->name('users.index');
    Route::inertia('users/create', 'users/create')->name('users.create');
    Route::inertia('users/{user}', 'users/show')->name('users.show');
    Route::inertia('users/{user}/edit', 'users/edit')->name('users.edit');

    Route::inertia('patients', 'patients/index')->name('patients.index');
    Route::inertia('patients/create', 'patients/create')->name('patients.create');
    Route::inertia('patients/{patient}', 'patients/show')->name('patients.show');
    Route::inertia('patients/{patient}/edit', 'patients/edit')->name('patients.edit');
    Route::inertia('patients/{patient}/history', 'patients/history')->name('patients.history');

    Route::inertia('radiographs', 'radiographs/index')->name('radiographs.index');
    Route::inertia('radiographs/create', 'radiographs/create')->name('radiographs.create');
    Route::inertia('radiographs/{radiograph}', 'radiographs/show')->name('radiographs.show');
    Route::inertia('radiographs/{radiograph}/history', 'radiographs/history')->name('radiographs.history');

    Route::inertia('verification/tasks', 'verification/tasks')->name('verification.tasks');

    Route::inertia('reports/radiographs/{radiograph}/pdf', 'reports/radiograph-pdf')
        ->name('reports.radiographs.pdf');
});

require __DIR__.'/settings.php';
