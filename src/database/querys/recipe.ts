import recipeModel from "../schema/recipe.model";
import { RecipeType } from "../../utils/types";

export async function getCuisineCategories(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .where("cuisine")
    .ne("")
    .distinct("cuisine");

  return categories;
}

export async function getIngredientsCategory(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .where("ingredients")
    .ne("")
    .distinct("ingredients");

  return categories;
}

export async function getCategories(lang: string) {
  const categories: string[] = await recipeModel
    .find({ lang: lang })
    .where("category")
    .ne("")
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
      { category: { $regex: name, $options: "i" } },
      { name: { $regex: name, $options: "i" } },
      { desc: { $regex: name, $options: "i" } },
      { cuisine: { $regex: name, $options: "i" } },
      { ingredients: { $regex: name, $options: "i" } },
    ],
    lang: lang,
  });
  const priorityRecipes: RecipeType[] = [];
  for (const i of recipes) {
    if (
      i.category.includes(name) ||
      i.cuisine.includes(name) ||
      i.ingredients.includes(name)
    ) {
      for (let j = 0; j < 3; j++) {
        priorityRecipes.push(i);
      }
    } else if (i.name.includes(name)) {
      for (let j = 0; j < 2; j++) {
        priorityRecipes.push(i);
      }
    } else priorityRecipes.push(i);
  }
  // console.log(priorityRecipes);

  if (recipes.length < 1) return null;
  else {
    return priorityRecipes[Math.floor(Math.random() * priorityRecipes.length)];
  }
}

export async function getRandomRecipe(lang: string) {
  const recipeNumbers = await recipeModel.find({ lang: lang }).countDocuments();
  const random = Math.floor(Math.random() * recipeNumbers);
  const recipe = await recipeModel.findOne({ lang: lang }).skip(random);
  return recipe;
}

export async function getRecipeById(id: string) {
  const recipe: RecipeType | null = await recipeModel.findById(id);
  return recipe;
}
