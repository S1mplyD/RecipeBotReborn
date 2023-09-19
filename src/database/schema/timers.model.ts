import { Schema, model, Document } from "mongoose";

interface Timer {
  guildId: string;
  channelId: string;
  time: number;
  status: boolean;
  lang: string;
  role: string;
  startedAt: Date;
}

interface TimerDocument extends Timer, Document {}

const timerSchema = new Schema<TimerDocument>({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  time: { type: Number, required: true },
  status: { type: Boolean, required: true }, // if timer is on (true) or off (false)
  lang: { type: String, required: true },
  role: { type: String, required: false },
  startedAt: { type: Date, required: true },
});

const timerModel = model<TimerDocument>("timerData", timerSchema);

export default timerModel;
