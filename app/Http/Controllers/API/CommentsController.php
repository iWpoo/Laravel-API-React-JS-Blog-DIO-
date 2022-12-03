<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentsController extends Controller
{
    public function AddComment(Request $request) 
    {
        $comment = new Comment();
        $comment->id_user = $request->id_user;
        $comment->id_post = $request->id_post;
        $comment->text = $request->text;

        $comment->save();
        return response()->json([
            'status' => 200,
        ]);
    }   

    public function DeleteComment(Request $request, $id) 
    {
        $comment = Comment::find($id);
        $comment->delete();
        
        return response()->json([
            'status' => 200,
        ]);
    }   

    public function GetComments()
    {
        $comments = Comment::orderBy('id', 'ASC')->get();

        if($comments)
        {
            return response()->json([
                'status' => 200,
                'comments' => $comments,
            ]);
        }
        else
        {
            return response()->json([
                'status' => 404,
            ]);
        }
    }
}