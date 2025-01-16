<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group'
    ];

    protected $casts = [
        'value' => 'json'
    ];

    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set($key, $value, $group = 'general')
    {
        $setting = static::firstOrNew(['key' => $key]);
        $setting->value = $value;
        $setting->group = $group;
        $setting->save();
        return $setting;
    }

    public static function getGroup($group)
    {
        return static::where('group', $group)->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->value];
            });
    }
}
