import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Product Title"],
      minLength: [2, "Title should have at least 2 chars"],
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    defaultPrice: {
      type: Number,
      default: 1,
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
    image: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is require"],
      minLength: [2, "Slug should have at least 2 chars"],
    },
    durations: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    options: [
      {
        name: { type: String, required: true, default: "" },
        values: [{ type: String, required: true, default: "" }],
      },
    ],
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel };
