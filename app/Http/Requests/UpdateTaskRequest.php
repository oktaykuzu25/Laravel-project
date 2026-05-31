<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'is_completed' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'Görev başlığı metin olmalıdır.',
            'title.max' => 'Görev başlığı en fazla 255 karakter olabilir.',
            'description.string' => 'Açıklama metin olmalıdır.',
            'is_completed.boolean' => 'Tamamlanma durumu doğru veya yanlış olmalıdır.',
        ];
    }
}
