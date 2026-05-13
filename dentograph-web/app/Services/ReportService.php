<?php

namespace App\Services;

class ReportService
{
    /**
     * @return array<string, mixed>
     */
    public function radiographPdfData(string $radiograph): array
    {
        return [
            'radiograph' => $radiograph,
            'patient' => null,
            'detections' => [],
            'qr_code' => null,
        ];
    }
}
