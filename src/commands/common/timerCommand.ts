import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
// const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js"); //Buttons integration WIP
import { GuildType, TimerType } from "../../utils/types";
import { startTimer, stopTimer } from "../../utils/timers";
import {
  changeTimerRole,
  createTimer,
  getTimerByGuildId,
  setTimerStatus,
  updateTimer,
} from "../../database/querys/timers";
import { client } from "../..";
import { checkPermissions } from "../../utils/checkPermissions";
import loadLanguage from "../../utils/loadLanguage";
import { getGuildLang } from "../../database/querys/guild";

const hourMultiplier = 1000 * 60 * 60;

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) // Requires the "ManageChannels" permission to see the command (eg: Mods)
    .setName("timer")
    .setDescription("Send a random timed recipe")
    .addStringOption((option) => {
      option
        .setName("time")
        .setDescription("Time (in hours), on or off")
        .setRequired(false);
      return option;
    })
    .addRoleOption((role) =>
      role
        .setName("role")
        .setDescription("Select a role to tag. Leave empty to clear role tag")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    let lang: string | Error = await getGuildLang(guild.guildId);
    if (lang instanceof Error) return lang;

    const languagePack = loadLanguage(lang);
    const lpcode = languagePack.code.timer;

    const timeArg = interaction.options.get("time");
    const roleArg = interaction.options.get("role");
    const roleId = roleArg?.role?.id;
    // console.log("roleArg: ", roleId, " ", typeof roleId);
    // console.log("timeArg: ", timeArg?.value, " ", typeof timeArg?.value);
    const permissionError = checkPermissions(interaction);

    if (!permissionError) {
      // Check if command has no time specified (/timer ...)
      if (!timeArg) {
        const timer = await getTimerByGuildId(interaction.guildId!);

        // If the guild already has a timer, reply with its time
        if (timer) {
          let reply = "";

          // If a role was specifed (/timer @everyone) updates the timer role
          if (roleArg) {
            changeTimerRole(roleId as string, timer.guildId);
            reply = `${lpcode.current.role} <@&${timer.role}>`;
          } else {
            // No time or role argument was specified, return the current timer info
            let timer_status = "off";
            timer.status == false
              ? (timer_status = "off")
              : (timer_status = "on");

            reply =
              timer.time / hourMultiplier == 1
                ? // prettier-ignore
                  // Eg. "Current timer is set to 1 hour and is currently off"
                  ` ${lpcode.current.name}\n${lpcode.current.interval} ***${timer.time / hourMultiplier}  ${lpcode.current.valueOne}*** | ${lpcode.current.status} ***${timer_status}***` + 
                      ((timer.role == undefined || timer.role == "" ) ? "" : ` | ${lpcode.current.role} <@&${timer.role}>`)
                : // prettier-ignore
                  // Eg. "Current timer is set to 4 hours and is currently off"
                  ` ${lpcode.current.name}\n${lpcode.current.interval} ***${timer.time / hourMultiplier}  ${lpcode.current.valueMany}*** | ${lpcode.current.status} ***${timer_status}***` + 
                      ((timer.role == undefined || timer.role == "" ) ? "" : ` | ${lpcode.current.role} <@&${timer.role}>`);
          }
          await interaction.deferReply({ ephemeral: true });
          await interaction.editReply({ content: reply });
        }
        else {
          // The guild has not a timer already set in db, prompt user to add a timer'

          await interaction.deferReply({ ephemeral: true });
          await interaction.editReply({
            content: lpcode.empty.name, // Eg. "No timer set. please add a time amount (in hours) after the `/timer` command"
          });
        }
      } else {
        // Command has time argument (and/or may have role argument too)
        const timer = await getTimerByGuildId(interaction.guildId!);

        // If the time argument is a string, check if the string value is "on" or "off" (cases like "hello" will be managed lastly).
        if (typeof timeArg.value === "string") {
          const lowerCaseArgs = timeArg.value.toLowerCase();

          if (lowerCaseArgs === "off") {
            // ##########################
            // ###   SET TIMER OFF    ###
            // ##########################

            // And check if guild has a timer
            if (timer) {
              await stopTimer(timer);
              await interaction.deferReply({ ephemeral: true });
              interaction.editReply({
                content: lpcode.stopped, // Eg. "Timer stopped"
              });
            } else {
              await interaction.deferReply({ ephemeral: true });
              await interaction.editReply({
                content: lpcode.started, // Eg. "Timer started"
              }); // Guild has no timer
            }
          } else if (lowerCaseArgs === "on") {
            // ##########################
            // ###    SET TIMER ON    ###
            // ##########################

            // And check if guild has a timer
            if (timer) {
              await setTimerStatus(timer, true);
              await startTimer(timer, client, true);
              await interaction.deferReply({ ephemeral: true });
              await interaction.editReply({
                content: lpcode.started, // Eg. "Timer started"
              });
            } else {
              await interaction.deferReply({ ephemeral: true });
              await interaction.editReply({
                content: lpcode.notFound, // Eg. "Timer not found"
              }); // Guild has no timer
            }
          }
          // Timer is neither "off" nor "on" -> "timeArg" is a number (or an invalid string, which will be catched and ruturn "invalid argument")
          else {
            if (!timer) {
              // ##########################
              // ###  CREATE NEW TIMER  ###
              // ##########################

              try {
                const newTimer = await createTimer(
                  interaction.guildId!,
                  interaction.channelId,
                  timeArg.value as unknown as number,
                  guild.lang,
                  roleId as unknown as string
                );

                if (typeof newTimer == "string") {
                  // Creation ERROR (input time was less than 1 or more than 24)
                  await interaction.deferReply({ ephemeral: true });
                  await interaction.reply({ content: newTimer });
                } else {
                  // Creation SUCCESSFUL (input time was more than 1 and less than 24)
                  await startTimer(newTimer, client, true);
                  await interaction.deferReply({ ephemeral: true });
                  await interaction.editReply({
                    content: lpcode.started, // Eg. "Timer started"
                  });
                }
              } catch {
                interaction.reply({
                  content: `${lpcode.invalid.name} **"${timeArg.value}"** ${lpcode.invalid.value}`, // Eg. "Value "A" is not a valid timer argument"
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
                  timeArg.value as unknown as number
                );
                if (updatedTimer) {
                  // Creation ERROR (input time was less than 1 or more than 24)
                  await interaction.deferReply({ ephemeral: true });
                  await interaction.editReply({
                    content: updatedTimer,
                  });
                } else {
                  // Creation SUCCESSFUL (input time was more than 1 and less than 24)
                  const newTimer: TimerType | null = await getTimerByGuildId(
                    timer.guildId
                  );

                  // Update role if there is one, remove role if just time is specified
                  if (roleArg) changeTimerRole(roleId as string, timer.guildId);
                  else changeTimerRole("", timer.guildId);

                  // Start the updated timer
                  await stopTimer(timer);
                  await setTimerStatus(newTimer!, true);
                  await startTimer(newTimer!, client, true);
                  if (timer) {
                    const reply =
                      timeArg.value == "1"
                        ? // prettier-ignore
                          // Eg. "Current timer is set to 1 hour and is currently off"
                          ` ${lpcode.current.set} ${lpcode.current.interval} ***${timeArg.value}  ${lpcode.current.valueOne}***` + 
                      (roleArg == undefined ? "" : ` | ${lpcode.current.role} <@&${roleId}>`)
                        : // prettier-ignore
                          // Eg. "Current timer is set to 4 hours and is currently off"
                          ` ${lpcode.current.set} ${lpcode.current.interval} ***${timeArg.value}  ${lpcode.current.valueMany}***` + 
                      (roleArg == undefined ? "" : ` | ${lpcode.current.role} <@&${roleId}>`);
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({
                      content: reply,
                    });
                  }
                }
              } catch {
                interaction.reply({
                  // Eg. "Value "A" is not a valid timer argument"
                  content: `${lpcode.invalid.name} **"${timeArg.value}"** ${lpcode.invalid.value}`,
                  ephemeral: true,
                });
              }
            }
          }
        }
      }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
