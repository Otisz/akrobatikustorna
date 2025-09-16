<?php

namespace App\Models;

use App\Observers\DocumentObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

#[ObservedBy(DocumentObserver::class)]
class Document extends Model
{
    use HasUuids;

    protected $appends = [
        'file_url',
    ];

    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: fn($value, array $attributes) => Storage::url($attributes['file_path']),
        );
    }
}
