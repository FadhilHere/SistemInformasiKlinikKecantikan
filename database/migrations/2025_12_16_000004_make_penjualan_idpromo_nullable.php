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
        Schema::table('penjualan', function (Blueprint $table) {
            $table->dropForeign(['idPromo']);
        });

        DB::statement('ALTER TABLE `penjualan` MODIFY `idPromo` INT UNSIGNED NULL');

        Schema::table('penjualan', function (Blueprint $table) {
            $table->foreign('idPromo')->references('idPromo')->on('promo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penjualan', function (Blueprint $table) {
            $table->dropForeign(['idPromo']);
        });

        DB::statement('ALTER TABLE `penjualan` MODIFY `idPromo` INT UNSIGNED NOT NULL');

        Schema::table('penjualan', function (Blueprint $table) {
            $table->foreign('idPromo')->references('idPromo')->on('promo')->onDelete('cascade');
        });
    }
};
