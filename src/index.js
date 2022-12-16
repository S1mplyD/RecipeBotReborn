const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

mongoose.set("strictQuery", false);

// connetti al db
mongoose.connect(
  process.env.MONGO_URL || "",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.USER_DB,
    pass: process.env.PASSWORD_DB,
  },
  async function (err) {
    if (err) throw err;
    console.log("Successfully connected mongoose");
    // INSERITO QUI PER AVVIARE IL TUTTO DOPO ESSERMI CONNESSO
    client.handleEvents();
    client.handleCommands();
    await client.login(process.env.BOT_TOKEN);
  }
);
