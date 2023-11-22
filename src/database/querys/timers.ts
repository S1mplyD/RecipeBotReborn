/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimerType } from "../../utils/types";
import timerModel from "../schema/timers.model";
import loadLanguage from "../../utils/loadLanguage";
import { getGuildLang } from "../../database/querys/guild";

const hourMultiplier = 1000 * 60 * 60;

export async function getAllTimers() {
  const timers: TimerType[] | null = await timerModel.find();
  return timers;
}

export async function createTimer(
  guildId: string,
  channelId: string,
  time: number,
  category: string,
  lang: string
): Promise<TimerType | string> {
  const languagePack = loadLanguage(lang);
  const lpcode = languagePack.code.timerError;

  if (time < 1) {
    return lpcode.less;
  } else if (time > 24) {
    return lpcode.more;
  } else {
    const newTimer: TimerType | null = await timerModel.create({
      guildId: guildId,
      channelId: channelId,
      lang: lang,
      time: time * hourMultiplier,
      category: category,
      status: true,
      startedAt: new Date(),
    });
    if (newTimer) {
      return newTimer;
    } else {
      return lpcode.failure;
    }
  }
}

export async function getTimerByGuildId(guildId: string) {
  const timer: TimerType | null = await timerModel.findOne({
    guildId: guildId,
  });
  return timer;
}

export async function setTimerStatus(timer: TimerType, status: boolean) {
  const update = await timerModel.updateOne(
    { channelId: timer.channelId },
    { status: status }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
  else console.log("timer status updated");
}

export async function getTimerStatus(timer: TimerType) {
  const timerT: TimerType | null = await timerModel.findOne({
    guildId: timer.guildId,
  });
  if (timerT) return timerT.status;
}

export async function updateTimer(
  timer: TimerType,
  time?: number,
  category?: string
): Promise<string | null> {
  const lang: string | Error = await getGuildLang(timer.guildId);
  if (lang instanceof Error) return lang.message;

  const languagePack = loadLanguage(lang);
  const lpcode = languagePack.code.timerError;

  if (time && time < 1) {
    return lpcode.less;
  } else if (time && time > 24) {
    return lpcode.more;
  } else {
    const update: Record<string, any> = {};

    if (typeof time !== "undefined") {
      update.time = time * hourMultiplier;
    }
    update.category = category || "";
    await timerModel.updateOne({ guildId: timer.guildId }, update);
    if (update.modifiedCount < 1) console.log("cannot update");
    return null;
  }
}

export async function changeTimerLang(lang: string, guildId: string) {
  const update = await timerModel.updateOne(
    { guildId: guildId },
    { lang: lang }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
  else return null;
}

export async function addStartTime(timer: TimerType, date: Date) {
  const newDate = new Date(date.getTime() - (timer.time - 600000));

  const update = await timerModel.updateOne(
    { channelId: timer.channelId },
    { startedAt: newDate }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
  else return null;
}

export async function updateStartTimer(timer: TimerType) {
  const update = await timerModel.updateOne(
    { guildId: timer.guildId },
    { startedAt: new Date() }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
  else return null;
}

export async function changeTimerChannel(channelId: string, guildId: string) {
  const update = await timerModel.updateOne(
    { guildId: guildId },
    { channelId: channelId }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
  else return channelId;
}