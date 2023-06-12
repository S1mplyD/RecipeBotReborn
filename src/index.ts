import { config } from "dotenv";
import { resolve } from "path";
import { Client, GatewayIntentBits } from "discord.js";
import "./client";

config({ path: resolve(__dirname, "..", ".env") });
