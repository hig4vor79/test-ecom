import express from "express";
import { UserController } from "../controllers/index.js";
import {
  loginValidation,
  registerValidation,
  updateUserValidation,
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

router
  .route("/user/update/:id")
  .put(
    updateUserValidation,
    handleValidationErrors,
    isAuthenticatedUser,
    UserController.updateUserById
  );

router.route("/user/:id").get(UserController.getUserById);
router.route("/users").get(UserController.getAllUsers);

export { router };
