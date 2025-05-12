import mongoose, { Document, Model, Schema } from 'mongoose';


export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  profilePic?: string;
  createdAt: Date;
}


const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
