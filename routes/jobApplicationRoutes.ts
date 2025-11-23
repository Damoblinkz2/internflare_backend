import express from "express";
import { protectRoute } from "../middlewares/routeProtector.js";

import {
  getAllJobApplications,
  addNewJobApplications,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from "../controllers/jobApplicationsController.js";

const router = express.Router();

//JOB APPLICATION ROUTES
router
  .route("/")
  .get(protectRoute, getAllJobApplications)
  .post(protectRoute, addNewJobApplications);

router
  .route("/:id")
  .get(protectRoute, getJobApplication)
  .patch(protectRoute, updateJobApplication)
  .delete(protectRoute, deleteJobApplication);

export default router;
