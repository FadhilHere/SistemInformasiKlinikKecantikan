<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfilDokterController;
use App\Http\Controllers\JadwalReservasiController;
use App\Http\Controllers\ReservasiController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\KategoriProdukController;
use App\Http\Controllers\ProdukKlinikController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\DetailPenjualanController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\ProfilPerusahaanController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\PromoController;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API berjalan dengan baik'
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- EXISTING ROUTES ---

    // CRUD profil dokter - hanya admin (dicek di controller)
    Route::get('/profil-dokter', [ProfilDokterController::class, 'index']);
    Route::get('/profil-dokter/{id}', [ProfilDokterController::class, 'show']);
    Route::post('/profil-dokter', [ProfilDokterController::class, 'store']);
    Route::put('/profil-dokter/{id}', [ProfilDokterController::class, 'update']);
    Route::delete('/profil-dokter/{id}', [ProfilDokterController::class, 'destroy']);

    // CRUD jadwal reservasi - hanya admin (dicek di controller)
    Route::get('/jadwal-reservasi', [JadwalReservasiController::class, 'index']);
    Route::get('/jadwal-reservasi/{id}', [JadwalReservasiController::class, 'show']);
    Route::post('/jadwal-reservasi', [JadwalReservasiController::class, 'store']);
    Route::put('/jadwal-reservasi/{id}', [JadwalReservasiController::class, 'update']);
    Route::delete('/jadwal-reservasi/{id}', [JadwalReservasiController::class, 'destroy']);

    // CRUD reservasi - admin bisa semua, pelanggan hanya miliknya (dicek di controller)
    Route::get('/reservasi', [ReservasiController::class, 'index']);
    Route::get('/reservasi/{id}', [ReservasiController::class, 'show']);
    Route::post('/reservasi', [ReservasiController::class, 'store']);
    Route::put('/reservasi/{id}', [ReservasiController::class, 'update']);
    Route::delete('/reservasi/{id}', [ReservasiController::class, 'destroy']);

    // CRUD user - hanya admin (dicek di controller)
    Route::get('/users', [UserManagementController::class, 'index']);
    Route::get('/users/{id}', [UserManagementController::class, 'show']);
    Route::post('/users', [UserManagementController::class, 'store']);
    Route::put('/users/{id}', [UserManagementController::class, 'update']);
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

    // CRUD profil perusahaan - hanya admin (dicek di controller)
    Route::get('/profil-perusahaan', [ProfilPerusahaanController::class, 'index']);
    Route::get('/profil-perusahaan/{id}', [ProfilPerusahaanController::class, 'show']);
    Route::post('/profil-perusahaan', [ProfilPerusahaanController::class, 'store']);
    Route::put('/profil-perusahaan/{id}', [ProfilPerusahaanController::class, 'update']);
    Route::delete('/profil-perusahaan/{id}', [ProfilPerusahaanController::class, 'destroy']);

    // --- OTHER TEAM MEMBERS ROUTES ---

    // CRUD event - hanya admin (dicek di controller)
    Route::get('/event', [EventController::class, 'index']);
    Route::get('/event/{id}', [EventController::class, 'show']);
    Route::post('/event', [EventController::class, 'store']);
    Route::put('/event/{id}', [EventController::class, 'update']);
    Route::delete('/event/{id}', [EventController::class, 'destroy']);

    // CRUD kegiatan - hanya admin (dicek di controller)
    Route::get('/kegiatan', [KegiatanController::class, 'index']);
    Route::get('/kegiatan/{id}', [KegiatanController::class, 'show']);
    Route::post('/kegiatan', [KegiatanController::class, 'store']);
    Route::put('/kegiatan/{id}', [KegiatanController::class, 'update']);
    Route::delete('/kegiatan/{id}', [KegiatanController::class, 'destroy']);

    // CRUD promo - hanya admin (dicek di controller)
    Route::get('/promo', [PromoController::class, 'index']);
    Route::get('/promo/{id}', [PromoController::class, 'show']);
    Route::post('/promo', [PromoController::class, 'store']);
    Route::put('/promo/{id}', [PromoController::class, 'update']);
    Route::delete('/promo/{id}', [PromoController::class, 'destroy']);
});

// Public routes untuk kategori produk (read-only)
Route::get('/kategori-produk', [KategoriProdukController::class, 'index']);
Route::get('/kategori-produk/{id}', [KategoriProdukController::class, 'show']);

// Protected routes untuk kategori produk (admin only)
Route::middleware('auth:api')->group(function () {
    Route::post('/kategori-produk', [KategoriProdukController::class, 'store']);
    Route::put('/kategori-produk/{id}', [KategoriProdukController::class, 'update']);
    Route::delete('/kategori-produk/{id}', [KategoriProdukController::class, 'destroy']);
});
