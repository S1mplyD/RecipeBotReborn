const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandsFolder = fs.readdirSync("./src/commands");
    for (const folder of commandsFolder) {
      const commandsFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const { commands, commandsArray } = client;
      for (const file of commandsFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
      }
    }
  };
};
