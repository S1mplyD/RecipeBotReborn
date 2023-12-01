import { Schema, model, Document } from "mongoose";

interface statsDatas {
  addDate: Date;
  removeDate: Date;
}

interface statsDocument extends statsDatas, Document {}

const statsSchema = new Schema<statsDocument>({
  addDate: { type: Date },
  removeDate: { type: Date },
});

const statsModel = model<statsDocument>(
  "stats",
  statsSchema
);

export default statsModel;