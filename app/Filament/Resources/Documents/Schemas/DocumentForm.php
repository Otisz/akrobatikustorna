<?php

namespace App\Filament\Resources\Documents\Schemas;

use App\Models\Document;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class DocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->maxLength(255)
                    ->label('Cím')
                    ->required(),
                FileUpload::make('file_path')
                    ->directory('documents')
                    ->visibility('public')
                    ->storeFileNamesIn('file_name')
                    ->label('Fájl')
                    ->downloadable()
                    ->openable()
                    ->required(),
            ]);
    }
}
