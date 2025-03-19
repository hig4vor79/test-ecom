import express from "express";
import { ProductController } from "../controllers/index.js";

const router = express.Router();

router.route("/products").post(ProductController.create);
router.route("/product/:id").get(ProductController.getProduct);

export { router };
