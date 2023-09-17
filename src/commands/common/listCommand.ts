import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { getCategories } from "../../database/querys/recipe";
import { checkPermissions } from "../../utils/checkPermissions";
import { cleaned } from "../../utils/listCleaner";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("list")
    .setDescription("Show the list of categories")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Country | Cuisine")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const permissionError = checkPermissions(interaction);
    const args = interaction.options.get("type");

    if (!permissionError) {
      const languagePack = loadLanguage(guild.lang);

      // const categories = await getCategories(guild.lang);
      const categories: string[] | undefined = await cleaned(guild.lang);
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
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
