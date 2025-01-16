<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['user_id']);
            
            // Drop existing columns
            $table->dropColumn(['url', 'user_id']);
            
            // Add new columns
            $table->foreignId('customer_id')->after('name')->constrained('users')->onDelete('cascade');
            $table->text('description')->after('customer_id');
            $table->date('start_date')->after('description');
            $table->date('end_date')->after('start_date');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['customer_id']);
            
            // Drop new columns
            $table->dropColumn(['customer_id', 'description', 'start_date', 'end_date', 'status']);
            
            // Add back old columns
            $table->string('url');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
    }
};
