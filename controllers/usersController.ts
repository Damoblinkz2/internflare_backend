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
  const users = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
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

export { getAllUsers, addNewUsers, getUser, updateUser, deleteUser };
