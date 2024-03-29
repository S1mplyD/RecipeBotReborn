import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("donate")
    .setDescription("Support this project by donating any amount!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "https://www.buymeacoffee.com/RecipeBot",
      ephemeral: true,
    });
  },
};
