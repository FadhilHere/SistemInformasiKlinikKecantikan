<?php

namespace App\Http\Controllers;

use App\Models\ProfilDokter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfilDokterController extends Controller
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

        $data = ProfilDokter::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $dokter = ProfilDokter::find($id);

        if (!$dokter) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $dokter,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'nama' => 'bail|required|string|max:60',
            'foto' => 'bail|nullable|image|mimes:jpg,jpeg,png|max:2048', // max 2MB, only images
            'email' => 'bail|required|email:rfc,dns|unique:profilDokter,email',
            'deskripsi' => 'bail|nullable|string|max:500',
        ])->validate();

        $payload = [
            'nama' => $data['nama'],
            'email' => $data['email'],
            'deskripsi' => $data['deskripsi'] ?? null,
        ];

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('profil-dokter', 'public');
            $payload['foto'] = $path;
        }

        $dokter = ProfilDokter::create($payload);

        return response()->json([
            'success' => true,
            'data' => $dokter,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $dokter = ProfilDokter::find($id);

        if (!$dokter) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'nama' => 'bail|sometimes|required|string|max:60',
            'foto' => 'bail|sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048', // max 2MB, only images
            'email' => 'bail|sometimes|required|email:rfc,dns|unique:profilDokter,email,' . $id . ',idDokter',
            'deskripsi' => 'bail|sometimes|nullable|string|max:500',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('foto')) {
            // hapus file lama jika ada
            if (!empty($dokter->foto)) {
                Storage::disk('public')->delete($dokter->foto);
            }
            $path = $request->file('foto')->store('profil-dokter', 'public');
            $payload['foto'] = $path;
        }
        // dd($request->all());
        $dokter->update($payload);

        return response()->json([
            'success' => true,
            'data' => $dokter,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $dokter = ProfilDokter::find($id);

        if (!$dokter) {
            return response()->json([
                'success' => false,
                'message' => 'Dokter tidak ditemukan',
            ], 404);
        }

        // hapus file foto jika ada
        if (!empty($dokter->foto)) {
            Storage::disk('public')->delete($dokter->foto);
        }

        $dokter->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dokter dihapus',
        ]);
    }
}
