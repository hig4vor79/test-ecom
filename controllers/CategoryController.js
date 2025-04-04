import { CategoryModel } from "../models/index.js";
import filterSlug from "../utils/filterSlug.js";

// Get all Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().exec();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.log("Get all categories error: " + error);
    res.status(500).json({
      message: "Get all categories error",
      error,
    });
  }
};

// Get one Category
export const getCategoryBySlug = async (req, res) => {
  const slug = req.params.slug;

  try {
    const category = await CategoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(201).json(category);
  } catch (error) {
    console.log("Get single category error: " + error);
    res.status(500).json({
      message: "Get single category error",
      error,
    });
  }
};

// Create Category --ADMIN
export const create = async (req, res) => {
  const { title, text, image, slug, userID } = req.body;

  try {
    let slugToDb = await filterSlug(slug, title);

    const doc = new CategoryModel({
      title,
      text,
      image,
      slug: slugToDb,
      user: userID,
    });

    const category = await doc.save();

    res.status(201).json(category);
  } catch (error) {
    console.log("Create category error: " + error);
    res.status(500).json({
      message: "Create category error",
      error,
    });
  }
};

// Update Category --ADMIN
export const updateCategoryById = async (req, res) => {
  const id = req.params.id;
  const { title, text, image, slug } = req.body;

  let slugToDb = await filterSlug(slug, title);

  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      {
        title,
        text,
        image,
        slug: slugToDb,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log("Update category error: " + error);
    res.status(500).json({ message: "Update category error", error });
  }
};

// Remove Category --ADMIN
export const removeCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await CategoryModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Remove category error: " + error);
    res.status(500).json({ message: "Remove category error", error });
  }
};
