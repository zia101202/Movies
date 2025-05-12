// Define the movie genre mapping type
interface GenreMap {
    [key: string]: number;
  }
  
  // Hardcoded Movie Genre Map (can be dynamically fetched for more accuracy)
  const movieGenres: GenreMap = {
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Horror": 27,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37
  };
  
  // Function to get genre IDs based on an array of genre names
  function getGenreIds(genreNames: string[]): number[] {
    return genreNames
      .map(name => movieGenres[name.trim()])
      .filter((id): id is number => id !== undefined); // TypeGuard for `undefined`
  }
  
  // Example Usage
  const genres = ["Action", "Drama", "Horror", "Unknown Genre"];
  console.log(getGenreIds(genres)); // Output: [28, 18, 27]
   export { getGenreIds };