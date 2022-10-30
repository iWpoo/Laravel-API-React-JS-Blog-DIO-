<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use File;


class ProfileController extends Controller
{
    public function closeAccount(Request $request, $id) {
        $user = User::find($id);
        $user->is_private = $request->input('is_private');

        $user->update();

        return response()->json([
            'status'=> 200,
        ]);
    }

    public function changePassword(Request $request, $id) {
        $user = User::find($id);

        $user->password = Hash::make($request->input('password'));

        $user->update();

        return response()->json([
            'status'=> 200,
            'message'=>'Пароль успешно изменен.',
        ]);
    }

    public function deleteUserImage(Request $request, $id) {
        $user = User::find($id);

        $path = 'uploads/profiles/'.$user->image;
        if(File::exists($path)) {
            File::delete($path);
        }

        $user->image = $request->input('image');

        $user->update();

        return response()->json([
            'status'=> 200,
            'image'=>$user->image,
            'message'=>'Image Deleted Successfully',
        ]);

    }

    public function editImage(Request $request, $id) {
        $validator = Validator::make($request->all(),[
            'image'=>'',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=> 422,
                'validate_err'=> $validator->messages(),
            ]);
        }
        else
        {
            $user = User::find($id);

            if($request->hasFile('image')) {
                $path = 'uploads/profiles/'.$user->image;
                if(File::exists($path)) {
                    File::delete($path);
                }
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '.' . $extension;
                $file->move('uploads/profiles/', $filename);
                $user->image = $filename;
            }

            $user->update();

            return response()->json([
                'status'=> 200,
                'image'=>$user->image,
                'message'=>'Данные обновлены.',
            ]);
        }
    } 

    public function editUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'username'=>'',
            'name'=>'',
            'email'=>'email',
            'site'=>'',
            'phone'=>'',
            'bio'=>'',
            'is_private'=>'',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=> 422,
                'validate_err'=> $validator->messages(),
            ]);
        }
        else
        {
            $user = User::find($id);
            $user->username = $request->input('username');
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->site = $request->input('site');
            $user->phone = $request->input('phone');
            $user->bio = $request->input('bio');
            $user->is_private = $request->input('id_private');

            $user->update();

            return response()->json([
                'status'=> 200,
                'username'=>$user->username,
                'id'=>$user->id,
                'message'=>'Данные обновлены.',
            ]);
        }
    }

    public function getUser($id) {

        $user = User::find($id);

        if($user)
        {
            return response()->json([
                'status'=> 200,
                'user'=>$user,
                'name'=>$user->name,
            ]);
        }
        else
        {
            return response()->json([
                'status'=> 404,
                'message' => 'Данный пользователь не найден.',
            ]);
        }
    }

    public function getAllUsers() {
        $users = User::orderBy('id', 'DESC')->get();

        if($users)
        {
            return response()->json([
                'status'=> 200,
                'users'=>$users,
            ]);
        }
        else
        {
            return response()->json([
                'status'=> 404,
            ]);
        }
    }
}