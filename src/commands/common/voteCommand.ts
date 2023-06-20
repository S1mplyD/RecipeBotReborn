import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote our channel!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("https://top.gg/bot/657369551121678346");
  },
};
