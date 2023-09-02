import {
  Client,
  Collection,
  GatewayIntentBits,
  CommandInteraction,
  Interaction,
} from "discord.js";

import { GuildType } from "../utils/types";
import { getGuildByGuildId } from "../database/querys/guild";

export class CustomClient extends Client {
  public commands: Collection<string, any>;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
    this.commands = new Collection();
  }

  public setupInteractionHandler() {
    this.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      const guild = await getGuildByGuildId(interaction.guildId!);

      try {
        //TODO check server permission
        await command.execute(
          interaction as CommandInteraction,
          guild as GuildType
        );
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }
}
