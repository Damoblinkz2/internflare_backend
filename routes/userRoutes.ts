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
import {
  adminOverview,
  activateOrDeactivateUsers,
} from "../controllers/adminController.js";
import loginUser from "../controllers/login.js";
import imageUpload from "../middlewares/imageUpload.js";

const router = express.Router();

//INTERNS ROUTES
router.route("/interns/all").get(protectRoute, getAllUsers);
router.route("/intern/signup").post(addNewUsers);

router
  .route("/intern/:id")
  .get(protectRoute, getUser)
  .patch(protectRoute, imageUpload.single("profile-pic"), updateUser)
  .delete(protectRoute, deleteUser);

//COMPANY ROUTES
router.route("/companies/all").get(protectRoute, getAllCompanies);
router.route("/company/signup").post(addNewCompanyProfiles);

router
  .route("/company/:id")
  .get(protectRoute, getCompanyProfile)
  .patch(protectRoute, imageUpload.single("profile-pic"), updateCompanyProfile)
  .delete(protectRoute, deleteCompanyProfile);

//ADMIN ROUTES
router.route("/admin/overview").get(protectRoute, adminOverview);
router.route("/admin/user/:id").post(protectRoute, activateOrDeactivateUsers);

router.route("/login").post(loginLimiter, loginUser);

export default router;
