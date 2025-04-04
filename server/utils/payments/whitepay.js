import axios from "axios";
import pkg from "crypto-js";
// import OrderModel from "../models/Order.js";

const { HmacSHA256 } = pkg;

const WHITEPAY_API_URL = "https://api.whitepay.com";

const WHITEPAY_API_KEY = process.env.WHITEPAY_API_KEY;
const WHITEPAY_API_SLUG = process.env.WHITEPAY_API_SLUG;
const WHITEPAY_WEBHOOK_TOKEN = process.env.WHITEPAY_WEBHOOK_TOKEN;

//TODO Функция для создания платежа
export const createPaymentCrypto = async (req, res) => {
  const { amount, orderId } = req.body;

  try {
    console.log("START CRYPTO PAY 1 " + amount + " " + orderId);

    const response = await axios.post(
      `${WHITEPAY_API_URL}/private-api/crypto-orders/${WHITEPAY_API_SLUG}`,
      {
        amount: amount,
        currency: "USDT",
        external_order_id: orderId,
        successful_link: `${process.env.URL}/result/${orderId}`,
        failure_link: `${process.env.URL}/result/${orderId}`,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHITEPAY_API_KEY}`,
        },
      }
    );

    console.log("START CRYPTO PAY", response.data);

    try {
      const order = await OrderModel.findOne({ _id: orderId });

      if (!order) {
        console.log("Order not found");
      } else {
        const orderOwner = order.user;

        console.log("Order owner id: " + orderOwner);

        // const orders = await OrderModel.find({ user: orderOwner });
        // for (let element of orders) {
        //   element.paymentId = response.data.order.id;
        //   await element.save();
        // }

        const updatedOrders = await OrderModel.updateMany(
          { user: orderOwner, status: "Pending" },
          { $set: { paymentId: response.data.order.id } }
        );
      }

      console.log("DB order payid update. PayId: " + response.data.order.id);
    } catch (error) {
      console.error("Error updating order payid:", error);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: "Failed to create crypto payment" });
  }
};

export const handleCallbackCrypto = async (req, res) => {
  console.log("WhitePay callback received");
  console.log("Callback data: ", req.body);
  console.log("Callback headers: ", req.headers);

  const payload = req.body;
  const signature = req.headers["signature"];

  const payloadJson = JSON.stringify(req.body);

  const calculatedSignature = HmacSHA256(
    JSON.stringify(req.body).replace(/\//g, "\\/"),
    WHITEPAY_WEBHOOK_TOKEN
  ).toString();

  //   const calculatedSignature = HmacSHA256(payloadJson, WHITEPAY_WEBHOOK_TOKEN).toString();

  console.log("Calculated signature: " + calculatedSignature);
  console.log("Received signature: " + signature);

  const updateOrderStatus = async (status) => {
    try {
      await OrderModel.updateMany(
        { paymentId: payload.order.id },
        { $set: { statusId: status } }
      );
      res.status(200).send("Order status updated successfully");
    } catch (err) {
      console.error(
        "Failed to update order status in database:",
        err.message || err
      );
      res.status(500).send("Internal server error");
    }
  };

  if (signature === calculatedSignature) {
    console.log(
      `Payment status: id=${payload.order.id}, amount=${payload.order.value}, status=${payload.event_type}`
    );

    switch (payload.event_type) {
      case "order::declined":
        await updateOrderStatus(1);
        break;
      case "order::partially_fulfilled":
        await updateOrderStatus(5);
        break;
      case "order::final_amount_was_received":
        await updateOrderStatus(2);
        break;
      case "order::completed":
        await updateOrderStatus(2);
        break;
      default:
        res.status(400).send("Unknown event type");
    }
  } else {
    console.log("Signature is not valid");
    res.status(401).send("Invalid signature");
  }
};

export const getPaymentStatusCrypto = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const response = await axios.get(
      `${WHITEPAY_API_URL}/private-api/crypto-orders/${WHITEPAY_API_SLUG}/${order.paymentId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHITEPAY_API_KEY}`,
        },
      }
    );

    console.log("GET ORDER STATUS CRYPTO PAY", response.data);

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching status crypto payment:", error);
    return res
      .status(500)
      .json({ error: "Error fetching status crypto payment" });
  }
};

/*
 *    declined
 *    partially_fulfilled
 *    final_amount_was_received
 *    completed
 */
