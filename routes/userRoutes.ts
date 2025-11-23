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

const router = express.Router();

// USERS ROUTES
router.route("/signup").get(getAllUsers).post(addNewUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/login").post(loginLimiter, loginUser);

export default router;
