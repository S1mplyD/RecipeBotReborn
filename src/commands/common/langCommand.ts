import {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
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
    .setName("lang")
    .setDescription("Set the bot language")
    .addStringOption((option) => {
      option
        .setName("lang")
        .setDescription("The language to set")
        .setRequired(false);

      // Aggiungi le scelte basate sulle lingue disponibili
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
    console.log("Command executed");
    const args = interaction.options.get("lang");
    console.log("Args:", args);

    if (!args) {
      let language = interaction.guildLocale as string;
      if (language === "en-US") language = "en";

      const languagePack = loadLanguage(language);

      const langSetEmbed = new EmbedBuilder()
        .setColor(constants.message.color)
        .setDescription(languagePack.code.languages.title)
        Object.entries(langs).forEach(([langCode, langInfo]) => {
          const field = {
            name: langInfo.name,
            value: `\`/lang ${langCode}\``,
            inline: true,
          };
          langSetEmbed.addFields(field);
        });
      // Aggiungi altre opzioni di lingua qui

      await interaction.reply({ embeds: [langSetEmbed] });
    } else {
      const newLang = args.value as string;
      console.log(newLang);

      if (AviableLanguages.includes(newLang)) {
        // Aggiorna il linguaggio nella base di dati del server
        await updateGuildLanguage(interaction.guildId!, newLang);
        await interaction.reply({
          content: LanguageToEmote[newLang] || "✅",
          ephemeral: true,
        });
      } else {
        await interaction.reply({ content: "❌", ephemeral: true });
      }
    }
  },
};
