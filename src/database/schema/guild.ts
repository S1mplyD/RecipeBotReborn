import { Schema, model, Model, Document } from "mongoose";

export interface IGuildSchema {
  guildId: string;
  name: string;
  region: string;
  memberCount: number;
  lang?: string;
  recipe_lang?: string;
  prefix?: string;
  premium?: boolean;
}

export interface guildDoc extends Document {
  guildId: string;
  name: string;
  region: string;
  memberCount: number;
  lang?: string;
  recipe_lang?: string;
  prefix?: string;
  premium?: boolean;
}

const GuildSchema = new Schema({
  guildId: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  name: {
    type: Schema.Types.String,
  },
  region: {
    type: Schema.Types.String,
  },
  memberCount: {
    type: Schema.Types.Number,
  },
  lang: {
    type: Schema.Types.String,
    default: "en",
  },
  recipe_lang: {
    type: Schema.Types.String,
    default: "en",
  },
  premium: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

// Added interface for building model
interface guildInterface extends Model<guildDoc> {
  build(attr: IGuildSchema): guildDoc;
}

GuildSchema.statics.build = (attr: IGuildSchema) => {
  return new Guild(attr);
};

const Guild = model<guildDoc, guildInterface>("Guild", GuildSchema);

export { Guild };
export default Guild;
