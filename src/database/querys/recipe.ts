import recipeModel from "../schema/recipe.model";
import { RecipeType } from "../../utils/types";

export async function getCategories(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .distinct("category");
  return categories;
}

/**
 * Function that find a recipe if the value {name} is included in the name or in the description
 * @param name research value
 * @returns RecipeType
 */
export async function getRecipeName(name: string, lang: string) {
  const recipes: RecipeType[] | null = await recipeModel.find({
    $or: [
      { name: { $regex: name, $options: "i" } },
      { desc: { $regex: name, $options: "i" } },
      { category: { $regex: name, $options: "i" } },
    ],
    lang: lang,
  });
  if (recipes.length < 1) return null;
  else return recipes[Math.floor(Math.random() * (recipes.length - 0 + 1)) + 0];
}

export async function getRandomRecipe(lang: string) {
  const recipeNumbers = await recipeModel.find({ lang: lang }).countDocuments();
  const random = Math.floor(Math.random() * recipeNumbers);
  const recipe = await recipeModel.findOne({ lang: lang }).skip(random).lean();
  return recipe;
}
