import {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { GuildType } from "../../utils/types";
import constants, {
  AviableLanguages,
  LanguageToEmote,
} from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { updateGuildLanguage } from "../../database/querys/guild";
import langs from "../../languages/index";
import { changeTimerLang } from "../../database/querys/timers";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) // Requires the "ManageChannels" permission to see the command (eg: Mods)
    .setName("lang")
    .setDescription("Set the bot and recipes language")
    .addStringOption((option) => {
      option
        .setName("lang")
        .setDescription("The language to set")
        .setRequired(false);

      Object.entries(langs).forEach(([langCode, langInfo]) => {
        const field = {
          name: langInfo.name,
          value: langCode,
        };
        option.addChoices(field);
      });

      return option;
    }),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const language = guild.lang;
    const languagePack = loadLanguage(language);
    const lpcode = languagePack.code.languages;

    const args = interaction.options.get("lang");
    if (!args) {
      const langSetEmbed = new EmbedBuilder()
        .setColor(constants.message.color)
        .setDescription(languagePack.code.languages.title);
      Object.entries(langs).forEach(([langCode, langInfo]) => {
        const field = {
          name: langInfo.name,
          value: `\`/lang ${langCode}\``,
          inline: true,
        };
        langSetEmbed.addFields(field);
      });
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ embeds: [langSetEmbed] });
    } else {
      const newLang = args.value as string;

      if (language != newLang) {
        if (AviableLanguages.includes(newLang)) {
          await updateGuildLanguage(interaction.guildId!, newLang);
          await changeTimerLang(newLang, interaction.guildId!);
          await interaction.deferReply({ ephemeral: true });
          await interaction.editReply({
            content:
              `${lpcode.set} ***${newLang}***  ${LanguageToEmote[newLang]}` ||
              lpcode.setAlt,
          });
        } else {
          await interaction.deferReply({ ephemeral: true });
          await interaction.editReply({
            content: lpcode.error,
          });
        }
      } else {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
          content:
            `${lpcode.same} ***${newLang}***  ${LanguageToEmote[newLang]}` ||
            lpcode.setAlt,
        });
      }
    }
  },
};
