import { Request, Response, NextFunction } from "express";
import argon2 from "argon2";

import { AppError } from "../utils/appError.js";
import CompanyProfile, {
  ICompanyProfile,
} from "../models/companyProfileModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import sendNotificationEmail from "../utils/emailFunc.js";

//GET ALL COMPANY PROFILES
const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  //EXECUTE QUERY
  const features = new APIFeatures(CompanyProfile.find(), req.query)
    .filter()
    .sort()
    .pagination();
  const companies = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: companies.length,
    data: { companies },
  });
});

//ADD A COMPANY PROFILE
const addNewCompanyProfiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      companyName,
      email,
      password,
      phoneNumber,
      industry,
      companySize,
      location,
      profilePic,
    } = req.body;

    const hash = await argon2.hash(password);

    if (!req.body) {
      return next(new AppError("no user input", 400));
    }

    const newCompany = new CompanyProfile({
      companyName,
      email,
      password: hash,
      phoneNumber,
      industry,
      companySize,
      location,
      profilePic,
    });

    await newCompany.save();

    // Send verification email
    await sendNotificationEmail({
      to: email,
      title: "Email Verification",
      message: "Verify your email by clicking the link below.",
      buttonText: "Verify Email",
      buttonUrl: "https://internflare-jobs.com/verify-email/token",
    });

    res.status(201).json({
      status: "success",
      data: { company: newCompany },
    });
  }
);

//GET A COMPANY PROFILE
const getCompanyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const company = await CompanyProfile.findById(req.params.id);

    if (!company) {
      return next(new AppError("no company found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { company },
    });
  }
);

//UPDATE A COMPANY PROFILE

const updateCompanyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, ...otherFields } = req.body;

    const updatedData: Partial<ICompanyProfile> = { ...otherFields };
    // If password is included, hash it
    if (password) {
      updatedData.password = await argon2.hash(password);
    }

    const company: ICompanyProfile | null =
      await CompanyProfile.findByIdAndUpdate(req.params.id, updatedData, {
        new: true, // return updated document
        runValidators: true, // ensure validation rules are enforced
      });

    if (!company) {
      return next(new AppError("No company found with this id", 404));
    }

    // Remove password from response
    const { password: _, ...companyWithoutPassword } = company.toObject();
    res.status(200).json({
      status: "success",
      company: companyWithoutPassword,
    });
  }
);

//REMOVE A COMPANY PROFILE
const deleteCompanyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteCompany = await CompanyProfile.findByIdAndDelete(req.params.id);

    if (!deleteCompany) {
      return next(new AppError("no company found with this id", 404));
    }

    res.status(200).json({
      status: "success",
    });
  }
);

export {
  getAllCompanies,
  addNewCompanyProfiles,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
};
