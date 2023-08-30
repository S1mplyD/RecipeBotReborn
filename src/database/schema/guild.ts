import { Schema, model, Document } from "mongoose";

interface Guild {
  guildId: string;
  name: string;
  region: string;
  memberCount: number;
  lang: string;
  recipe_lang: string;
  premium: boolean;
}

interface GuildDocument extends Guild, Document {}

const guildSchema = new Schema<GuildDocument>({
  guildId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  memberCount: { type: Number },
  lang: { type: String },
  recipe_lang: { type: String },
  premium: { type: Boolean, required: true, default: false },
});

const guildModel = model<GuildDocument>("guildData", guildSchema);

export default guildModel;
