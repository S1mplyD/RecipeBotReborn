import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Support this project by donating any amount!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("https://www.buymeacoffee.com/RecipeBot");
  },
};
