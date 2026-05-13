<?php

namespace App\Http\Controllers;

use App\Http\Requests\Patients\StorePatientRequest;
use App\Http\Requests\Patients\UpdatePatientRequest;
use App\Services\PatientService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(Request $request, PatientService $service): Response
    {
        return Inertia::render('patients/index', $service->indexData($request->user()));
    }

    public function create(): Response
    {
        return Inertia::render('patients/create');
    }

    public function store(StorePatientRequest $request, PatientService $service): RedirectResponse
    {
        $patient = $service->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Patient created.')]);

        return to_route('patients.show', $patient);
    }

    public function show(string $patient, PatientService $service): Response
    {
        return Inertia::render('patients/show', $service->detailData($patient));
    }

    public function edit(string $patient, PatientService $service): Response
    {
        return Inertia::render('patients/edit', $service->detailData($patient));
    }

    public function update(UpdatePatientRequest $request, string $patient, PatientService $service): RedirectResponse
    {
        $service->update($patient, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Patient updated.')]);

        return to_route('patients.show', $patient);
    }

    public function destroy(string $patient, PatientService $service): RedirectResponse
    {
        $service->delete($patient);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Patient deleted.')]);

        return to_route('patients.index');
    }

    public function history(string $patient, PatientService $service): Response
    {
        return Inertia::render('patients/history', $service->historyData($patient));
    }
}
