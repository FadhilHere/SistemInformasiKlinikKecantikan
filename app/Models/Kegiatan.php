<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use HasFactory;

    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'kegiatan';
    protected $primaryKey = 'idKegiatan';
    protected $fillable = [
        'namaKegiatan',
        'deskripsi',
        'foto',
        'tanggalKegiatan'
    ];

    protected $casts = [
        'tanggalKegiatan' => 'date',
    ];
}
