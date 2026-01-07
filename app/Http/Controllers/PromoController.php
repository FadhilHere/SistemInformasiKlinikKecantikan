<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PromoController extends Controller
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

        $data = Promo::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        // $this->ensureAdmin();

        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'message' => 'Promo tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $promo,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'gambar' => 'bail|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'namaPromo' => 'bail|required|string|max:60',
            'jenisPromo' => 'bail|required|string|max:60',
            'kode' => 'bail|required|string|max:12',
            'diskon' => 'bail|required|integer|min:0',
            'deskripsi' => 'bail|required|string',
            'tanggalMulai' => 'bail|required|date',
            'tanggalSelesai' => 'bail|required|date|after_or_equal:tanggalMulai',
            'minimalTransaksi' => 'bail|required|integer|min:0',
            'status' => 'bail|required|boolean',
            'idKategori' => 'bail|nullable|integer|exists:kategoriProduk,idKategori',
            'idProduk' => 'bail|nullable|integer|exists:produkKlinik,idProduk',
        ])->validate();

        $payload = [
            'namaPromo' => $data['namaPromo'],
            'jenisPromo' => $data['jenisPromo'],
            'kode' => $data['kode'],
            'diskon' => $data['diskon'],
            'deskripsi' => $data['deskripsi'],
            'tanggalMulai' => $data['tanggalMulai'],
            'tanggalSelesai' => $data['tanggalSelesai'],
            'minimalTransaksi' => $data['minimalTransaksi'],
            'status' => $data['status'],
            'idKategori' => $data['idKategori'] ?? null,
            'idProduk' => $data['idProduk'] ?? null,
        ];

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('promo', 'public');
            $payload['gambar'] = $path;
        }

        $promo = Promo::create($payload);

        return response()->json([
            'success' => true,
            'data' => $promo,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'message' => 'Promo tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'gambar' => 'bail|sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'namaPromo' => 'bail|sometimes|required|string|max:60',
            'jenisPromo' => 'bail|sometimes|required|string|max:60',
            'kode' => 'bail|sometimes|required|string|max:12',
            'diskon' => 'bail|sometimes|required|integer|min:0',
            'deskripsi' => 'bail|sometimes|required|string',
            'tanggalMulai' => 'bail|sometimes|required|date',
            'tanggalSelesai' => 'bail|sometimes|required|date|after_or_equal:tanggalMulai',
            'minimalTransaksi' => 'bail|sometimes|required|integer|min:0',
            'status' => 'bail|sometimes|required|boolean',
            'idKategori' => 'bail|sometimes|nullable|integer|exists:kategoriProduk,idKategori',
            'idProduk' => 'bail|sometimes|nullable|integer|exists:produkKlinik,idProduk',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('gambar')) {
            if (!empty($promo->gambar)) {
                Storage::disk('public')->delete($promo->gambar);
            }
            $path = $request->file('gambar')->store('promo', 'public');
            $payload['gambar'] = $path;
        }

        $promo->update($payload);

        return response()->json([
            'success' => true,
            'data' => $promo,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'message' => 'Promo tidak ditemukan',
            ], 404);
        }

        if (!empty($promo->gambar)) {
            Storage::disk('public')->delete($promo->gambar);
        }

        $promo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promo dihapus',
        ]);
    }
}
