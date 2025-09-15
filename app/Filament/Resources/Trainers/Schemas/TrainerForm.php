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
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                TextInput::make('role')
                    ->label('Pozíció')
                    ->trim()
                    ->required(),
                TextInput::make('slug')
                    ->required()
                    ->unique(Trainer::class, 'slug', fn ($record) => $record)
                    ->regex('^[a-z0-9-]+$')
                    ->belowContent('Ez az szöveg jelenik meg az böngésző címsorában. Csak az angol ABC kisbetűi, számok és kötőjel érvényesek.'),
                ColorPicker::make('color')
                    ->label('Hátterszín')
                    ->hexColor()
                    ->required(),
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
                    ->nullable()
                    ->columnSpanFull(),
            ]);
    }
}
