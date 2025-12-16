<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    use HasFactory;

    protected $table = 'reservasi';

    protected $primaryKey = 'idReservasi';

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'namaCustomer',
        'nomorWa',
        'jenisTreatment',
        'tanggalReservasi',
        'status',
        'idUser',
        'idDokter',
        'idJadwal',
    ];

    protected $casts = [
        'tanggalReservasi' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(users::class, 'idUser');
    }

    public function dokter()
    {
        return $this->belongsTo(ProfilDokter::class, 'idDokter');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalReservasi::class, 'idJadwal');
    }
}
