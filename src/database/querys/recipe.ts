import recipeModel from "../schema/recipe.model";

export async function getCategories(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .distinct("category");
  return categories;
}
