import express from "express";
import { protectRoute } from "../middlewares/routeProtector.js";

import {
  getAllJobs,
  addNewJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobsController.js";

const router = express.Router();

// JOBS ROUTES
router.route("/").get(protectRoute, getAllJobs).post(protectRoute, addNewJobs);

router
  .route("/:id")
  .get(protectRoute, getJob)
  .patch(protectRoute, updateJob)
  .delete(protectRoute, deleteJob);

export default router;
