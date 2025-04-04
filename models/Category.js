import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Category Title"],
      minLength: [2, "Title should have at least 2 chars"],
    },
    text: {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export { CategoryModel };
