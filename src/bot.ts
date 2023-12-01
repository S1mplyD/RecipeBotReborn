/* eslint-disable @typescript-eslint/no-var-requires */
import { Events } from "discord.js";
import { CustomClient } from "./client/client";
import { config } from "dotenv";
import path, { resolve } from "path";
import fs from "fs";
import mongoose from "mongoose";
import { createGuild, getGuildByGuildId } from "./database/querys/guild";
import { GuildType, StatsType } from "./utils/types";
import guildModel from "./database/schema/guild.model";
import { startAllTimer, stopTimer } from "./utils/timers";
import timerModel from "./database/schema/timers.model";
import { getTimerByGuildId } from "./database/querys/timers";
import {
  createGuildStats,
  updateRemoveGuildStat,
} from "./database/querys/stats";

config({ path: resolve(__dirname, "..", ".env") });

export const client = new CustomClient();
client.setupInteractionHandler();

const foldersPath = path.join(__dirname, "commands");

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    if (file.endsWith(".js") || file.endsWith(".ts")) return file;
  });

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

client.once(Events.ClientReady, async (c) => {

  console.log(`Ready! Logged in as ${c.user.tag}`);

  const gilde = client.guilds.cache;
  gilde.forEach(async (guild) => {
    const guilddb: GuildType | Error = await getGuildByGuildId(guild.id);
    if (guilddb instanceof Error) {
      const addDate = new Date;
      let statsId = "";
      try {
        const newGuildStat: Error | StatsType = await createGuildStats(addDate);
        console.log(newGuildStat);
        if (!(newGuildStat instanceof Error)) {
          statsId = newGuildStat._id;
        }
      } catch (error) {
        console.log(error);
      }
      await createGuild(guild.id, guild.name, guild.memberCount, statsId);
    }
  });
  await startAllTimer(client);
});

client.on("guildCreate", async (guild) => {
  console.log(`bot added to new guild (${guild.id})`);
  const addDate = new Date;
  let statsId = "";
  try {
    const newGuildStat: Error | StatsType = await createGuildStats(addDate);
    console.log(newGuildStat);
    if (!(newGuildStat instanceof Error)) {
      statsId = newGuildStat._id;
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const newGuild: Error | GuildType = await createGuild(
      guild.id,
      guild.name,
      guild.memberCount,
      statsId
    );

    console.log(newGuild);
  } catch (error) {
    console.log(error);
  }
});

client.on("guildDelete", async (guild) => {
  try {
    const timer = await getTimerByGuildId(guild.id);
    if (timer) stopTimer(timer);
    await timerModel.findOneAndDelete({ guildId: guild.id });
    console.log(
      `timer for server with ID: ${guild.id} deleted from database.`
    );
  } catch (error) {
    console.error("Error when trying to delete timer from database:", error);
  }

  const removeDate = new Date;
  try {
    const guildDocument: Error | GuildType = await getGuildByGuildId(guild.id);
    if (!(guildDocument instanceof Error)) {
      await updateRemoveGuildStat(guildDocument.statsId, removeDate);
    }
  } catch {
    console.error(
      `Error when updating removeDate field for guild with ID: ${guild.id}`
    );
  }

  try {
    await guildModel.findOneAndDelete({ guildId: guild.id });
    console.log(
      `bot was removed from server with ID: ${guild.id}, record deleted from database.`
    );
  } catch (error) {
    console.error("Error when trying to delete server record from database:", error);
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL || "", {
    user: process.env.USER_DB,
    pass: process.env.PASSWORD_DB,
  })

  .then(async () => {
    console.log("connected to mongoose");
    client.login(process.env.TOKEN);
  })
  .catch((error) => {
    throw error;
  });
