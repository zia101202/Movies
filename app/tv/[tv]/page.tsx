'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import Favourite from '@/components/Favourite';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genres: { name: string }[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

async function fetchTVShowDetails(tvId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch TV show details');
  return res.json();
}

async function fetchTVShowCast(tvId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch TV show cast');
  return res.json();
}

export default function TVShowDetailsPage() {
  const { tv } = useParams<{ tv: string }>();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const getTVShowDetails = async () => {
      try {
        const data = await fetchTVShowDetails(tv!);
        setTVShow(data);

        const castData = await fetchTVShowCast(tv!);
        setCast(castData.cast);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    if (tv) getTVShowDetails();
  }, [tv]);

  useEffect(() => {
    const genres = tvShow?.genres.map((genre) => genre.name);
    const postSearch = async () => {
      const res = await fetch("/api/watchHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          data: {
            name: tvShow?.name,
            genre: genres,
            type: "tv",
          },
        }),
      });
      return res.json();
    };
    if (tvShow?.name) {
      postSearch();
    }
  }, [tvShow?.name]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!tvShow) return <p>Loading...</p>;

  const genres = tvShow.genres.map((genre) => genre.name).join(', ');

  return (
    <>
    
    <div className="bg-gray-900 min-h-screen">  
    <Favourite name={tvShow?.name}/>
      <div className="bg-gray-900 bg-opacity-80">
        <div
          className="w-[80%] mx-auto"
          style={{
            backgroundImage: `url(${BACKDROP_BASE_URL}${tvShow?.poster_path})`,
            backgroundSize: 'cover',
            height: '80vh',
          }}
        >
          {/* Main Section */}
          <div className="flex h-[80vh] p-[30px] bg-black/70 space-x-2">
            {/* Poster Image */}
            <div>
              <img
                src={`${IMAGE_BASE_URL}${tvShow?.poster_path}`}
                alt={tvShow?.name}
                className="w-full max-h-[600px] max-w-[350px] rounded-2xl shadow-lg"
              />
            </div>

            {/* Background with Details */}
            <div className="flex flex-col justify-center text-white rounded-2xl overflow-hidden">
              <div className="p-8 rounded-2xl">
                <h1 className="text-4xl font-bold mb-4">{tvShow?.name}</h1>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">First Air Date:</span> {tvShow?.first_air_date}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Genres:</span> {genres}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Rating:</span> {tvShow?.vote_average} / 10
                </p>
                <p className="text-gray-200">{tvShow?.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <h2 className="text-3xl font-semibold mb-6 text-center text-white">Cast</h2>
      <div className="flex overflow-scroll w-[80%] mx-auto scrollbar-hide justify-center gap-4">
        {cast.map((member) => (
          <div key={member.id} className="flex flex-col items-center bg-gray-800 p-3 rounded-lg shadow-md">
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
            <p className="text-xs text-white text-center">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  
  );
}
