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
  internFlareApproved: boolean;
  employed: boolean;
  bio: string;
  profilePic: string;
  role: string;
  signUpDate: Date;
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
  accountType: {
    type: String,
    require: [true, "account type should be added"],
  },
  employed: {
    type: Boolean,
    default: false,
    required: [true, "employment status should be provided"],
  },
  role: {
    type: String,
    required: [true, "user role should be provided"],
  },
  internFlareApproved: {
    type: Boolean,
    default: false,
    required: [true, "internflare approval"],
  },
  skillSet: { type: [String], require: [true, "Add atleast one skill"] },
  bio: { type: String, trim: true },
  profilePic: {
    type: String,
    unique: true,
  },
  signUpDate: { type: Date, default: new Date() },
});

// Model
const User: Model<IUser> = mongoose.model<IUser>("Users", userSchema);

export default User;
