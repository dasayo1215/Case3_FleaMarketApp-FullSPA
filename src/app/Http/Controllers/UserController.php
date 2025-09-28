<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ProfileRequest;
use App\Http\Requests\AddressRequest;
use Inertia\Inertia;

class UserController extends Controller
{
    public function showProfile(Request $request)
    {
        $user = $request->user();
        $page = $request->query('page', 'sell'); // デフォルトは出品タブ

        // 出品商品
        $sellItems = Item::where('seller_id', $user->id)
            ->with('purchase')
            ->latest()
            ->get();

        // 購入商品
        $buyItems = Item::whereHas('purchase', function ($query) use ($user) {
                $query->where('buyer_id', $user->id)
                    ->whereNotNull('completed_at');
            })
            ->with('purchase')
            ->get()
            ->sortByDesc(fn($item) => $item->purchase->completed_at)
            ->values();

        return inertia('Mypage', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'profile_image_url' => $user->profile_image_url,
                ],
            ],
            'page' => $page,
            'sellItems' => $sellItems,
            'buyItems' => $buyItems,
        ]);
    }

    public function editProfile(){
        $user = Auth::user();

        return Inertia::render('Users/Edit', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    public function updateProfile(AddressRequest $request){
        $data = $request->validated();
        $user = Auth::user();

        $path = $request->input('profile_uploaded_image_path');

        if ($path) {
            // 古い画像を削除
            if ($user->image_filename) {
                Storage::disk('public')->delete('users/' . $user->image_filename);
            }

            $filename = $user->id . '_' . time() . '.' . pathinfo($path, PATHINFO_EXTENSION);
            Storage::disk('public')->move($path, 'users/' . $filename);
            $data['image_filename'] = $filename;
        }

        $user->update($data);

        return redirect()->route('index');
    }

    public function uploadProfileImage(ProfileRequest $request) {
        $path = $request->file('image')->store('tmp', 'public');

        // JSONレスポンスを返す
        return response()->json([
            'success' => true,
            'image_url' => asset('storage/' . $path),
            'path' => $path,
        ]);
    }
}
