<?php

namespace App\Http\Controllers;

use App\Models\DetailPenjualan;
use App\Models\Penjualan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;

class DetailPenjualanController extends Controller
{
    private function ensureAdmin()
    {
        $user = Auth::user();
        return $user && $user->role === 'admin';
    }

    /**
     * Display a listing of sold items.
     * Supports filtering by idPenjualan.
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $isAdmin = $this->ensureAdmin();

            $query = DetailPenjualan::with(['produk', 'penjualan']);

            // Filter by Penjualan ID if provided
            if ($request->has('idPenjualan')) {
                $query->where('idPenjualan', $request->idPenjualan);
            }

            // Security Check: Limit scope
            if (!$isAdmin) {
                // User can only see details of their own sales
                $query->whereHas('penjualan', function ($q) use ($user) {
                    $q->where('idUser', $user->idUser);
                });
            }

            $data = $query->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data detail penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified detail item.
     * Secure access check included.
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            $isAdmin = $this->ensureAdmin();

            $detail = DetailPenjualan::with(['produk', 'penjualan'])->find($id);

            if (!$detail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Detail penjualan tidak ditemukan',
                ], 404);
            }

            // Authorization: Check if the transaction belongs to the user
            if (!$isAdmin && $detail->penjualan->idUser !== $user->idUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access (Bukan milik Anda)',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $detail,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
