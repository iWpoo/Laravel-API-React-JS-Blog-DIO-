<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\ChatController;

Route::get('/posts', [StudentController::class, 'index']);
Route::post('/add-posts', [StudentController::class, 'store']);
Route::get('/edit-posts/{id}', [StudentController::class, 'edit']);
Route::post('/update-posts/{id}', [StudentController::class, 'update']);
Route::delete('/delete-posts/{id}', [StudentController::class, 'destroy']);
Route::get('/search/{key}', [StudentController::class, 'search']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile/{id}', [AuthController::class, 'getUser']);
Route::post('/edit-profile/{id}', [AuthController::class, 'editUser']);
Route::post('/delete-profile-img/{id}', [AuthController::class, 'deleteUserImage']);

Route::post('password/{id}', [AuthController::class, 'changePassword']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});
