import express from "express";
import { ProductController } from "../controllers/index.js";
import isAdmin from "../middlewares/isAdmin.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { createProductValidation } from "../middlewares/validations.js";

const router = express.Router();

router
  .route("/product")
  .post(
    isAdmin,
    createProductValidation,
    handleValidationErrors,
    ProductController.create
  );
router.route("/product/:id").put(isAdmin, ProductController.updateProductId);
router
  .route("/product/:id")
  .delete(isAdmin, ProductController.removeProductById);

router.route("/product/:slug").get(ProductController.getProductBySlug);
router.route("/products").get(ProductController.getAllProducts);

export { router };
