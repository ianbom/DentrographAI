<?php

namespace App\Services;

use App\Models\User;
use App\Models\Patient;
// use App\Models\Radiograph; // Sesuaikan dengan nama model radiografi kamu

class DashboardService
{
    public function getDashboardData(User $user): array
    {
        $role = $user->role;

        $stats = match ($role) {
            'admin' => [
                'total_users' => User::count(),
                'total_patients' => Patient::count(),
                // 'total_radiographs' => Radiograph::count(),
            ],
            'radiografer' => [
                'total_scans' => 0, // Contoh stat
                'pending_analysis' => 0,
            ],
            'dokter' => [
                'needs_verification' => 0,
                'total_reports' => 0,
            ],
            'pasien' => [
                'my_history_count' => 0,
            ],
            default => [],
        };

        return [
            'role' => $role,
            'stats' => $stats,
            'user' => $user->load('patient'), // Agar data pasien (NIK, dll) ikut terbawa
            'activities' => [], // Bisa diisi log aktivitas terbaru
        ];
    }
}