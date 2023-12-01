import statsModel from "../schema/stats.model";
import { ServerCountType, StatsType } from "../../utils/types";
import serverCountModel from "../schema/timeSeries.model";

export async function createGuildStats(addDate: Date) {
  console.log(`addDate: ${addDate}`);
  const statsData: StatsType | null = await statsModel.create({
    addDate: addDate,
    removeDate: "",
  });
  if (!statsData) return new Error("cannot create 'add' date stat");
  else return statsData;
}

export async function updateRemoveGuildStat(
  documentId: string,
  removeDate: Date
) {
  const document: StatsType | null = await statsModel.findOne({
    _id: documentId,
  });
  console.log(`documentId: ${documentId}`);
  console.log(`document found: ${document}`);
  console.log(`removeDate: ${removeDate}`);
  if (document) {
    await statsModel.updateOne({ _id: documentId }, { removeDate: removeDate });
  } else {
    return new Error("Document not found");
  }
}

export async function getStatsDocumentById(id: string) {
  const stats: StatsType | null = await statsModel.findById(id);
  return stats;
}

export async function createServerCountTimeSeries() {
  console.log("counting Servers...");
  const date = await new Date;
  const serverCountData: ServerCountType | null = await serverCountModel.create({
    servers: 0,
    timeStamp: date,
  });
  if (!serverCountData) return new Error("Error while creating serverCount stat");
  else return serverCountData;
}
