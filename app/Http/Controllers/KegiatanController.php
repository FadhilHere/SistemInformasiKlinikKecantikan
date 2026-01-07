<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class KegiatanController extends Controller
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

        $data = Kegiatan::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        // $this->ensureAdmin();

        $kegiatan = Kegiatan::find($id);

        if (!$kegiatan) {
            return response()->json([
                'success' => false,
                'message' => 'Kegiatan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $kegiatan,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'namaKegiatan' => 'bail|required|string|max:60',
            'deskripsi' => 'bail|required|string',
            'foto' => 'bail|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggalKegiatan' => 'bail|required|date',
        ])->validate();

        $payload = [
            'namaKegiatan' => $data['namaKegiatan'],
            'deskripsi' => $data['deskripsi'],
            'tanggalKegiatan' => $data['tanggalKegiatan'],
        ];

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('kegiatan', 'public');
            $payload['foto'] = $path;
        }

        $kegiatan = Kegiatan::create($payload);

        return response()->json([
            'success' => true,
            'data' => $kegiatan,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $kegiatan = Kegiatan::find($id);

        if (!$kegiatan) {
            return response()->json([
                'success' => false,
                'message' => 'Kegiatan tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'namaKegiatan' => 'bail|sometimes|required|string|max:60',
            'deskripsi' => 'bail|sometimes|required|string',
            'foto' => 'bail|sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggalKegiatan' => 'bail|sometimes|required|date',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('foto')) {
            if (!empty($kegiatan->foto)) {
                Storage::disk('public')->delete($kegiatan->foto);
            }
            $path = $request->file('foto')->store('kegiatan', 'public');
            $payload['foto'] = $path;
        }

        $kegiatan->update($payload);

        return response()->json([
            'success' => true,
            'data' => $kegiatan,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $kegiatan = Kegiatan::find($id);

        if (!$kegiatan) {
            return response()->json([
                'success' => false,
                'message' => 'Kegiatan tidak ditemukan',
            ], 404);
        }

        if (!empty($kegiatan->foto)) {
            Storage::disk('public')->delete($kegiatan->foto);
        }

        $kegiatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan dihapus',
        ]);
    }
}
