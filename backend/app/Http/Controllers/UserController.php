<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function searchUsers(Request $request)
    {
        $keyword = $request->input('query');
        $currentUser = $request->user();
        $users = $currentUser->where('id', '!=', $currentUser->id)->where(
            fn ($q) =>
            $q->where('name', 'LIKE', '%' . $keyword . '%')
                ->orwhere('email', 'LIKE', '%' . $keyword . '%')
        )->get();
        return response()->json([
            'users' => $users
        ]);
    }
}
