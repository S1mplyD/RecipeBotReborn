import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  ReactionUserManager,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, RecipeType, UserType } from "../../utils/types";
import constants from "../../utils/constants";
import { getRandomRecipe, getRecipeName } from "../../database/querys/recipe";
import {
  addRecipeToUserFavourite,
  createUser,
  getUser,
} from "../../database/querys/user";
import { getUnpackedSettings } from "http2";
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
    let lang: string | Error = await getGuildLang(guild.guildId);
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
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setImage(recipe.img)
            .setColor(constants.message.color)
            .setDescription(recipe.desc);

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
          } catch {}
          recipeEmbed
            .setURL(recipe.url)
            .setTimestamp()
            .setFooter({
              text: lpcode.category + ": " + recipe.category ?? " ",
              iconURL: constants.botImage,
            });

          // const button = new ButtonBuilder()
          //   .setCustomId("add")
          //   .setLabel("Add")
          //   .setStyle(ButtonStyle.Primary)
          //   .setEmoji("⭐");

          // const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

          const response = await interaction.reply({
            embeds: [recipeEmbed],
            // components: [row],
          });
          // const collectorFilter = (i) => i.user.id === interaction.user.id;
          // try {
          //   const confirmation = await response.awaitMessageComponent({
          //     filter: collectorFilter,
          //     time: 60000,
          //   });
          //   const user: UserType | Error = await getUser(interaction.user.id);
          //   if (user instanceof Error) await createUser(interaction.user.id);
          //   if (confirmation.customId === "add") {
          //     await addRecipeToUserFavourite(interaction.user.id, recipe.url);
          //     confirmation.update({
          //       content: `Recipe ${recipe.name} added to favorites`,
          //     });
          //   } else {
          //     interaction.reply("error occurred");
          //   }
          // } catch (e) {
          //   await interaction.reply({
          //     content: "Confirmation not received within 1 minute, cancelling",
          //     components: [],
          //   });
          // }
        }
      } else {
        let recipeName = args?.value as string;
        console.log("Recipe Name:", recipeName);
        const recipe = await getRecipeName(recipeName, guild.lang);
        if (recipe) {
          if (recipe?.featuredData.length > 0) console.log(" balls");
        }
        if (recipe) {
          console.log("db name:", recipe.name);
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setImage(recipe.img)
            .setColor(constants.message.color)
            .setDescription(recipe.desc)
            .setURL(recipe.url)
            .setTimestamp()
            .setFooter({
              text: "Category: " + recipe.category ?? " ",
              iconURL: constants.botImage,
            });
          await interaction.reply({ embeds: [recipeEmbed] });
        } else await interaction.reply("No matching recipe name found");
      }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
