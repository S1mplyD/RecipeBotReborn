import { SlashCommandBuilder } from "discord.js";
import { CommandInteraction } from "discord.js";
import {
  getAllMembersCount,
  getServerNumber,
} from "../../database/querys/guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Get the numbers of people using this bot"),
  async execute(interaction: CommandInteraction) {
    const members: number | Error = await getAllMembersCount();
    const server: number | Error = await getServerNumber();
    if (members instanceof Error)
      await interaction.reply("Some error occurred");
    else
      await interaction.reply({
        content: `${members + ""} users in ${server + ""} servers`,
      });
  },
};
