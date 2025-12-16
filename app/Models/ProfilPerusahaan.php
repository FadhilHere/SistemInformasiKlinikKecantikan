<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilPerusahaan extends Model
{
    use HasFactory;

    public $incrementing = true;
    public $timestamps = true;
    protected $table = 'profilPerusahaan';

    protected $primaryKey = 'idProfil';

    protected $fillable = [
        'visi',
        'misi',
        'deskripsiPerusahaan',
        'nomorCustomerService',
        'jamBukak',
        'jamKeluar'
    ];
}
