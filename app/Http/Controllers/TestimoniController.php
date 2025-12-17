<?php

namespace App\Http\Controllers;

use App\Models\Testimoni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File; // For file deletion
use Illuminate\Database\QueryException;

class TestimoniController extends Controller
{
    /**
     * Helper to ensure admin access
     */
    private function ensureAdmin()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            abort(response()->json([
                'success' => false,
                'message' => 'Forbidden: hanya admin yang diizinkan mengelola testimoni',
            ], 403));
        }
    }

    /**
     * Display a listing of testimonis.
     * Public Access
     */
    public function index()
    {
        try {
            $data = Testimoni::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data testimoni',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display single testimoni
     * Public Access
     */
    public function show($id)
    {
        try {
            $testimoni = Testimoni::find($id);

            if (!$testimoni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Testimoni tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $testimoni,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail testimoni',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new testimoni
     * Admin Only
     * Handles Image Upload
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validator = Validator::make($request->all(), [
            'namaTester' => 'required|string|max:20',
            'jenisTestimoni' => 'required|string|max:60',
            'deskripsi' => 'required|string',
            'tanggalTreatment' => 'required|date',
            'buktiFoto' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ], [
            'namaTester.required' => 'Nama tester wajib diisi',
            'namaTester.max' => 'Nama tester maksimal 20 karakter',
            'buktiFoto.required' => 'Bukti foto wajib diupload',
            'buktiFoto.image' => 'File harus berupa gambar',
            'buktiFoto.max' => 'Ukuran foto maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            // Handle File Upload
            $fotoPath = null;
            if ($request->hasFile('buktiFoto')) {
                $file = $request->file('buktiFoto');
                $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                $destinationPath = public_path('uploads/testimoni');
                
                // Create directory if not exists
                if (!File::exists($destinationPath)) {
                    File::makeDirectory($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $filename);
                $fotoPath = 'uploads/testimoni/' . $filename;
            }

            $testimoni = Testimoni::create([
                'namaTester' => $request->namaTester,
                'jenisTestimoni' => $request->jenisTestimoni,
                'deskripsi' => $request->deskripsi,
                'tanggalTreatment' => $request->tanggalTreatment,
                'buktiFoto' => $fotoPath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil ditambahkan',
                'data' => $testimoni,
            ], 201);

        } catch (\Exception $e) { // Catch general exception specifically for file operations too
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan testimoni: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update testimoni
     * Admin Only
     * Handles Image Replacement (Optional)
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $testimoni = Testimoni::find($id);

        if (!$testimoni) {
            return response()->json([
                'success' => false,
                'message' => 'Testimoni tidak ditemukan',
            ], 404);
        }

        // POST method with _method=PUT is recommended for file uploads in Laravel, 
        // but if using raw PUT via API, file upload might need special handling.
        // Standard Laravel validation:
        $validator = Validator::make($request->all(), [
            'namaTester' => 'sometimes|required|string|max:20',
            'jenisTestimoni' => 'sometimes|required|string|max:60',
            'deskripsi' => 'sometimes|required|string',
            'tanggalTreatment' => 'sometimes|required|date',
            'buktiFoto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            // Handle File Upload if exists
            if ($request->hasFile('buktiFoto')) {
                // Delete old file
                if ($testimoni->buktiFoto && File::exists(public_path($testimoni->buktiFoto))) {
                    File::delete(public_path($testimoni->buktiFoto));
                }

                $file = $request->file('buktiFoto');
                $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                $file->move(public_path('uploads/testimoni'), $filename);
                $testimoni->buktiFoto = 'uploads/testimoni/' . $filename;
            }

            // Update other fields
            if ($request->has('namaTester')) $testimoni->namaTester = $request->namaTester;
            if ($request->has('jenisTestimoni')) $testimoni->jenisTestimoni = $request->jenisTestimoni;
            if ($request->has('deskripsi')) $testimoni->deskripsi = $request->deskripsi;
            if ($request->has('tanggalTreatment')) $testimoni->tanggalTreatment = $request->tanggalTreatment;

            $testimoni->save();

            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil diperbarui',
                'data' => $testimoni,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui testimoni',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove testimoni
     * Admin Only
     * Deletes file from storage
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $testimoni = Testimoni::find($id);

        if (!$testimoni) {
            return response()->json([
                'success' => false,
                'message' => 'Testimoni tidak ditemukan',
            ], 404);
        }

        try {
            // Delete file
            if ($testimoni->buktiFoto && File::exists(public_path($testimoni->buktiFoto))) {
                File::delete(public_path($testimoni->buktiFoto));
            }

            $testimoni->delete();

            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus testimoni',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
