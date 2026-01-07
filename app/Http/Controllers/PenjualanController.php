<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\Keranjang;
use App\Models\ProdukKlinik;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Transaction support
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class PenjualanController extends Controller
{
    private function currentUser()
    {
        return Auth::user();
    }

    private function ensureAdmin()
    {
        $user = Auth::user();
        return $user && $user->role === 'admin';
    }

    /**
     * List Penjualan
     * Admin: See all
     * User: See own only
     */
    public function index()
    {
        try {
            $user = $this->currentUser();

            $query = Penjualan::with(['user', 'promo', 'detailpenjualan.produk']);

            if (!$this->ensureAdmin()) {
                $query->where('idUser', $user->idUser);
            }

            // Order by newest first
            $query->orderBy('created_at', 'desc');

            $data = $query->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Detail Penjualan
     */
    public function show($id)
    {
        try {
            $user = $this->currentUser();

            $penjualan = Penjualan::with(['user', 'promo', 'detailpenjualan.produk'])->find($id);

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaksi tidak ditemukan',
                ], 404);
            }

            // Authorization Check
            if (!$this->ensureAdmin() && $penjualan->idUser !== $user->idUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to transaction',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $penjualan,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail transaksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * CHECKOUT Process
     * Move Cart -> Penjualan + DetailPenjualan
     */
    public function checkout(Request $request)
    {
        $user = $this->currentUser();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'idPromo' => 'bail|nullable|integer|exists:promo,idPromo',
            'metodePembayaran' => 'bail|nullable|string', // Optional, just for record
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            // 1. Get Cart Items
            $cartItems = Keranjang::where('idUser', $user->idUser)->with('produk')->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Keranjang belanja kosong',
                ], 400);
            }

            // Start DB Transaction to ensure Atomicity
            DB::beginTransaction();

            // 2. Calculate Total & Validate Stock
            $totalHarga = 0;

            foreach ($cartItems as $item) {
                if (!$item->produk) {
                    throw new \Exception('Produk tidak ditemukan di keranjang');
                }
                // Stock Check
                if ($item->produk->stock < $item->jumlahProduk) {
                    throw new \Exception("Stock produk '{$item->produk->nama}' tidak mencukupi. Sisa: {$item->produk->stock}");
                }

                $subtotal = $item->produk->harga * $item->jumlahProduk;
                $totalHarga += $subtotal;
            }

            // TODO: Apply Promo Logic Calculation Here if needed
            $promo = null;
            $totalDiskon = 0;

            if (!empty($request->idPromo)) {
                $promo = Promo::find($request->idPromo);

                if (!$promo || !$promo->status) {
                    throw new \Exception('Promo tidak aktif atau tidak ditemukan');
                }

                $today = now()->toDateString();
                if ($promo->tanggalMulai > $today || $promo->tanggalSelesai < $today) {
                    throw new \Exception('Promo sudah tidak berlaku');
                }

                if ($totalHarga < $promo->minimalTransaksi) {
                    throw new \Exception('Minimal transaksi untuk promo belum terpenuhi');
                }

                // Asumsi diskon berupa persentase 0-100
                $diskonPersen = min(max((int) $promo->diskon, 0), 100);
                $totalDiskon = (int) floor($totalHarga * ($diskonPersen / 100));
            }

            $totalBayar = max($totalHarga - $totalDiskon, 0);

            // 3. Create Penjualan Header
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'totalHarga' => $totalBayar,
                'status' => 'pending', // Default status
                'idUser' => $user->idUser,
                'idPromo' => $request->idPromo ?? null, // Nullable logic
            ]);

            // 4. Create Detail & Update Stock
            foreach ($cartItems as $item) {
                DetailPenjualan::create([
                    'jumlahProduk' => $item->jumlahProduk,
                    'idPenjualan' => $penjualan->idPenjualan,
                    'idProduk' => $item->idProduk
                ]);

                // Reduce Stock
                $item->produk->decrement('stock', $item->jumlahProduk);
            }

            // 5. Clear Cart
            Keranjang::where('idUser', $user->idUser)->delete();

            // Commit Transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibuat',
                'data' => $penjualan->load('detailpenjualan'),
                'summary' => [
                    'totalHarga' => $totalHarga,
                    'totalDiskon' => $totalDiskon,
                    'totalBayar' => $totalBayar,
                    'idPromo' => $promo?->idPromo,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Revert all changes if any error occurs

            return response()->json([
                'success' => false,
                'message' => 'Transaksi gagal: ' . $e->getMessage(),
            ], 400); // 400 Bad Request
        }
    }

    /**
     * Update Status Pembayaran (Admin Only)
     */
    public function updateStatus(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $penjualan = Penjualan::find($id);
        if (!$penjualan)
            return response()->json(['message' => 'Not Found'], 404);

        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled'
        ]);

        $penjualan->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi diperbarui',
            'data' => $penjualan
        ]);
    }
}
