// app/search/page.tsx
"use client";

import { fetchData } from "@/lib/api";
import { useState } from "react";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border placeholder:black border-gray-300 rounded-lg p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Search
        </button>
      </form>

      <div className="grid gap-4">
        {results.length > 0 ? (
          results.map((movie: any) => (
            <div key={movie._id} className="p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-bold">{movie.name}</h2>
              <p>Genre: {movie.genre}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
