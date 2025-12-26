import jwt from "jsonwebtoken";
import argon2 from "argon2";
import User, { IUser } from "../models/userModel.js";
import CompanyProfile, {
  ICompanyProfile,
} from "../models/companyProfileModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

// Create a function to sign tokens
const signToken = (userId: string) => {
  return jwt.sign(
    { id: userId }, // payload
    process.env.JWT_SECRET as string, // secret key
    { expiresIn: "1h" } // token expires in 1 hour
  );
};

//LOGIN
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    // 1. Check required fields
    if (!email || !password)
      return next(new AppError("Please provide email and password", 400));

    const user: IUser | null = await User.findOne({ email });
    const company: ICompanyProfile | null = await CompanyProfile.findOne({
      email,
    });

    let details: IUser | ICompanyProfile;

    if (user) {
      details = user;
    } else if (company) {
      details = company;
    } else {
      return next(new AppError("Incorrect email or password", 401));
    }

    if (!(await argon2.verify(details.password, password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(details._id.toString());

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: details._id,
        email: details.email,
        name: "name" in details ? details.name : details.companyName,
      },
    });
  }
);

export default loginUser;
