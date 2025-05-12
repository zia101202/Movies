import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY ;  
const BASE_URL = 'https://api.themoviedb.org/3/discover/movie';

async function getMoviesByGenres(genres: number[]) {
  try {
    // Join the genre IDs into a comma-separated string
    const genreString = genres.join(',');

    // Make the API request to fetch movies based on genres
    const response = await axios.get(BASE_URL, {
      params: {
        api_key: API_KEY,
        with_genres: genreString,
        language: 'en-US',
      },
    });



    
    const movies = response.data.results.slice(0, 10)
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export default getMoviesByGenres;