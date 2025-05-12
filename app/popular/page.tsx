'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
export interface Movie {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
  }
  

const Page = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const loadMovies = async () => {
    const fetchPopularMovies = async (page: number) => {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
        );
        return response.data;
      };
     const data= await fetchPopularMovies (page)
    setMovies((prevMovies) => [...prevMovies, ...data.results]);
    setHasMore(data.page < data.total_pages);
  };

  useEffect(() => {
    loadMovies();
  }, [page]);

  const fetchData = () => {
    setPage(page + 1);
  };

  return (
     <div className='w-[80%] mx-auto'>
    <InfiniteScroll
      dataLength={movies.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<div className="text-center">Loading...</div>}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white text-xl font-semibold">{movie.title}</h3>
              <p className="text-gray-400">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
    </div>
  );
};

export default Page;
