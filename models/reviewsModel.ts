import mongoose, { Document, Model, Schema } from "mongoose";

// Optional: define a TypeScript interface for type safety
export interface IReviews extends Document {
  fromUserId: string;
  toUserId: string;
  jobId: string;
  stars: number;
  reviewNote: string;
  reviewDate: Date;
}

//REVIEWS SCHEMA
const reviewsSchema: Schema<IReviews> = new mongoose.Schema({
  fromUserId: {
    type: String,
    require: [true, "sender userId should be added"],
    trim: true,
  },
  toUserId: {
    type: String,
    require: [true, "reciever userId should be added"],
    trim: true,
  },
  jobId: {
    type: String,
    require: [true, "jobId should be added"],
    trim: true,
  },
  stars: {
    type: Number,
    require: [true, "stars should be added"],
    trim: true,
  },

  reviewDate: {
    type: Date,
    require: [true, "review date needed"],
    default: new Date(),
  },

  reviewNote: {
    type: String,
    trim: true,
  },
});

// Model
const Reviews: Model<IReviews> = mongoose.model<IReviews>(
  "Reviews",
  reviewsSchema
);

export default Reviews;
