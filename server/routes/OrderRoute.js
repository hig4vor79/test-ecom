import express from "express";
import { OrderController } from "../controllers/index.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { createOrderValidation } from "../middlewares/validations.js";
import isAuthenticatedUser from "../middlewares/isAuthenticatedUser.js";

const router = express.Router();

router
  .route("/order")
  .post(
    isAuthenticatedUser,
    createOrderValidation,
    handleValidationErrors,
    OrderController.create
  );

export { router };
