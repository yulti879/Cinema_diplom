<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SalesController extends Controller
{
    // Получить текущее состояние продаж
    public function get()
    {
        $open = Cache::get('sales_open', false);
        return response()->json(['open' => $open]);
    }

    // Установить состояние продаж
    public function set(Request $request)
    {
        $request->validate([
            'open' => 'required|boolean',
        ]);

        Cache::put('sales_open', $request->input('open'));

        return response()->json(['open' => $request->input('open')]);
    }
}