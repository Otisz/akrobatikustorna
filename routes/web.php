<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\RecommendedPageController;
use App\Http\Controllers\ScheduleController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dokumentumok', DocumentController::class)->name('documents.index');
Route::get('/szakosztalyok', DepartmentController::class)->name('departments.index');
Route::get('/edzeseink', ScheduleController::class)->name('schedule.index');
Route::get('/kapcsolat', ContactController::class)->name('contact.index');
Route::get('/ajanlott-oldalak', RecommendedPageController::class)->name('recommended-page.index');
Route::get('/galeria', GalleryController::class)->name('gallery.index');
Route::get('/hirek', [PostController::class, 'index'])->name('posts.index');
Route::get('/hirek/{slug}', [PostController::class, 'show'])->name('posts.show');
