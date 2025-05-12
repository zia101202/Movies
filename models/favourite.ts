import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the document
interface ITest extends Document {
  name:string[] ;
  id: string;
  email: string;
}

// Create the schema
const testSchema = new Schema<ITest>({
    email:{
        type:String,
        required:true,
        unique:true,
    },
  name: {
    type: [String],
    required: true,
  },
  
});
// Use existing model if already compiled
const favourite: Model<ITest> = mongoose.models.favourite || mongoose.model<ITest>('favourite', testSchema, 'favourite');

export default favourite;
