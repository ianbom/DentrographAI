<?php

namespace App\Http\Requests\Radiographs;

use Illuminate\Foundation\Http\FormRequest;

class FinalizeRadiographRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'detections' => ['required', 'array'],
        ];
    }
}
