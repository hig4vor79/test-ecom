import { OrderModel } from "../models/index.js";

export const create = async (req, res) => {
  const { userId, items, paymentMethod, totalAmount } = req.body;

  try {

    
    const doc = new OrderModel({
        items,
      quantity,
      price,
      durations,
    });

    const order = await doc.save();

    res.status(200).json(order);
  } catch (error) {
    console.log("Create order error: " + error);
    res.status(500).json({
      message: "Create order error",
      error,
    });
  }
};
