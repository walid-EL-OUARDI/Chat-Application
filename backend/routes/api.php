<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ChatroomController;
use App\Models\Chatroom;
use Illuminate\Http\Request;
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
    Route::post('/chatroom', [ChatroomController::class, 'storeChatroom']);
    Route::post('/chatrooms/{chatroom}/users', [ChatroomController::class, 'addUsersToChatroom']);
    Route::get('/chatrooms', [ChatroomController::class, 'getChatrooms']);
    Route::delete('/chatrooms/{chatroom}', [ChatroomController::class, 'deleteChatroom']);
});

// Route::post('/logout', [AuthController::class, 'logout']);