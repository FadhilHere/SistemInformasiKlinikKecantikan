<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\ProdukKlinik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Inertia\Inertia;

class KeranjangController extends Controller
{
    /**
     * Get authenticated user
     */
    private function currentUser()
    {
        return Auth::user();
    }

    public function viewList()
    {
        return Inertia::render('CartPage');
    }

    /**
     * Display a listing of the resource.
     * Only shows items belonging to the logged-in user.
     */
    public function index()
    {
        try {
            $user = $this->currentUser();
            
            $keranjang = Keranjang::with(['produk.kategori', 'produk.promo'])
                ->where('idUser', $user->idUser)
                ->get();

            // Calculate subtotal for each item and total cart value
            $totalHarga = 0;
            $items = $keranjang->map(function ($item) use (&$totalHarga) {
                // Determine price (can be adjusted if promo logic exists)
                $hargaSatuan = $item->produk->harga;
                $subtotal = $hargaSatuan * $item->jumlahProduk;
                
                $totalHarga += $subtotal;

                return [
                    'idKeranjang' => $item->idKeranjang,
                    'jumlahProduk' => $item->jumlahProduk,
                    'subtotal' => $subtotal,
                    'produk' => $item->produk
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $items,
                    'totalHarga' => $totalHarga,
                    'totalItems' => $keranjang->sum('jumlahProduk')
                ]
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Logic: If product exists in cart -> update qty, else -> create new.
     * Check stock availability.
     */
    public function store(Request $request)
    {
        $user = $this->currentUser();

        $data = Validator::make($request->all(), [
            'idProduk' => 'bail|required|integer|exists:produkklinik,idProduk',
            'jumlahProduk' => 'bail|required|integer|min:1',
        ], [
            'idProduk.required' => 'Produk wajib dipilih',
            'idProduk.exists' => 'Produk tidak valid',
            'jumlahProduk.required' => 'Jumlah produk wajib diisi',
            'jumlahProduk.min' => 'Jumlah produk minimal 1',
        ])->validate();

        try {
            // Check product stock
            $produk = ProdukKlinik::find($data['idProduk']);
            if ($produk->stock < $data['jumlahProduk']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock produk tidak mencukupi. Stock tersisa: ' . $produk->stock,
                ], 400);
            }

            // Check if product already in cart
            $existingItem = Keranjang::where('idUser', $user->idUser)
                ->where('idProduk', $data['idProduk'])
                ->first();

            if ($existingItem) {
                // Validate total stock for update
                $newTotal = $existingItem->jumlahProduk + $data['jumlahProduk'];
                if ($produk->stock < $newTotal) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stock produk tidak mencukupi untuk penambahan ini. Stock tersisa: ' . $produk->stock,
                    ], 400);
                }

                $existingItem->jumlahProduk = $newTotal;
                $existingItem->save();
                $existingItem->load('produk');

                return response()->json([
                    'success' => true,
                    'message' => 'Jumlah produk di keranjang berhasil diperbarui',
                    'data' => $existingItem
                ], 200);
            } else {
                // Create new item
                $keranjang = Keranjang::create([
                    'idUser' => $user->idUser,
                    'idProduk' => $data['idProduk'],
                    'jumlahProduk' => $data['jumlahProduk']
                ]);
                $keranjang->load('produk');

                return response()->json([
                    'success' => true,
                    'message' => 'Produk berhasil ditambahkan ke keranjang',
                    'data' => $keranjang
                ], 201);
            }

        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk ke keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * Update quantity only.
     */
    public function update(Request $request, $id)
    {
        $user = $this->currentUser();

        $keranjang = Keranjang::where('idUser', $user->idUser)->find($id);

        if (!$keranjang) {
            return response()->json([
                'success' => false,
                'message' => 'Item keranjang tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'jumlahProduk' => 'bail|required|integer|min:1',
        ], [
            'jumlahProduk.required' => 'Jumlah produk wajib diisi',
            'jumlahProduk.min' => 'Jumlah produk minimal 1',
        ])->validate();

        try {
            // Check stock
            $produk = ProdukKlinik::find($keranjang->idProduk);
            if ($produk->stock < $data['jumlahProduk']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock produk tidak mencukupi. Stock tersisa: ' . $produk->stock,
                ], 400);
            }

            $keranjang->jumlahProduk = $data['jumlahProduk'];
            $keranjang->save();
            $keranjang->load('produk');

            return response()->json([
                'success' => true,
                'message' => 'Keranjang berhasil diperbarui',
                'data' => $keranjang
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $this->currentUser();

        $keranjang = Keranjang::where('idUser', $user->idUser)->find($id);

        if (!$keranjang) {
            return response()->json([
                'success' => false,
                'message' => 'Item keranjang tidak ditemukan',
            ], 404);
        }

        try {
            $keranjang->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item berhasil dihapus dari keranjang',
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus item keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear all items in user's cart
     */
    public function clear()
    {
        $user = $this->currentUser();

        try {
            Keranjang::where('idUser', $user->idUser)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Keranjang berhasil dikosongkan',
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengosongkan keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
