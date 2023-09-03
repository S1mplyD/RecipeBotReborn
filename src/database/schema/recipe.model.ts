import { Schema, model, Document } from "mongoose";

interface Recipe {
  url: string;
  img: string;
  name: string;
  category: string;
  desc: string;
  lang: string;
  featuredData: string[];
}

interface RecipeDocument extends Recipe, Document {}

const recipeSchema = new Schema<RecipeDocument>({
  url: { type: String, required: true },
  img: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true },
  desc: { type: String, required: true },
  lang: { type: String, required: true },
  featuredData: { type: [String] },
});

const recipeModel = model<RecipeDocument>("recipeData", recipeSchema);

export default recipeModel;
