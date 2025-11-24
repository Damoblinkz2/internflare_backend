import express from "express";

import { loginLimiter } from "../middlewares/rateLimit.js";
import {
  getAllUsers,
  addNewUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/usersController.js";

import { protectRoute } from "../middlewares/routeProtector.js";

const router = express.Router();

// USERS ROUTES
router.route("/signup").get(protectRoute, getAllUsers).post(addNewUsers);

router
  .route("/id/:id")
  .get(protectRoute, getUser)
  .patch(protectRoute, updateUser)
  .delete(protectRoute, deleteUser);

router.route("/login").post(loginLimiter, loginUser);

export default router;
