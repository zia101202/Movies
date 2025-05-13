import { useEffect,useState } from 'react'
import React from 'react'
import { signOut, useSession } from "next-auth/react";
import axios from 'axios';
import {getGenreIds} from '@/lib/genre';
import getMoviesByGenres from '@/lib/genreData';
interface UserData {
  watchHistory: { genre: string,name: string, type: string }[];
  searchHistory: string[];
}
function Recommended() {
  const { data: session, status } = useSession();
  const [data,setData]=useState<UserData>()
  const [recommendations, setRecommendations] = useState<any[]>([]);
const getData = async () => {

   const response = await fetch('/api/searchHistory',{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: session?.user?.email,
    }),
   })
   const data = await response.json()
   console.log(data)
   setData(data.userSearch[0])
}
useEffect(() => {
  if (status !== "authenticated") return;
  getData();
}, [status]);


useEffect(() => {
const fetchRecommendations = async () => {
  console.log(data);
try {
 
  if (!data || !data.watchHistory) return;
  const genres = data?.watchHistory.flatMap((item) => item.genre) || [] ;

  const mostRepeatedGeneres = Object.entries(
    genres.reduce<Record<string, number>>((acc, term) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
    }, {})
).sort(([, a], [, b]) => b - a).slice(0, 3).map(([term]) => term);

console.log(mostRepeatedGeneres);
  const genreIds=getGenreIds(mostRepeatedGeneres)
console.log(genreIds);
 const movies = await getMoviesByGenres(genreIds);
 
 setRecommendations((prevRecommendations) => [...prevRecommendations, ...movies]);

 console.log(movies);
 console.log(genres);
} catch (error) {
  console.error('Error fetching recommendations:', error);
}
}
fetchRecommendations()

}, [data]);



useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      if (!data || !data.watchHistory) return;
      
      const searchTerms = data?.searchHistory || [];
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; // Make sure to set this in .env.local
console.log(searchTerms);

const mostRepeatedSearchTerms = Object.entries(
  searchTerms.reduce<Record<string, number>>((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
  }, {})
).sort(([, a], [, b]) => b - a).slice(0, 3).map(([term]) => term);

console.log(mostRepeatedSearchTerms);
      
      const allResults: any[] = [];
console.log(searchTerms);
      for (const term of mostRepeatedSearchTerms) {
        console.log(term);
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
          params: {
            api_key: apiKey,
            query: term,
          },
        });
        allResults.push(...response.data.results.slice(0, 3));
        console.log(response);
      }

   
      setRecommendations((prevRecommendations) => [...prevRecommendations, ...allResults]);


    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  fetchRecommendations();
}, [data]);

console.log(recommendations);
  return (
    <div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
       { !recommendations || recommendations.length === 0 ? (
        <div className="text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">No recommendations found.</h2>
          <p className="text-gray-400">Try searching for a movie or TV show.</p>
        </div>
      ):(recommendations.map((item) => (
        <div key={item.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-300">
          <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-72 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white">{item.title || item.name}</h3>
            <p className="text-sm text-gray-400">Rating: {item.vote_average.toFixed(1)} / 10</p>
          </div>
        </div>
      )))}
      
    </div>
    </div>
  )
}
export default Recommended
