import recipeModel from "../schema/recipe.model";
import { RecipeType } from "../../utils/types";

export async function getCategories(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .distinct("category");
  return categories;
}

export async function getRecipeName(name: string) {
  const recipe: RecipeType | null = await recipeModel.findOne({
    name: name,
  });
  if (!recipe) return null;
  else return recipe.name;
}
