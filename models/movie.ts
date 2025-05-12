import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for a Movie document
interface IMovie extends Document {
  id: number;
  url: string;
  title: string;
  genre: string;
  releaseYear: number;
  rating: number;
  description: string;
  poster: string;
  cast: string[]; // Array of image URLs
}

// Define the schema
const movieSchema = new Schema<IMovie>({
  id: {
    type: Number,
    required: true,
    unique: true // Assuming each movie has a unique id
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  cast: {
    type: [String],
    required: true
  }
});

// Use existing model if it exists, otherwise create a new one
const Movie: Model<IMovie> = mongoose.models.Movie || mongoose.model<IMovie>('Movie', movieSchema, 'movie');

export default Movie;
