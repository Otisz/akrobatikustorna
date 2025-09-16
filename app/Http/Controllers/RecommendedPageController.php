<?php

namespace App\Http\Controllers;

use App\Models\RecommendedPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendedPageController extends Controller
{
    public function __invoke(Request $request)
    {
        $recommendedPages = RecommendedPage::orderBy('name')->get();

        return Inertia::render('recommended-pages', [
            'recommendedPages' => $recommendedPages,
        ]);
    }
}
