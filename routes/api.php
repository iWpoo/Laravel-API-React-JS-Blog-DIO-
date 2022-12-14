<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\FollowsController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\CommentsController;

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

// PROFILE
Route::get('/users', [ProfileController::class, 'getAllUsers']);
Route::get('/profile/{id}', [ProfileController::class, 'getUser']);
Route::post('/edit-profile/{id}', [ProfileController::class, 'editUser']);
Route::post('/delete-profile-img/{id}', [ProfileController::class, 'deleteUserImage']);
Route::post('/edit-image/{id}', [ProfileController::class, 'editImage']);

// Change Password
Route::post('/password/{id}', [ProfileController::class, 'changePassword']);

// Privacy
Route::post('/privacy_and_security/{id}', [ProfileController::class, 'privacyAccount']);

// Followers system
Route::get('/followers', [FollowsController::class, 'followUsers']);
Route::post('/tofollow', [FollowsController::class, 'toFollow']);
Route::post('/request-follow/{id}', [FollowsController::class, 'requestFollow']);
Route::delete('/unfollow/{id}', [FollowsController::class, 'unFollow']);

// POSTS
Route::get('/posts', [PostController::class, 'index']);
Route::get('/post/{id}', [PostController::class, 'show']);
Route::post('/add-posts', [PostController::class, 'store']);
Route::post('/edit-posts/{id}', [PostController::class, 'edit']);
Route::delete('/delete-posts/{id}', [PostController::class, 'destroy']);

// LIKES
Route::post('/likes', [PostController::class, 'likes']);
Route::get('/likes-get', [PostController::class, 'likesGet']);
Route::get('/like/{id}', [PostController::class, 'likeOne']);
Route::delete('/like-delete/{id}', [PostController::class, 'UnLike']);

// COMMENTS
Route::post('/comment-add', [CommentsController::class, 'AddComment']);
Route::get('/comments-get', [CommentsController::class, 'GetComments']);
Route::delete('/comment-delete/{id}', [CommentsController::class, 'DeleteComment']);