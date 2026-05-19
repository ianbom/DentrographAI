<?php

namespace App\Http\Controllers;

use App\Models\Radiograph;
use App\Services\ReportService;
use App\Services\SimplePdfService;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function radiographPdf(string $radiograph, ReportService $service): Response
    {
        abort_unless(
            Radiograph::query()
                ->whereKey($radiograph)
                ->where('status', 'terverifikasi')
                ->exists(),
            404,
        );

        return Inertia::render('reports/radiograph-pdf', $service->radiographPdfData($radiograph));
    }

    public function download(string $radiograph, ReportService $reportService, SimplePdfService $pdfService): HttpResponse
    {
        abort_unless(
            Radiograph::query()
                ->whereKey($radiograph)
                ->where('status', 'terverifikasi')
                ->exists(),
            404,
        );

        $pdf = $pdfService->radiographReport($reportService->radiographPdfData($radiograph));

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-'.$radiograph.'.pdf"',
        ]);
    }
}
