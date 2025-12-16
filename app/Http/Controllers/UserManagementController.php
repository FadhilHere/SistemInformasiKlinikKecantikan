<?php

namespace App\Http\Controllers;

use App\Models\users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserManagementController extends Controller
{
    private function ensureAdmin()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            abort(response()->json([
                'success' => false,
                'message' => 'Forbidden: hanya admin yang diizinkan',
            ], 403));
        }
    }

    public function index()
    {
        $this->ensureAdmin();

        $data = users::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $user = users::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'nama' => 'bail|required|string|max:255',
            'alamat' => 'bail|nullable|string|max:255',
            'jenisKelamin' => 'bail|nullable|string|max:20',
            'tanggalLahir' => 'bail|nullable|date',
            'role' => 'bail|required|string|in:admin,pelanggan',
            'email' => 'bail|required|email:rfc,dns|unique:user,email',
            'nomorWa' => 'bail|nullable|string|max:20',
            'password' => 'bail|required|string|min:6',
        ])->validate();

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

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $user = users::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'nama' => 'bail|sometimes|required|string|max:255',
            'alamat' => 'bail|sometimes|nullable|string|max:255',
            'jenisKelamin' => 'bail|sometimes|nullable|string|max:20',
            'tanggalLahir' => 'bail|sometimes|nullable|date',
            'role' => 'bail|sometimes|required|string|in:admin,pelanggan',
            'email' => 'bail|sometimes|required|email:rfc,dns|unique:user,email,' . $id . ',idUser',
            'nomorWa' => 'bail|sometimes|nullable|string|max:20',
            'password' => 'bail|sometimes|required|string|min:6',
        ])->validate();

        // Hash password jika diisi
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $user = users::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User dihapus',
        ]);
    }
}
