import { IUser } from "../models/userModel.ts";
import { ICompanyProfile } from "../models/companyProfileModel.ts";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser | ICompanyProfile;
  }
}
declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
    }
  }
}

export {};
