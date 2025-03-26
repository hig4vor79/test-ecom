import express from "express";
import { UserController } from "../controllers/index.js";
import {
  loginValidation,
  registerValidation,
  updateValidation,
} from "../middlewares/validations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import isAuthenticatedUser from "../middlewares/isAuthenticatedUser.js";

const router = express.Router();

router
  .route("/auth/registration")
  .post(
    registerValidation,
    handleValidationErrors,
    UserController.registration
  );
router
  .route("/auth/login")
  .post(loginValidation, handleValidationErrors, UserController.login);

router.route("/user/getMe").get(isAuthenticatedUser, UserController.getMe);
router
  .route("/user/update")
  .put(
    updateValidation,
    handleValidationErrors,
    isAuthenticatedUser,
    UserController.updateProfile
  );

router.route("/user/:id").get(UserController.getUserById);
router.route("/users").get(UserController.getAllUsers);

export { router };
