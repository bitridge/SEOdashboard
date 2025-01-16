<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'content',
        'type',
        'status',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ReportSection::class);
    }

    public function seoLogs(): BelongsToMany
    {
        return $this->belongsToMany(SeoLog::class, 'report_seo_log')
            ->withTimestamps();
    }
} 