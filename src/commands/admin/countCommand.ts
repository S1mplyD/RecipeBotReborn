import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";
import { getServerNumber } from "../../database/querys/guild";
import constants from "../../utils/constants";

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(0) // Hides the command from the list
    .setName("count")
    .setDescription("Get the numbers of people using this bot"),
  async execute(interaction: CommandInteraction) {
    if (constants.adminIds.includes(interaction.user.id)) {
      const server: number = await getServerNumber();

      await interaction.reply({
        content: `${server + ""} servers`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "You cannot use this command",
        ephemeral: true,
      });
    }
  },
};
