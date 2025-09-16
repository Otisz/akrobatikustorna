<?php

namespace App\Filament\Resources\Trainers\Schemas;

use Filament\Infolists\Components\ColorEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;

class TrainerInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('order')
                    ->label('Sorrend')
                    ->numeric(),
                ColorEntry::make('color')
                    ->label('Hátterszín'),
                TextEntry::make('role')
                    ->label('Pozíció'),
                ImageEntry::make('image_paths')
                    ->label('Kép')
                    ->openUrlInNewTab()
                    ->visibility('public')
                    ->checkFileExistence(false),
                TextEntry::make('content')
                    ->label('Tartalom')
                    ->columnSpanFull()
                    ->prose()
                    ->html(),
            ]);
    }
}
