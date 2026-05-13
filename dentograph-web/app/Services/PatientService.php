<?php

namespace App\Services;

use App\Models\User;

class PatientService
{
    /**
     * @return array<string, mixed>
     */
    public function indexData(User $viewer): array
    {
        return [
            'patients' => [],
            'filters' => [],
            'permissions' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function detailData(string $patient): array
    {
        return [
            'patient' => $patient,
            'permissions' => [],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function historyData(string $patient): array
    {
        return [
            'patient' => $patient,
            'radiographs' => [],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): string
    {
        return (string) $data['nik'];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(string $patient, array $data): string
    {
        return $patient;
    }

    public function delete(string $patient): void
    {
        //
    }
}
