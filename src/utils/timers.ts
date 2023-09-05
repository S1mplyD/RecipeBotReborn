import { EmbedBuilder } from "discord.js";
import { CustomClient } from "../client/client";
import { getAllTimers, setTimerStatus } from "../database/querys/timers";
import { Interval, RecipeType, TimerType } from "./types";
import constants from "./constants";
const hourMultiplier = 1000 * 60 * 60;
import { getRandomRecipe } from "../database/querys/recipe";
import { updateTimer } from "../database/querys/timers";

var intervals: Array<Interval> = [];

export async function startAllTimer(client: CustomClient) {
  console.log("[STARTING TIMERS...]");
  const timers: TimerType[] | null = await getAllTimers();
  if (!timers) console.error("no timers");
  if (Array.isArray(timers)) {
    for (let timer of timers) {
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

  const channel = await client.channels.fetch(timer.channelId);
  if (status === true) {
    interval = setInterval(async () => {
      if (channel && channel.isTextBased()) {
        const recipe: RecipeType | null = await getRandomRecipe(timer.lang);
        if (!recipe) channel.send("not found");
        else {
          const recipeEmbed = new EmbedBuilder()
            .setTitle(recipe.name)
            .setImage(recipe.img)
            .setColor(constants.message.color)
            .setDescription(recipe.desc);
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
          } catch {}

          await channel.send({ embeds: [recipeEmbed] });
        }
      }
    }, timer.time as number);
    await setTimerInterval(interval, timer.channelId, timer.guildId);
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
