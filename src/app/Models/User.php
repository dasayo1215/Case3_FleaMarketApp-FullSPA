<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\JapaneseVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'postal_code',
        'address',
        'building',
        'image_filename'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'password_confirmation',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function likes() {
        return $this->hasMany(Like::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function purchases() {
        return $this->hasMany(Purchase::class, 'buyer_id');
    }

    public function items() {
        return $this->hasMany(Item::class, 'seller_id');
    }

    public function sendEmailVerificationNotification() {
        $this->notify(new JapaneseVerifyEmail());
    }

    public function likedItems() {
        return $this->belongsToMany(Item::class, 'likes')->withTimestamps();
    }

    public function getProfileImageUrlAttribute()
    {
        if ($this->image_filename) {
            return asset('storage/users/' . $this->image_filename);
        }
        // 画像がない場合は null か、デフォルト画像のパスを返す
        return asset('images/no-image.png');
    }
}