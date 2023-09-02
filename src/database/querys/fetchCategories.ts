import { Recipe } from "../../database/schema/recipe";

export async function fetchCategories(language = "en"): Promise<Array<string>> {
  const categories = (await Recipe.find({ lang: language }).distinct(
    "category"
  )) as Array<string>;
  return categories;
}
