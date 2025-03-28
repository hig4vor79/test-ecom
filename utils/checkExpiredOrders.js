import moment from "moment";

// TODO for big order list
const checkExpiredOrders = async (req, res) => {
  try {
    const now = moment().toDate();
    const expiredOrders = await OrderModel.find({
      "items.expiresAt": { $lte: now },
      status: "active",
    });

    for (const order of expiredOrders) {
      order.status = "expired";
      await order.save();
    }

    console.log(`Expired orders updated: ${expiredOrders.length}`);
  } catch (error) {
    console.error("Error checking expired orders:", error);
  }
};

export default checkExpiredOrders;
