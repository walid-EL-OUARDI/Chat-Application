<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ChatroomController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Models\Chatroom;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    //chatrooms 
    Route::post('/chatrooms', [ChatroomController::class, 'storeChatroom']);
    Route::get('/chatrooms/{chatroom}', [ChatroomController::class, 'getChatRoomById']);
    Route::post('/chatrooms/{chatroom}/users', [ChatroomController::class, 'addUsersToChatroom']);
    Route::post('/chatrooms/{chatroom}/update', [ChatroomController::class, 'updateChatroom']);
    Route::get('/chatrooms', [ChatroomController::class, 'getChatrooms']);
    Route::delete('/chatrooms/{chatroom}', [ChatroomController::class, 'deleteChatroom']);

    //search users
    Route::get('/search/users', [UserController::class, 'searchUsers']);

    Broadcast::routes(['middleware' => ['auth:sanctum']]);


    Route::post('chatrooms/{chatroom}/user-is-typing', [MessageController::class, 'userIsTyping']);
    Route::post('chatrooms/{chatroom}/user-stopped-typing', [MessageController::class, 'userStoppedTyping']);

    //send messages
    Route::post('/chatroom/{chatroom}/messages', [MessageController::class, 'storeMessage']);
});

// Route::post('/logout', [AuthController::class, 'logout']);