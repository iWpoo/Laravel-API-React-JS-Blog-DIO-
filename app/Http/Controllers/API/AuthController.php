<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use File;

class AuthController extends Controller
{
    public function changePassword(Request $request, $id) {
        $user = User::find($id);

        $user->password = Hash::make($request->input('password'));

        $user->update();

        return response()->json([
            'status'=> 200,
            'message'=>'Пароль успешно был обновлен.',
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

    public function editUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            'username'=>'required|max:191',
            'name'=>'required|max:191',
            'email'=>'email',
            'site'=>'',
            'phone'=>'',
            'bio'=>'',
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
                'username'=>$user->username,
                'id'=>$user->id,
                'image'=>$user->image,
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

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'=>'required|max:55',
            'username'=>'required|max:33|unique:users',
            'email'=>'required|max:191|unique:users',
            'token'=>'required|max:191|unique:users',
            'password'=>'required|min:8',
        ]);

        if($validator->fails()) {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else {
            $user = User::create([
                'username'=>$request->username,
                'name'=>$request->name,
                'email'=>$request->email,
                'token'=>$request->token,
                'password'=>Hash::make($request->password),
            ]);

            $user->save();
            return response()->json([
                'status'=>200,
                'username'=>$user->username,
                'token'=>$user->token,
                'id'=>$user->id,
                'message'=>'Вы успешно зарегистрировались!',
            ]);
        }
    }


    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'username'=>'required|max:191',
            'password'=>'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else {
            $user = User::where('username', $request->username)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status'=>401,
                    'message'=>'Invalid Credentials',
                ]);
            }
            else {
                $token = $user->createToken($user->username.'_Token')->plainTextToken;
                $pass = $request->password;

                return response()->json([
                    'status'=>200,
                    'username'=>$user->username,
                    'token'=>$user->token,
                    'id'=>$user->id,
                    'image'=>$user->image,
                    'message'=>'Авторизация прошла успешно.',
                ]);
            }
        }
    }

    public function logout(){
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged Out Successfully',
        ]);
    }
}
