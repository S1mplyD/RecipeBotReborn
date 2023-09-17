import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandInteraction } from "discord.js";
import { GuildType, RecipeType, UserType } from "../../utils/types";
import {
  createUser,
  getAllUserFavourites,
  getUser,
} from "../../database/querys/user";
import constants from "../../utils/constants";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("favorite")
    .setDescription("Add a recipe to favorites"),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const user: UserType | Error = await getUser(interaction.user.id);
    if (user instanceof Error) {
      await createUser(interaction.user.id);
    }
    const recipes: RecipeType[] | Error | undefined =
      await getAllUserFavourites(interaction.user.id);
    if (recipes instanceof Error || recipes === undefined || recipes.length < 1)
      interaction.reply("You have no favorite recipes");
    else {
      let page = 0;
      let chunk: number[] = [];
      for (let i = 0; i < recipes.length; i += 5) {
        chunk.push(Math.min(5, recipes.length - i));
      }
      const totalPages = chunk.length > 0 ? chunk.length - 1 : 0;
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("backwards")
          .setEmoji("◀️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("forward")
          .setEmoji("▶️")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("remove")
          .setEmoji("❌")
          .setStyle(ButtonStyle.Secondary)
      );

      const embedMessage = async (page) => {
        let embeds: EmbedBuilder[] = [];
        for (let i = 0; i < chunk[page]; i++) {
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipes[i + page * 5].name)
            .setColor(constants.message.color)
            .setDescription(recipes[i + page * 5].desc)
            .setURL(recipes[i + page * 5].url);
          embeds.push(recipeEmbed);
        }
        return embeds;
      };
      row.components[0].setDisabled(true);
      if (page === totalPages) {
        row.components[1].setDisabled(true);
      }

      const response = await interaction.reply({
        embeds: await embedMessage(page),
        components: [row],
        ephemeral: true,
      });
      const filter = (i) =>
        (i.customId === "forward" ||
          i.customId === "backwards" ||
          i.customId === "remove") &&
        i.user.id === interaction.user.id;

      const collector = interaction.channel!.createMessageComponentCollector({
        filter,
        time: 180000,
      });

      collector.on("collect", async (i) => {
        try {
          if (i.customId === "forward") {
            // page = (page % totalPages) + 1; // wrap around if exceeding last page
            page++; // should move 1 page
            if (page === 0) {
              row.components[0].setDisabled(true);
              row.components[1].setDisabled(false);
            } else if (page === totalPages) {
              row.components[0].setDisabled(false);
              row.components[1].setDisabled(true);
            } else {
              row.components[0].setDisabled(false);
              row.components[1].setDisabled(false);
            }
            await i.deferUpdate();
            await interaction.editReply({
              embeds: await embedMessage(page),
              components: [row],
            });
          }
          if (i.customId === "backwards") {
            page--;
            if (page === 0) {
              row.components[0].setDisabled(true);
              row.components[1].setDisabled(false);
            } else if (page === totalPages) {
              row.components[0].setDisabled(false);
              row.components[1].setDisabled(true);
            } else {
              row.components[0].setDisabled(false);
              row.components[1].setDisabled(false);
            }
            await i.deferUpdate();
            await interaction.editReply({
              embeds: await embedMessage(page),
              components: [row],
            });
          }
          if (i.customId === "remove") {
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  },
};
// import { SlashCommandBuilder } from "discord.js";
// import { CommandInteraction } from "discord.js";

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setDMPermission(false) // Command will not work in dm
//     .setName("favorite")
//     .setDescription("Manage favorites"),
//   async execute(interaction: CommandInteraction) {
//     await interaction.reply({
//       content: "Coming soon!" /*"https://t.me/Recipe20Bot"*/,
//       ephemeral: true,
//     });
//   },
// };
