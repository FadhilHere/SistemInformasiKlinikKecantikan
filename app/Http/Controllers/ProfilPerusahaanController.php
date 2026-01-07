<?php

namespace App\Http\Controllers;

use App\Models\ProfilPerusahaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        // $this->ensureAdmin();

        $data = ProfilPerusahaan::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        // $this->ensureAdmin();

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
            'gambar' => 'bail|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'jamBukak' => 'bail|required|date_format:H:i',
            'jamKeluar' => 'bail|required|date_format:H:i|after:jamBukak',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('profil-perusahaan', 'public');
            $payload['gambar'] = $path;
        }

        $profil = ProfilPerusahaan::create($payload);

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
            'gambar' => 'bail|sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'jamBukak' => 'bail|sometimes|required|date_format:H:i',
            'jamKeluar' => 'bail|sometimes|required|date_format:H:i|after:jamBukak',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('gambar')) {
            if (!empty($profil->gambar)) {
                Storage::disk('public')->delete($profil->gambar);
            }
            $path = $request->file('gambar')->store('profil-perusahaan', 'public');
            $payload['gambar'] = $path;
        }

        $profil->update($payload);

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

        if (!empty($profil->gambar)) {
            Storage::disk('public')->delete($profil->gambar);
        }

        $profil->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profil perusahaan dihapus',
        ]);
    }
}
