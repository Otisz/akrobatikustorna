<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use LaraZeus\Sky\Models\Post;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $posts = Post::query()
            ->select(['id', 'title', 'slug', 'description', 'published_at'])
            ->published()
            ->orderBy('published_at', 'desc')
            ->with('media')
            ->limit(6)
            ->get();

        return Inertia::render('home', [
            'posts' => $posts,
        ]);
    }
}
