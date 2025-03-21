import crypto from "crypto";
import axios from "axios";
// import OrderModel from "../models/Order.js";

const secretKey = process.env.SECRETKEY_WAYFORPAY;
const merchantAccount = process.env.MERCHANT_ACCOUNT;
const merchantDomain = process.env.MERCHANT_DOMAIN;

//TODO Create payment WayForPay
export const createPaymentWayForPay = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const roundedAmount = Number(amount).toFixed(3);
    const payId = generateUUID();

    const orderReference = payId;
    const orderDate = Math.floor(new Date().getTime() / 1000);
    const currency = "USD";
    const productName = ["Mac Mini M2 256GB"];
    const productPrice = [roundedAmount];
    const productCount = ["1"];

    // Формирование массива параметров для подписи
    const paramsToSign = [
      merchantAccount,
      merchantDomain,
      orderReference,
      orderDate,
      roundedAmount,
      currency,
      ...productName,
      ...productCount,
      ...productPrice,
    ];

    // Генерация подписи
    const signature = generateSignature(paramsToSign);

    // Формирование тела запроса
    const requestData = {
      transactionType: "CREATE_INVOICE",
      merchantAccount: merchantAccount,
      merchantDomainName: merchantDomain,
      merchantSignature: signature,
      apiVersion: 1,
      serviceUrl: `${process.env.URL}/api/wayforpay/callback`,
      orderReference,
      orderDate,
      amount: roundedAmount,
      currency,
      productName,
      productPrice,
      productCount,
      language: "en",
    };

    const response = await axios.post(
      "https://api.wayforpay.com/api",
      requestData
    );

    console.log("START WAYFORPAY");
    console.log(response);

    try {
      const order = await OrderModel.findOne({ _id: orderId });

      if (!order) {
        console.log("Order not found");
      } else {
        const orderOwner = order.user;

        console.log("Order owner id: " + orderOwner);

        // Update all orders of this user with status "Pending" and assign the paymentId
        const updatedOrders = await OrderModel.updateMany(
          { user: orderOwner, statusId: 1 }, // Make sure to filter orders with "Pending" status
          { $set: { paymentId: payId } }
        );
      }

      console.log("DB order payid update. PayId: " + payId);
    } catch (error) {
      console.error("Error updating order payid:", error);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).send("Error creating invoice");
  }
};

function generateSignature(params) {
  const concatenatedParams = params.join(";");
  return crypto
    .createHmac("md5", secretKey)
    .update(concatenatedParams)
    .digest("hex");
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// TODO Обработчик для обратного вызова от WAYFORPAY
// export const handleCallbackWayForPay = async (req, res) => {
//   console.log("WAYFORPAY callback received");

//   // Доступ к строке JSON внутри объекта с null-прототипом
//   const rawData = Object.keys(req.body)[0]; // Получаем ключ, который содержит JSON строку

//   // Парсим строку в объект
//   const data = JSON.parse(rawData);

//   const currentTime = Math.floor(Date.now() / 1000);
//   const paramsToSign = [data.orderReference, "accept", currentTime];
//   const signature = generateSignature(paramsToSign);

//   const updateOrderStatus = async (status) => {
//     try {
//       await OrderModel.updateMany(
//         { paymentId: data.orderReference },
//         { $set: { statusId: status } }
//       );
//     } catch (err) {
//       console.error(
//         "Failed to update order status in database:",
//         err.message || err
//       );
//       res.status(500).send("Internal server error");
//     }
//   };

//   const orders = await OrderModel.find({ paymentId: data.orderReference });

//   if (orders.length == 0) {
//     console.log("Product with this payID not find");
//   } else {
//     if (data.transactionStatus == "Approved") {
//       console.log("WAYFORPAY оплата успешна !");
//       await updateOrderStatus(2);
//     } else {
//       console.log("WAYFORPAY оплата не успешна");
//       await updateOrderStatus(5);
//     }
//   }

//   res.status(200).json({
//     orderReference: data.orderReference,
//     status: "accept",
//     time: currentTime,
//     signature: signature,
//   });
// };
