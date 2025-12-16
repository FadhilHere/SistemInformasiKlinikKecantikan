<?php

namespace App\Http\Controllers;

use App\Models\JadwalReservasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class JadwalReservasiController extends Controller
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

        $data = JadwalReservasi::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $jadwal = JadwalReservasi::find($id);
        if (!$jadwal) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $jadwal,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'jamMulai' => 'bail|required|date_format:H:i',
            'jamSelesai' => 'bail|required|date_format:H:i|after:jamMulai',
        ])->validate();

        $jadwal = JadwalReservasi::create($data);

        return response()->json([
            'success' => true,
            'data' => $jadwal,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $jadwal = JadwalReservasi::find($id);
        if (!$jadwal) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'jamMulai' => 'bail|sometimes|required|date_format:H:i',
            'jamSelesai' => 'bail|sometimes|required|date_format:H:i|after:jamMulai',
        ])->validate();

        $jadwal->update($data);

        return response()->json([
            'success' => true,
            'data' => $jadwal,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $jadwal = JadwalReservasi::find($id);
        if (!$jadwal) {
            return response()->json([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan',
            ], 404);
        }

        $jadwal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal dihapus',
        ]);
    }
}
