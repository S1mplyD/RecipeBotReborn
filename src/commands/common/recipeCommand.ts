import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, RecipeType } from "../../utils/types";
import constants from "../../utils/constants";
import { getRandomRecipe, getRecipeName } from "../../database/querys/recipe";
import { checkPermissions } from "../../utils/checkPermissions";
import loadLanguage from "../../utils/loadLanguage";
import { getGuildLang } from "../../database/querys/guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("recipe")
    .setDescription("Show a Recipe")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The recipe name")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction, guild: GuildType) {
    const lang: string | Error = await getGuildLang(guild.guildId);
    if (lang instanceof Error) return lang;

    const languagePack = loadLanguage(lang);
    const lpcode = languagePack.code.recipe;

    const args = interaction.options.get("name");
    const permissionError = checkPermissions(interaction);

    if (!permissionError) {
      if (!args) {
        const recipe: RecipeType | null = await getRandomRecipe(guild.lang);

        if (!recipe) interaction.reply("not found");
        else {
          console.log(
            "recipe name: ",
            recipe.name,
            "\nrecipe_id: ",
            recipe._id.toString()
          );
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setColor(constants.message.color)
            .setDescription(recipe.desc);
          if (recipe.img !== "") {
            recipeEmbed.setImage(recipe.img);
          }

          try {
            let featuredDataString = "";
            recipe.featuredData.forEach((data, index) => {
              if (index !== 0) {
                featuredDataString += " | ";
              }
              featuredDataString += data;
            });

            const field = {
              name: lpcode.tags,
              value: featuredDataString,
              inline: true,
            };

            recipeEmbed.addFields(field);
          } catch {
            console.log("no featuredDataString");
          }
          recipeEmbed
            .setURL(recipe.url)
            .setTimestamp()
            .setFooter({
              text: lpcode.category + ": " + recipe.category ?? " ",
            });

          const add_favorite_recipe = new ButtonBuilder()
            .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
            .setLabel("Add")
            .setStyle(ButtonStyle.Primary);

          const remove_favorite_recipe = new ButtonBuilder()
            .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
            .setLabel("Remove")
            .setStyle(ButtonStyle.Secondary);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            add_favorite_recipe,
            remove_favorite_recipe
          );

          await interaction.deferReply();
          await interaction.editReply({
            embeds: [recipeEmbed],
            components: [row],
          });
        }
      } else {
        const recipeName = args?.value as string;
        console.log("Recipe Name:", recipeName);
        const recipe = await getRecipeName(recipeName, guild.lang);
        console.log(recipe);

        if (recipe) {
          console.log("db name:", recipe.name);
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setColor(constants.message.color)
            .setDescription(recipe.desc)
            .setURL(recipe.url)
            .setTimestamp()
            .setFooter({
              text: "Category: " + recipe.category ?? " ",
            });
          if (recipe.img !== "") {
            recipeEmbed.setImage(recipe.img);
          }
          const add_favorite_recipe = new ButtonBuilder()
            .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
            .setLabel("Add")
            .setStyle(ButtonStyle.Primary);

          const remove_favorite_recipe = new ButtonBuilder()
            .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
            .setLabel("Remove")
            .setStyle(ButtonStyle.Secondary);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            add_favorite_recipe,
            remove_favorite_recipe
          );
          await interaction.deferReply();
          await interaction.editReply({
            embeds: [recipeEmbed],
            components: [row],
          });
        } else await interaction.reply("No matching recipe name found");
      }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
