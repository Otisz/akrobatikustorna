<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Részletek')
                    ->schema([
                        TextInput::make('name')
                            ->label('Név')
                            ->required(),
                        TextInput::make('email')
                            ->label('Email cím')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('password')
                            ->label('Jelszó')
                            ->password()
                            ->required()
                            ->dehydrateStateUsing(fn ($state): string => Hash::make($state))
                            ->visibleOn('create')
                            ->rule(Password::default()),
                    ]),
                Section::make('Jelszó csere')
                    ->schema([
                        TextInput::make('new_password')
                            ->label('Új jelszó')
                            ->password()
                            ->nullable()
                            ->rule(Password::default()),
                        TextInput::make('new_password_confirmation')
                            ->label('Új jelszó megerősítése')
                            ->password()
                            ->requiredWith('new_password')
                            ->same('new_password'),
                    ])
                    ->visibleOn('edit'),
            ]);
    }
}
