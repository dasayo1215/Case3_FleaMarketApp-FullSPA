<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExhibitionRequest;
use App\Http\Requests\CommentRequest;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\ItemCondition;
use App\Models\Item;
use App\Models\Like;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(Item::all());
    }

    public function listAvailableItems(Request $request) {
        $page = $request->query('page');
        $keyword = $request->query('keyword');

        if($page === 'mylist'){
            return $this->showMyList($request);
        }

        $query = Item::with('purchase');

        // ログインしている場合は自分が出品した商品を除外
        if (Auth::check()) {
            $user = Auth::user();
            $query->where('seller_id', '!=', $user->id);
        }

        if(!empty($keyword)){
            $query->where('name', 'like', '%' . $keyword . '%');
        }

        $items = $query->latest()->get();

        return Inertia::render('Items/Index', [
            'items' => $items,
            'keyword' => $keyword,
            'page' => $page,
        ]);
    }

    public function showMyList(Request $request) {
        $items = [];
        $keyword = $request->query('keyword');

        if (Auth::check()) {
            $user = Auth::user();

            $items = $user->likedItems()
                ->where('seller_id', '!=', $user->id)
                ->when($keyword, function ($query, $keyword) {
                    $query->where('name', 'like', '%' . $keyword . '%');
                })
                ->orderBy('pivot_created_at', 'desc') // いいね順に並び替え
                ->get();
        }

        $page='mylist';

        return view('items.index', compact('items', 'keyword', 'page'));
    }

    public function showItem($itemId)
    {
        $item = Item::with([
            'categories',
            'itemCondition',
            'purchase',
            'comments.user',   // ← コメントとユーザー情報を一緒にロード！
            'likes',
        ])->findOrFail($itemId);

        $user = Auth::user();

        return Inertia::render('Items/Show', [
            'item' => $item,
            'user' => $user,
            'isLiked' => $user ? $item->isLikedBy($user) : false, // ← これ必須
            'likeCount' => $item->likes->count(),
            'commentCount' => $item->comments->count(),
            'comments' => $item->comments->map(fn($c) => [
                'user_name' => $c->user->name,
                'user_image' => $c->user->image_filename,
                'text' => $c->comment,
            ]),
        ]);
    }

    public function storeComment(CommentRequest $request, $itemId){
        $request->validated();

        $item = Item::findOrFail($itemId);
        $comment = $item->comments()->create([
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        // ユーザー情報も一緒に返す（画像・名前のため）
        $comment->load('user');

        return response()->json([
            'success' => true,
            'comment' => [
                'user_name' => $comment->user->name,
                'user_image' => $comment->user->image_filename,
                'text' => $comment->comment,
            ],
        ]);
    }

    public function toggleLike(Request $request, $itemId){
        $user = Auth::user();
        $item = Item::findOrFail($itemId);
        $like = $item->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => $user->id,
                'item_id' => $itemId,
            ]);
            $liked = true;
        }

        if ($request->expectsJson()) {
            return response()->json([
                'liked' => $liked,
                'like_count' => $item->likes()->count(),
            ]);
        }

        return back();
    }

    public function showSellForm()
    {
        $categories = Category::all();
        $conditions = ItemCondition::all();

        return Inertia::render('Items/Create', [
            'categories' => $categories,
            'conditions' => $conditions,
        ]);
    }

    public function storeItem(ExhibitionRequest $request)
    {
        $validated = $request->validated();
        $sellerId = auth()->id();

        $item = new Item();
        $item->name = $validated['name'];
        $item->brand = $validated['brand'] ?? null;
        $item->description = $validated['description'];
        $item->price = str_replace(',', '', $validated['price']);
        $item->item_condition_id = $validated['item_condition_id'];
        $item->seller_id = $sellerId;

        // 仮保存
        $item->image_filename = '';
        $item->save();

        // 画像の移動
        $tmpPath = $validated['sell_uploaded_image_path'];
        if ($tmpPath && \Storage::disk('public')->exists($tmpPath)) {
            $extension = pathinfo($tmpPath, PATHINFO_EXTENSION);
            $filename = $item->id . '_' . now()->format('YmdHis') . '.' . $extension;
            \Storage::disk('public')->move($tmpPath, 'items/' . $filename);
            $item->image_filename = $filename;
            $item->save();
        }

        $item->categories()->sync($validated['category_id']);

        return redirect()->route('mypage');
    }

    public function uploadItemImage(UploadImageRequest $request) {
        $path = $request->file('image')->store('tmp', 'public');

        return response()->json([
            'success' => true,
            'path' => $path,
            'image_url' => asset('storage/' . $path),
        ]);
    }
}