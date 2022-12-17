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
        ]);
    }
}
