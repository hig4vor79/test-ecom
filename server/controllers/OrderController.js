import { OrderModel, ProductModel, UserModel } from "../models/index.js";
import getExpirationDate from "../utils/getExpirationDate.js";
import { createPaymentWayForPay } from "../utils/payments/wayforpay.js";
import { createPaymentCrypto } from "../utils/payments/whitepay.js";

// Create Order
export const create = async (req, res) => {
  const { items, userId, paymentMethod } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not found` });
      }

      const duration = product.durations.find(
        (d) => d._id.toString() === item.durationId
      );
      if (!duration) {
        return res.status(400).json({
          message: `Duration ${item.durationId} not found for product ${item.productId}`,
        });
      }

      const expiresAt = getExpirationDate(duration.amount, duration.unit);

      orderItems.push({
        productId: product._id,
        price: duration.price,
        duration: {
          amount: duration.amount,
          unit: duration.unit,
          price: duration.price,
        },
        expiresAt,
        productStatus: "pending",
      });

      totalAmount += parseFloat(duration.price);
    }

    let transactionId = "";
    let paymentData = {};

    if (paymentMethod === "wayforpay") {
      let { paymentId, data } = await createPaymentWayForPay();
      transactionId = paymentId;
      paymentData = data;
    } else if (paymentMethod === "whitepay") {
      let { paymentId, data } = await createPaymentCrypto();
      transactionId = paymentId;
      paymentData = data;
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const order = new OrderModel({
      items: orderItems,
      userId,
      totalAmount,
      status: "pending",
      paymentDetails: {
        transactionId,
        paymentMethod,
        status: "pending",
      },
    });

    await order.save();
    res.status(200).json({ order, paymentData });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Create order error", error });
  }
};

// Get one Order
export const getOrderById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await ProductModel.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.log("Get single Order error: " + error);
    res.status(500).json({
      message: "Get single Order error",
      error,
    });
  }
};

// Get all Orders --ADMIN
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().exec();

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.log("Get all orders error: " + error);
    res.status(500).json({
      message: "Get all orders error",
      error,
    });
  }
};

// Remove Order --ADMIN
export const removeOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedOrder = await OrderModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Remove Order error: " + error);
    res.status(500).json({ message: "Remove Order error", error });
  }
};

//TODO Update Order --ADMIN
export const updateOrderById = async (req, res) => {
  const id = req.params.id;
  const { items, status, paymentDetails, totalAmount } = req.body;

  try {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      {
        items,
        userId,
        totalAmount,
        status,
        paymentDetails
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Update order error", error });
  }
};

//TODO Get Order by User
export const getUserOrders = async (req, res) => {};
