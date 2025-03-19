import { ProductModel } from "../models/index.js";

// Create Product ---ADMIN
export const create = async (req, res) => {
  const { title, quantity, price } = req.body;

  try {
    const doc = new ProductModel({
      title,
      quantity,
      price,
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

// Get one Product
export const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    res.status(201).json(product);
  } catch (error) {
    console.log("Get single product error: " + error);
    res.status(500).json({
      message: "Get single product error",
      error,
    });
  }
};
