import { ButtonInteraction } from "discord.js";
import { GuildType, RecipeType, UserType } from "./types";
import {
  addRecipeToUserFavorite,
  createUser,
  getUser,
  removeRecipeFromFavorite,
} from "../database/querys/user";
import { getRecipeById } from "../database/querys/recipe";

export async function handleButtonInteraction(
  interaction: ButtonInteraction,
  guild: GuildType
) {
  const buttonId = interaction.customId.split(":");
  console.log(
    "buttonId: ",
    buttonId[0],
    "\nbuttonValue: ",
    buttonId[1]
  );
  const recipe: RecipeType | null = await getRecipeById(buttonId[1]);

  if (!recipe) {
    await interaction.reply("Recipe not found.");
    return;
  }

  const user: UserType | Error = await getUser(interaction.user.id);
  if (user instanceof Error) await createUser(interaction.user.id);

  if (buttonId[0] === "add_favorite_recipe") {
    const addRecipe = await addRecipeToUserFavorite(
      interaction.user.id,
      recipe.url
    );
    if (addRecipe instanceof Error) {
      interaction.reply({ content: addRecipe.message, ephemeral: true });
    } else {
      interaction.reply({
        content: `Recipe **${recipe.name}** added to favorites`,
        ephemeral: true,
      });
    }
  } else if (buttonId[0] === "remove_favorite_recipe") {
    try {
      const removeRecipe = await removeRecipeFromFavorite(
        interaction.user.id,
        recipe.url
      );
      if (removeRecipe instanceof Error) {
        interaction.reply({ content: removeRecipe.message, ephemeral: true });
      } else {
        interaction.reply({
          content: `Recipe **${recipe.name}** removed from favorites`,
          ephemeral: true,
        });
      }
    } catch {
      interaction.reply({
        content: `Recipe **${recipe.name}** is not in your favorites`,
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({
      content: "Unknown button clicked.",
      ephemeral: true,
    });
  }
}
