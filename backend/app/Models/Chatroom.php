<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chatroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
