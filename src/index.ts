import { ShardingManager } from "discord.js";
import { config } from "dotenv";
import path, { resolve } from "path";

config({ path: resolve(__dirname, "..", ".env") });

const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
  token: process.env.TOKEN,
});

manager.on("shardCreate", async (shard) => {
  console.log(`Launched shard ${shard.id}`);
  shard.on("error", (error) => console.log(error));
});

manager.spawn();
