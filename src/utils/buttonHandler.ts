import { ButtonInteraction } from "discord.js";
import { RecipeType, UserType } from "./types";
import {
  addRecipeToUserFavorite,
  createUser,
  getUser,
  removeRecipeFromFavorite,
} from "../database/querys/user";
import { getRecipeById } from "../database/querys/recipe";
import { setTimeout } from "timers/promises";

export async function handleButtonInteraction(
  interaction: ButtonInteraction
  // guild: GuildType
) {
  const buttonId = interaction.customId.split(":");
  console.log("buttonId: ", buttonId[0], "\nbuttonValue: ", buttonId[1]);

  const recipe: RecipeType | null = await getRecipeById(buttonId[1]);
  const user: UserType | Error = await getUser(interaction.user.id);

  if (user instanceof Error) await createUser(interaction.user.id);

  if (buttonId[0] === "add_favorite_recipe") {
    if (!recipe) {
      await interaction.reply("Recipe not found.");
      return;
    }
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
    if (!recipe) {
      await interaction.reply("Recipe not found.");
      return;
    }
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
  } else if (
    buttonId[0] === "category_list_forward" ||
    buttonId[0] === "category_list_backwards"
  ) {
    await setTimeout(2500);
    try {
      await interaction.reply({
        content: "Interaction has expired, use **/list** command again",
        ephemeral: true,
      });
      await setTimeout(10000);
      interaction.deleteReply();
    } catch {
      console.log(`${buttonId[0]} was pressed`);
    }
  } else {
    await setTimeout(2500);
    try {
      await interaction.reply({
        content: "Unknown button clicked.",
        ephemeral: true,
      });
    } catch {
      console.log("interaction already replied");
    }
  }
}
