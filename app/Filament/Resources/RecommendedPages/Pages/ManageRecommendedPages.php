<?php

namespace App\Filament\Resources\RecommendedPages\Pages;

use App\Filament\Resources\RecommendedPages\RecommendedPageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageRecommendedPages extends ManageRecords
{
    protected static string $resource = RecommendedPageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
