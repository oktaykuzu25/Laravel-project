<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Görev başlığı zorunludur.',
            'title.string' => 'Görev başlığı metin olmalıdır.',
            'title.max' => 'Görev başlığı en fazla 255 karakter olabilir.',

            'description.string' => 'Açıklama metin olmalıdır.',

            'is_completed.boolean' => 'Tamamlanma durumu doğru veya yanlış olmalıdır.',
        ];
    }
}
