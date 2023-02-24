import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URL || "",
  {
    user: process.env.USER_DB,
    pass: process.env.PASSWORD_DB,
  },
  async (err) => {
    if (err) throw err;
    console.log("Successfully connected mongoose");
  }
);
