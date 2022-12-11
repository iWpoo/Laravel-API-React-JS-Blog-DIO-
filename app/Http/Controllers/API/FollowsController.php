<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Follower;
use App\Models\User;

class FollowsController extends Controller
{
    public function followUsers() 
    {
        $followers = Follower::orderBy('id', 'DESC')->get();

        if($followers)
        {
            return response()->json([
                'status' => 200,
                'followers' => $followers,
            ]);
        }
        else
        {
            return response()->json([
                'status' => 404,
            ]);
        }
    }

    public function toFollow(Request $request) 
    {
        $follow = new Follower;
        $follow->follower_id = $request->follower_id;
        $follow->user_id = $request->user_id;
        $follow->is_private = $request->is_private;
        $follow->save();
        
        return response()->json([
            'status' => 200,
        ]);
    }

    public function requestFollow(Request $request, $id)
    {
        $follow = Follower::find($id);
        $follow->follower_id = $request->input('follower_id');
        $follow->user_id = $request->input('user_id');
        $follow->is_private = $request->input('is_private');
        $follow->update();
        
        return response()->json([
            'status' => 200,
        ]);
    }

    public function unFollow($id) 
    {
        $follow = Follower::find($id);
        $follow->delete();

        return response()->json([
            'status' => 200,
        ]);
    } 
}
