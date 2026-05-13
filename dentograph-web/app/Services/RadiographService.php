<?php

namespace App\Services;

use App\Models\User;

class RadiographService
{
    /**
     * @return array<string, mixed>
     */
    public function indexData(User $viewer): array
    {
        return [
            'radiographs' => [],
            'filters' => [],
            'permissions' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function detailData(string $radiograph): array
    {
        return [
            'radiograph' => $radiograph,
            'detections' => [],
            'permissions' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function historyData(string $radiograph): array
    {
        return [
            'radiograph' => $radiograph,
            'history' => [],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, User $radiographer): string
    {
        return (string) ($data['patient_nik'] ?? '');
    }

    public function delete(string $radiograph): void
    {
        //
    }
}
