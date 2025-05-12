import mongoose, { Schema, Document, model } from 'mongoose';

// Mongoose Model
interface IUserPreference extends Document {
  email: string;
  preferredLanguage: string;
  preferredGenres: string[];
  themeMode: 'light' | 'dark';
  notificationsEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema = new Schema<IUserPreference>({
  email: { type: String, required: true, unique: true },
  preferredLanguage: { type: String, default: 'English' },
  preferredGenres: { type: [String], default: [] },
  themeMode: { type: String, enum: ['light', 'dark'], default: 'light' },
  notificationsEnabled: { type: Boolean, default: true },

}, { timestamps: true });

export const UserPreference = mongoose.models.UserPreference || model<IUserPreference>('UserPreference', UserPreferenceSchema);