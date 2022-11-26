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
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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

    public function UnLike(Request $request, $id) 
    {
        $like = Like::find($id);
        $like->delete();
        
        return response()->json([
            'status' => 200,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
