"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import Searchs  from '@/components/search';
import { signOut, useSession } from "next-auth/react";
import InfiniteScroll from 'react-infinite-scroll-component';

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

interface MultiSearchResponse {
  results: MediaItem[];
  total_pages: number;
}

async function multiSearch(query: string, page: number = 1): Promise<MultiSearchResponse> {
  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch search results');
  return res.json();
}

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  console.log(query);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await multiSearch(query, page);
        setResults(prevResults => [...prevResults, ...data.results]);
        setHasMore(page < data.total_pages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    console.log(fetchResults );
  }, [ page]);


  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await multiSearch(query, page);
        setResults(data.results);
      
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    console.log(fetchResults );
  }, [query]);
  const loadMoreResults = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const postSearch = async () => {
      const res = await fetch("/api/searchHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          searchHistory: query,
        }),
      });
      return res.json();
    };
    postSearch();
  }, [query]);

  return (
    <>
    <div className='bg-gray-900'>
    
<InfiniteScroll
  dataLength={results.length}
  next={loadMoreResults}
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

{results.length === 0 && !loading && !error && (
  <p className="text-gray-400 text-center bg-gray-900 p-4 rounded-lg">No results found</p>
)}

{loading && (
  <p className="text-gray-400 text-center bg-gray-900 p-4 rounded-lg">Loading...</p>
)}
</div>

    </>
  );
}
