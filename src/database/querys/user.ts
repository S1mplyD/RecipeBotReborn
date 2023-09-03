import { RecipeType, UserType } from "../../utils/types";
import recipeModel from "../schema/recipe.model";
import userModel from "../schema/user.model";

export async function createUser(userId: string) {
  const user: UserType | null = await userModel.create({ userId: userId });
  if (!user) return new Error("cannot create user");
}

export async function getUser(userId: string) {
  const user: UserType | null = await userModel.findOne({ userId: userId });
  if (!user) return new Error("cannot find user");
  else return user;
}
export async function getAllUserFavourites(userId: string) {
  const user: UserType | null = await userModel.findOne({ userId: userId });
  if (user) {
    const recipes: RecipeType[] | null = await recipeModel.find({
      url: { $in: user.favoriteRecipes },
    });
    if (recipes) return recipes;
    else return new Error("no favorites recipes");
  }
}

export async function addRecipeToUserFavourite(userId: string, url: string) {
  const recipe = await userModel.updateOne(
    { userId: userId },
    { $push: { favoriteRecipes: url } }
  );
  if (recipe.modifiedCount < 1)
    return new Error("cannot add recipe to favorites");
}

export async function removeRecipeFromFavourite(userId: string, url: string) {
  const removed = await userModel.updateOne(
    { userId: userId },
    { $pull: { favoriteRecipes: url } }
  );
  if (removed.modifiedCount < 1)
    return new Error("cannot remove recipe from favorites");
}
