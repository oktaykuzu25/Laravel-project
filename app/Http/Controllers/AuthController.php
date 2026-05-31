<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Yeni kullanıcı kaydı + token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Şifre, User modelindeki 'password' => 'hashed' cast'i ile otomatik hash'lenir.
        $user = User::create($request->validated());

        return $this->tokenResponse($user, 'Kayıt başarılı.', 201);
    }

    /**
     * Giriş + token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::firstWhere('email', $data['email']);

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'E-posta veya şifre hatalı.'], 401);
        }

        return $this->tokenResponse($user, 'Giriş başarılı.');
    }

    /**
     * Token üretip standart JSON cevabı döndüren ortak yardımcı (DRY).
     */
    private function tokenResponse(User $user, string $message, int $status = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'user'    => $user,
            'token'   => $user->createToken('auth')->plainTextToken,
        ], $status);
    }
}
