<?php

namespace App\Http\Controllers;

use App\Models\users;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = Validator::make($request->all(), [
            'nama' => 'required|string',
            'alamat' => 'nullable|string',
            'jenisKelamin' => 'nullable|string',
            'tanggalLahir' => 'nullable|date',
            'role' => 'required|string',
            'email' => 'required|email|unique:user,email',
            'nomorWa' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
        ])->validate();

        try {
            $user = users::create([
                'nama' => $data['nama'],
                'alamat' => $data['alamat'] ?? null,
                'jenisKelamin' => $data['jenisKelamin'] ?? null,
                'tanggalLahir' => $data['tanggalLahir'] ?? null,
                'role' => $data['role'],
                'email' => $data['email'],
                'nomorWa' => $data['nomorWa'] ?? null,
                'password' => Hash::make($data['password']),
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal registrasi',
                'error' => $e->getMessage(),
            ], 500);
        }

        $token = Auth::login($user);

        return response()->json([
            'success' => true,
            'token' => $token,
            'type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'token' => $token,
            'type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Logout berhasil']);
    }
}
