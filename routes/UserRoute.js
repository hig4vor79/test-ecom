import express from "express";
import { UserController } from "../controllers/index.js";
import { loginValidation } from "../middlewares/validations.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

const router = express.Router();

router.route("/auth/registration").post(UserController.registration);
router
  .route("/auth/login")
  .post(loginValidation, handleValidationErrors, UserController.login);

router.route("/user/getMe").get(UserController.getMe);
router.route("/user/updateProfile").put(UserController.updateProfile);

router.route("/admin/getAllUsers").get(UserController.getAllUsers);
router.route("/admin/getUserDetails/:id").get(UserController.getUserDetails);

export { router };
