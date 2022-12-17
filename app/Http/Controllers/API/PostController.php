<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Support\Facades\Validator;
use File;

class PostController extends Controller
{

    public function index()
    {
        $posts = Post::orderBy('id', 'DESC')->get();

        if($posts)
        {
            return response()->json([
                'status' => 200,
                'posts' => $posts,
            ]);
        }
        else
        {
            return response()->json([
                'status' => 404,
            ]);
        }
    }

    public function likes(Request $request) 
    {
        $like = new Like;
        $like->id_post = $request->id_post;
        $like->id_user = $request->id_user;

        $like->save();

        return response()->json([
            'status' => 200,
        ]);
    }

    public function likesGet(Request $request) 
    {
        $likes = Like::orderBy('created_at', 'DESC')->get();

        if($likes)
        {
            return response()->json([
                'status' => 200,
                'likes' => $likes,
            ]);
        }
        else
        {
            return response()->json([
                'status' => 404,
            ]);
        }
    }

    public function likeOne(Request $request, $id) 
    {
        $like = Like::find($id);
        
        return response()->json([
            'status' => 200,
            'like' => $like,
        ]);
    }

    public function UnLike(Request $request, $id) 
    {
        $like = Like::find($id);
        $like->delete();
        
        return response()->json([
            'status' => 200,
        ]);
    }

    public function store(Request $request)
    {
        $posts = new Post();
        $posts->id_user = $request->id_user;
        $posts->description = $request->description;

        if($request->hasFile('post')) {
            $path = 'uploads/posts/'.$posts->post;
            $file = $request->file('post');
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '.' . $extension;
            if(strpos($filename, 'mp4') != false) {
                $file->move('uploads/videos/', $filename);
            }else {
                $file->move('uploads/posts/', $filename);
            }
            $posts->post = $filename;
        }
        $posts->save();

        return response()->json([
            'status' => 200,
            'message' => 'Ваша новая публикация!',
        ]);
    }

    public function show($id)
    {
        $post = Post::find($id);

        if($post)
        {
            return response()->json([
                'status' => 200,
                'post' => $post,
            ]);
        }
        else
        {
            return response()->json([
                'status'=> 404,
                'message' => 'Данный пост не найден.',
            ]);
        }
    }

    public function edit(Request $request, $id)
    {
        $post = Post::find($id);
        $post->description = $request->input('description');

        $post->update();

        return response()->json([
            'status' => 200,
            'message' => 'Описание успешно редактировано!',
        ]);
    }

    public function destroy($id)
    {
        $post = Post::find($id);
        $post->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Запись удалена.',
        ]);
    }
}
