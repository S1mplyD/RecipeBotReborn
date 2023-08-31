import { EmbedBuilder, CommandInteraction } from "discord.js";
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

    const languagePack = loadLanguage(lang);
    // console.log(interaction.user.id); id dell'utente che ha eseguito il comando

    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "RecipeBot", iconURL: constants.botImage })
      .setTitle("RecipeBot commands")
      .setColor(constants.message.color)
      .addFields(
        {
          name: languagePack.code.help.help.Name,
          value: languagePack.code.help.help.Value,
        },
        {
          name: languagePack.code.help.randomRecipe.Name,
          value: languagePack.code.help.randomRecipe.Value,
        },
        {
          name: languagePack.code.help.specificRecipe.Name,
          value: languagePack.code.help.specificRecipe.Value,
        },
        {
          name: languagePack.code.help.listAvaiableLanguages.Name,
          value: languagePack.code.help.listAvaiableLanguages.Value,
        },
        {
          name: languagePack.code.help.changeBotLanguage.Name,
          value: languagePack.code.help.changeBotLanguage.Value,
        },
        {
          name: languagePack.code.help.changeRecipeLanguage.Name,
          value: languagePack.code.help.changeRecipeLanguage.Value,
        },
        {
          name: languagePack.code.help.changePrefix.Name,
          value: languagePack.code.help.changePrefix.Value,
        },
        {
          name: languagePack.code.help.timerAdd.Name,
          value: languagePack.code.help.timerAdd.Value,
        },
        {
          name: languagePack.code.help.timerOff.Name,
          value: languagePack.code.help.timerOff.Value,
        },
        {
          name: languagePack.code.help.categoryList.Name,
          value: languagePack.code.help.categoryList.Value,
        },
        {
          name: languagePack.code.help.showFavoriteList.Name,
          value: languagePack.code.help.showFavoriteList.Value,
        },
        {
          name: languagePack.code.help.support.Name,
          value: languagePack.code.help.support.Value,
        },
        {
          name: languagePack.code.help.donate.Name,
          value: languagePack.code.help.donate.Value,
        },
        {
          name: languagePack.code.help.telegram.Name,
          value: languagePack.code.help.telegram.Value,
        }
      )
      .setFooter({ text: languagePack.code.help.footer });

    await interaction.reply({ embeds: [helpEmbed],
        ephemeral: true,});
  },
};
