import { Schema, model } from "mongoose";

interface serverCountDatas{
  servers: number;
  timeStamp: Date;
}

interface serverCountDocument extends serverCountDatas, Document {}

const serverCountSchema = new Schema<serverCountDocument>(
  {
    servers: { type: Number, required: true },
    timeStamp: { type: Date, required: true },
  },
  {
    timeseries: {
      timeField: "timeStamp",
      granularity: "minutes",
    },
  }
);
const serverCountModel = model<serverCountDocument>("serverCount", serverCountSchema);

export default serverCountModel;
