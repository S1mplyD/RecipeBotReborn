import { Events } from "discord.js";
import { CustomClient } from "./client/client";
import { config } from "dotenv";
import path, { resolve } from "path";
import fs from "fs";
import mongoose from "mongoose";

config({ path: resolve(__dirname, "..", ".env") });

const client = new CustomClient();
client.setupInteractionHandler();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts" || ".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL || "", {
    user: process.env.USER_DB,
    pass: process.env.PASSWORD_DB,
  })

  .then(() => {
    console.log("connected to mongoose");
    client.login(process.env.TOKEN);
  })
  .catch((error) => {
    throw error;
  });
