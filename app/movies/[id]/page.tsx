'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Favourite from '@/components/Favourite';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

async function fetchMovieDetails(movieId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  return res.json();
}

async function fetchCast(movieId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch cast');
  return res.json();
}

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(id!);
        setMovie(movieData);

        const castData = await fetchCast(id!);
        setCast(castData.cast);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!movie) return <p>Loading...</p>;

  const genres = movie.genres.map((genre: any) => genre.name).join(', ');
  const productionCompanies = movie.production_companies.map((company: any) => company.name).join(', ');

  return (
<>
<div className='bg-gray-900'>
  <Favourite  name={movie.title}/>
  <div className="">
    <div
      className="w-[80%] mx-auto"
      style={{
        backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`,
        backgroundSize: 'cover',
        height: '80vh',
      }}
    >
      {/* Main Section */}
      <div className="flex h-[80vh] p-[30px] bg-black/70 space-x-2">
        <div>
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full max-h-[600px] max-w-[350px] rounded-2xl shadow-lg"
          />
        </div>

        <div className="flex flex-col lg:flex-row mb-12 relative">
          {/* Background with Details */}
          <div className="lg:w-2/3 relative flex flex-col justify-center text-white rounded-2xl overflow-hidden">
            <div className="p-8 rounded-2xl">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Release Date:</span> {movie.release_date}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Genres:</span> {genres}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Runtime:</span> {movie.runtime} minutes
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Rating:</span> {movie.vote_average} / 10 ({movie.vote_count} votes)
              </p>
              <p className="text-gray-300 mb-4">
                <span className="font-semibold">Production Companies:</span> {productionCompanies}
              </p>
              <p className="text-gray-200">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Cast Section */}
    </div>
  </div>

  <h2 className="text-3xl font-semibold mb-6 text-center text-white">Cast</h2>
  <div className="flex overflow-scroll w-[80%] mx-auto scrollbar-hide justify-center gap-4">
    {cast.map((member) => (
      <div
        key={member.id}
        className="flex flex-col items-center bg-gray-800 p-3 rounded-lg shadow-md"
      >
        <img
          src={
            member.profile_path
              ? `${IMAGE_BASE_URL}${member.profile_path}`
              : 'https://via.placeholder.com/200x300?text=No+Image'
          }
          alt={member.name}
          className="w-full min-w-[140px] h-[200px] object-cover rounded-lg mb-2"
        />
        <p className="text-sm font-semibold text-center text-white">{member.name}</p>
        <p className="text-xs text-gray-400 text-center">{member.character}</p>
      </div>
    ))}
  </div>
  </div>
</>

  );
}
