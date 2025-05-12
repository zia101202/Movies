import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the document
interface ITest extends Document {
  name: string;
  id: string;
}

// Create the schema
const testSchema = new Schema<ITest>({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  }
});

// Use existing model if already compiled
const Test: Model<ITest> = mongoose.models.Test || mongoose.model<ITest>('Test', testSchema, 'test');

export default Test;
