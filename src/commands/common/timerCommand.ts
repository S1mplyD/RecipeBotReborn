import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
// const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js"); //Buttons integration WIP
import { GuildType, TimerType } from "../../utils/types";
import { startTimer, stopTimer } from "../../utils/timers";
import {
  createTimer,
  getTimerByGuildId,
  setTimerStatus,
  updateTimer,
} from "../../database/querys/timers";
import { client } from "../..";

const hourMultiplier = 1000 * 60 * 60;
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) // Requires the "ManageChannels" permission to see the command (eg: Mods)
    .setName("timer")
    .setDescription("Send a random timed recipe")
    .addStringOption((option) => {
      option
        .setName("time")
        .setDescription("Time (in hours), on or off")
        .setRequired(false);
      return option;
    }),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    //Buttons integration WIP
    // ------------------------------------------------------------------------------
    // const yes_button = new ButtonBuilder()
    //   .setCustomId("yes")
    //   .setLabel("Yes")
    //   .setStyle(ButtonStyle.Primary);
    // const no_button = new ButtonBuilder()
    //   .setCustomId("no")
    //   .setLabel("No")
    //   .setStyle(ButtonStyle.Secondary);
    // const row = new ActionRowBuilder().addComponents(yes_button, no_button);
    // ------------------------------------------------------------------------------

    const args = interaction.options.get("time");

    // Check if command has arguments
    if (!args) {
      const timer = await getTimerByGuildId(interaction.guildId!);

      // If the guild already has a timer, reply with its time. (1)
      if (timer) {
        const reply =
          timer.time / hourMultiplier == 1
            ? `Current timer is set to ${timer.time / hourMultiplier} hour`
            : `Current timer is set to ${timer.time / hourMultiplier} hours`;
        interaction.reply({ content: reply, ephemeral: true });
      }
      // (1) Otherwise, prompt to add a timer
      else
        interaction.reply({
          content:
            "No timer set. please add a time amount (in hours) after the `/timer` command",
          ephemeral: true,
        });
    } else {
      // Command has no arguments
      const timer = await getTimerByGuildId(interaction.guildId!);

      if (typeof args.value === "string") {
        const lowerCaseArgs = args.value.toLowerCase();

        if (lowerCaseArgs === "off") {
          // ##########################
          // ###   SET TIMER OFF    ###
          // ##########################

          // And check if guild has a timer
          if (timer) {
            await stopTimer(timer);
            interaction.reply({ content: "Timer stopped", ephemeral: true });
          } else interaction.reply({ content: "No timer found", ephemeral: true }); // Guild has no timer
        } else if (lowerCaseArgs === "on") {
          // ##########################
          // ###    SET TIMER ON    ###
          // ##########################

          // And check if guild has a timer
          if (timer) {
            await setTimerStatus(timer, true);
            await startTimer(timer, client, true);
            interaction.reply({ content: "Timer started", ephemeral: true });
          } else interaction.reply({ content: "No timer found", ephemeral: true }); // Guild has no timer
        }
        // All other cases where timer is neither "off" nor "on" -> "args" is a number
        else {
          if (!timer) {
            // ##########################
            // ###  CREATE NEW TIMER  ###
            // ##########################

            try {
              const newTimer = await createTimer(
                interaction.guildId!,
                interaction.channelId,
                args.value as unknown as number,
                guild.lang
              );

              if (typeof newTimer == "string")
                // Creation ERROR (input time was less than 1 or more than 24)
                interaction.reply({ content: newTimer, ephemeral: true });
              else {
                // Creation SUCCESSFUL (input time was more than 1 and less than 24)
                await startTimer(newTimer, client, true);
                interaction.reply({
                  content: "timer started",
                  ephemeral: true,
                });
              }
            } catch {
              interaction.reply({
                content: `Value **${args.value}** is not a valid timer argument`,
                ephemeral: true,
              });
            }
          } else {
            // ######################
            // ###  UPDATE TIMER  ###
            // ######################

            try {
              const updatedTimer = await updateTimer(
                timer,
                args.value as unknown as number
              );
              if (updatedTimer)
                // Creation ERROR (input time was less than 1 or more than 24)
                interaction.reply({ content: updatedTimer, ephemeral: true });
              else {
                // Creation SUCCESSFUL (input time was more than 1 and less than 24)
                const newTimer: TimerType | null = await getTimerByGuildId(
                  timer.guildId
                );

                // Start the updated timer
                await startTimer(newTimer!, client, true);
                if (timer) {
                  const reply =
                    args.value == "1"
                      ? `Timer set to ${args.value} hour`
                      : `Timer set to ${args.value} hours`;
                  interaction.reply({
                    content: reply,
                    ephemeral: true,
                    /*components: [row]*/  //Buttons integration WIP
                  }); 
                }
              }
            } catch {
              interaction.reply({
                content: `value "${args.value}" is not a valid timer argument`,
                ephemeral: true
              });
            }
          }
        }
      }
    }
  },
};
