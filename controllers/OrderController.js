import moment from "moment";

import { OrderModel, ProductModel, UserModel } from "../models/index.js";
import { createPaymentWayForPay } from "../utils/payments/wayforpay.js";
import { createPaymentCrypto } from "../utils/payments/whitepay.js";

const getExpirationDate = (amount, unit) => {
  return moment().add(amount, unit).toDate();
};

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
        return res
          .status(400)
          .json({
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
