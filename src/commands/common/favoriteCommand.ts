import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  CommandInteraction,
} from "discord.js";
import { RecipeType, UserType } from "../../utils/types";
import {
  createUser,
  getAllUserFavorites,
  getUser,
  removeRecipeFromFavorite,
} from "../../database/querys/user";
import constants from "../../utils/constants";
import { checkVoteAndAnswer } from "../../utils/checks";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("favorite")
    .setDescription("Add a recipe to favorites")
    .addStringOption((option) => {
      option
        .setName("remove")
        .setDescription("Remove")
        .setAutocomplete(true)
        .setRequired(false);
      return option;
    }),
  async autocomplete(interaction: AutocompleteInteraction) {
    const user: UserType | Error = await getUser(interaction.user.id);
    if (user instanceof Error) {
      await createUser(interaction.user.id);
    }
    const recipes:
      | Error
      | { recipe: RecipeType | undefined; date: Date }[]
      | undefined = await getAllUserFavorites(interaction.user.id);
    console.log("categories: ", recipes);
    const focusedValue = interaction.options.getFocused().toLowerCase();
    if (recipes) {
      if (!(!recipes || recipes instanceof Error)) {
        let slicedFiltered;
        const foundFavoriteStart = recipes.filter((favorite) =>
          favorite.recipe?.name.toLowerCase().startsWith(focusedValue)
        );
        if (foundFavoriteStart.length >= 25) {
          slicedFiltered = foundFavoriteStart.slice(0, 25);
        } else {
          const foundFavoriteIncludes = recipes.filter((favorite) =>
            favorite.recipe?.name.toLowerCase().includes(focusedValue)
          );

          const uniqueFoundFavoriteIncludes = foundFavoriteIncludes.filter(
            (favorite) => !foundFavoriteStart.includes(favorite)
          );

          slicedFiltered = foundFavoriteStart.concat(
            uniqueFoundFavoriteIncludes.slice(0, 25 - foundFavoriteStart.length)
          );
        }

        await interaction.respond(
          slicedFiltered.map((favorite) => ({
            name: favorite.recipe?.name,
            value: favorite.recipe?.name,
          }))
        );
      } else {
        await interaction.respond([]);
      }
    }
  },
  async execute(interaction: CommandInteraction) {
    const user: UserType | Error = await getUser(interaction.user.id);
    if (user instanceof Error) {
      await createUser(interaction.user.id);
    }

    const voted = await checkVoteAndAnswer(interaction.user.id);

    const recipes:
      | Error
      | { recipe: RecipeType | undefined; date: Date }[]
      | undefined = await getAllUserFavorites(interaction.user.id);

    if (voted != true) {
      interaction.reply({
        content: voted,
        ephemeral: true,
      });
    } else if (
      recipes instanceof Error ||
      recipes === undefined ||
      recipes.length < 1
    )
      interaction.reply({
        content: "You have no favorite recipes",
        ephemeral: true,
      });
    else {
      const remove = interaction.options.get("remove");
      let foundFavorite;

      if (remove) {
        // Command has category argument, return category closest to given value, "undefined" if none are found
        if (typeof remove.value === "string" && isNaN(parseInt(remove.value))) {
          const favoriteValue = remove.value.toLowerCase();
          if (!(!recipes || recipes instanceof Error)) {
            foundFavorite = recipes.filter((favorite) =>
              favorite.recipe?.name.toLowerCase().startsWith(favoriteValue)
            )[0];
            if (foundFavorite == undefined) {
              foundFavorite = recipes.filter((favorite) =>
                favorite.recipe?.name.toLowerCase().includes(favoriteValue)
              )[0];
            }
            console.log("input favorite: ", favoriteValue);
            console.log("found favorite element: ", foundFavorite.recipe.name);
          }
        }
        try {
          const removeRecipe = await removeRecipeFromFavorite(
            interaction.user.id,
            foundFavorite.recipe.url
          );
          if (removeRecipe instanceof Error) {
            interaction.reply({
              content: removeRecipe.message,
              ephemeral: true,
            });
          } else {
            const add_favorite_recipe = new ButtonBuilder()
              .setCustomId(
                `add_favorite_recipe:${foundFavorite.recipe._id.toString()}`
              )
              .setLabel("Undo")
              .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              add_favorite_recipe
            );

            interaction.reply({
              content: `Recipe **${foundFavorite.recipe.name}** removed from favorites`,
              ephemeral: true,
              components: [row],
            });
          }
        } catch {
          interaction.reply({
            content: `Recipe **${foundFavorite.recipe.name}** is not in your favorites`,
            ephemeral: true,
          });
        }
      } else if (!remove) {
        const embedMessage = async () => {
          const embed = new EmbedBuilder();
          let body: string = "";
          for (let i = 0; i < recipes.length; i++) {
            const currentRecipe = recipes[i];

            if (currentRecipe.recipe) {
              const date =
                currentRecipe.date.toLocaleDateString() +
                "  " +
                currentRecipe.date
                  .toLocaleTimeString()
                  .replace(/(.*)\D\d+/, "$1");
              body += `- [${currentRecipe.recipe.name}](${currentRecipe.recipe.url}) ∙ ${date}\n`;
            }
          }
          embed
            .setTitle("Favorites")
            .setColor(constants.message.color)
            .setDescription(body);

          return embed;
        };
        const embed = await embedMessage();
        await interaction.reply({
          embeds: [embed],
          // components: [row],
          ephemeral: true,
        });
      } else {
        let page: number = 0;
        const chunk: number[] = [];
        for (let i = 0; i < recipes.length; i += 5) {
          chunk.push(Math.min(5, recipes.length - i));
        }
        const totalPages = chunk.length > 0 ? chunk.length - 1 : 0;
        let row;
        if (chunk.length <= 1) {
          row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("favorite_remove")
              .setEmoji("❌")
              .setStyle(ButtonStyle.Secondary)
          );
        } else if (chunk.length > 1) {
          row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("favorite_backwards")
              .setEmoji("◀️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("favorite_forward")
              .setEmoji("▶️")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("favorite_remove")
              .setEmoji("❌")
              .setStyle(ButtonStyle.Secondary)
          );
        }

        const embedMessage = async (page: number) => {
          const embeds: EmbedBuilder[] = [];
          for (let i = 0; i < chunk[page]; i++) {
            let description: string;
            const currentRecipe = recipes[i + page * 5];

            if (currentRecipe.recipe) {
              if (currentRecipe.recipe.desc.length > 100) {
                const lastSpaceIndex = currentRecipe.recipe.desc.lastIndexOf(
                  " ",
                  100
                );
                if (lastSpaceIndex !== -1) {
                  description = `${currentRecipe.recipe.desc.substring(
                    0,
                    lastSpaceIndex
                  )}...`;
                } else {
                  description = `${currentRecipe.recipe.desc.substring(
                    0,
                    100
                  )}...`;
                }
              } else {
                description = currentRecipe.recipe.desc;
              }
              const recipeEmbed = new EmbedBuilder()
                .setTitle(currentRecipe.recipe.name)
                .setColor(constants.message.color)
                .setDescription(description)
                .setURL(currentRecipe.recipe.url)
                .setTimestamp(currentRecipe.date);
              if (currentRecipe.recipe.img !== "") {
                recipeEmbed.setThumbnail(currentRecipe.recipe.img);
              }
              embeds.push(recipeEmbed);
            }
          }
          return embeds;
        };
        if (chunk.length > 1) {
          row.components[0].setDisabled(true);
          if (page === totalPages) {
            row.components[1].setDisabled(true);
          }
        }

        await interaction.reply({
          embeds: await embedMessage(page),
          components: [row],
          ephemeral: true,
        });

        const filter = (i) =>
          (i.customId === "favorite_forward" ||
            i.customId === "favorite_backwards" ||
            i.customId === "favorite_remove") &&
          i.user.id === interaction.user.id;

        const collector = interaction.channel!.createMessageComponentCollector({
          filter,
          time: 180000,
        });

        collector.on("collect", async (i) => {
          try {
            if (i.customId === "favorite_forward") {
              // page = (page % totalPages) + 1; // wrap around if exceeding last page
              page++; // should move 1 page
              if (page === 0) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(false);
              } else if (page === totalPages) {
                row.components[0].setDisabled(false);
                row.components[1].setDisabled(true);
              } else {
                row.components[0].setDisabled(false);
                row.components[1].setDisabled(false);
              }
              await i.deferUpdate();
              await interaction.editReply({
                embeds: await embedMessage(page),
                components: [row],
              });
            }
            if (i.customId === "favorite_backwards") {
              page--;
              if (page === 0) {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(false);
              } else if (page === totalPages) {
                row.components[0].setDisabled(false);
                row.components[1].setDisabled(true);
              } else {
                row.components[0].setDisabled(false);
                row.components[1].setDisabled(false);
              }
              await i.deferUpdate();
              await interaction.editReply({
                embeds: await embedMessage(page),
                components: [row],
              });
            }
          } catch (error) {
            console.error(error);
          }
        });
      }
    }
  },
};
