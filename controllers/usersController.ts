import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

import { AppError } from "../utils/appError.js";
import User, { IUser } from "../models/userModel.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create a function to sign tokens
export const signToken = (userId: string) => {
  return jwt.sign(
    { id: userId }, // payload
    process.env.JWT_SECRET as string, // secret key
    { expiresIn: "1h" } // token expires in 1 hour
  );
};

//GET ALL USERS
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  //EXECUTE QUERY
  const features = new APIFeatures(User.find(), req.query)
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

//ADD A USER
const addNewUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, dob, bio, skillSet, profilePic } = req.body;

    const hash = await argon2.hash(password);

    if (!req.body) {
      return next(new AppError("no user input", 400));
    }

    const newUser = new User({
      name,
      email,
      password: hash,
      dob,
      bio,
      skillSet,
      profilePic,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      data: { user: newUser },
    });
  }
);

//GET A USER
const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("no user found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

//UPDATE A USER

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, ...otherFields } = req.body;

    const updatedData: Partial<IUser> = { ...otherFields };

    // If password is included, hash it
    if (password) {
      updatedData.password = await argon2.hash(password);
    }

    const user: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true, // return updated document
        runValidators: true, // ensure validation rules are enforced
      }
    );

    if (!user) {
      return next(new AppError("No user found with this id", 404));
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      status: "success",
      user: userWithoutPassword,
    });
  }
);

//REMOVE USER
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      return next(new AppError("no user found with this id", 404));
    }

    res.status(200).json({
      status: "success",
    });
  }
);

//LOGIN
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user || !(await argon2.verify(user.password, password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  }
);

export { getAllUsers, addNewUsers, getUser, updateUser, deleteUser, loginUser };
