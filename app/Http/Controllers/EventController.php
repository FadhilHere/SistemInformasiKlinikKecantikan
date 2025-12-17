<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EventController extends Controller
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

    public function viewList()
    {
        return Inertia::render('EventPage', [
            'events' => Event::all()
        ]);
    }

    public function viewDetail($id)
    {
        $event = Event::find($id);
        if (!$event) {
            abort(404);
        }
        return Inertia::render('EventDetailPage', [
            'event' => $event
        ]);
    }

    public function index()
    {
        $this->ensureAdmin();

        $data = Event::all();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $this->ensureAdmin();

        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $event,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $data = Validator::make($request->all(), [
            'nama' => 'bail|required|string|max:60',
            'deskripsi' => 'bail|required|string',
            'foto' => 'bail|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggalMulai' => 'bail|required|date',
            'tanggalSelesai' => 'bail|required|date|after_or_equal:tanggalMulai',
            'lokasi' => 'bail|required|string|max:100',
        ])->validate();

        $payload = [
            'nama' => $data['nama'],
            'deskripsi' => $data['deskripsi'],
            'tanggalMulai' => $data['tanggalMulai'],
            'tanggalSelesai' => $data['tanggalSelesai'],
            'lokasi' => $data['lokasi'],
        ];

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('event', 'public');
            $payload['foto'] = $path;
        }

        $event = Event::create($payload);

        return response()->json([
            'success' => true,
            'data' => $event,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak ditemukan',
            ], 404);
        }

        $data = Validator::make($request->all(), [
            'nama' => 'bail|sometimes|required|string|max:60',
            'deskripsi' => 'bail|sometimes|required|string',
            'foto' => 'bail|sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggalMulai' => 'bail|sometimes|required|date',
            'tanggalSelesai' => 'bail|sometimes|required|date|after_or_equal:tanggalMulai',
            'lokasi' => 'bail|sometimes|required|string|max:100',
        ])->validate();

        $payload = $data;

        if ($request->hasFile('foto')) {
            if (!empty($event->foto)) {
                Storage::disk('public')->delete($event->foto);
            }
            $path = $request->file('foto')->store('event', 'public');
            $payload['foto'] = $path;
        }

        $event->update($payload);

        return response()->json([
            'success' => true,
            'data' => $event,
        ]);
    }

    public function destroy($id)
    {
        $this->ensureAdmin();

        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak ditemukan',
            ], 404);
        }

        if (!empty($event->foto)) {
            Storage::disk('public')->delete($event->foto);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event dihapus',
        ]);
    }
}
