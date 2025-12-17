<?php

namespace App\Http\Controllers;

use App\Models\ProdukKlinik;
use App\Models\KategoriProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class ProdukKlinikController extends Controller
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
     * Display a listing of produk klinik
     * Public access - anyone can view products
     * Supports filtering by kategori
     */
    public function index(Request $request)
    {
        try {
            $query = ProdukKlinik::with('kategori');

            // Filter by kategori if provided
            if ($request->has('idKategori')) {
                $query->where('idKategori', $request->idKategori);
            }

            // Filter by stock availability
            if ($request->has('inStock') && $request->inStock == 'true') {
                $query->where('stock', '>', 0);
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('nama', 'like', '%' . $request->search . '%');
            }

            $data = $query->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produk klinik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified produk klinik
     * Public access - anyone can view product details
     */
    public function show($id)
    {
        try {
            $produk = ProdukKlinik::with(['kategori', 'promo'])->find($id);

            if (!$produk) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk klinik tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $produk,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produk klinik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created produk klinik
     * Admin only
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'nama' => 'bail|required|string|max:60',
            'deskripsi' => 'bail|required|string|max:5000',
            'harga' => 'bail|required|integer|min:0',
            'stock' => 'bail|required|integer|min:0',
            'idKategori' => 'bail|required|integer|exists:kategoriproduk,idKategori',
        ], [
            'nama.required' => 'Nama produk wajib diisi',
            'nama.max' => 'Nama produk maksimal 60 karakter',
            'deskripsi.required' => 'Deskripsi produk wajib diisi',
            'deskripsi.max' => 'Deskripsi produk maksimal 5000 karakter',
            'harga.required' => 'Harga produk wajib diisi',
            'harga.integer' => 'Harga harus berupa angka',
            'harga.min' => 'Harga tidak boleh negatif',
            'stock.required' => 'Stock produk wajib diisi',
            'stock.integer' => 'Stock harus berupa angka',
            'stock.min' => 'Stock tidak boleh negatif',
            'idKategori.required' => 'Kategori produk wajib dipilih',
            'idKategori.exists' => 'Kategori produk tidak valid',
        ])->validate();

        try {
            $produk = ProdukKlinik::create([
                'nama' => $data['nama'],
                'deskripsi' => $data['deskripsi'],
                'harga' => $data['harga'],
                'stock' => $data['stock'],
                'idKategori' => $data['idKategori'],
            ]);

            // Load relationship
            $produk->load('kategori');

            return response()->json([
                'success' => true,
                'message' => 'Produk klinik berhasil ditambahkan',
                'data' => $produk,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk klinik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified produk klinik
     * Admin only
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $produk = ProdukKlinik::find($id);

        if (!$produk) {
            return response()->json([
                'success' => false,
                'message' => 'Produk klinik tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'nama' => 'bail|sometimes|required|string|max:60',
            'deskripsi' => 'bail|sometimes|required|string|max:5000',
            'harga' => 'bail|sometimes|required|integer|min:0',
            'stock' => 'bail|sometimes|required|integer|min:0',
            'idKategori' => 'bail|sometimes|required|integer|exists:kategoriproduk,idKategori',
        ], [
            'nama.required' => 'Nama produk wajib diisi',
            'nama.max' => 'Nama produk maksimal 60 karakter',
            'deskripsi.required' => 'Deskripsi produk wajib diisi',
            'deskripsi.max' => 'Deskripsi produk maksimal 5000 karakter',
            'harga.required' => 'Harga produk wajib diisi',
            'harga.integer' => 'Harga harus berupa angka',
            'harga.min' => 'Harga tidak boleh negatif',
            'stock.required' => 'Stock produk wajib diisi',
            'stock.integer' => 'Stock harus berupa angka',
            'stock.min' => 'Stock tidak boleh negatif',
            'idKategori.required' => 'Kategori produk wajib dipilih',
            'idKategori.exists' => 'Kategori produk tidak valid',
        ])->validate();

        try {
            $produk->update($data);
            $produk->load('kategori');

            return response()->json([
                'success' => true,
                'message' => 'Produk klinik berhasil diperbarui',
                'data' => $produk,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui produk klinik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update stock of produk klinik
     * Admin only
     * Separate endpoint for stock management
     */
    public function updateStock(Request $request, $id)
    {
        $this->ensureAdmin();

        $produk = ProdukKlinik::find($id);

        if (!$produk) {
            return response()->json([
                'success' => false,
                'message' => 'Produk klinik tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'stock' => 'bail|required|integer|min:0',
            'action' => 'bail|sometimes|string|in:set,add,subtract',
        ], [
            'stock.required' => 'Jumlah stock wajib diisi',
            'stock.integer' => 'Stock harus berupa angka',
            'stock.min' => 'Stock tidak boleh negatif',
            'action.in' => 'Action harus: set, add, atau subtract',
        ])->validate();

        try {
            $action = $data['action'] ?? 'set';
            $stockValue = $data['stock'];

            switch ($action) {
                case 'add':
                    $produk->stock += $stockValue;
                    break;
                case 'subtract':
                    if ($produk->stock < $stockValue) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Stock tidak mencukupi. Stock saat ini: ' . $produk->stock,
                        ], 400);
                    }
                    $produk->stock -= $stockValue;
                    break;
                case 'set':
                default:
                    $produk->stock = $stockValue;
                    break;
            }

            $produk->save();

            return response()->json([
                'success' => true,
                'message' => 'Stock produk berhasil diperbarui',
                'data' => [
                    'idProduk' => $produk->idProduk,
                    'nama' => $produk->nama,
                    'stock' => $produk->stock,
                ],
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui stock produk',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified produk klinik
     * Admin only
     * Check if product is in cart or has sales before deletion
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $produk = ProdukKlinik::withCount(['keranjang', 'detailpenjualan'])->find($id);

        if (!$produk) {
            return response()->json([
                'success' => false,
                'message' => 'Produk klinik tidak ditemukan',
            ], 404);
        }

        // Prevent deletion if product is in cart
        if ($produk->keranjang_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak dapat dihapus karena masih ada di ' . $produk->keranjang_count . ' keranjang',
            ], 409);
        }

        // Prevent deletion if product has sales history
        if ($produk->detailpenjualan_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak dapat dihapus karena memiliki riwayat penjualan',
            ], 409);
        }

        try {
            $produk->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produk klinik berhasil dihapus',
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus produk klinik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
