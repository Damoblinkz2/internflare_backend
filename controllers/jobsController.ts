import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError.js";
import Job from "../models/jobsModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

//GET ALL JOBS
const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const jobs = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: { jobs },
  });
});

//ADD NEW JOB
const addNewJobs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const companyId = req.user!._id;
    const { jobTitle, jobDesc, jobType } = req.body;

    if (!req.body) {
      return next(new AppError("no job input", 400));
    }

    const newJob = new Job({
      jobTitle,
      jobDesc,
      jobType,
      companyId,
    });

    await newJob.save();

    res.status(201).json({
      status: "success",
      data: { product: newJob },
    });
  }
);

//GET A JOB
const getJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError("no job found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { job },
    });
  }
);

//UPDATE A JOB
const updateJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return next(new AppError("no product found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      job,
    });
  }
);

//REMOVE JOB
const deleteJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteJob = await Job.findByIdAndDelete(req.params.id);

    if (!deleteJob) {
      return next(new AppError("no job found with this id", 404));
    }

    res.status(200).json({
      status: "success",
    });
  }
);

export { getAllJobs, addNewJobs, getJob, updateJob, deleteJob };
