import {
  Client,
  Collection,
  GatewayIntentBits,
  CommandInteraction,
  Interaction,
  AutocompleteInteraction,
  ButtonInteraction,
} from "discord.js";

import { GuildType } from "../utils/types";
import { getGuildByGuildId } from "../database/querys/guild";
import { handleButtonInteraction } from "../utils/buttonHandler";
import { supportButton } from "../utils/utilityButtons";

export class CustomClient extends Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public commands: Collection<string, any>;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
    });
    this.commands = new Collection();
  }

  public setupInteractionHandler() {
    this.on("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
          console.error(
            `No command matching ${interaction.commandName} was found.`
          );
          return;
        }

        const guild = await getGuildByGuildId(interaction.guildId!);

        try {
          await command.execute(
            interaction as CommandInteraction,
            guild as GuildType
          );
        } catch (error) {
          console.error("caught command interaction error: ", error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp(supportButton(error));
          } else {
            await interaction.reply(supportButton(error));
          }
        }
      } else if (interaction.isAutocomplete()) {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
          console.error(
            `No command matching ${interaction.commandName} was found.`
          );
          return;
        }

        const guild = await getGuildByGuildId(interaction.guildId!);

        try {
          await command.autocomplete(
            interaction as AutocompleteInteraction,
            guild as GuildType
          );
        } catch (error) {
          console.error("caught auto-complete interaction error: ", error);
        }
      } else if (interaction.isButton()) {

        // const guild = await getGuildByGuildId(interaction.guildId!);

        try {
          await handleButtonInteraction(
            interaction as ButtonInteraction,
            // guild as GuildType
          );
        } catch (error) {
          console.error("caught button interaction error: ", error);
        }
      } else return;
    });
  }
}
