const { ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, ModalBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import loadLanguage from "../../utils/loadLanguage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Shows RecipeBot settings"),

  async execute(interaction: CommandInteraction, guild: GuildType) {
    const languagePack = loadLanguage(guild.lang);
    const languageInput = new TextInputBuilder()
      .setCustomId("languageInput")
      .setLabel("Set bot's language")
      .setStyle(TextInputStyle.Short);

    const modal = new ModalBuilder()
      .setCustomId("settings")
      .setTitle("RecipeBot Settings");

    const timerInput = new TextInputBuilder()
      .setCustomId("timerInput")
      .setLabel("Set recipes timer in hours")
      .setStyle(TextInputStyle.Short);
    const firstActionRow = new ActionRowBuilder().addComponents(languageInput);
    const secondActionRow = new ActionRowBuilder().addComponents(timerInput);
    
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  },
};
