"use client";

import Documents from "@/data/documents";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import Highlighter from "react-highlight-words";

export default function FilterDocuments() {
  const [query, setQuery] = useState("");

  return (
    <>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          type="search"
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-primary focus:ring-orange-primary sm:text-sm"
          placeholder="Keresés..."
        />
      </div>
      <div className="flex flex-col gap-4">
        {Documents.filter((document) => document.name.toLowerCase().includes(query)).map((document, i) => (
          <Link
            key={i}
            href={document.href}
            className="rounded border border-gray-400 bg-white px-4 py-2 text-xl font-semibold text-gray-800 shadow after:text-orange-primary after:content-['_↗'] hover:bg-gray-100"
            target="_blank"
          >
            <Highlighter
              highlightClassName="bg-yellow-200/70"
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={document.name}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
