import { Schema, model, Model, Document } from "mongoose";

interface MRecipeSchema {
  url: string;
  name: string;
  category: string;
  desc: string;
  lang: string;
  img: string;
}

export interface RecipeDoc extends Document {
  url: string;
  name: string;
  category: string;
  desc: string;
  lang: string;
  img: string;
}

const RecipeSchema = new Schema({
  url: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  img: {
    type: Schema.Types.String,
  },
  name: {
    type: Schema.Types.String,
    index: true,
  },
  category: {
    type: Schema.Types.String,
  },
  desc: {
    type: Schema.Types.String,
  },
  lang: {
    type: Schema.Types.String,
  },
});

RecipeSchema.index({ name: "text" });

// Added interface for building model
interface guildInterface extends Model<RecipeDoc> {
  build(attr: MRecipeSchema): RecipeDoc;
}

RecipeSchema.statics.build = (attr: MRecipeSchema) => {
  return new Recipe(attr);
};

const Recipe = model<RecipeDoc, guildInterface>("Recipe", RecipeSchema);
export { Recipe };
export default Recipe;
