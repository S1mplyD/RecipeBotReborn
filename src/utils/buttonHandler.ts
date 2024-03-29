import { ButtonInteraction } from "discord.js";
import { RecipeType, UserType } from "./types";
import {
  addRecipeToUserFavorite,
  countUserFavorites,
  createUser,
  getUser,
  removeRecipeFromFavorite,
} from "../database/querys/user";
import { getRecipeById } from "../database/querys/recipe";
import { setTimeout } from "timers/promises";

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../..", ".env") });

import { VoteClient, VoteClientEvents } from "topgg-votes";
import { checkVoteAndAnswer } from "./checks";
import { supportButton } from "./utilityButtons";
const topGGToken = process.env.TOPGG_TOKEN || "";
const votesClient = new VoteClient({
  token: topGGToken,
});

// Event for vote notifications
votesClient.on(VoteClientEvents.BotVote, ({ userId }) => {
  console.log(`${userId} has voted!`);
});

export async function handleButtonInteraction(
  interaction: ButtonInteraction
  // guild: GuildType
) {
  const buttonId = interaction.customId.split(":");
  console.log(
    "buttonId: ",
    buttonId[0],
    "\nbuttonValue: ",
    buttonId[1],
    "\nbuttonParameter: ",
    buttonId[2]
  );

  const buttonName = buttonId[0];

  const recipe: RecipeType | null = await getRecipeById(buttonId[1]);
  const user: UserType | Error = await getUser(interaction.user.id);

  if (user instanceof Error) await createUser(interaction.user.id);
  const voted = await checkVoteAndAnswer(interaction.user.id);

  if (buttonName === "add_favorite_recipe") {
    if (voted === true) {
      if (!recipe) {
        await interaction.reply("Recipe not found.");
        return;
      }
      const countRecipes: true | string | Error = await countUserFavorites(
        interaction.user.id
      );
      if (countRecipes == true) {
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
      } else if (countRecipes instanceof Error) {
        interaction.reply(supportButton(countRecipes.message));
      } else if (typeof countRecipes === "string") {
        interaction.reply({ content: countRecipes, ephemeral: true });
      }
    } else {
      interaction.reply({
        content: voted,
        ephemeral: true,
      });
    }
  } else if (buttonName === "remove_favorite_recipe") {
    if (voted === true) {
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
    } else {
      interaction.reply({
        content: voted,
        ephemeral: true,
      });
    }
  } else if (buttonName === "vote_bot") {
    await interaction.reply({
      content: "https://top.gg/bot/657369551121678346",
      ephemeral: true,
    });
  } else {
    await setTimeout(2500);
    try {
      await interaction.reply({
        content: "Unknown button clicked.",
        ephemeral: true,
      });
    } catch {
      console.log("button interaction successfully replied");
    }
  }
}
