/* eslint-disable @typescript-eslint/no-var-requires */
import { Events } from "discord.js";
import { CustomClient } from "./client/client";
import { config } from "dotenv";
import path, { resolve } from "path";
import fs from "fs";
import mongoose from "mongoose";
import { createGuild, getGuildByGuildId } from "./database/querys/guild";
import { GuildType, statsType } from "./utils/types";
import guildModel from "./database/schema/guild.model";
import { startAllTimer } from "./utils/timers";
import { AutoPoster } from "topgg-autoposter";
import currentDateTime from "./utils/dateTime";
import {
  createGuildStats,
  createServerCountTimeSeries,
  updateRemoveGuildStat,
} from "./database/querys/stats";
import schedule from "node-schedule";

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

schedule.scheduleJob("0 0 * * *", () => {
  console.log("create count file");
}); // run everyday at midnight
schedule.scheduleJob("30 * * * *", () => {
  console.log("write server count");
}); // run every 30 minutes

client.once(Events.ClientReady, async (c) => {
  if (process.env.CLIENT_ID == "657369551121678346") {
    const topGGToken = process.env.TOPGG_TOKEN || "";
    const poster = AutoPoster(topGGToken, client);

    poster.on("posted", (stats) => {
      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
    });

    poster.on("error", (err) => {
      console.error("Error posting stats to Top.gg:", err);
    });
  }

  console.log(`Ready! Logged in as ${c.user.tag}`);
  //Controllo i server che usano il bot
  createServerCountTimeSeries();

  const gilde = client.guilds.cache;
  gilde.forEach(async (guild) => {
    const guilddb: GuildType | Error = await getGuildByGuildId(guild.id);
    if (guilddb instanceof Error) {
      const addDate = await currentDateTime();
      let statsId = "";
      try {
        const newGuildStat: Error | statsType = await createGuildStats(addDate);
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
  const addDate = await currentDateTime();
  let statsId = "";
  try {
    const newGuildStat: Error | statsType = await createGuildStats(addDate);
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
  const removeDate = await currentDateTime();
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
      `Il bot è stato rimosso dalla gilda con ID: ${guild.id}, record eliminato dal database.`
    );
  } catch (error) {
    console.error("Errore durante l'eliminazione del record:", error);
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
