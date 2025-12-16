<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah tipe nomorWa menjadi string supaya bisa menampung angka panjang dengan leading zero.
        DB::statement('ALTER TABLE `user` MODIFY `nomorWa` VARCHAR(20) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE `user` MODIFY `nomorWa` INT UNSIGNED NULL');
    }
};
