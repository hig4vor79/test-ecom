import express from "express";
import { OrderController } from "../controllers/index.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { createOrderValidation } from "../middlewares/validations.js";

const router = express.Router();

router
  .route("/order")
  .post(createOrderValidation, handleValidationErrors, OrderController.create);

export { router };
