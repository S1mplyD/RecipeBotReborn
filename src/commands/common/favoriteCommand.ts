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
//   removeRecipeFromFavourite,
// } from "../../database/querys/user";
// import constants from "../../utils/constants";

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setDMPermission(false) // Command will not work in dm
//     .setName("favorite")
//     .setDescription("Add a recipe to favorites"),
//   async execute(interaction: CommandInteraction, guild: GuildType) {
//     const user: UserType | Error = await getUser(interaction.user.id);
//     if (user instanceof Error) {
//       await createUser(interaction.user.id);
//     }
//     const recipes: RecipeType[] | Error | undefined =
//       await getAllUserFavourites(interaction.user.id);
//     if (recipes instanceof Error || recipes === undefined)
//       interaction.reply("You have no favorite recipes");
//     else {
//       let embeds: EmbedBuilder[] = [];
//       let rows: ActionRowBuilder<ButtonBuilder>[] = [];
//       for (let i = 0; i < recipes.length; i++) {
//         const recipeEmbed = new EmbedBuilder()
//           .setTitle(recipes[i].name)
//           .setColor(constants.message.color)
//           .setDescription(recipes[i].desc);
//         const button = new ButtonBuilder()
//           .setCustomId("remove" + i)
//           .setLabel("Remove")
//           .setStyle(ButtonStyle.Primary)
//           .setEmoji("❌");

//         const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
//         embeds.push(recipeEmbed);
//         rows.push(row);
//       }

//       const response = await interaction.reply({
//         embeds: embeds,
//         components: rows,
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
