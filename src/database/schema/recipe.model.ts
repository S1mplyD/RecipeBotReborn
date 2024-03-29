import { Schema, model, Document } from "mongoose";

interface Recipe {
  url: string;
  img: string;
  name: string;
  category: string;
  ingredients: string[];
  cuisine: string;
  desc: string;
  lang: string;
  featuredData: string[];
  directions: string;
}

interface RecipeDocument extends Recipe, Document {}

const recipeSchema = new Schema<RecipeDocument>({
  url: { type: String, required: true },
  img: { type: String },
  name: { type: String, required: true },
  category: { type: String },
  cuisine: { type: String },
  ingredients: { type: [String] },
  desc: { type: String, required: true },
  lang: { type: String, required: true },
  featuredData: { type: [String] },
  directions: { type: String },
});

const recipeModel = model<RecipeDocument>("recipeData", recipeSchema);

export default recipeModel;
