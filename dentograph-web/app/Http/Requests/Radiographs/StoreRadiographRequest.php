<?php

namespace App\Http\Requests\Radiographs;

use Illuminate\Foundation\Http\FormRequest;

class StoreRadiographRequest extends FormRequest
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
            'patient_nik' => ['required', 'digits:16'],
            'doctor_id' => ['nullable', 'integer'],
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:10240'],
        ];
    }
}
