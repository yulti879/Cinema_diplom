<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Логин через сессии
     */
    public function login(Request $request)
    {
        // Валидация
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Попытка аутентификации
        if (Auth::attempt($request->only('email', 'password'))) {
            // Регенерируем сессию для защиты от фиксации
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'message' => 'Авторизация успешна',
                'role' => $user->role,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ]);
        }

        // Если аутентификация не удалась
        return response()->json([
            'success' => false,
            'message' => 'Неверный email или пароль'
        ], 401);
    }

    /**
     * Логаут (уничтожение сессии)
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Выход выполнен'
        ]);
    }

    /**
     * Текущий пользователь
     */
    public function me(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Не авторизован'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'role' => $user->role,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }
}