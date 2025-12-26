import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import JobApplication from "../models/jobApplicationModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

//GET ALL JOBS
const getAllJobApplications = catchAsync(
  async (req: Request, res: Response) => {
    //EXECUTE QUERY
    const features = new APIFeatures(JobApplication.find(), req.query)
      .filter()
      .sort()
      .pagination();
    const jobApplications = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: jobApplications.length,
      data: { jobApplications },
    });
  }
);

//ADD NEW JOB APPLICATION
const addNewJobApplications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = "";
    const { coverLetter, resumeLink, portfolioLink, jobId } = req.body;

    if (!req.body) {
      return next(new AppError("no job application input", 400));
    }

    const newJobApplication = new JobApplication({
      coverLetter,
      resumeLink,
      portfolioLink,
      userId,
      jobId,
    });

    await newJobApplication.save();

    res.status(201).json({
      status: "success",
      data: { product: newJobApplication },
    });
  }
);

//GET A JOB
const getJobApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobApplication = await JobApplication.findById(req.params.id);

    if (!jobApplication) {
      return next(new AppError("no job applicaion found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { jobApplication },
    });
  }
);

//UPDATE A JOB
const updateJobApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!jobApplication) {
      return next(new AppError("no product found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      jobApplication,
    });
  }
);

//REMOVE JOB
const deleteJobApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteJobApplication = await JobApplication.findByIdAndDelete(
      req.params.id
    );

    if (!deleteJobApplication) {
      return next(new AppError("no job application found with this id", 404));
    }

    res.status(200).json({
      status: "success",
    });
  }
);

export {
  getAllJobApplications,
  addNewJobApplications,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
};
