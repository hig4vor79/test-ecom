import { OrderModel, UserModel } from "../models/index.js";
import { createPaymentWayForPay } from "../utils/payments/wayforpay.js";
import { createPaymentCrypto } from "../utils/payments/whitepay.js";

export const create = async (req, res) => {
  const { userId, items, paymentMethod, totalAmount } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // if (paymentMethod == "wayforpay") {
    //   let { transactionId, paymentLink } = createPaymentWayForPay();
    // } else {
    //   let { transactionId, paymentLink } = createPaymentCrypto();
    // }

    let transactionId = "pay-12345";
    let paymentLink = "http://test-link";

    const doc = new OrderModel({
      items,
      userId,
      totalAmount,
      paymentDetails: {
        transactionId,
        paymentMethod,
      },
    });

    const order = await doc.save();

    res.status(200).json({ order, paymentLink });
  } catch (error) {
    console.log("Create order error: " + error);
    res.status(500).json({
      message: "Create order error",
      error,
    });
  }
};
