import { Request, Response } from "express";
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
  async (req: Request, res: Response) => {
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

    if (!req.body) throw new AppError("no user input", 400);

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
const getCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const company = await CompanyProfile.findById(req.params.id);

  if (!company)
    throw new AppError(`No company found with id ${req.params.id}`, 404);

  res.status(200).json({
    status: "success",
    data: { company },
  });
});

//UPDATE A COMPANY PROFILE

const updateCompanyProfile = catchAsync(async (req: Request, res: Response) => {
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

  if (!company)
    throw new AppError(`No company found with id ${req.params.id}`, 404);

  // Remove password from response
  const { password: _, ...companyWithoutPassword } = company.toObject();
  res.status(200).json({
    status: "success",
    company: companyWithoutPassword,
  });
});

//REMOVE A COMPANY PROFILE
const deleteCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const deleteCompany = await CompanyProfile.findByIdAndDelete(req.params.id);

  if (!deleteCompany)
    throw new AppError(`No company found with id ${req.params.id}`, 404);

  res.status(200).json({
    status: "success",
  });
});

export {
  getAllCompanies,
  addNewCompanyProfiles,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
};
