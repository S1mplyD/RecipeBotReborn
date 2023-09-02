import {
  SlashCommandBuilder,
  EmbedBuilder,
  CommandInteraction,
} from "discord.js";
import { Guild, guildDoc } from "../../database/schema/guild";
import constants, {
  AviableLanguages,
  LanguageToEmote,
} from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lang")
    .setDescription("Set the bot language")
    .addStringOption(
      (option) =>
        option
          .setName("lang")
          .setDescription("The language to set")
          .setRequired(false)
          .addChoices(
            { name: "Italian", value: "it" },
            { name: "English", value: "en" }
          )
      // Aggiungi altre opzioni di lingua qui
    ),
  async execute(interaction: CommandInteraction, guild) {
    const args = interaction.options.get("lang");
    console.log(args);

    if (!args) {
      let language = interaction.guildLocale as string;
      if (language === "en-US") language = "en";

      const languagePack = loadLanguage(language);

      const langSetEmbed = new EmbedBuilder()
        .setColor(constants.message.color)
        .setDescription(languagePack.languages.title)
        .addFields({
          name: "**ITALIAN**",
          value: `\`${guild.prefix}lang it\``,
          inline: true,
        })
        .addFields({
          name: "**ENGLISH**",
          value: `\`${guild.prefix}lang en\``,
          inline: true,
        });
      // Aggiungi altre opzioni di lingua qui

      await interaction.reply({ embeds: [langSetEmbed] });
    } else {
      const newLang = args.value as string;
      if (AviableLanguages.includes(newLang)) {
        // Aggiorna il linguaggio nella base di dati del server
        await Guild.findOneAndUpdate(
          { guildId: interaction.guildId },
          { lang: newLang }
        );
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
