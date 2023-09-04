import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("support")
    .setDescription("Request help from our staff!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "https://discord.gg/PrGRP3w",
      ephemeral: true,
    });
  },
};
