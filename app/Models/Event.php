<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'event';
    protected $primaryKey = 'idEvent';
    protected $fillable = [
        'nama',
        'deskripsi',
        'foto',
        'tanggalMulai',
        'tanggalSelesai',
        'lokasi'
    ];

    protected $casts = [
        'tanggalMulai' => 'date',
        'tanggalSelesai' => 'date',
    ];
}
