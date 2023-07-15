import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { guildDoc } from "../../database/schema/guild";
import { fetchCategories } from "../../database/querys/fetchCategories";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Show the list of categories"),
  async execute(interaction: CommandInteraction, guild: guildDoc) {
    const languagePack = loadLanguage(guild.lang);
    const categories = await fetchCategories(guild.recipe_lang);
    let str = "";
    for (let i = 0; i < categories.length; i++) {
      str += `${i + 1}) ${categories[i]}\n`;
    }
    const list = new EmbedBuilder()
      .setTitle(languagePack.categoryList.title)
      .setColor(constants.message.color)
      .setDescription(str);
    await interaction.reply({ embeds: [list] });
  },
};