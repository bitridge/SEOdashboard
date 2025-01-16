<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@seodash.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Provider Users
        User::create([
            'name' => 'Provider One',
            'email' => 'provider1@seodash.com',
            'password' => Hash::make('password'),
            'role' => 'provider',
        ]);

        User::create([
            'name' => 'Provider Two',
            'email' => 'provider2@seodash.com',
            'password' => Hash::make('password'),
            'role' => 'provider',
        ]);

        // Create Customer Users
        User::create([
            'name' => 'Customer One',
            'email' => 'customer1@seodash.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'website' => 'https://customer1.com',
        ]);

        User::create([
            'name' => 'Customer Two',
            'email' => 'customer2@seodash.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'website' => 'https://customer2.com',
        ]);
    }
}
