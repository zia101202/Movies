import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Category document
interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt fields
  }
);

// Use the existing model if it exists, otherwise create a new one
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
