import express from "express";
import { protectRoute } from "../middlewares/routeProtector.js";

import {
  getAllReviews,
  getUserReviews,
  addNewReview,
  updateUserReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// ONBOARD ROUTES
router.route("/all").get(protectRoute, getAllReviews);

router.route("/new").post(protectRoute, addNewReview);

router
  .route("/all/:id")
  .get(protectRoute, getUserReviews)
  .patch(protectRoute, updateUserReview);

export default router;
