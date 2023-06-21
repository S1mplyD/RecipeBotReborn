import { Message, EmbedBuilder, CommandInteraction } from "discord.js";
// import DiscordClient from "../../client/client";
import { guildDoc } from "../../database/schema/guild";
import loadLanguage from "../../utils/loadLanguage";
import constants from "../../utils/constants";
import { SlashCommandBuilder } from "discord.js";

// export default class HelpCommand extends BaseCommand {
//   constructor() {
//     super('help', 'common', []);
//   }

//   async execute (client: DiscordClient, guild: guildDoc, message: Message, args: Array<string>): Promise<void> {
//     const languagePack = loadLanguage(guild.lang);
//     const help = new EmbedBuilder()
//       .setAuthor({name: 'RecipeBot', iconURL: constant.botImage})
//       .setTitle('RecipeBot commands:')
//       .setColor(constants.message.color)
//       // .setDescription('This bot will send a random recipe every hour \n **Prefix **`' + variables.users_prefix[id_channel] + '`')
//       .addFields({name: languagePack.help.help.Name, value: languagePack.help.help.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name: languagePack.help.randomRecipe.Name, value: languagePack.help.randomRecipe.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.specificRecipe.Name,value:  languagePack.help.specificRecipe.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.listAvaiableLanguages.Name,value:  languagePack.help.listAvaiableLanguages.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.changeBotLanguage.Name, value: languagePack.help.changeBotLanguage.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.changeRecipeLanguage.Name, value: languagePack.help.changeRecipeLanguage.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.changePrefix.Name, value: languagePack.help.changePrefix.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.timerAdd.Name, value: languagePack.help.timerAdd.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.timerOff.Name, value: languagePack.help.timerOff.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.categoryList.Name, value: languagePack.help.categoryList.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.showFavoriteList.Name,value:  languagePack.help.showFavoriteList.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.support.Name, value: languagePack.help.support.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.donate.Name, value: languagePack.help.donate.Value.replace('%s', guild?.prefix || '')})
//       .addFields({name:languagePack.help.telegram.Name, value: languagePack.help.telegram.Value.replace('%s', guild?.prefix || '')})
//       .setFooter({text: languagePack.help.footer});
//     await message.channel.send({embeds: [help]});
//   }
// }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show RecipeBot commands"),
  async execute(interaction: CommandInteraction, guild: guildDoc) {
    console.log(interaction.guildLocale);
    const lang = interaction.guildLocale;

    const languagePack = loadLanguage(lang!);
    const helpEmbed = new EmbedBuilder()
      .setAuthor({ name: "RecipeBot", iconURL: constants.botImage })
      .setTitle("RecipeBot commands")
      .setColor(constants.message.color)
      .addFields(
        {
          name: languagePack.help.help.Name,
          value: languagePack.help.help.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.randomRecipe.Name,
          value: languagePack.help.randomRecipe.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.specificRecipe.Name,
          value: languagePack.help.specificRecipe.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.listAvaiableLanguages.Name,
          value: languagePack.help.listAvaiableLanguages.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.changeBotLanguage.Name,
          value: languagePack.help.changeBotLanguage.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.changeRecipeLanguage.Name,
          value: languagePack.help.changeRecipeLanguage.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.changePrefix.Name,
          value: languagePack.help.changePrefix.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.timerAdd.Name,
          value: languagePack.help.timerAdd.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.timerOff.Name,
          value: languagePack.help.timerOff.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.categoryList.Name,
          value: languagePack.help.categoryList.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.showFavoriteList.Name,
          value: languagePack.help.showFavoriteList.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.support.Name,
          value: languagePack.help.support.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.donate.Name,
          value: languagePack.help.donate.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        },
        {
          name: languagePack.help.telegram.Name,
          value: languagePack.help.telegram.Value.replace(
            "%s",
            guild?.prefix || ""
          ),
        }
      )
      .setFooter({ text: languagePack.help.footer });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};