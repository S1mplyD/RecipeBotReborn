import { EmbedBuilder, CommandInteraction } from "discord.js";
import { GuildType } from "../../utils/types";
import loadLanguage from "../../utils/loadLanguage";
import constants from "../../utils/constants";
import { SlashCommandBuilder } from "discord.js";
import { getGuildLang } from "../../database/querys/guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("help")
    .setDescription("Show RecipeBot commands"),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const lang: string | Error = await getGuildLang(guild.guildId);
    if (lang instanceof Error) return lang;

    const languagePack = loadLanguage(lang);
    const lpcode = languagePack.code.help;

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "RecipeBot", iconURL: constants.botImage })
      .setTitle("RecipeBot commands")
      .setColor(constants.message.color)
      .addFields(
        {
          name: lpcode.help.Name,
          value: lpcode.help.Value,
        },
        {
          name: lpcode.randomRecipe.Name,
          value: lpcode.randomRecipe.Value,
        },
        {
          name: lpcode.specificRecipe.Name,
          value: lpcode.specificRecipe.Value,
        },
        {
          name: lpcode.listAvaiableLanguages.Name,
          value: lpcode.listAvaiableLanguages.Value,
        },
        {
          name: lpcode.changeBotLanguage.Name,
          value: lpcode.changeBotLanguage.Value,
        },
        {
          name: lpcode.timer.Name,
          value: lpcode.timer.Value,
        },
        {
          name: lpcode.categoryList.Name,
          value: lpcode.categoryList.Value,
        },
        // {
        //   name: lpcode.showFavoriteList.Name,
        //   value: lpcode.showFavoriteList.Value,
        // },
        {
          name: lpcode.support.Name,
          value: lpcode.support.Value,
        },
        {
          name: lpcode.donate.Name,
          value: lpcode.donate.Value,
        },
        {
          name: lpcode.telegram.Name,
          value: lpcode.telegram.Value,
        }
      )
      .setFooter({ text: languagePack.code.help.footer });
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({ embeds: [helpEmbed] });
  },
};
