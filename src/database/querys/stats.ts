import statsModel from "../schema/stats.model";
import { statsType } from "../../utils/types";

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
