import mongoose, { Document, Model, Schema } from "mongoose";

// Optional: define a TypeScript interface for type safety
export interface ICompanyProfile extends Document {
  email: string;
  companyName: string;
  password: string;
  phoneNumber: string;
  verified: boolean;
  industry: string;
  companySize: string;
  location: string;
  profilePic: string;
  signUpDate: Date;
}

//COMPANY SCHEMA
const companySchema: Schema<ICompanyProfile> = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "An email must be added"],
    unique: true,
    trim: true,
  },
  companyName: {
    type: String,
    require: [true, "A company name must be added"],
    trim: true,
  },
  password: {
    type: String,
    require: [true, "A password must be added"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    required: [true, "industry should be provided"],
  },
  companySize: {
    type: String,
    required: [true, "company size should be provided"],
  },
  location: {
    type: String,
    required: [true, "location should be provided"],
  },
  profilePic: {
    type: String,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  signUpDate: { type: Date, default: new Date() },
});

// Model
const CompanyProfile: Model<ICompanyProfile> = mongoose.model<ICompanyProfile>(
  "CompanyProfiles",
  companySchema
);

export default CompanyProfile;
