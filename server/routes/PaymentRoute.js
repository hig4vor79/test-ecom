import express from "express";
import { handleCallbackWayForPay } from "../utils/payments/wayforpay";

const router = express.Router();

router.route("/payment/collback/wayforpay").post(handleCallbackWayForPay);

export { router };
