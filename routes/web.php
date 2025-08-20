<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dokumentumok', DocumentController::class)->name('documents.index');
Route::get('/szakosztalyok', DepartmentController::class)->name('departments.index');
