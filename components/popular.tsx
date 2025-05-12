'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { fetchData } from "@/lib/api";
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const PopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
      
     const response=  await fetchData("/movie/popular",{
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            language: "en-US",
            page: 1,
          },)
        setMovies(response.data.results);
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleMovieClick = (id: number) => {
    router.push(`/movies/${id}`);
  };

  const handleClick = () => {
    router.replace(`/popular`);
  };

  return (
    < div className="w-[80%] bg-black/20 rounded-4xl mx-auto mt-[10px]">
      <button 
        onClick={handleClick} 
        className="mb-4 text-white bg-blue-500 px-4 py-2 rounded-lg shadow-lg"
      >
        Popular
      </button>

      <div className=" overflow-x-scroll scrollbar-hide flex gap-4 py-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-[200px] cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-2xl shadow-lg mb-2"
            />
            <div className="text-center text-black  p-2 rounded-b-2xl">
              <h3 className="text-sm font-bold text-white">{movie.title}</h3>
              <p className="text-xs text-gray-300">{movie.vote_average} / 10</p>
              <p className="text-xs text-gray-300">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovies;
