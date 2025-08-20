<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function __invoke(Request $request)
    {
        $documents = Document::orderBy('title')->get();

        return Inertia::render('documents', [
            'documents' => $documents,
        ]);
    }
}
