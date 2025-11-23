import mongoose, { Document, Model, Schema } from "mongoose";

// Optional: define a TypeScript interface for type safety
export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  accountType: string;
  description: string;
  dob: Date;
  skillSet: string[];
  bio: string;
  profilePic: string;
}

//USER SCHEMA
const userSchema: Schema<IUser> = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "An email must be added"],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    require: [true, "A name must be added"],
    trim: true,
  },
  password: {
    type: String,
    require: [true, "A password must be added"],
    trim: true,
  },
  dob: { type: Date },
  accountType: { type: String, require: [true, "account tye should be added"] },
  skillSet: { type: [String], require: [true, "Add atleast one skill"] },
  bio: { type: String, trim: true },
  profilePic: {
    type: String,
    unique: true,
  },
});

// Model
const User: Model<IUser> = mongoose.model<IUser>("Users", userSchema);

export default User;
