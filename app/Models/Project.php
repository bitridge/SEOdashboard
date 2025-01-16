<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'customer_id',
        'description',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function providers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_provider', 'project_id', 'provider_id')
                    ->where('role', 'provider')
                    ->withTimestamps();
    }

    public function seoLogs(): HasMany
    {
        return $this->hasMany(SeoLog::class);
    }
}
