'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MyMovieDetails from '@/components/myMovieDetails';
import MovieSearch from '@/components/search';
interface Movie {
  _id: string;
  id: number;
  url: string;
  title: string;
  genre: string;
  releaseYear: number;
  rating: number;
  description: string;
  poster: string;
  cast: string[];
}

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [allMovies, setAllMovies] = useState<boolean>(true);


 const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();
    setMovies(data);
  };


  // Fetch movies on load
  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  // Handle movie click
  const handleClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setAllMovies(false);
  };

  // Handle back to all movies
  const handleBack = () => {
    setSelectedMovie(null);
    setAllMovies(true);
  };

  return (
    <>
   
    <div className="dark min-h-screen bg-gray-900 text-white">
    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
      <div className='mx-auto mt-[40px] space-x-2'>
    <input
      type="text"
      placeholder="local db search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border border-gray-300 rounded-lg p-2 bg-white placeholder-gray-500 text-gray-500 w-[200px] "
    />
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
      Search
    </button>
    </div>
  </form>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">🎬 Movie Gallery</h1>

        {/* Movie Grid */}
        {allMovies ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            { movies.length>0 &&  movies?.map((movie) => (
              <div
                key={movie?._id}
                className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                onClick={() => handleClick(movie)}
              >
                <div>
                  <Image src={movie.url} alt={movie?.title} width={300} height={500} />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{movie?.title}</h2>
                  <p className="text-yellow-400 mt-1">⭐ {movie?.rating}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Movie Details View
          selectedMovie && (
            <>
              
              <button
                onClick={handleBack}
                className="bg-gray-700 text-white px-4 py-2 cursor-pointer rounded-lg my-4"
              >
                ⬅️ Back to All Movies
              </button>
              <MyMovieDetails movie={selectedMovie} />
            </>
          )
        )}
      </div>
    </div>
    </>
  );
}
