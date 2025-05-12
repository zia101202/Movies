'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {fetchData} from "@/lib/api";
interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

const Tv = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchShows = async () => {
      try {
       const response=  await fetchData("/tv/on_the_air",   {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            language: "en-US",
            page: 1,
          },)
        setShows(response.data.results);
      } catch (err) {
        setError("Failed to load TV shows. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleShowClick = (id: number) => {
    router.push(`/tv/${id}`);
  };

  const handleClick = () => {
    router.replace("/tvShows");
  };

  return (
    <>
    
    < div className="w-[80%] bg-black/20 rounded-4xl mx-auto mt-[10px]">
    <button 
        onClick={handleClick} 
        className="mb-4 text-white bg-blue-500 px-4 py-2 rounded-lg shadow-lg"
      >
        TV
      </button>
      <div className=" overflow-x-scroll scrollbar-hide flex gap-4 py-6">
     
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex-shrink-0 w-[200px] cursor-pointer"
            onClick={() => handleShowClick(show.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="w-full rounded-2xl shadow-lg mb-2"
            />
            <div className="text-center   p-2 rounded-b-2xl">
              <h3 className="text-sm  text-white font-bold">{show.name}</h3>
              <p className="text-xs text-gray-300">{show.vote_average} / 10</p>
              <p className="text-xs text-gray-300">{show.first_air_date}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default Tv;
