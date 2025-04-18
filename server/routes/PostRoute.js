import express from "express";
import { PostController } from "../controllers/index.js";
import isAdmin from "../middlewares/isAdmin.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
import { createPostValidation } from "../middlewares/validations.js";
import { uploadPostImage } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/post")
  .post(
    isAdmin,
    createPostValidation,
    handleValidationErrors,
    uploadPostImage,
    PostController.create
  );
router
  .route("/post/:id")
  .put(isAdmin, uploadPostImage, PostController.updatePostById);
router.route("/post/:id").delete(isAdmin, PostController.removePostById);

router.route("/post/:slug").get(PostController.getPostBySlug);
router
  .route("/posts/category/:slug")
  .get(PostController.getPostsByCategorySlug);
router.route("/posts").get(PostController.getAllPosts);

export { router };
