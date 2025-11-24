import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError.js";
import Reviews, { IReviews } from "../models/reviewsModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

//GET ALL OnBoardedJobs
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Reviews.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const result = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: result.length,
    data: { result },
  });
});

//ADD A NEW JOB
const addNewReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fromUserId, toUserId, jobId, stars, reviewNote, reviewDate } =
      req.body;

    const review = new Reviews({
      fromUserId,
      toUserId,
      jobId,
      stars,
      reviewNote,
      reviewDate,
    });

    await review.save();

    res.status(201).json({
      status: "success",
      data: { review },
    });
  }
);

//GET ALL REVIEWS FOR A PARTICULAR USER
const getUserReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Reviews.find({ toUserId: req.params.id });

    if (!result || result.length < 1) {
      return next(new AppError("reviews for this user not found", 404));
    }

    res.status(200).json({
      status: "success",
      result,
    });
  }
);

//UPDATE A REVIEW

const updateUserReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { stars, reviewNote } = req.body;

    const result: IReviews | null = await Reviews.findByIdAndUpdate(
      req.params.id,
      { stars, reviewNote },
      {
        new: true, // return updated document
        runValidators: true, // ensure validation rules are enforced
      }
    );

    if (!result) {
      return next(new AppError("No board job found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      boardJob: result,
    });
  }
);

export { getAllReviews, addNewReview, getUserReviews, updateUserReview };
