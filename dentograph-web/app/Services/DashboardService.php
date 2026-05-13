<?php

namespace App\Services;

use App\Models\User;

class DashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function getDashboardData(User $user): array
    {
        return [
            'role' => $user->role ?? null,
            'stats' => [],
            'activities' => [],
        ];
    }
}
