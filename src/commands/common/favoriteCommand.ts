import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandInteraction } from "discord.js";
import { GuildType, RecipeType, UserType } from "../../utils/types";
import {
  createUser,
  getAllUserFavourites,
  getUser,
  removeRecipeFromFavourite,
} from "../../database/querys/user";
import constants from "../../utils/constants";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("favorite")
    .setDescription("Add a recipe to favorites"),
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const user: UserType | Error = await getUser(interaction.user.id);
    if (user instanceof Error) {
      await createUser(interaction.user.id);
    }
    const recipes: RecipeType[] | Error | undefined =
      await getAllUserFavourites(interaction.user.id);
    if (recipes instanceof Error || recipes === undefined)
      interaction.reply("You have no favorite recipes");
    else {
      let embeds: APIEmbed[] = [];
      let components: APIActionRowComponent<APIButtonComponent>[] = [];
      for (let i = 0; i < recipes.length; i++) {
        const recipeEmbed = new EmbedBuilder()
          .setTitle(recipes[i].name)
          .setColor(constants.message.color)
          .setDescription(recipes[i].desc);
        const button = new ButtonBuilder()
          .setCustomId("remove" + i)
          .setLabel("Remove")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("❌");
        embeds.push(recipeEmbed.toJSON() as APIEmbed);
        components.push({
          type: 1,
          components: [button.toJSON() as APIButtonComponent],
        });
      }

      // Combina tutti i bottoni in un'unica riga di azione

      // Invia un'unica risposta contenente il combinedEmbed e l'actionRow
      await interaction.reply({
        embeds: embeds,
        components: components,
      });
      // const collectorFilter = (i) => i.user.id === interaction.user.id;
      // try {
      //   const confirmation = await response.awaitMessageComponent({
      //     filter: collectorFilter,
      //     time: 60000,
      //   });
      //   const user: UserType | Error = await getUser(interaction.user.id);
      //   if (user instanceof Error) await createUser(interaction.user.id);
      //   if (confirmation.customId === "remove") {
      //     //   await removeRecipeFromFavourite(interaction.user.id, recipe.url);
      //     confirmation.update({
      //       content: `Recipe removed`,
      //     });
      //   } else {
      //     interaction.reply("error occurred");
      //   }
      // } catch (e) {
      //   await interaction.reply({
      //     content: "Confirmation not received within 1 minute, cancelling",
      //     components: [],
      //   });
      // }
    }
  },
};
