import { PostModel, CategoryModel } from "../models/index.js";
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

    // PostModel.findOneAndUpdate(
    //   {
    //     slug: slug,
    //   },
    //   {
    //     $inc: { viewsCount: 1 },
    //   },
    //   {
    //     returnDocument: "after",
    //   },
    //   (err, doc) => {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).json({
    //         message: "Не удалось вернуть статью",
    //       });
    //     }

    //     if (!doc) {
    //       return res.status(404).json({
    //         message: "Статья не найдена",
    //       });
    //     }

    //     res.json(doc);
    //   }
    // ).populate("user");

    res.status(201).json(post);
  } catch (error) {
    console.log("Get single post error: " + error);
    res.status(500).json({
      message: "Get single post error",
      error,
    });
  }
};

// Get Posts By Category
export const getPostsByCategorySlug = async (req, res) => {
  const slug = req.params.slug;

  try {
    // First, find the category by its slug
    const category = await CategoryModel.findOne({ slug }).exec();

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Then, find all posts that include this category ID in their categories array
    const posts = await PostModel.find({
      categories: category._id,
    })
      .populate("user", "name email") // Optional: populate user details
      .populate("categories", "title slug") // Optional: populate category details
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: "No posts found for this category",
      });
    }

    res.status(200).json({
      posts,
      category: {
        title: category.title,
        slug: category.slug,
      },
    });
  } catch (error) {
    console.log("Get posts by category error: " + error);
    res.status(500).json({
      message: "Get posts by category error",
      error,
    });
  }
};

// Create Post --ADMIN
export const create = async (req, res) => {
  const { title, text, image, slug, categories } = req.body;

  try {
    let slugToDb = await filterSlug(slug, title, PostModel);

    const doc = new PostModel({
      title,
      text,
      image,
      slug: slugToDb,
      user: req.userId,
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

  let slugToDb = await filterSlug(slug, title, PostModel);

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
