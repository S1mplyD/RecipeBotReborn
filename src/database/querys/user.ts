import { RecipeType, UserType } from "../../utils/types";
import recipeModel from "../schema/recipe.model";
import userModel from "../schema/user.model";

export async function createUser(userId: string) {
  try {
    const user = await userModel.create({
      userId: userId,
      favoriteRecipes: [],
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUser(userId: string) {
  const user: UserType | null = await userModel.findOne({ userId: userId });
  if (!user) return new Error("cannot find user");
  else return user;
}
export async function getAllUserFavorites(userId: string) {
  const user: UserType | null = await userModel.findOne({ userId: userId });
  const favoriteUrlsDates = user?.favoriteRecipes.map((recipe) => ({
    url: recipe.url,
    date: recipe.date,
  }));

  if (favoriteUrlsDates && favoriteUrlsDates.length > 0) {
    const favoriteUrls = favoriteUrlsDates.map((favorite) => favorite.url);
    const recipes: RecipeType[] | null = await recipeModel.find({
      url: { $in: favoriteUrls },
    });

    if (recipes) {
      const recipesWithDate = favoriteUrlsDates.map((favorite) => {
        const matchingRecipe = recipes.find(
          (recipe) => recipe.url === favorite.url
        );

        return {
          recipe: matchingRecipe,
          date: favorite.date,
        };
      });
      return recipesWithDate;
    } else return new Error("no favorites recipes");
  }
}

export async function isRecipeInUserFavorite(userId: string, url: string) {
  const user = await userModel.findOne({ userId: userId });
  if (!user) {
    return new Error("User not found");
  }
  if (user.favoriteRecipes.some((recipe) => recipe.url === url)) {
    return true;
  } else {
    return false;
  }
}

export async function countUserFavorites(userId: string) {
  const user: UserType | null = await userModel.findOne({ userId: userId });
  const favoriteUrlsDates = user?.favoriteRecipes.map((recipe) => ({
    url: recipe.url,
    date: recipe.date,
  }));

  if (!favoriteUrlsDates) {
    throw new Error("favoriteUrlsDates is not defined");
  }

  if (favoriteUrlsDates.length === 0) {
    throw new Error("no favorite recipes");
  }

  if (favoriteUrlsDates.length >= 10) {
    throw new Error("maximum recipes count reached");
  }

  return true;
}

export async function addRecipeToUserFavorite(userId: string, url: string) {
  if (await isRecipeInUserFavorite(userId, url)) {
    return new Error("Recipe already added to favorites");
  }

  try {
    const currentDate = new Date();
    const updateResult = await userModel.updateOne(
      { userId: userId },
      {
        $push: {
          favoriteRecipes: {
            url: url,
            date: currentDate,
          },
        },
      }
    );

    if (updateResult.modifiedCount < 1) {
      return new Error("Cannot add recipe to favorites");
    }

    return true;
  } catch (error) {
    console.error(error);
    return new Error("An error occurred while adding the recipe to favorites");
  }
}

export async function removeRecipeFromFavorite(userId: string, url: string) {
  if (!(await isRecipeInUserFavorite(userId, url))) {
    return new Error("Recipe is not in your favorites");
  }

  const removed = await userModel.updateOne(
    { userId: userId },
    {
      $pull: {
        favoriteRecipes: {
          url: url,
        },
      },
    }
  );

  if (removed.modifiedCount < 1)
    return new Error("cannot remove recipe from favorites");
}
