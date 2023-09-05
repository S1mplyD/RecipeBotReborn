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
    const args = interaction.options.get("lang");
    if (!args) {
      let language = guild.lang;

      const languagePack = loadLanguage(language);

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

      await interaction.reply({ embeds: [langSetEmbed], ephemeral: true });
    } else {
      const newLang = args.value as string;

      if (AviableLanguages.includes(newLang)) {
        await updateGuildLanguage(interaction.guildId!, newLang);
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
          content:
            `Language set to ***${newLang}***  ${LanguageToEmote[newLang]}` ||
            "Language set",
        });
      } else {
        await interaction.reply({
          content: "Error: Cannot edit language",
          ephemeral: true,
        });
      }
    }
  },
};
