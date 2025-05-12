// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  email: string;
  searchHistory: string[];
  watchHistory: {
    name: string;
    genre: string;
    type: 'movie' | 'tv';
  }[];
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  searchHistory: {
    type: [String],
    default: [],
  },
  watchHistory: {
    type: [
      {
        name: { type: String, required: true },
        genre: [{ type: String, required: true }],
        type: { type: String, enum: ['movie', 'tv'], required: true },
      },
    ],
    default: [],
  },
});

const UserSearch: Model<IUser> = mongoose.models.UserSearch || mongoose.model<IUser>('UserSearch', userSchema);
export default UserSearch;
