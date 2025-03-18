import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    options: [
      {
        name: { type: String, required: true }, // Например, "Размер"
        values: [{ type: String, required: true }], // ["S", "M", "L"]
      },
    ],
    images: [
      {
        type: String,
        default: "",
      },
    ],
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    price: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
