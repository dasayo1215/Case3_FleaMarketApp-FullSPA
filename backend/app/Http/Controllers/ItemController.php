<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        // ダミーデータを返す
        return response()->json([
            ['id' => 1, 'name' => 'サンプル商品A', 'price' => 1000],
            ['id' => 2, 'name' => 'サンプル商品B', 'price' => 2000],
        ]);
    }
}
