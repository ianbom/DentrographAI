<?php

namespace App\Http\Controllers;

use App\Services\RadiographService;
use Inertia\Inertia;
use Inertia\Response;

class DetectionController extends Controller
{
    public function index(RadiographService $service): Response
    {
        return Inertia::render('detection/index', $service->indexData(request()->user()));
    }

    public function show(string $radiograph, RadiographService $service): Response
    {
        return Inertia::render('detection/show', $service->detailData($radiograph));
    }
}
