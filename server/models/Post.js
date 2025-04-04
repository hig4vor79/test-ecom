import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter Post Title"],
      minLength: [2, "Title should have at least 2 chars"],
    },
    text: {
      type: String,
      default: "",
    },
    viewsCount: {
      type: Number,
      default: 0,
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
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

const PostModel = mongoose.model("Post", PostSchema);

export { PostModel };
