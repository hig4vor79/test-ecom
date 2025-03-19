import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number,
        duration: Number,
        expiresAt: Date,
        productStatus: {
          type: String,
          enum: ["pending", "active", "expired"],
          default: "pending",
        },
      },
    ],
    userId: mongoose.Schema.Types.ObjectId,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "active", "expired", "cancelled"],
      default: "pending",
    },
    paymentDetails: {
      transactionId: String,
      paymentMethod: String,
      status: String, // success, failed, pending
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export { OrderModel };
