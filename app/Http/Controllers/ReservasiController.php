<?php

namespace App\Http\Controllers;

use App\Models\Reservasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReservasiController extends Controller
{
    private function currentUser()
    {
        return Auth::user();
    }

    private function ensureOwnerOrAdmin(Reservasi $reservasi)
    {
        $user = $this->currentUser();
        if (!$user || ($user->role !== 'admin' && $reservasi->idUser !== $user->idUser)) {
            abort(response()->json([
                'success' => false,
                'message' => 'Forbidden: tidak diizinkan',
            ], 403));
        }
    }

    public function index()
    {
        $user = $this->currentUser();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $query = Reservasi::with(['dokter', 'jadwal']);

        if ($user->role !== 'admin') {
            $query->where('idUser', $user->idUser);
        }

        $data = $query->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $reservasi = Reservasi::with(['dokter', 'jadwal'])->find($id);

        if (!$reservasi) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        $this->ensureOwnerOrAdmin($reservasi);

        return response()->json([
            'success' => true,
            'data' => $reservasi,
        ]);
    }

    public function store(Request $request)
    {
        $user = $this->currentUser();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $data = Validator::make($request->all(), [
            'namaCustomer' => 'bail|required|string|max:60',
            'nomorWa' => 'bail|required|regex:/^[0-9]{8,12}$/',
            'jenisTreatment' => 'bail|required|string|max:60',
            'tanggalReservasi' => 'bail|required|date',
            'status' => 'bail|nullable|string|max:60',
            'idDokter' => 'bail|required|integer|exists:profilDokter,idDokter',
            'idJadwal' => 'bail|required|integer|exists:jadwalReservasi,idJadwal',
        ])->validate();

        $payload = [
            'namaCustomer' => $data['namaCustomer'],
            'nomorWa' => $data['nomorWa'],
            'jenisTreatment' => $data['jenisTreatment'],
            'tanggalReservasi' => $data['tanggalReservasi'],
            'status' => $data['status'] ?? 'pending',
            'idUser' => $user->idUser,
            'idDokter' => $data['idDokter'],
            'idJadwal' => $data['idJadwal'],
        ];

        $reservasi = Reservasi::create($payload);

        return response()->json([
            'success' => true,
            'data' => $reservasi,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $reservasi = Reservasi::find($id);

        if (!$reservasi) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        $this->ensureOwnerOrAdmin($reservasi);

        $user = $this->currentUser();

        $rules = [
            'namaCustomer' => 'bail|sometimes|required|string|max:60',
            'nomorWa' => 'bail|sometimes|sometimes|regex:/^[0-9]{8,12}$/',
            'jenisTreatment' => 'bail|sometimes|required|string|max:60',
            'tanggalReservasi' => 'bail|sometimes|required|date',
            'idDokter' => 'bail|sometimes|sometimes|integer|exists:profilDokter,idDokter',
            'idJadwal' => 'bail|sometimes|sometimes|integer|exists:jadwalReservasi,idJadwal',
        ];

        // Hanya admin yang boleh ubah status.
        if ($user->role === 'admin') {
            $rules['status'] = 'bail|sometimes|required|string|max:60';
        }

        $data = Validator::make($request->all(), $rules)->validate();

        // Jika non-admin, kunci status/idUser agar tidak bisa diubah.
        if ($user->role !== 'admin') {
            unset($data['status'], $data['idUser']);
        }

        $reservasi->update($data);

        return response()->json([
            'success' => true,
            'data' => $reservasi,
        ]);
    }

    public function destroy($id)
    {
        $reservasi = Reservasi::find($id);

        if (!$reservasi) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        $this->ensureOwnerOrAdmin($reservasi);

        $reservasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservasi dihapus',
        ]);
    }
}
