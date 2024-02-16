<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatroomResource;
use App\Models\Chatroom;
use Illuminate\Http\Request;

class ChatroomController extends Controller
{
    public function storeChatroom(Request $request)
    {
        $validated = $request->validate([
            'room_name' => 'required|unique:chatrooms,name|max:255',
        ]);


        $chatroom = auth()->user()->chatrooms()->create([
            'name' => $validated['room_name'],
        ]);

        return response()->json(['chatroom' => $chatroom], 201);
    }

    public function addUsersToChatroom(Request $request, Chatroom $chatroom)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'required|integer|exists:users,id',
        ]);

        $chatroom->users()->syncWithoutDetaching($validated['user_ids']);

        return response()->json([
            'chatroom' => $chatroom->load('users'),
        ], 201);
    }


    public function getChatrooms()
    {
        $chatrooms = auth()->user()->chatrooms()->with('users')->get();

        return response()->json([
            'chatrooms' => ChatroomResource::collection($chatrooms),
        ], 200);
    }
    public function deleteChatroom(Chatroom $chatroom)
    {
        $chatroom->delete();

        return response()->json([
            'message' => 'Chatroom deleted successfully!',
        ], 200);
    }
}
