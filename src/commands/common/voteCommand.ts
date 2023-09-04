import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("vote")
    .setDescription("Vote our bot!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "https://top.gg/bot/657369551121678346",
      ephemeral: true,
    });
  },
};
