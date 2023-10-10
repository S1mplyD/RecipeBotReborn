import { Schema, model, Document } from "mongoose";

interface statsDatas {
  addDate: string;
  removeDate: string;
}

interface statsDocument extends statsDatas, Document {}

const statsSchema = new Schema<statsDocument>({
  addDate: { type: String },
  removeDate: { type: String },
});

const statsModel = model<statsDocument>(
  "stats",
  statsSchema
);

export default statsModel;