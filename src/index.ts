import { ShardingManager } from "discord.js";
import { config } from "dotenv";
import path, { resolve } from "path";
import AutoPoster from "topgg-autoposter";

config({ path: resolve(__dirname, "..", ".env") });

const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
  totalShards: "auto",
  token: process.env.TOKEN
});

manager.on("shardCreate", async (shard) => {
  console.log(`Launched shard ${shard.id}`);
  shard.on("error", (error) => console.log(error));
});

if (process.env.CLIENT_ID == "657369551121678346") {
  const topGGToken = process.env.TOPGG_TOKEN || "";
  const poster = AutoPoster(topGGToken, manager);

  poster.on("posted", (stats) => {
    console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
  });

  poster.on("error", (err) => {
    console.error("Error posting stats to Top.gg:", err);
  });
}

manager.spawn();
