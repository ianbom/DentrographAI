<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\Radiograph;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Storage;

class DashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function getDashboardData(User $user): array
    {
        $role = $user->role;

        $stats = match ($role) {
            'admin' => [
                'total_users' => User::count(),
                'total_patients' => Patient::count(),
                'total_doctors' => User::where('role', 'dokter')->count(),
                'total_radiographers' => User::where('role', 'radiografer')->count(),
                'total_radiographs' => Radiograph::count(),
                'total_detections' => Radiograph::where('status', 'terverifikasi')->count(),
                'pending_verifications' => Radiograph::where('status', 'menunggu')->count(),
                'doctor_analyses' => Radiograph::whereNotNull('id_dokter')->count(),
                'radiograph_uploads' => Radiograph::whereNotNull('id_radiografer')->count(),
            ],
            'radiografer' => [
                'total_patients' => Patient::count(),
                'detections_today' => Radiograph::where('id_radiografer', $user->id)
                    ->whereDate('created_at', today())
                    ->count(),
                'total_detections' => Radiograph::where('id_radiografer', $user->id)->count(),
                'pending_detections' => Radiograph::where('id_radiografer', $user->id)
                    ->where('status', 'menunggu')
                    ->count(),
            ],
            'dokter' => [
                'my_patients' => Radiograph::where('id_dokter', $user->id)
                    ->distinct('patient_nik')
                    ->count('patient_nik'),
                'pending_verifications' => Radiograph::where('status', 'menunggu')->count(),
                'completed_verifications' => Radiograph::where('id_dokter', $user->id)
                    ->where('status', 'terverifikasi')
                    ->count(),
                'total_system' => Radiograph::count(),
            ],
            'pasien' => [
                'my_history_count' => 0,
            ],
            default => [],
        };

        return [
            'role' => $role,
            'stats' => $stats,
            'user' => $user->load('patient'),
            'activities' => $role === 'admin' ? $this->adminActivities() : [],
            'notifications' => $role === 'admin' ? $this->adminNotifications() : [],
            'charts' => $role === 'admin' ? [
                'weekly' => $this->detectionSeries('week'),
                'monthly' => $this->detectionSeries('month'),
            ] : [],
            'recent_patients' => $role === 'radiografer' ? $this->recentPatients() : [],
            'completed_detections' => $role === 'radiografer'
                ? $this->completedDetectionsForRadiographer($user)
                : [],
            'verification_queue' => $role === 'dokter' ? $this->verificationQueue() : [],
            'doctor_completed_detections' => $role === 'dokter'
                ? $this->completedDetectionsForDoctor($user)
                : [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function adminActivities(): array
    {
        return [
            'doctors' => User::query()
                ->where('role', 'dokter')
                ->latest()
                ->get(['id', 'name'])
                ->map(fn (User $doctor): array => [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'total' => Radiograph::where('id_dokter', $doctor->id)->count(),
                    'today' => Radiograph::where('id_dokter', $doctor->id)
                        ->whereDate('updated_at', today())
                        ->count(),
                    'active' => Radiograph::where('id_dokter', $doctor->id)
                        ->whereDate('updated_at', today())
                        ->exists(),
                ])
                ->values(),
            'radiographers' => User::query()
                ->where('role', 'radiografer')
                ->latest()
                ->get(['id', 'name'])
                ->map(fn (User $radiographer): array => [
                    'id' => $radiographer->id,
                    'name' => $radiographer->name,
                    'total' => Radiograph::where('id_radiografer', $radiographer->id)->count(),
                    'today' => Radiograph::where('id_radiografer', $radiographer->id)
                        ->whereDate('created_at', today())
                        ->count(),
                    'active' => Radiograph::where('id_radiografer', $radiographer->id)
                        ->whereDate('created_at', today())
                        ->exists(),
                ])
                ->values(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function adminNotifications(): array
    {
        return Radiograph::query()
            ->with(['patient.user:id,name', 'radiografer:id,name'])
            ->where('status', 'menunggu')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Radiograph $radiograph): array => [
                'id_radiograph' => $radiograph->id_radiograph,
                'patient_name' => $radiograph->patient?->user?->name ?? $radiograph->patient_nik,
                'radiographer_name' => $radiograph->radiografer?->name,
                'image_url' => Storage::url($radiograph->image),
                'created_at' => optional($radiograph->created_at)->diffForHumans(),
                'date' => optional($radiograph->created_at)->format('d M'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function recentPatients(): array
    {
        return Patient::query()
            ->with('user:id,name')
            ->latest()
            ->limit(4)
            ->get(['id', 'nik', 'user_id', 'age', 'created_at'])
            ->map(fn (Patient $patient): array => [
                'nik' => $patient->nik,
                'name' => $patient->user?->name ?? $patient->nik,
                'age' => $patient->age,
                'date' => optional($patient->created_at)->format('d/m/Y'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function completedDetectionsForRadiographer(User $radiographer): array
    {
        return Radiograph::query()
            ->with(['patient.user:id,name'])
            ->withCount('detections')
            ->where('id_radiografer', $radiographer->id)
            ->where('status', 'terverifikasi')
            ->latest('updated_at')
            ->limit(4)
            ->get()
            ->map(fn (Radiograph $radiograph): array => [
                'id_radiograph' => $radiograph->id_radiograph,
                'patient_name' => $radiograph->patient?->user?->name ?? $radiograph->patient_nik,
                'detections_count' => $radiograph->detections_count,
                'date' => optional($radiograph->updated_at)->format('d/m/Y'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function verificationQueue(): array
    {
        return Radiograph::query()
            ->with(['patient.user:id,name'])
            ->where('status', 'menunggu')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Radiograph $radiograph): array => [
                'id_radiograph' => $radiograph->id_radiograph,
                'patient_name' => $radiograph->patient?->user?->name ?? $radiograph->patient_nik,
                'created_at' => optional($radiograph->created_at)->diffForHumans(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function completedDetectionsForDoctor(User $doctor): array
    {
        return Radiograph::query()
            ->with(['patient.user:id,name'])
            ->where('id_dokter', $doctor->id)
            ->where('status', 'terverifikasi')
            ->latest('updated_at')
            ->limit(4)
            ->get()
            ->map(fn (Radiograph $radiograph): array => [
                'id_radiograph' => $radiograph->id_radiograph,
                'patient_name' => $radiograph->patient?->user?->name ?? $radiograph->patient_nik,
                'date' => optional($radiograph->updated_at)->format('d/m/Y'),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, value: int}>
     */
    private function detectionSeries(string $range): array
    {
        $start = $range === 'month'
            ? today()->subDays(29)
            : today()->subDays(6);
        $period = CarbonPeriod::create($start, today());

        $rows = Radiograph::query()
            ->where('status', 'terverifikasi')
            ->whereDate('updated_at', '>=', $start)
            ->selectRaw('DATE(updated_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return collect($period)
            ->map(fn ($date): array => [
                'label' => $range === 'month' ? $date->format('d M') : $date->format('D'),
                'value' => (int) ($rows[$date->format('Y-m-d')] ?? 0),
            ])
            ->values()
            ->all();
    }
}
