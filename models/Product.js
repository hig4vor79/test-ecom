import mongoose from "mongoose";
import slugify from "slugify";

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
    description: String,
    sku: {
      type: String,
      default: "",
    },
    image: String,
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is require"],
      minLength: [2, "Slug should have at least 2 chars"],
    },
    durations: [
      {
        name: { type: String, required: true }, // 1 месяц
        price: { type: Number, required: true }, // 65
      },
    ],
    options: [
      {
        name: { type: String, required: true }, // Например, "Размер"
        values: [{ type: String, required: true }], // ["S", "M", "L"]
      },
    ],
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// TODO уникальные slugs
// ProductSchema.pre("save", async function (next) {
//   // Если поле "slug" уже присутствует и оно изменилось, проверяем его
//   if (this.slug && this.isModified("slug")) {
//     // Преобразуем slug в правильный формат (нижний регистр, без специальных символов и пробелов)
//     this.slug = slugify(this.slug, { lower: true, strict: true });

//     // Проверяем, существует ли уже продукт с таким же slug
//     const existingProduct = await this.constructor.findOne({ slug: this.slug });

//     if (
//       existingProduct &&
//       existingProduct._id.toString() !== this._id.toString()
//     ) {
//       let newSlug;
//       let counter = 1;
//       while (existingProduct) {
//         newSlug = `${this.slug}-${counter}`;
//         existingProduct = await this.constructor.findOne({ slug: newSlug });
//         counter++;
//       }

//       this.slug = newSlug;
//     }
//   }

//   next();
// });

const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel };
