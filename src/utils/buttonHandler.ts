import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { RecipeType, UserType } from "./types";
import {
  addRecipeToUserFavorite,
  createUser,
  getUser,
  removeRecipeFromFavorite,
  getAllUserFavorites,
} from "../database/querys/user";
import { getRecipeById } from "../database/querys/recipe";
import { setTimeout } from "timers/promises";

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../..", ".env") });

import { VoteClient, VoteClientEvents } from "topgg-votes";
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
  console.log("buttonId: ", buttonId[0], "\nbuttonValue: ", buttonId[1]);

  const recipe: RecipeType | null = await getRecipeById(buttonId[1]);
  const user: UserType | Error = await getUser(interaction.user.id);

  if (user instanceof Error) await createUser(interaction.user.id);

  if (buttonId[0] === "add_favorite_recipe") {
    if (!recipe) {
      await interaction.reply("Recipe not found.");
      return;
    }

    const voted = await checkVoteAndAnswer(interaction.user.id);

    if (voted === true) {
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
    } else {
      interaction.reply({
        content: voted,
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
  } else if (buttonId[0] === "vote_bot") {
    await interaction.reply({
      content: "https://top.gg/bot/657369551121678346",
      ephemeral: true,
    });
  } else if (buttonId[0] === "favorite_remove") {
    const recipes:
      | Error
      | { recipe: RecipeType | undefined; date: Date }[]
      | undefined = await getAllUserFavorites(interaction.user.id);
    if (recipes instanceof Error || recipes === undefined || recipes.length < 1)
      interaction.reply("You have no favorite recipes");
    else {
      
      const actionRow = buttonList(recipes);
      
      await interaction.reply({
        content: "Favorite remove button clicked",
        ephemeral: true,
        components: actionRow,
      });
    }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkVoteAndAnswer(user) {
  const voted = false; // TODO: REMOVE BOOL
  // await votesClient.hasVoted(interaction.user.id);

  if (voted) {
    console.log("User has voted!");
    return true;
  } else {
    console.log("User has not voted!");

    const content =
      "Looks like you haven't voted the bot yet\n[Click here](https://top.gg/bot/657369551121678346/vote) to go to the voting page";

    return content;
  }
}


function buttonList(recipes) {
  const actionRow: ActionRowBuilder<ButtonBuilder>[] = [];
  recipes.forEach((recipeData) => {
    const actionButton = new ActionRowBuilder<ButtonBuilder>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recipe, date } = recipeData;
    const button = new ButtonBuilder()
      .setCustomId(recipe.url) 
      .setLabel(recipe.name) 
      .setStyle(ButtonStyle.Secondary); 
    actionButton.addComponents(button);
    actionRow.push(actionButton);
  });

  return actionRow;
}