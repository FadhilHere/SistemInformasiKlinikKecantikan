<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProdukKlinik; // Example if needed for landing page data
use App\Models\Testimoni; // Example if needed

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('LandingPage');
    }
}
