<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function index()
    {
        $trainers = Trainer::orderBy('order')->get();

        return Inertia::render('trainers', [
            'trainers' => $trainers,
        ]);
    }

    public function show(Trainer $trainer)
    {
        return Inertia::render('trainer', [
            'trainer' => $trainer,
        ]);
    }
}
