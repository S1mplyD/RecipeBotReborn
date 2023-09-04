import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("telegram")
    .setDescription("Find new recipes on the official telegram channel"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "Coming soon!" /*"https://t.me/Recipe20Bot"*/,
      ephemeral: true,
    });
  },
};
