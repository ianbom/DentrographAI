<?php

namespace App\Http\Controllers;

use App\Http\Requests\Radiographs\AnalyzeRadiographRequest;
use App\Http\Requests\Radiographs\FinalizeRadiographRequest;
use App\Http\Requests\Radiographs\StoreRadiographRequest;
use App\Services\AiDetectionService;
use App\Services\RadiographService;
use App\Services\VerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RadiographController extends Controller
{
    public function index(Request $request, RadiographService $service): Response
    {
        return Inertia::render('radiographs/index', $service->indexData($request->user()));
    }

    public function create(): Response
    {
        return Inertia::render('radiographs/create');
    }

    public function store(StoreRadiographRequest $request, RadiographService $service): RedirectResponse
    {
        $radiograph = $service->create($request->validated(), $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Radiograph created.')]);

        return to_route('radiographs.show', $radiograph);
    }

    public function show(string $radiograph, RadiographService $service): Response
    {
        return Inertia::render('radiographs/show', $service->detailData($radiograph));
    }

    public function history(string $radiograph, RadiographService $service): Response
    {
        return Inertia::render('radiographs/history', $service->historyData($radiograph));
    }

    public function analyze(AnalyzeRadiographRequest $request, string $radiograph, AiDetectionService $service): RedirectResponse
    {
        $service->analyze($radiograph);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Radiograph analysis started.')]);

        return to_route('radiographs.show', $radiograph);
    }

    public function finalize(FinalizeRadiographRequest $request, string $radiograph, VerificationService $service): RedirectResponse
    {
        $service->finalize($radiograph, $request->validated(), $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Radiograph finalized.')]);

        return to_route('radiographs.show', $radiograph);
    }

    public function destroy(string $radiograph, RadiographService $service): RedirectResponse
    {
        $service->delete($radiograph);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Radiograph deleted.')]);

        return to_route('radiographs.index');
    }
}
