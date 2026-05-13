<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AiDetectionService
{
    /**
     * @return array<string, mixed>
     */
    public function analyze(string $radiograph): array
    {
        return [
            'radiograph' => $radiograph,
            'status' => 'queued',
            'results' => [],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function buildPayload(string $imagePath): array
    {
        return ['image_path' => $imagePath];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function sendRequestToFlask(array $payload): array
    {
        $baseUrl = config('services.ai.url', 'http://127.0.0.1:5000');

        return Http::timeout(120)
            ->connectTimeout(10)
            ->post($baseUrl.'/predict', $payload)
            ->throw()
            ->json();
    }

    /**
     * @param  array<string, mixed>  $response
     * @return array<string, mixed>
     */
    public function normalizeResponse(array $response): array
    {
        return [
            'results' => $response['results'] ?? [],
            'result_image' => $response['result_image'] ?? null,
        ];
    }
}
