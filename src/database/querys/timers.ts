import { TimerType } from "../../utils/types";
import timerModel from "../schema/timers.model";
const hourMultiplier = 1000 * 60 * 60;
export async function getAllTimers() {
  const timers: TimerType[] | null = await timerModel.find();
  return timers;
}

export async function createTimer(
  guildId: string,
  channelId: string,
  time: number,
  lang: string
): Promise<TimerType | string> {
  if (time < 1) {
    return "Timer must be at least one hour!";
  } else if (time > 24) {
    return "Timer can't be more than 24 hours";
  } else {
    const newTimer: TimerType | null = await timerModel.create({
      guildId: guildId,
      channelId: channelId,
      lang: lang,
      time: time * hourMultiplier,
      status: true,
    });
    if (newTimer) {
      return newTimer;
    } else {
      return "Failed to create timer";
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
  time: number
): Promise<string | null> {
  if (time < 1) {
    return "Timer must be at least 1 hour";
  } else if (time > 24) {
    return "Timer can't be more than 24 hour";
  } else {
    const update = await timerModel.updateOne(
      { guildId: timer.guildId },
      { time: time * hourMultiplier }
    );
    if (update.modifiedCount < 1) console.log("cannot update");
    return null;
  }
}
