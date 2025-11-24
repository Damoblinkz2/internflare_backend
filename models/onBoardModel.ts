import mongoose, { Document, Model, Schema } from "mongoose";

// Optional: define a TypeScript interface for type safety
export interface IOnBoard extends Document {
  userId: string;
  jobId: string;
  role: string;
  onBoardDate: Date;
  workMode: string;
}

//ONBOARD SCHEMA
const onBoardSchema: Schema<IOnBoard> = new mongoose.Schema({
  userId: {
    type: String,
    require: [true, "userId should be added"],
    trim: true,
  },
  jobId: {
    type: String,
    require: [true, "jobId should be added"],
    trim: true,
  },
  workMode: {
    type: String,
    require: [true, "work must be added"],
    trim: true,
  },

  onBoardDate: { type: Date, require: [true, "onboard date needed"] },

  role: {
    type: String,
    required: [true, "user role should be provided"],
  },
});

// Model
const OnBoard: Model<IOnBoard> = mongoose.model<IOnBoard>(
  "Onboard",
  onBoardSchema
);

export default OnBoard;
