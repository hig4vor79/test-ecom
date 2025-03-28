import { ProductModel } from "../models/index.js";
import filterSlug from "../utils/filterSlug.js";

// Get all Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().exec();

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.log("Get all products error: " + error);
    res.status(500).json({
      message: "Get all products error",
      error,
    });
  }
};

// Get one Product
export const getProductBySlug = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await ProductModel.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.log("Get single product error: " + error);
    res.status(500).json({
      message: "Get single product error",
      error,
    });
  }
};

// Create Product --ADMIN
export const create = async (req, res) => {
  const {
    title,
    quantity,
    defaultPrice,
    description,
    sku,
    image,
    slug,
    durations,
    options,
  } = req.body;

  try {
    let slugToDb = await filterSlug(slug, title);

    const doc = new ProductModel({
      title,
      quantity,
      defaultPrice,
      description,
      sku,
      image,
      slug: slugToDb,
      durations,
      options,
    });

    const product = await doc.save();

    res.status(201).json(product);
  } catch (error) {
    console.log("Create product error: " + error);
    res.status(500).json({
      message: "Create product error",
      error,
    });
  }
};

// Update Product --ADMIN
export const updateProductById = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    quantity,
    defaultPrice,
    description,
    sku,
    image,
    slug,
    durations,
    options,
  } = req.body;

  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        title,
        quantity,
        defaultPrice,
        description,
        sku,
        image,
        slug,
        durations,
        options,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.log("Update product error: " + error);
    res.status(500).json({ message: "Update product error", error });
  }
};

// Remove Product --ADMIN
export const removeProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Remove product error: " + error);
    res.status(500).json({ message: "Remove product error", error });
  }
};
