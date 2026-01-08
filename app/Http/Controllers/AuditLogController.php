<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
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

    public function index(Request $request)
    {
        $this->ensureAdmin();

        $query = AuditLog::query();

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('path', 'like', '%' . $q . '%')
                    ->orWhere('method', 'like', '%' . $q . '%')
                    ->orWhere('user_agent', 'like', '%' . $q . '%');
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('method')) {
            $query->where('method', strtoupper($request->input('method')));
        }

        if ($request->filled('path')) {
            $query->where('path', 'like', '%' . $request->input('path') . '%');
        }

        if ($request->filled('status_code')) {
            $query->where('status_code', $request->input('status_code'));
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->input('to'));
        }

        $perPage = (int) $request->input('per_page', 20);
        $perPage = max(1, min(100, $perPage));

        $data = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $log = AuditLog::find($id);

        if (!$log) {
            return response()->json([
                'success' => false,
                'message' => 'Audit log tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $log,
        ]);
    }
}
