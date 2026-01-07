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
        Schema::table('promo', function (Blueprint $table) {
            $table->dropForeign(['idKategori']);
            $table->dropForeign(['idProduk']);
        });

        DB::statement('ALTER TABLE `promo` MODIFY `idKategori` INT UNSIGNED NULL');
        DB::statement('ALTER TABLE `promo` MODIFY `idProduk` INT UNSIGNED NULL');

        Schema::table('promo', function (Blueprint $table) {
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promo', function (Blueprint $table) {
            $table->dropForeign(['idKategori']);
            $table->dropForeign(['idProduk']);
        });

        DB::statement('ALTER TABLE `promo` MODIFY `idKategori` INT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE `promo` MODIFY `idProduk` INT UNSIGNED NOT NULL');

        Schema::table('promo', function (Blueprint $table) {
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
        });
    }
};
