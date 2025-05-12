// components/FuseSearch.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Fuse from 'fuse.js';
import didYouMean from 'didyoumean2';
import { Search } from 'lucide-react'; // Import the search icon

interface Movie {
  title: string;
  id: number;
  release_date: string;
  poster_path: string;
}

const FuseSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [data, setData] = useState<Movie[]>([]);
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch movies directly from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: 'en-US',
          include_adult: false,
        },
      });
      const movies = response.data.results.map((movie: any) => ({
        title: movie.title,
        id: movie.id,
        release_date: movie.release_date || 'Unknown',
        poster_path: movie.poster_path || '',
      }));
      setData(movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    if (query.trim().length > 0) {
      fetchMovies();
    } else {
      setResults([]);
      setSuggestion('');
    }
  }, [query]);

  // Run Fuse.js search and spelling correction
  useEffect(() => {
    if (data.length === 0 || query.trim() === '') return;

    const fuse = new Fuse(data, {
      keys: ['title'],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });

    const result = fuse.search(query).map(({ item }) => item).slice(0, 4);
    setResults(result);

    const titles = data.map((movie) => movie.title);
    const corrected = didYouMean(query, titles);
    setSuggestion(corrected || '');
  }, [data, query]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  // Handle icon click
  const handleIconClick = () => {
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex justify-center items-center   space-x-4"> 
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for a movie..."
          className="w-full p-2 mb-2 border bg-white border-gray-300 rounded-lg pr-12"
        />
        <Search
          onClick={handleIconClick}
          className=" right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          size={34}
        />
      </form>

      {suggestion && results.length === 0 && (
        <div className="text-gray-500 mb-2">
          Did you mean: <strong>{suggestion}</strong>?
        </div>
      )}

      <ul className='absolute bg-gray-900 p-[30px] rounded-2xl z-[999]'>
        {results.map((movie) => (
          <li
            key={movie.id}
            className="mb-2 flex items-center cursor-pointer  "
            onClick={() => router.push(`/search?query=${encodeURIComponent(movie.title)}`)}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="w-[40px] h-[40px] rounded-lg mr-4"
              />
            ) : (
              <div className=" bg-gray-900 rounded-lg mr-4 flex items-center justify-center text-xs text-white">
                No Image
              </div>
            )}
            <div>
              <div className='text-sm text-white'>{movie.title}</div>
              <p className="text-sm text-white">{movie.release_date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuseSearch;
