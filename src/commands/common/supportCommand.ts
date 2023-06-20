import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Request help from our staff!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("https://discord.gg/PrGRP3w");
  },
};
