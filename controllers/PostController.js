import { PostModel } from "../models/index.js";
import filterSlug from "../utils/filterSlug.js";

// Get all Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log("Get all posts error: " + error);
    res.status(500).json({
      message: "Get all posts error",
      error,
    });
  }
};

// Get one Post
export const getPostBySlug = async (req, res) => {
  const slug = req.params.slug;

  try {
    const post = await PostModel.findOne({ slug });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(201).json(post);
  } catch (error) {
    console.log("Get single post error: " + error);
    res.status(500).json({
      message: "Get single post error",
      error,
    });
  }
};

// Create Post --ADMIN
export const create = async (req, res) => {
  const { title, text, image, slug, userID, categories } = req.body;

  try {
    let slugToDb = await filterSlug(slug, title);

    const doc = new PostModel({
      title,
      text,
      image,
      slug: slugToDb,
      user: userID,
      categories,
    });

    const post = await doc.save();

    res.status(201).json(post);
  } catch (error) {
    console.log("Create post error: " + error);
    res.status(500).json({
      message: "Create post error",
      error,
    });
  }
};

// Update Post --ADMIN
export const updatePostById = async (req, res) => {
  const id = req.params.id;
  const { title, text, image, slug, userID, categories } = req.body;

  let slugToDb = await filterSlug(slug, title);

  try {
    const post = await PostModel.findByIdAndUpdate(
      id,
      {
        title,
        text,
        image,
        slug: slugToDb,
        user: userID,
        categories,
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    console.log("Update post error: " + error);
    res.status(500).json({ message: "Update post error", error });
  }
};

// Remove Post --ADMIN
export const removePostById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPost = await PostModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Remove post error: " + error);
    res.status(500).json({ message: "Remove post error", error });
  }
};
