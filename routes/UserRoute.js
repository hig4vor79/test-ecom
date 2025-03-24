import express from "express";
import { UserController } from "../controllers/index.js";
import {
  loginValidation,
  updateValidation,
} from "../middlewares/validations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import isAuthenticatedUser from "../middlewares/isAuthenticatedUser.js";

const router = express.Router();

router.route("/auth/registration").post(UserController.registration);
router
  .route("/auth/login")
  .post(loginValidation, handleValidationErrors, UserController.login);

router.route("/user/getMe").get(UserController.getMe);
router
  .route("/user/update")
  .put(
    updateValidation,
    handleValidationErrors,
    isAuthenticatedUser,
    UserController.updateProfile
  );

router.route("/admin/users").get(UserController.getAllUsers);
router.route("/admin/getUserDetails/:id").get(UserController.getUserById);

export { router };
