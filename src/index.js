const { Client, Events, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    // await registerEvents(client, "../events");
    // await registerCommands(client, "../commands");
    await client.login(process.env.BOT_TOKEN);
  }
);

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
