<?php

namespace App\Services;

class PublicVerificationService
{
    /**
     * @return array<string, mixed>
     */
    public function verify(string $radiograph): array
    {
        return [
            'radiograph' => $radiograph,
            'valid' => false,
            'summary' => null,
        ];
    }
}
