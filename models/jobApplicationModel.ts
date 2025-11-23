import mongoose, { Document, Model, Schema } from "mongoose";

//define a TypeScript interface for type safety
export interface IJobApplication extends Document {
  coverLetter: string;
  cvLink: string;
  portfolioLink: string;
  jobId: string;
  userId: string;
}

const jobApplicationSchema: Schema<IJobApplication> = new mongoose.Schema({
  coverLetter: { type: String, trim: true },
  cvLink: { type: String, trim: true },
  portfolioLink: { type: String, trim: true },
  jobId: { type: String, required: [true, "job id should be provided"] },
  userId: { type: String, required: [true, "user id should be provided"] },
});

const JobApplication: Model<IJobApplication> = mongoose.model<IJobApplication>(
  "JobApplications",
  jobApplicationSchema
);

export default JobApplication;
