import {
  CommandInteraction,
  PermissionFlagsBits,
  AutocompleteInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, TimerType } from "../../utils/types";
import { startTimer, stopTimer } from "../../utils/timers";
import {
  createTimer,
  getTimerByGuildId,
  setTimerStatus,
  updateTimer,
} from "../../database/querys/timers";
import { client } from "../../bot";
import { checkPermissions } from "../../utils/checks";
import loadLanguage from "../../utils/loadLanguage";
import { getGuildLang } from "../../database/querys/guild";
import { cleaned } from "../../utils/listCleaner";

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
    .addStringOption((option) => {
      option
        .setName("category")
        .setDescription("Specify a category")
        .setAutocomplete(true)
        .setRequired(false);
      return option;
    }),

  async autocomplete(interaction: AutocompleteInteraction, guild: GuildType) {
    const categories: string[] | undefined = await cleaned(guild.lang);
    console.log("categories: ", categories);
    const focusedValue = interaction.options.getFocused().toLowerCase();
    if (categories) {
      if (focusedValue) {
        let slicedFiltered;
        const foundCategoryStart = categories.filter((category) =>
          category.toLowerCase().startsWith(focusedValue)
        );
        if (foundCategoryStart.length >= 25) {
          slicedFiltered = foundCategoryStart.slice(0, 25);
        } else {
          const foundCategoryIncludes = categories.filter((category) =>
            category.toLowerCase().includes(focusedValue)
          );

          const uniqueFoundCategoryIncludes = foundCategoryIncludes.filter(
            (category) => !foundCategoryStart.includes(category)
          );

          slicedFiltered = foundCategoryStart.concat(
            uniqueFoundCategoryIncludes.slice(0, 25 - foundCategoryStart.length)
          );
        }

        await interaction.respond(
          slicedFiltered.map((category) => ({
            name: category,
            value: category,
          }))
        );
      } else {
        await interaction.respond([]);
      }
    }
  },

  async execute(interaction: CommandInteraction, guild: GuildType) {
    const lang: string | Error = await getGuildLang(guild.guildId);
    if (lang instanceof Error) return lang;

    const languagePack = loadLanguage(lang);
    const lpcode = languagePack.code.timer;

    const timeArg = interaction.options.get("time");
    const category = interaction.options.get("category");
    const permissionError = checkPermissions(interaction);

    if (!permissionError) {
      // Check if command has arguments

      let foundCategory;
      if (category) {
        // Command has category argument, return category closest to given value, "undefined" if none are found
        if (
          typeof category.value === "string" &&
          isNaN(parseInt(category.value))
        ) {
          const categories: string[] | undefined = await cleaned(guild.lang);
          // console.log("categories: ", categories);
          const categoryValue = category.value.toLowerCase();
          console.log(categoryValue);
          if (categories) {
            foundCategory = categories.filter((category) =>
              category.toLowerCase().startsWith(categoryValue)
            )[0];
            if (foundCategory == undefined) {
              foundCategory = categories.filter((category) =>
                category.toLowerCase().includes(categoryValue)
              )[0];
            }
            console.log("input category: ", categoryValue);
            console.log("found category element: ", foundCategory);
          }
        }
      }

      if (!timeArg) {
        const timer = await getTimerByGuildId(interaction.guildId!);

        // If the guild already has a timer, check if user gave a vaid category, otherwise reply with timer info.
        if (timer) {
          if (foundCategory) {
            // #########################
            // ###  UPDATE CATEGORY  ###
            // #########################

            try {
              const updatedTimer = await updateTimer(
                timer,
                undefined,
                foundCategory
              );
              if (updatedTimer) {
                // Category update ERROR
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({
                  content: updatedTimer,
                });
              } else {
                // Category update SUCCESSFUL
                const newTimer: TimerType | null = await getTimerByGuildId(
                  timer.guildId
                );

                // Start the updated timer
                await stopTimer(timer);
                await setTimerStatus(newTimer!, true);
                await startTimer(newTimer!, client, true);
                if (timer) {
                  const timer_status = timer.status == false ? "off" : "on";
                  const reply = `${lpcode.current.updated}\n${
                    lpcode.current.interval
                  } **${timer.time / hourMultiplier} ${
                    timer.time / hourMultiplier === 1
                      ? lpcode.current.valueOne
                      : lpcode.current.valueMany
                  }** | ${lpcode.current.status} **${timer_status}**${
                    foundCategory && foundCategory !== ""
                      ? ` | ${lpcode.current.category} **${foundCategory}**`
                      : ""
                  }`;
                  await interaction.deferReply({ ephemeral: true });
                  await interaction.editReply({ content: reply });
                }
              }
            } catch {
              interaction.reply({
                // Eg. "Value "A" is not a valid timer argument"
                content: `${lpcode.invalid.name} **"${foundCategory}"** ${lpcode.invalid.value}`,
                ephemeral: true,
              });
            }
          } else if (!foundCategory && category) {
            // Category was given but none found --> Input category was not valid (Eg. "1","!","-", ecc.)
            interaction.reply({
              // Eg. "Value "1" is not a valid timer argument"
              content: `${lpcode.invalid.name} **"${category.value}"** ${lpcode.invalid.value}`,
              ephemeral: true,
            });
          } else {
            // No category field, guild has timer, show timer info
            console.log(timer.category);

            const timer_status = timer.status == false ? "off" : "on";
            const reply = `${lpcode.current.current}\n${
              lpcode.current.interval
            } **${timer.time / hourMultiplier} ${
              timer.time / hourMultiplier === 1
                ? lpcode.current.valueOne
                : lpcode.current.valueMany
            }** | ${lpcode.current.status} **${timer_status}**${
              timer.category && timer.category !== ""
                ? ` | ${lpcode.current.category} **${timer.category}**`
                : ""
            }`;

            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ content: reply });
          }
        }
        // Guild has no timer, prompt to add a timer
        else {
          await interaction.deferReply({ ephemeral: true });
          await interaction.editReply({
            content: lpcode.empty.name, // Eg. "No timer set. please add a time amount (in hours) after the `/timer` command"
          });
        }
      } else {
        // Command has timeArg argument
        const timer = await getTimerByGuildId(interaction.guildId!);

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
          // All other cases where timeArg is neither "off" nor "on"
          else {
            if (!timer) {
              // Guild has no timer set

              // ##########################
              // ###  CREATE NEW TIMER  ###
              // ##########################

              if (!foundCategory && category) {
                // Category was given but none found --> Input category was not valid (Eg. "1","!","-", ecc.)
                interaction.reply({
                  // Eg. "Value "1" is not a valid timer argument"
                  content: `${lpcode.invalid.name} **"${category.value}"** ${lpcode.invalid.value}`,
                  ephemeral: true,
                });
              } else {
                try {
                  const newTimer = await createTimer(
                    interaction.guildId!,
                    interaction.channelId,
                    timeArg.value as unknown as number,
                    foundCategory as unknown as string,
                    guild.lang
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
              }
            } else {
              // Guild has a timer

              // ######################
              // ###  UPDATE TIMER  ###
              // ######################

              if (!foundCategory && category) {
                // Category was given but none found --> Input category was not valid (Eg. "1","!","-", ecc.)
                interaction.reply({
                  // Eg. "Value "1" is not a valid timer argument"
                  content: `${lpcode.invalid.name} **"${category.value}"** ${lpcode.invalid.value}`,
                  ephemeral: true,
                });
              } else {
                try {
                  const updatedTimer = await updateTimer(
                    timer,
                    timeArg.value as unknown as number,
                    foundCategory as unknown as string
                  );
                  if (updatedTimer) {
                    // Time (and possibly Category) update ERROR (input time was less than 1 or more than 24)
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({
                      content: updatedTimer,
                    });
                  } else {
                    // Time (and possibly Category) update SUCCESSFUL (input time was more than 1 and less than 24)
                    const newTimer: TimerType | null = await getTimerByGuildId(
                      timer.guildId
                    );

                    // Start the updated timer
                    await stopTimer(timer);
                    await setTimerStatus(newTimer!, true);
                    await startTimer(newTimer!, client, true);
                    if (timer) {
                      const timer_status = timer.status == false ? "off" : "on";
                      const reply = `${lpcode.current.updated}\n${
                        lpcode.current.interval
                      } **${timeArg.value} ${
                        timeArg.value === "1"
                          ? lpcode.current.valueOne
                          : lpcode.current.valueMany
                      }** | ${lpcode.current.status} **${timer_status}**${
                        foundCategory && foundCategory !== ""
                          ? ` | ${lpcode.current.category} **${foundCategory}**`
                          : ""
                      }`;
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
      }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
