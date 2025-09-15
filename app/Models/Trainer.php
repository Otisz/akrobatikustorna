<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Trainer extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $appends = [
        'image_url',
    ];

    public static function boot(): void
    {
        parent::boot();

        static::creating(static function (self $trainer) {
            $trainer->order = self::query()->max('order') + 1;
        });
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value, array $attributes) => Storage::url($attributes['image_paths']),
        );
    }
}
