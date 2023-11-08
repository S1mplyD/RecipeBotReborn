import { Schema, model, Document } from "mongoose";

interface User {
  userId: string;
  favoriteRecipes: { url: string; date: Date }[];
}

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  userId: { type: String, required: true, unique: true },
  favoriteRecipes: [
    {
      url: { type: String },
      date: { type: Date },
    },
  ],
});

const userModel = model<UserDocument>("userData", userSchema);

export default userModel;
