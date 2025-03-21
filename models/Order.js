import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        variations: {
          name: String,
          price: String,
        },
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
      paymentMethod: {
        type: String,
        enum: ["wayforpay", "whitepay"],
      },
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
