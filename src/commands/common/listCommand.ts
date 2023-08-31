import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { getCategories } from "../../database/querys/recipe";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Show the list of categories"),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const languagePack = loadLanguage(guild.lang);
    const categories = await getCategories(guild.recipe_lang);
    let str = "";
    if (categories.length < 1) str = "No categories found";
    else {
      for (let i = 0; i < categories.length; i++) {
        str += `${i + 1}) ${categories[i]}\n`;
      }
    }

    const list = new EmbedBuilder()
      .setTitle(languagePack.categoryList.title)
      .setColor(constants.message.color)
      .setDescription(str);
    await interaction.reply({ embeds: [list] });
  },
};
