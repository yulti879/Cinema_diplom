<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SalesController;

Route::middleware('web')->group(function () {

    // ===============================
    // React SPA — главная страница
    // ===============================
    Route::get('/', function () {
        return view('app');
    })->name('home');

    // ===============================
    // API маршруты
    // ===============================
    Route::prefix('api')->group(function () {

        // ---------- ПУБЛИЧНЫЕ API ----------

        // Аутентификация
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);

        // Фильмы
        Route::get('/movies', [MovieController::class, 'index']);
        Route::get('/movies/{id}', [MovieController::class, 'show']);

        // Залы
        Route::get('/halls', [HallController::class, 'index']);
        Route::get('/halls/{id}', [HallController::class, 'show']);

        // Сеансы
        Route::get('/screenings', [ScreeningController::class, 'index']);
        Route::get('/screenings/{id}', [ScreeningController::class, 'show']);

        // Бронирование (гости)
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::get('/bookings/{code}', [BookingController::class, 'show']);
        Route::get('/bookings/{code}/qr', [BookingController::class, 'qr'])
            ->name('bookings.qr');

        // ---------- ЗАЩИЩЁННЫЕ API ----------
        Route::middleware('auth')->group(function () {

            // Пользователь
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);

            // Тест
            Route::get('/test', function () {
                return response()->json([
                    'message' => 'API работает!',
                    'user' => Auth::user(),
                ]);
            });

            // ===== УПРАВЛЕНИЕ ФИЛЬМАМИ =====
            Route::post('/movies', [MovieController::class, 'store']);
            Route::put('/movies/{id}', [MovieController::class, 'update']);
            Route::patch('/movies/{id}', [MovieController::class, 'update']);
            Route::delete('/movies/{id}', [MovieController::class, 'destroy']);

            // ===== УПРАВЛЕНИЕ ЗАЛАМИ =====
            Route::post('/halls', [HallController::class, 'store']);
            Route::put('/halls/{id}', [HallController::class, 'update']);
            Route::patch('/halls/{id}', [HallController::class, 'update']);
            Route::delete('/halls/{id}', [HallController::class, 'destroy']);

            // ===== УПРАВЛЕНИЕ СЕАНСАМИ =====
            Route::post('/screenings', [ScreeningController::class, 'store']);
            Route::put('/screenings/{id}', [ScreeningController::class, 'update']);
            Route::patch('/screenings/{id}', [ScreeningController::class, 'update']);
            Route::delete('/screenings/{id}', [ScreeningController::class, 'destroy']);

            // ===== УПРАВЛЕНИЕ БРОНИРОВАНИЯМИ =====
            Route::get('/admin/bookings', [BookingController::class, 'index']);
            Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

            // ===== УПРАВЛЕНИЕ ПРОДАЖАМИ =====
            Route::get('/sales', [SalesController::class, 'get']);
            Route::post('/sales', [SalesController::class, 'set']);
        });
    });

    // ===============================
    // Catch-all для SPA
    // ===============================
    Route::get('/{any}', function () {
        return view('app');
    })->where('any', '.*');
});
