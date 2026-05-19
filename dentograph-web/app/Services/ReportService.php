<?php

namespace App\Services;

use App\Models\Radiograph;
use Illuminate\Support\Facades\Storage;

class ReportService
{
    /**
     * @return array<string, mixed>
     */
    public function radiographPdfData(string $radiograph): array
    {
        $radiograph = Radiograph::query()
            ->with(['patient.user:id,name,email,phone', 'dokter:id,name', 'radiografer:id,name', 'detections'])
            ->findOrFail($radiograph);

        return [
            'radiograph' => [
                'id_radiograph' => $radiograph->id_radiograph,
                'doctor_name' => $radiograph->dokter?->name,
                'radiographer_name' => $radiograph->radiografer?->name,
                'image_url' => asset('storage/'.$radiograph->image),
                'result_image_url' => $radiograph->result_image ? asset('storage/'.$radiograph->result_image) : null,
                'image_path' => storage_path('app/public/'.$radiograph->image),
                'result_image_path' => $radiograph->result_image ? storage_path('app/public/'.$radiograph->result_image) : null,
                'status' => $radiograph->status,
                'created_at' => optional($radiograph->created_at)->translatedFormat('d F Y'),
                'verified_at' => optional($radiograph->updated_at)->translatedFormat('d F Y'),
                'verification_url' => route('public.verify', $radiograph->id_radiograph),
            ],
            'patient' => [
                'nik' => $radiograph->patient_nik,
                'name' => $radiograph->patient?->user?->name,
                'email' => $radiograph->patient?->user?->email,
                'phone' => $radiograph->patient?->user?->phone,
                'age' => $radiograph->patient?->age,
                'address' => $radiograph->patient?->address,
            ],
            'detections' => $radiograph->detections
                ->map(fn ($detection): array => [
                    'no_fdi' => $detection->no_fdi,
                    'abnormality' => $detection->abnormality,
                    'analysis' => $detection->analysis,
                    'crop_image_url' => $detection->crop_image ? Storage::url($detection->crop_image) : null,
                    'is_active' => $detection->is_active,
                ])
                ->values(),
            'qr_code' => 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='.urlencode(route('public.verify', $radiograph->id_radiograph)),
        ];
    }
}
