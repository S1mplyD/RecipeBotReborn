import statsModel from "../schema/stats.model";
import { serverCountType, statsType } from "../../utils/types";
import serverCountModel from "../schema/timeSeries.model";

export async function createGuildStats(addDate: string) {
  console.log(`addDate: ${addDate}`);
  const statsData: statsType | null = await statsModel.create({
    addDate: addDate,
    removeDate: "",
  });
  if (!statsData) return new Error("cannot create 'add' date stat");
  else return statsData;
}

export async function updateRemoveGuildStat(
  documentId: string,
  removeDate: string
) {
  const document: statsType | null = await statsModel.findOne({
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
  const stats: statsType | null = await statsModel.findById(id);
  return stats;
}

export async function createServerCountTimeSeries() {
  console.log("counting Servers...");
  const date = await new Date;
  const serverCountData: serverCountType | null = await serverCountModel.create({
    servers: 0,
    timeStamp: date,
  });
  if (!serverCountData) return new Error("Error while creating serverCount stat");
  else return serverCountData;
}
