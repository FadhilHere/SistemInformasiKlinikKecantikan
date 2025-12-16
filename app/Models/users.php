<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class users extends Authenticatable implements JWTSubject
{
    use HasFactory;

    public $incrementing = true;

    public $timestamps = true;

    protected $table = 'user';

    protected $primaryKey = 'idUser';

    protected $fillable = [
        'nama',
        'alamat',
        'jenisKelamin',
        'tanggalLahir',
        'role',
        'email',
        'nomorWa',
        'password'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'idUser');
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'idUser');
    }
    public function reservasi()
    {
        return $this->hasMany(Reservasi::class, 'idUser');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
