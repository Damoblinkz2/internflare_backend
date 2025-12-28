import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError.js";
import OnBoard, { IOnBoard } from "../models/onBoardModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

//GET ALL OnBoardedJobs
const getAllOnboardedUsers = catchAsync(async (req: Request, res: Response) => {
  //EXECUTE QUERY
  const features = new APIFeatures(OnBoard.find(), req.query)
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

//ADD NEW USER ONBOARD
const addNewUserOnboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const { jobId, role, onBoardDate, workMode } = req.body;

    const onBoarding = new OnBoard({
      userId,
      jobId,
      role,
      onBoardDate,
      workMode,
    });

    await onBoarding.save();

    res.status(201).json({
      status: "success",
      data: { user: onBoarding },
    });
  }
);

//GET A JOB ONBOARD
const getJobOnboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const boardJob = await OnBoard.findById(req.params.id);

    if (!boardJob) {
      return next(new AppError("no board job with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { boardJob },
    });
  }
);

//UPDATE JOB ONBOARD

const updateJobOnboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role, workMode } = req.body;

    const onboard: IOnBoard | null = await OnBoard.findByIdAndUpdate(
      req.params.id,
      { role, workMode },
      {
        new: true, // return updated document
        runValidators: true, // ensure validation rules are enforced
      }
    );

    if (!onboard) {
      return next(new AppError("No board job found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      boardJob: onboard,
    });
  }
);

export {
  getAllOnboardedUsers,
  addNewUserOnboard,
  getJobOnboard,
  updateJobOnboard,
};
