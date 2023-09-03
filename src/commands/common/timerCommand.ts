import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, TimerType } from "../../utils/types";
import { startTimer, stopTimer } from "../../utils/timers";
import {
  createTimer,
  getTimerByGuildId,
  setTimerStatus,
  updateTimer,
} from "../../database/querys/timers";
import { client } from "../..";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Send a random timed recipe")
    .addStringOption((option) => {
      option.setName("time").setDescription("Time or off").setRequired(false);
      return option;
    }),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const args = interaction.options.get("time");

    if (!args) {
      const timer = await getTimerByGuildId(interaction.guildId!);
      if (timer) interaction.reply(`current timer ${timer.time}`);
      else interaction.reply("add time after command");
    } else {
      console.log(args.type);
      console.log(args.value as number);

      const timer = await getTimerByGuildId(interaction.guildId!);
      if (args.value === "off") {
        if (timer) {
          await stopTimer(timer);
          interaction.reply("Timer stopped");
        } else interaction.reply("no timer found");
      } else if (args.value === "on") {
        if (timer) {
          await setTimerStatus(timer, true);
          await startTimer(timer, client, true);
          interaction.reply("timer started");
        }
      } else {
        if (!timer) {
          const newTimer = await createTimer(
            interaction.guildId!,
            interaction.channelId,
            args.value as number,
            guild.lang
          );
          if (newTimer instanceof Error)
            interaction.reply("Timer must be at least 1 hour!");
          else {
            await startTimer(newTimer, client, true);
            interaction.reply("timer started");
          }
        } else {
          await updateTimer(timer, args.value as number);
          await stopTimer(timer);
          const newTimer: TimerType | null = await getTimerByGuildId(
            timer.guildId
          );
          await startTimer(newTimer!, client, true);
          interaction.reply("timer updated");
        }
      }
    }
  },
};
