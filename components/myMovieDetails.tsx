import React from 'react';

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

interface MovieProps {
  movie: Movie;
}

const MyMovieDetails: React.FC<MovieProps> = ({ movie }) => {


    
  return (
    <div className="bg-gray-900 min-h-screen">
    <div className="bg-gray-900 bg-opacity-80">
      <div
        className="w-[80%] mx-auto"
        style={{
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: 'cover',
          height: '80vh',
        }}
      >
        {/* Main Section */}
        <div className="flex h-[80vh] p-[30px] bg-black/70 space-x-2">
          {/* Poster Image */}
          <div>
            <img
              src={movie.url}
              alt={movie.title}
              className="w-full max-h-[600px] max-w-[350px] rounded-2xl shadow-lg"
            />
          </div>

          {/* Background with Details */}
          <div className="flex flex-col justify-center text-white rounded-2xl overflow-hidden">
            <div className="p-8 rounded-2xl">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">First Air Date:</span> {movie.releaseYear}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Genres:</span> {movie.genre}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Rating:</span> {movie.rating} / 10
              </p>
              <p className="text-gray-200">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Cast Section */}
    <h2 className="text-3xl font-semibold mb-6 text-center text-white">Cast</h2>
    <div className="flex overflow-scroll w-[80%] mx-auto scrollbar-hide justify-center gap-4">
      {movie.cast.map((member) => (
        <div  className="flex flex-col items-center bg-gray-800 p-3 rounded-lg shadow-md">
          <img
            src={
                member
                ? `${member}`
                : 'https://via.placeholder.com/200x300?text=No+Image'
            }
         
            className="w-full min-w-[140px] h-[200px] object-cover rounded-lg mb-2"
          />
       
        </div>
      ))}
    </div>
  </div>
  );
};

export default MyMovieDetails;
