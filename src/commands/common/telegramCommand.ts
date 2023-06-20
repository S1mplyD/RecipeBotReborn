import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("telegram")
    .setDescription("Find new recipes on the official telegram channel"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("https://t.me/Recipe20Bot");
  },
};
