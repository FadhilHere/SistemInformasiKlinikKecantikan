<?php

namespace App\Http\Controllers;

use App\Models\KategoriProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class KategoriProdukController extends Controller
{
    /**
     * Ensure only admin can perform actions
     */
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

    /**
     * Display a listing of kategori produk
     * Public access - anyone can view categories
     */
    public function index()
    {
        try {
            $data = KategoriProduk::all();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified kategori produk
     * Public access - anyone can view category details
     */
    public function show($id)
    {
        try {
            $kategori = KategoriProduk::with('produkklinik')->find($id);

            if (!$kategori) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori produk tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $kategori,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created kategori produk
     * Admin only
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'nama' => 'bail|required|string|max:60|unique:kategoriproduk,nama',
            'deskripsi' => 'bail|required|string|max:1000',
        ], [
            'nama.required' => 'Nama kategori wajib diisi',
            'nama.max' => 'Nama kategori maksimal 60 karakter',
            'nama.unique' => 'Nama kategori sudah digunakan',
            'deskripsi.required' => 'Deskripsi kategori wajib diisi',
            'deskripsi.max' => 'Deskripsi kategori maksimal 1000 karakter',
        ])->validate();

        try {
            $kategori = KategoriProduk::create([
                'nama' => $data['nama'],
                'deskripsi' => $data['deskripsi'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kategori produk berhasil ditambahkan',
                'data' => $kategori,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan kategori produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified kategori produk
     * Admin only
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $kategori = KategoriProduk::find($id);

        if (!$kategori) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori produk tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'nama' => 'bail|sometimes|required|string|max:60|unique:kategoriproduk,nama,' . $id . ',idKategori',
            'deskripsi' => 'bail|sometimes|required|string|max:1000',
        ], [
            'nama.required' => 'Nama kategori wajib diisi',
            'nama.max' => 'Nama kategori maksimal 60 karakter',
            'nama.unique' => 'Nama kategori sudah digunakan',
            'deskripsi.required' => 'Deskripsi kategori wajib diisi',
            'deskripsi.max' => 'Deskripsi kategori maksimal 1000 karakter',
        ])->validate();

        try {
            $kategori->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Kategori produk berhasil diperbarui',
                'data' => $kategori,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui kategori produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified kategori produk
     * Admin only
     * Check if category has products before deletion
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $kategori = KategoriProduk::withCount('produkklinik')->find($id);

        if (!$kategori) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori produk tidak ditemukan',
            ], 404);
        }

        // Prevent deletion if category has products
        if ($kategori->produkklinik_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak dapat dihapus karena masih memiliki ' . $kategori->produkklinik_count . ' produk',
            ], 409);
        }

        try {
            $kategori->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kategori produk berhasil dihapus',
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus kategori produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
