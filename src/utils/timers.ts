import { EmbedBuilder } from "discord.js";
import { CustomClient } from "../client/client";
import {
  addStartTime,
  getAllTimers,
  getTimerByGuildId,
  setTimerStatus,
  updateStartTimer,
} from "../database/querys/timers";
import { Interval, RecipeType, TimerType } from "./types";
import constants from "./constants";
const hourMultiplier = 1000 * 60 * 60;
import { getRandomRecipe, getRecipeName } from "../database/querys/recipe";
import { updateTimer } from "../database/querys/timers";

let intervals: Array<Interval> = [];

export async function startAllTimer(client: CustomClient) {
  console.log("[STARTING TIMERS...]");
  const timers: TimerType[] | null = await getAllTimers();
  if (!timers) console.error("no timers");
  if (Array.isArray(timers)) {
    for (const timer of timers) {
      if (timer.time < 1 * hourMultiplier || timer.time > 24 * hourMultiplier) {
        timer.time = 1 * hourMultiplier;
        await updateTimer(timer, timer.time);
      }
      await startTimer(timer, client, timer.status);
    }
  }
}

export async function startTimer(
  timer: TimerType,
  client: CustomClient,
  status: boolean
) {
  let interval: NodeJS.Timeout;

  if (status === true && client.channels.cache.get(timer.channelId)) {
    const channel = await client.channels.fetch(timer.channelId);
    console.log(`channel: ${channel}`);
    console.log("hello");
    let newTimer: TimerType | null = null;
    if (timer.startedAt === undefined) {
      await addStartTime(timer, new Date());
      newTimer = await getTimerByGuildId(timer.guildId);
    }
    const now = new Date();
    const timeLeft = newTimer
      ? newTimer!.time - (now.getTime() - newTimer!.startedAt.getTime())
      : timer.time - (now.getTime() - timer.startedAt.getTime());
    if (timeLeft < 0) {
      if (
        channel &&
        channel.isTextBased() &&
        client.channels.cache.get(timer.channelId)
      ) {
        const recipe: RecipeType | null = timer.category
          ? await getRecipeName(timer.category, timer.lang)
          : await getRandomRecipe(timer.lang);
        timer.category
          ? console.log("getRecipeName")
          : console.log("getRandomRecipe");
        if (!recipe) channel.send("not found");
        else {
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setImage(
              recipe.img != ""
                ? recipe.img
                : "https://images.discordapp.net/avatars/657369551121678346/01263371e45d9b162e86961bcc7f5947.png?size=128"
            )
            .setColor(constants.message.color)
            .setDescription(recipe.desc)
            .setURL(recipe.url);
          try {
            let featuredDataString = "";
            recipe.featuredData.forEach((data, index) => {
              if (index !== 0) {
                featuredDataString += " | ";
              }
              featuredDataString += data;
            });

            const field = {
              name: "Tags:",
              value: featuredDataString,
              inline: true,
            };

            recipeEmbed.addFields(field);
          } catch {
            console.log("no featuredDataString");
          }
          await updateStartTimer(timer);
          await channel.send({ embeds: [recipeEmbed] });
          await stopTimer(timer);
          const newTimer: TimerType | null = await getTimerByGuildId(
            timer.guildId
          );
          await setTimerStatus(newTimer!, true);
          await startTimer(newTimer!, client, true);
        }
      } else stopTimer(timer);
    } else {
      interval = setInterval(async () => {
        if (
          channel &&
          channel.isTextBased() &&
          client.channels.cache.get(timer.channelId)
        ) {
          const recipe: RecipeType | null = timer.category
            ? await getRecipeName(timer.category, timer.lang)
            : await getRandomRecipe(timer.lang);
          timer.category
            ? console.log("getRecipeName")
            : console.log("getRandomRecipe");
          if (!recipe) channel.send("not found");
          else {
            const recipeEmbed = new EmbedBuilder()
              .setTitle(recipe.name)
              .setImage(
                recipe.img != ""
                  ? recipe.img
                  : "https://images.discordapp.net/avatars/657369551121678346/01263371e45d9b162e86961bcc7f5947.png?size=128"
              )
              .setColor(constants.message.color)
              .setDescription(recipe.desc)
              .setURL(recipe.url);
            try {
              let featuredDataString = "";
              recipe.featuredData.forEach((data, index) => {
                if (index !== 0) {
                  featuredDataString += " | ";
                }
                featuredDataString += data;
              });

              const field = {
                name: "Tags:",
                value: featuredDataString,
                inline: true,
              };

              recipeEmbed.addFields(field);
            } catch {
              console.log("no featuredDataString");
            }
            await updateStartTimer(timer);
            await channel.send({ embeds: [recipeEmbed] });
            await stopTimer(timer);
            const newTimer: TimerType | null = await getTimerByGuildId(
              timer.guildId
            );
            await setTimerStatus(newTimer!, true);
            await startTimer(newTimer!, client, true);
          }
        } else stopTimer(timer);
      }, timeLeft as number);
      await setTimerInterval(interval, timer.channelId, timer.guildId);
    }
  }
}

export async function stopTimer(timer: TimerType) {
  clearInterval(await findInterval(timer));
  const newIntervals = intervals.filter(
    (interval) => interval.guildId !== timer.guildId
  );
  intervals = newIntervals;
  await setTimerStatus(timer, false);
}

export async function findInterval(timer: TimerType) {
  const ret: Interval | undefined = intervals.find(
    (el) => el.guildId === timer.guildId
  );
  return ret?.interval as NodeJS.Timeout;
}

export async function setTimerInterval(
  timeout: NodeJS.Timeout,
  timerId: string,
  guildId: string
) {
  const len: number = intervals.length;
  const newInterval: Interval = {
    interval: timeout,
    channelId: timerId,
    guildId: guildId,
  };
  intervals.push(newInterval);

  if (intervals.length <= len) {
    console.error("Cannot add interval to array");
  }
}
