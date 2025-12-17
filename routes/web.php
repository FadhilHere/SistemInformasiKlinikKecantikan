<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Pages
Route::inertia('/', 'LandingPage')->name('landing');
Route::inertia('/about', 'AboutPage')->name('about');

// Auth Pages (Guest only)
Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'LoginPage')->name('login');
    Route::inertia('/register', 'RegistrationPage')->name('register');
});

// Products & Promos (Public)
Route::get('/products', function () {
    return Inertia::render('ProductsPage', [
        'products' => \App\Models\ProdukKlinik::with('kategori')->get()
    ]);
})->name('products.index');

Route::get('/promos', function () {
    return Inertia::render('PromoPage', [
        'promos' => \App\Models\Promo::all()
    ]);
})->name('promos.index');

Route::get('/promos/{id}', function ($id) {
    $promo = \App\Models\Promo::find($id);
    if (!$promo) abort(404);
    return Inertia::render('PromoDetailPage', [
        'promo' => $promo
    ]);
})->name('promos.show');

Route::get('/events', function () {
    return Inertia::render('EventPage', [
        'events' => \App\Models\Event::all()
    ]);
})->name('events.index');

Route::get('/events/{id}', function ($id) {
    $event = \App\Models\Event::find($id);
    if (!$event) abort(404);
    return Inertia::render('EventDetailPage', [
        'event' => $event
    ]);
})->name('events.show');

// Protected Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', function () {
        return Inertia::render('ProfilePage', [
            'user' => Auth::user(),
        ]);
    })->name('profile');

    Route::get('/reservation', function () {
        return Inertia::render('ReservationPage');
    })->name('reservation');

    Route::get('/cart', function () {
        return Inertia::render('CartPage');
    })->name('cart');
    
    // Auth Actions (Logout acts as an API call, can stay controller or move here)
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Note: API routes for data fetching should ideally be in api.php, 
// but if they are used here they should probably be prefixed or organized.
// For now, we assume the pages themselves load data via Inertia props 
// (which we added in the controllers) or via client-side fetch calls to API endpoints.
