<?php

namespace App\Services;

use App\Models\User;

class VerificationService
{
    /**
     * @return array<string, mixed>
     */
    public function taskData(User $doctor): array
    {
        return [
            'tasks' => [],
            'permissions' => [],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function finalize(string $radiograph, array $data, User $doctor): array
    {
        return [
            'radiograph' => $radiograph,
            'status' => 'verified',
            'detections' => $data['detections'] ?? [],
        ];
    }
}
