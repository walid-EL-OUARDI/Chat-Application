<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function updateUserAvatar(Request $request)
    {
        $request->validate(['image' => 'required|max:2044|image|mimes:jpg,png,jpeg']);

        $user = auth()->user();

        if (Storage::exists('public/users_avatars' . basename($user->avatat_url))) {
            Storage::delete('public/users_avatars' . basename($user->avatat_url));
        }
        $image = $request->image;
        $imageName = $user->id . '_avatar' . '.' . $request->image->extension();
        $image->storeAs('public/users_avatars', $imageName);
        $storageUrl = Storage::url('users_avatars/' . $imageName);


        $user->avatar_url = $storageUrl;
        $user->save();

        return response()->json([
            'user' => $user
        ], 200);
    }

    public function updateUserName(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|min:3|max:255']);
        $user = $request->user();
        $user->name = $validated['name'];
        $user->save();

        return response()->json([
            'user' => $user
        ], 200);
    }
}
