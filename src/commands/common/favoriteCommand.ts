// import {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   EmbedBuilder,
//   SlashCommandBuilder,
// } from "discord.js";
// import { CommandInteraction } from "discord.js";
// import { GuildType, RecipeType, UserType } from "../../utils/types";
// import {
//   createUser,
//   getAllUserFavourites,
//   getUser,
// } from "../../database/querys/user";
// import constants from "../../utils/constants";

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("favorite")
//     .setDescription("Add a recipe to favorites"),
//   async execute(interaction: CommandInteraction, guild: GuildType) {
//     const user: UserType | Error = await getUser(interaction.user.id);
//     if (user instanceof Error) {
//       await createUser(interaction.user.id);
//     }
//     const recipes: RecipeType[] | Error | undefined =
//       await getAllUserFavourites(interaction.user.id);
//     if (recipes instanceof Error || recipes === undefined || recipes.length < 1)
//       interaction.reply("You have no favorite recipes");
//     else {
//       let page = 0;
//       let chunk: number[] = [];
//       for (let i = 0; i < recipes.length; i += 5) {
//         chunk.push(Math.min(5, recipes.length - i));
//       }
//       const totalPages = chunk.length > 0 ? chunk.length - 1 : 0;
//       const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//         new ButtonBuilder()
//           .setCustomId("backwards")
//           .setEmoji("◀️")
//           .setStyle(ButtonStyle.Secondary),
//         new ButtonBuilder()
//           .setCustomId("forward")
//           .setEmoji("▶️")
//           .setStyle(ButtonStyle.Success)
//       );

//       const embedMessage = async (page) => {
//         let embeds: EmbedBuilder[] = [];
//         console.log(chunk[page]);

//         for (let i = 0; i < chunk[page]; i++) {
//           console.log(recipes[i + page * 5]);

//           const recipeEmbed = new EmbedBuilder()
//             .setTitle(recipes[i + page * 5].name)
//             .setColor(constants.message.color)
//             .setDescription(recipes[i + page * 5].desc);
//           embeds.push(recipeEmbed);
//         }
//         return embeds;
//       };
//       row.components[0].setDisabled(true);
//       if (page === totalPages) {
//         row.components[1].setDisabled(true);
//       }

//       const response = await interaction.reply({
//         embeds: await embedMessage(page),
//         components: [row],
//         ephemeral: true,
//       });
//       const collectorFilter = (i) => i.user.id === interaction.user.id;
//       try {
//         const confirmation = await response.awaitMessageComponent({
//           filter: collectorFilter,
//           time: 60000,
//         });
//         const user: UserType | Error = await getUser(interaction.user.id);
//         if (user instanceof Error) await createUser(interaction.user.id);
//         if (confirmation.customId === "remove") {
//           //   await removeRecipeFromFavourite(interaction.user.id, recipe.url);
//           confirmation.update({
//             content: `Recipe removed`,
//           });
//         } else {
//           interaction.reply("error occurred");
//         }
//       } catch (e) {
//         await interaction.reply({
//           content: "Confirmation not received within 1 minute, cancelling",
//           components: [],
//         });
//       }
//     }
//   },
// };
import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("favorite")
    .setDescription("Manage favorites"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "Coming soon!" /*"https://t.me/Recipe20Bot"*/,
      ephemeral: true,
    });
  },
};
