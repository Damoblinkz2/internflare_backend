import mongoose, { Document, Model, Schema } from "mongoose";

//define a TypeScript interface for type safety
export interface IJob extends Document {
  jobTitle: string;
  jobDesc: string;
  jobType: string;
  stillOpened: boolean;
  companyId: string;
}

const jobSchema: Schema<IJob> = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, "Job title must be added"],
    trim: true,
  },
  jobDesc: {
    type: String,
    required: [true, "Job description must be added"],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, "Job type must be added"],
  },
  stillOpened: {
    type: Boolean,
    default: true,
    required: [true, "Still open?"],
  },
  companyId: {
    type: String,
    required: [true, "Company ID must be provided"],
  },
});

// Model
const Job: Model<IJob> = mongoose.model<IJob>("Jobs", jobSchema);

export default Job;
