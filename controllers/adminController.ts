import { Request, Response } from "express";
import fs from "fs";
import { fileTypeFromFile } from "file-type";

import { AppError } from "../utils/appError.js";
import JobApplication from "../models/jobApplicationModel.js";
import User, { IUser } from "../models/userModel.js";
import CompanyProfile, {
  ICompanyProfile,
} from "../models/companyProfileModel.js";
import Job from "../models/jobsModel.js";
import OnBoard from "../models/onBoardModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ALLOWED_MIME_TYPES } from "../middlewares/fileUpload.js";

//ADMIN OVERVIEW
const adminOverview = catchAsync(async (req: Request, res: Response) => {
  //TOTAL NUMBER OF INTERNS
  const interns = new APIFeatures(User.find({ role: "intern" }), req.query)
    .filter()
    .sort()
    .pagination();
  const totalInterns = await interns.query;

  const totalNumberOfInterns = totalInterns.length;

  //NUMBER OF ACTIVE INTERNS(credly approved and not employed)
  const _activeInterns = new APIFeatures(
    User.find({
      role: "intern",
      internFlareApproved: true,
      employed: false,
      active: true,
    }),
    req.query
  )
    .filter()
    .sort()
    .pagination();
  const activeInterns = await _activeInterns.query;
  const totalNumberOfActiveInterns = activeInterns.length;

  //NUMBER OF ACTIVE JOB POSTING
  const job = new APIFeatures(Job.find({ stillOpened: true }), req.query)
    .filter()
    .sort()
    .pagination();
  const jobPosting = await job.query;
  const totalNumberOfJobPosting = jobPosting.length;

  //NUMBER OF HIRING COMPANIES
  const company = new APIFeatures(
    CompanyProfile.find({ currentlyHiring: true }),
    req.query
  )
    .filter()
    .sort()
    .pagination();
  const hiring = await company.query;
  const totalNumberOfhiringCompanies = hiring.length;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    totalNumberOfInterns,
    totalNumberOfActiveInterns,
    totalNumberOfJobPosting,
    totalNumberOfhiringCompanies,
  });
});

//SEE RECENT JOB PLACEMENT
const jobPlacement = catchAsync(async (req: Request, res: Response) => {
  //SEE RECENT JOB PLACEMENT
  const onboarding = new APIFeatures(OnBoard.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const data = await onboarding.query;

  if (!data) throw new AppError("No Job placement found", 404);

  res.status(201).json({
    status: "success",
    data,
  });
});

//ACTIVATE OR DEACTIVATE USERS
const activateOrDeactivateUsers = catchAsync(
  async (req: Request, res: Response) => {
    const role = req.user!.role;

    if (role !== "admin") throw new AppError("Forbidden access", 403);

    const user: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    const company: ICompanyProfile | null =
      await CompanyProfile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    let details: IUser | ICompanyProfile;

    if (user) {
      details = user;
    } else if (company) {
      details = company;
    } else {
      return res.status(404).json({ status: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { details },
    });
  }
);

//REMOVE JOB
const deleteJobApplication = catchAsync(async (req: Request, res: Response) => {
  const deleteJobApplication = await JobApplication.findByIdAndDelete(
    req.params.id
  );

  if (!deleteJobApplication)
    throw new AppError(
      `No job application found with id ${req.params.id}`,
      404
    );

  res.status(200).json({
    status: "success",
  });
});

export {
  adminOverview,
  jobPlacement,
  activateOrDeactivateUsers,
  deleteJobApplication,
};
