<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function radiographPdf(string $radiograph, ReportService $service): Response
    {
        return Inertia::render('reports/radiograph-pdf', $service->radiographPdfData($radiograph));
    }
}
