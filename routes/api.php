<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\ChatController;

Route::get('/posts', [StudentController::class, 'index']);
Route::post('/add-posts', [StudentController::class, 'store']);
Route::get('/edit-posts/{id}', [StudentController::class, 'edit']);
Route::post('/update-posts/{id}', [StudentController::class, 'update']);
Route::delete('/delete-posts/{id}', [StudentController::class, 'destroy']);
Route::get('/search/{key}', [StudentController::class, 'search']);

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// PROFILE
Route::get('/profile/{id}', [ProfileController::class, 'getUser']);
Route::post('/edit-profile/{id}', [ProfileController::class, 'editUser']);
Route::post('/delete-profile-img/{id}', [ProfileController::class, 'deleteUserImage']);
Route::post('/edit-image/{id}', [ProfileController::class, 'editImage']);

//Change Password
Route::post('/password/{id}', [ProfileController::class, 'changePassword']);

//Privacy
Route::post('/privacy_and_security/{id}', [ProfileController::class, 'closeAccount']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});
