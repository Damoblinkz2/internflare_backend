import express from "express";

import { loginLimiter } from "../middlewares/rateLimit.js";
import { protectRoute } from "../middlewares/routeProtector.js";
import {
  getAllUsers,
  addNewUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import {
  addNewCompanyProfiles,
  deleteCompanyProfile,
  getAllCompanies,
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController.js";
import loginUser from "../controllers/login.js";

const router = express.Router();

//INTERNS ROUTES
router.route("/interns/all").get(protectRoute, getAllUsers);
router.route("/intern/signup").post(addNewUsers);

router
  .route("/intern/:id")
  .get(protectRoute, getUser)
  .patch(protectRoute, updateUser)
  .delete(protectRoute, deleteUser);

//COMPANY ROUTES
router.route("/companies/all").get(protectRoute, getAllCompanies);
router.route("/company/signup").post(addNewCompanyProfiles);

router
  .route("/company/:id")
  .get(protectRoute, getCompanyProfile)
  .patch(protectRoute, updateCompanyProfile)
  .delete(protectRoute, deleteCompanyProfile);

router.route("/login").post(loginLimiter, loginUser);

export default router;
