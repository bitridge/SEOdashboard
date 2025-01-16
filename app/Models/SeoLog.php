<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeoLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'provider_id',
        'work_date',
        'work_type',
        'description',
        'attachment_path',
    ];

    protected $casts = [
        'work_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public static function workTypes(): array
    {
        return [
            'content_optimization',
            'link_building',
            'technical_seo',
            'keyword_research',
            'analytics_reporting',
            'other'
        ];
    }
}
