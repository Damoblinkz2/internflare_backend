import mongoose, { Document, Model, Schema } from "mongoose";

//define a TypeScript interface for type safety
export interface IJob extends Document {
  jobTitle: string;
  description: string;
  jobType: string;
}

const jobSchema: Schema<IJob> = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title must be added"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description must be added"],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, "Job type must be added"],
  },
});

// Model
const Job: Model<IJob> = mongoose.model<IJob>("Jobs", jobSchema);

export default Job;
