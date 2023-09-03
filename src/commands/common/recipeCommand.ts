import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, RecipeType, UserType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { getRandomRecipe, getRecipeName } from "../../database/querys/recipe";
import {
  addRecipeToUserFavourite,
  createUser,
  getUser,
} from "../../database/querys/user";
import { getUnpackedSettings } from "http2";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recipe")
    .setDescription("Show a Recipe")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The recipe name")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction, guild: GuildType) {
    const args = interaction.options.get("name");

    if (!args) {
      const recipe: RecipeType | null = await getRandomRecipe(guild.lang);
      if (!recipe) interaction.reply("not found");
      else {
        const recipeEmbed = new EmbedBuilder()
          .setTitle(recipe.name)
          .setColor(constants.message.color)
          .setDescription(recipe.desc);

        const button = new ButtonBuilder()
          .setCustomId("add")
          .setLabel("Add")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⭐");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        const response = await interaction.reply({
          embeds: [recipeEmbed],
          components: [row],
        });
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
          const confirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60000,
          });
          const user: UserType | Error = await getUser(interaction.user.id);
          if (user instanceof Error) await createUser(interaction.user.id);
          if (confirmation.customId === "add") {
            await addRecipeToUserFavourite(interaction.user.id, recipe.url);
            confirmation.update({
              content: `Recipe ${recipe.name} added to favorites`,
            });
          } else {
            interaction.reply("error occurred");
          }
        } catch (e) {
          await interaction.reply({
            content: "Confirmation not received within 1 minute, cancelling",
            components: [],
          });
        }
      }
    } else {
      let recipeName = args?.value as string;
      console.log("Recipe Name:", recipeName);
      const recipe = await getRecipeName(recipeName, guild.lang);
      if (recipe) {
        console.log("db name:", recipe.name);
        const recipeEmbed = new EmbedBuilder()
          .setTitle(recipe.name)
          .setColor(constants.message.color)
          .setFields([
            {
              name: "Regular field title",
              value: "Some value here",
            },
            {
              name: "\u200b",
              value: "\u200b",
              inline: false,
            },
            {
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            },
            {
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            },
            {
              name: "Inline field title",
              value: "Some value here",
              inline: true,
            },
          ]);
        //   .setImage(/*IMMAGINE RICETTA*/)
        //   .setURL(/*LINK ALLA RICETTA*/);
        await interaction.reply({ embeds: [recipeEmbed], ephemeral: true });
      } else await interaction.reply("No matching recipe name found");
    }
  },
};
