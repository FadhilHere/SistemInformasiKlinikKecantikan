<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    public $incrementing = true;
    public $timestamps = true;

    protected $table = 'promo';
    protected $primaryKey = 'idPromo';
    protected $fillable = [
        'gambar',
        'namaPromo',
        'jenisPromo',
        'kode',
        'diskon',
        'deskripsi',
        'tanggalMulai',
        'tanggalSelesai',
        'minimalTransaksi',
        'status',
        'idKategori',
        'idProduk'
    ];

    protected $casts = [
        'tanggalMulai' => 'date',
        'tanggalSelesai' => 'date',
        'status' => 'boolean',
    ];

    public function kategori(){
        return $this->belongsTo(KategoriProduk::class,'idKategori');
    }

    public function produk()
    {
        return $this->belongsTo(ProdukKlinik::class, 'idKategori');
    }

    public function penjualan(){
        return $this->hasMany(Penjualan::class,'idPromo');
    }
}
