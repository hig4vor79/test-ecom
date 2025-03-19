import ProductModel from "../models/Product.js";

export const create = async (req, res) => {
  const { title, quantity, price } = req.body;

  try {
    const doc = new ProductModel({
      title,
      quantity,
      price,
    });

    const product = await doc.save();

    res.status("200").json(product);
  } catch (err) {
    console.log("Create product error: " + err);
    res.status(500).json({
      message: "Create product error",
    });
  }
};
