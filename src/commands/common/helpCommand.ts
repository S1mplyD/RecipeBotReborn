import { Message, EmbedBuilder, CommandInteraction } from "discord.js";
import { GuildType } from "../../utils/types";
import loadLanguage from "../../utils/loadLanguage";
import constants from "../../utils/constants";
import { SlashCommandBuilder } from "discord.js";
import { getGuildLang } from "../../database/querys/guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show RecipeBot commands"),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    let lang: string | Error = await getGuildLang(guild.guildId);
    if (lang instanceof Error) return lang;
    // if (lang === "en-US") lang = "en";

    const languagePack = loadLanguage(lang!);
    // console.log(interaction.user.id); id dell'utente che ha eseguito il comando

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "RecipeBot", iconURL: constants.botImage })
      .setTitle("RecipeBot commands")
      .setColor(constants.message.color)
      .addFields(
        {
          name: languagePack.help.help.Name,
          value: languagePack.help.help.Value,
        },
        {
          name: languagePack.help.randomRecipe.Name,
          value: languagePack.help.randomRecipe.Value,
        },
        {
          name: languagePack.help.specificRecipe.Name,
          value: languagePack.help.specificRecipe.Value,
        },
        {
          name: languagePack.help.listAvaiableLanguages.Name,
          value: languagePack.help.listAvaiableLanguages.Value,
        },
        {
          name: languagePack.help.changeBotLanguage.Name,
          value: languagePack.help.changeBotLanguage.Value,
        },
        {
          name: languagePack.help.changeRecipeLanguage.Name,
          value: languagePack.help.changeRecipeLanguage.Value,
        },
        {
          name: languagePack.help.changePrefix.Name,
          value: languagePack.help.changePrefix.Value,
        },
        {
          name: languagePack.help.timerAdd.Name,
          value: languagePack.help.timerAdd.Value,
        },
        {
          name: languagePack.help.timerOff.Name,
          value: languagePack.help.timerOff.Value,
        },
        {
          name: languagePack.help.categoryList.Name,
          value: languagePack.help.categoryList.Value,
        },
        {
          name: languagePack.help.showFavoriteList.Name,
          value: languagePack.help.showFavoriteList.Value,
        },
        {
          name: languagePack.help.support.Name,
          value: languagePack.help.support.Value,
        },
        {
          name: languagePack.help.donate.Name,
          value: languagePack.help.donate.Value,
        },
        {
          name: languagePack.help.telegram.Name,
          value: languagePack.help.telegram.Value,
        }
      )
      .setFooter({ text: languagePack.help.footer });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
