import express from "express";
import { protectRoute } from "../middlewares/routeProtector.js";

import {
  getAllOnboardedUsers,
  addNewUserOnboard,
  getJobOnboard,
  updateJobOnboard,
} from "../controllers/onBoardController.js";

const router = express.Router();

// ONBOARD ROUTES
router.route("/all").get(protectRoute, getAllOnboardedUsers);

router.route("/hire").post(protectRoute, addNewUserOnboard);

router
  .route("/all/:id")
  .get(protectRoute, getJobOnboard)
  .patch(protectRoute, updateJobOnboard);

export default router;
