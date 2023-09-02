import { TimerType } from "../../utils/types";
import timerModel from "../schema/timers.model";

export async function getAllTimers() {
  const timers: TimerType[] | null = await timerModel.find();
  return timers;
}

export async function createTimer(
  guildId: string,
  channelId: string,
  time: number,
  lang: string
) {
  const newTimer: TimerType | null = await timerModel.create({
    guildId: guildId,
    channelId: channelId,
    lang: lang,
    time: time,
    status: true,
  });
  return newTimer;
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

export async function updateTimer(timer: TimerType, time: number) {
  const update = await timerModel.updateOne(
    { guildId: timer.guildId },
    { time: time }
  );
  if (update.modifiedCount < 1) console.log("cannot update");
}
