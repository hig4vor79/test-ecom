import slugify from "slugify";
import { ProductModel } from "../models/index.js";

const filterSlug = async (slug, title) => {
  // Если slug отсутствует, создаем его из title
  let newSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(title, { lower: true, strict: true });

  let uniqueSlug = newSlug;
  let counter = 1;

  // Проверяем уникальность
  while (await ProductModel.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${newSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

export default filterSlug;
