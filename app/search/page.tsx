"use client";
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import InfiniteScroll from 'react-infinite-scroll-component';
import { signOut, useSession } from "next-auth/react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface MediaItem {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
}

async function multiSearch(query: string, page: number = 1) {
  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch search results');
  return res.json();
}

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await multiSearch(query, page);
        setResults(prevResults => (page === 1 ? data.results : [...prevResults, ...data.results]));
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page]);

  useEffect(() => {
    if (!session || !query) return;
    const postSearch = async () => {
      try {
        await fetch("/api/searchHistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user?.email, searchHistory: query }),
        });
      } catch (err) {
        console.error("Failed to post search history:", err);
      }
    };
    postSearch();
  }, [query, session]);

  return (
    <InfiniteScroll
      dataLength={results.length}
      next={() => setPage(page + 1)}
      hasMore={hasMore}
      loader={<p className="text-gray-400 text-center mb-4 bg-gray-900 p-4 rounded-lg">Loading more results...</p>}
      endMessage={<p className="text-gray-500 text-center bg-gray-900 p-4 rounded-lg">No more results available</p>}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {results.map((item) => (
        <li key={item.id} className="mb-4">
          <Link href={`/${item.media_type}/${item.id}`}>
            <div className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name || "No Title"}
                  className="w-full h-auto mb-4 rounded-lg"
                />
              )}
              <h2 className="text-xl font-bold text-white">
                {item.title || item.name} ({item.media_type})
              </h2>
              <p className="text-gray-400">
                {item.release_date || item.first_air_date || 'No date available'}
              </p>
              <p className="text-gray-300">
                {(item.overview || 'No description available').slice(0, 100)}...
              </p>
            </div>
          </Link>
        </li>
      ))}
    </InfiniteScroll>
  );
}

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <Suspense fallback={<p className="text-gray-400 text-center bg-gray-900 p-4 rounded-lg">Loading...</p>}>
      <SearchResults query={query} />
    </Suspense>
  );
}
