import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { getRecipeName } from "../../database/querys/recipe";

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

    if(!args){
        const recipeEmbed = new EmbedBuilder()
      .setTitle("Ricetta casuale")
      .setColor(constants.message.color)
      .setDescription("Lorem Ipsum");

      await interaction.reply({ embeds: [recipeEmbed] });
    } else {
    let recipeName = args?.value as string;
    console.log("Recipe Name:", recipeName)
    const name = await getRecipeName(recipeName);
    console.log("db name:", name);
    if (name) {
      const recipeEmbed = new EmbedBuilder()
        .setTitle(name)
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
