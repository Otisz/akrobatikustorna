<?php

namespace App\Filament\Resources\Trainers\Schemas;

use App\Models\Trainer;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TrainerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Név')
                    ->required()
                    ->trim()
                    ->live(debounce: 500)
                    ->afterStateUpdated(fn(Set $set, ?string $state) => $set('slug', Str::slug($state))),
                TextInput::make('role')
                    ->label('Pozíció')
                    ->trim()
                    ->required(),
                ColorPicker::make('color')
                    ->label('Hátterszín')
                    ->hexColor()
                    ->required(),
                TextInput::make('order')
                    ->label('Sorrend')
                    ->required()
                    ->numeric(),
                FileUpload::make('image_paths')
                    ->label('Kép')
                    ->image()
                    ->directory('trainers')
                    ->visibility('public')
                    ->downloadable()
                    ->openable()
                    ->imageEditor()
                    ->imageEditorAspectRatios(['9:16'])
                    ->required()
                    ->columnSpanFull(),
                RichEditor::make('content')
                    ->label('Tartalom')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(Trainer::class, 'slug', fn($record) => $record)
                    ->readOnly()
                    ->belowContent('Ez az szöveg jelenik meg az böngésző címsorában. Nem szerkeszthető'),
            ]);
    }
}
