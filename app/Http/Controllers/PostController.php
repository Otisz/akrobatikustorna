<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use LaraZeus\Sky\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::query()
            ->select(['id', 'title', 'slug', 'description', 'published_at'])
            ->published()
            ->orderBy('published_at', 'desc')
            ->with('media')
            ->simplePaginate();

        return Inertia::render('posts', [
            'posts' => $posts,
        ]);
    }

    public function show(string $slug)
    {
        $post = Post::query()
            ->select(['id', 'title', 'slug', 'description', 'content', 'published_at'])
            ->published()
            ->whereSlug($slug)
            ->with('media')
            ->firstOrFail();

        return Inertia::render('post', [
            'post' => $post,
        ]);
    }
}
