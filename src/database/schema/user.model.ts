import { Schema, model, Document } from "mongoose";

interface User {
  userId: string;
  favoriteRecipes: string[];
}

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  userId: { type: String, required: true, unique: true },
  favoriteRecipes: { type: [String] },
});

const userModel = model<UserDocument>("userData", userSchema);

export default userModel;
