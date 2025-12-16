<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfilDokterController;
use App\Http\Controllers\JadwalReservasiController;
use App\Http\Controllers\ReservasiController;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API berjalan dengan baik'
    ]);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

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
});
