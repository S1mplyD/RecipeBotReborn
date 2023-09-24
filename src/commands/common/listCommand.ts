import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { checkPermissions } from "../../utils/checkPermissions";
import { cleaned } from "../../utils/listCleaner";
import {
  getCuisineCategories,
  getIngredientsCategory,
} from "../../database/querys/recipe";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("list")
    .setDescription("Show the list of categories")
    .addStringOption((option) =>
      option.setName("type").setDescription("country").setRequired(false),
    ),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const permissionError = checkPermissions(interaction);
    const args = interaction.options.get("type");

    if (!permissionError) {
      const languagePack = loadLanguage(guild.lang);
      if (!args) {
        const categories: string[] | undefined = await cleaned(guild.lang);
        if (categories) {
          let page: number = 0;
          let chunk: number[] = [];
          for (let i = 0; i < categories.length; i += 50) {
            chunk.push(Math.min(50, categories.length - i));
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
          );
          let str = "";
          if (categories.length < 1) str = "No categories found";
          const embedMessage = async (page: number) => {
            for (let i = 0; i < chunk[page]; i++) {
              str += `${i + page * 50 + 1}) ${categories[i + page * 50]}\n`;
            }
            const list = new EmbedBuilder()
              .setTitle(languagePack.code.categoryList.title)
              .setColor(constants.message.color)
              .setDescription(str);
            str = "";
            return list;
          };
          row.components[0].setDisabled(true);
          if (page === totalPages) {
            row.components[1].setDisabled(true);
          }

          await interaction.reply({
            embeds: [await embedMessage(page)],
            components: [row],
            ephemeral: true,
          });
          const filter = (i) =>
            (i.customId === "forward" ||
              i.customId === "backwards" ||
              i.customId === "remove") &&
            i.user.id === interaction.user.id;

          const collector =
            interaction.channel!.createMessageComponentCollector({
              filter,
              time: 180000,
            });

          collector.on("collect", async (i) => {
            try {
              if (i.customId === "forward") {
                page++;
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
                  embeds: [await embedMessage(page)],
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
                  embeds: [await embedMessage(page)],
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
      } else {
        if (typeof args.value === "string") {
          if (args.value.toLowerCase() === "country") {
            const categories: string[] = await getCuisineCategories(guild.lang);

            let str = "";
            if (categories) {
              if (categories.length < 1) str = "No categories found";
              else {
                for (let i = 0; i < categories.length; i++) {
                  str += `${i + 1}) ${categories[i]}\n`;
                }
              }
            }
            const list = new EmbedBuilder()
              .setTitle(languagePack.code.categoryList.title)
              .setColor(constants.message.color)
              .setDescription(str);
            await interaction.deferReply();
            await interaction.editReply({ embeds: [list] });
          } else if (args.value.toLowerCase() === "ingredients") {
            const categories: string[] = await getIngredientsCategory(
              guild.lang,
            );

            let str = "";
            if (categories) {
              if (categories.length < 1) str = "No categories found";
              else {
                for (let i = 0; i < categories.length; i++) {
                  str += `${i + 1}) ${categories[i]}\n`;
                }
              }
            }
            const list = new EmbedBuilder()
              .setTitle(languagePack.code.categoryList.title)
              .setColor(constants.message.color)
              .setDescription(str);
            await interaction.deferReply();
            await interaction.editReply({ embeds: [list] });
          }
        }
      }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
