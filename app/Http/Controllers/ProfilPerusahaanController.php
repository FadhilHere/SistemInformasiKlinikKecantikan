<?php

namespace App\Http\Controllers;

use App\Models\ProfilPerusahaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfilPerusahaanController extends Controller
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

        $data = ProfilPerusahaan::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $profil = ProfilPerusahaan::find($id);

        if (!$profil) {
            return response()->json([
                'success' => false,
                'message' => 'Profil perusahaan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profil,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'visi' => 'bail|required|string',
            'misi' => 'bail|required|string',
            'deskripsiPerusahaan' => 'bail|required|string',
            'nomorCustomerService' => 'bail|nullable|string|max:20',
            'jamBukak' => 'bail|required|date_format:H:i',
            'jamKeluar' => 'bail|required|date_format:H:i|after:jamBukak',
        ])->validate();

        $profil = ProfilPerusahaan::create($data);

        return response()->json([
            'success' => true,
            'data' => $profil,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $profil = ProfilPerusahaan::find($id);

        if (!$profil) {
            return response()->json([
                'success' => false,
                'message' => 'Profil perusahaan tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'visi' => 'bail|sometimes|required|string',
            'misi' => 'bail|sometimes|required|string',
            'deskripsiPerusahaan' => 'bail|sometimes|required|string',
            'nomorCustomerService' => 'bail|sometimes|nullable|string|max:20',
            'jamBukak' => 'bail|sometimes|required|date_format:H:i',
            'jamKeluar' => 'bail|sometimes|required|date_format:H:i|after:jamBukak',
        ])->validate();

        $profil->update($data);

        return response()->json([
            'success' => true,
            'data' => $profil,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $profil = ProfilPerusahaan::find($id);

        if (!$profil) {
            return response()->json([
                'success' => false,
                'message' => 'Profil perusahaan tidak ditemukan',
            ], 404);
        }

        $profil->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profil perusahaan dihapus',
        ]);
    }
}
