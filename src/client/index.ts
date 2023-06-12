import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.login(process.env.CLIENT_TOKEN).catch((err) => {
  console.error("Login error", err);
  process.exit(1);
});
