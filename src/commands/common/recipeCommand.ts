import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType, RecipeType } from "../../utils/types";
import constants from "../../utils/constants";
import { getRandomRecipe, getRecipeName } from "../../database/querys/recipe";
import { checkPermissions } from "../../utils/checks";
import loadLanguage from "../../utils/loadLanguage";
import { getGuildLang } from "../../database/querys/guild";

module.exports = {
    data: new SlashCommandBuilder()
        .setDMPermission(false) // Command will not work in dm
        .setName("recipe")
        .setDescription("Show a Recipe")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("The recipe name")
                .setRequired(false),
        )
        .addBooleanOption((option) =>
            option
                .setName("text")
                .setDescription("Get recipe as text")
                .setRequired(false),
        ),

    async execute(interaction: CommandInteraction, guild: GuildType) {
        const lang: string | Error = await getGuildLang(guild.guildId);
        if (lang instanceof Error) return lang;

        const languagePack = loadLanguage(lang);
        const lpcode = languagePack.code.recipe;

        const args = interaction.options.get("name");
        const textArg = interaction.options.get("text");
        const permissionError = checkPermissions(interaction);

        if (!permissionError) {
            if (!args) {
                const recipe: RecipeType | null = await getRandomRecipe(guild.lang);

                if (!recipe) interaction.reply("not found");
                else {
                    if ((textArg?.value as boolean) === true) {
                        console.log(recipe.directions.length);
                        if (recipe.directions.length > 2000) {
                            console.log("db name:", recipe.name);
                            let directionsChunk: EmbedBuilder[] = [];
                            directionsChunk.push(
                                new EmbedBuilder()
                                    .setTitle(recipe.name)
                                    .setColor(constants.message.color)
                                    .setFields({
                                        name: "Ingredients",
                                        value: recipe.ingredients.join("\n"),
                                        inline: false,
                                    })
                                    .setURL(recipe.url)
                                    .setTimestamp()
                                    .setFooter({
                                        text: "Category: " + recipe.category ?? " ",
                                    }),
                            );
                            let lastIndex = 0;
                            const chunkNumber = Math.floor(recipe.directions.length / 2000);
                            for (let i = 0; i <= chunkNumber; i++) {
                                console.log(lastIndex);
                                if (lastIndex === 0) {
                                    console.log("last index 0");
                                    const substring = recipe.directions.substring(0, 2000);
                                    lastIndex = substring.lastIndexOf(".");
                                    directionsChunk.push(
                                        new EmbedBuilder()
                                            .setColor(constants.message.color)
                                            .setDescription(
                                                recipe.directions.substring(0, lastIndex + 1),
                                            )
                                            .setTimestamp()
                                            .setFooter({
                                                text: "Category: " + recipe.category ?? " ",
                                            }),
                                    );
                                } else {
                                    console.log("last index ! 0");
                                    console.log(
                                        recipe.directions.length - 2000 * (i + 1) > 2000
                                            ? 2000 * (i + 1)
                                            : recipe.directions.length,
                                    );
                                    const substring = recipe.directions.substring(
                                        lastIndex + 1,
                                        recipe.directions.length - 2000 * (i + 1) > 2000
                                            ? 2000 * (i + 1)
                                            : recipe.directions.length,
                                    );
                                    console.log(substring);
                                    const oldLastIndex = lastIndex;
                                    lastIndex = substring.lastIndexOf(".");
                                    console.log(lastIndex);
                                    directionsChunk.push(
                                        new EmbedBuilder()
                                            .setColor(constants.message.color)
                                            .setDescription(
                                                recipe.directions.substring(
                                                    oldLastIndex + 1,
                                                    lastIndex + oldLastIndex + 1,
                                                ),
                                            )
                                            .setTimestamp()
                                            .setFooter({
                                                text: "Category: " + recipe.category ?? " ",
                                            }),
                                    );
                                }
                            }
                            console.log(directionsChunk);
                            if (recipe.img !== "") {
                                directionsChunk[0].setImage(recipe.img);
                            }
                            const add_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Add")
                                .setStyle(ButtonStyle.Primary);

                            const remove_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Remove")
                                .setStyle(ButtonStyle.Secondary);

                            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                                add_favorite_recipe,
                                remove_favorite_recipe,
                            );
                            await interaction.deferReply();
                            await interaction.editReply({
                                embeds: directionsChunk,
                                components: [row],
                            });
                        } else {
                            console.log("db name:", recipe.name);
                            const recipeEmbed = new EmbedBuilder()
                                .setTitle(recipe.name)
                                .setColor(constants.message.color)
                                .setFields({
                                    name: "Ingredients",
                                    value: recipe.ingredients.join("\n"),
                                    inline: false,
                                })
                                .setDescription(recipe.directions)
                                .setURL(recipe.url)
                                .setTimestamp()
                                .setFooter({
                                    text: "Category: " + recipe.category ?? " ",
                                });
                            if (recipe.img !== "") {
                                recipeEmbed.setImage(recipe.img);
                            }
                            const add_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Add")
                                .setStyle(ButtonStyle.Primary);

                            const remove_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Remove")
                                .setStyle(ButtonStyle.Secondary);

                            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                                add_favorite_recipe,
                                remove_favorite_recipe,
                            );
                            await interaction.deferReply();
                            await interaction.editReply({
                                embeds: [recipeEmbed],
                                components: [row],
                            });
                        }
                    } else {
                        console.log(
                            "recipe name: ",
                            recipe.name,
                            "\nrecipe_id: ",
                            recipe._id.toString(),
                        );
                        const recipeEmbed = new EmbedBuilder()
                            .setTitle(recipe.name)
                            .setColor(constants.message.color)
                            .setDescription(recipe.desc);
                        if (recipe.img !== "") {
                            recipeEmbed.setImage(recipe.img);
                        }

                        try {
                            let featuredDataString = "";
                            recipe.featuredData.forEach((data, index) => {
                                if (index !== 0) {
                                    featuredDataString += " | ";
                                }
                                featuredDataString += data;
                            });

                            const field = {
                                name: lpcode.tags,
                                value: featuredDataString,
                                inline: true,
                            };

                            recipeEmbed.addFields(field);
                        } catch {
                            console.log("no featuredDataString");
                        }
                        recipeEmbed
                            .setURL(recipe.url)
                            .setTimestamp()
                            .setFooter({
                                text: lpcode.category + ": " + recipe.category ?? " ",
                            });

                        const add_favorite_recipe = new ButtonBuilder()
                            .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                            .setLabel("Add")
                            .setStyle(ButtonStyle.Primary);

                        const remove_favorite_recipe = new ButtonBuilder()
                            .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                            .setLabel("Remove")
                            .setStyle(ButtonStyle.Secondary);

                        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                            add_favorite_recipe,
                            remove_favorite_recipe,
                        );

                        await interaction.deferReply();
                        await interaction.editReply({
                            embeds: [recipeEmbed],
                            components: [row],
                        });
                    }
                }
            } else {
                const recipeName = args?.value as string;
                const text = textArg?.value as boolean;
                console.log("Recipe Name:", recipeName);
                const recipe = await getRecipeName(recipeName, guild.lang);
                console.log(recipe);

                if (recipe) {
                    if (text === true) {
                        console.log(recipe.directions.length);
                        if (recipe.directions.length > 2000) {
                            console.log("db name:", recipe.name);
                            let directionsChunk: EmbedBuilder[] = [];
                            directionsChunk.push(
                                new EmbedBuilder()
                                    .setTitle(recipe.name)
                                    .setColor(constants.message.color)
                                    .setFields({
                                        name: "Ingredients",
                                        value: recipe.ingredients.join("\n"),
                                        inline: false,
                                    })
                                    .setURL(recipe.url)
                                    .setTimestamp()
                                    .setFooter({
                                        text: "Category: " + recipe.category ?? " ",
                                    }),
                            );
                            let lastIndex = 0;
                            const chunkNumber = Math.floor(recipe.directions.length / 2000);
                            for (let i = 0; i <= chunkNumber; i++) {
                                console.log(lastIndex);
                                if (lastIndex === 0) {
                                    console.log("last index 0");
                                    const substring = recipe.directions.substring(0, 2000);
                                    lastIndex = substring.lastIndexOf(".");
                                    directionsChunk.push(
                                        new EmbedBuilder()
                                            .setColor(constants.message.color)
                                            .setDescription(
                                                recipe.directions.substring(0, lastIndex + 1),
                                            )
                                            .setTimestamp()
                                            .setFooter({
                                                text: "Category: " + recipe.category ?? " ",
                                            }),
                                    );
                                } else {
                                    console.log("last index ! 0");
                                    console.log(
                                        recipe.directions.length - 2000 * (i + 1) > 2000
                                            ? 2000 * (i + 1)
                                            : recipe.directions.length,
                                    );
                                    const substring = recipe.directions.substring(
                                        lastIndex + 1,
                                        recipe.directions.length - 2000 * (i + 1) > 2000
                                            ? 2000 * (i + 1)
                                            : recipe.directions.length,
                                    );
                                    console.log(substring);
                                    const oldLastIndex = lastIndex;
                                    lastIndex = substring.lastIndexOf(".");
                                    console.log(lastIndex);
                                    directionsChunk.push(
                                        new EmbedBuilder()
                                            .setColor(constants.message.color)
                                            .setDescription(
                                                recipe.directions.substring(
                                                    oldLastIndex + 1,
                                                    lastIndex + oldLastIndex + 1,
                                                ),
                                            )
                                            .setTimestamp()
                                            .setFooter({
                                                text: "Category: " + recipe.category ?? " ",
                                            }),
                                    );
                                }
                            }
                            console.log(directionsChunk);
                            if (recipe.img !== "") {
                                directionsChunk[0].setImage(recipe.img);
                            }
                            const add_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Add")
                                .setStyle(ButtonStyle.Primary);

                            const remove_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Remove")
                                .setStyle(ButtonStyle.Secondary);

                            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                                add_favorite_recipe,
                                remove_favorite_recipe,
                            );
                            await interaction.deferReply();
                            await interaction.editReply({
                                embeds: directionsChunk,
                                components: [row],
                            });
                        } else {
                            console.log("db name:", recipe.name);
                            const recipeEmbed = new EmbedBuilder()
                                .setTitle(recipe.name)
                                .setColor(constants.message.color)
                                .setFields({
                                    name: "Ingredients",
                                    value: recipe.ingredients.join("\n"),
                                    inline: false,
                                })
                                .setDescription(recipe.directions)
                                .setURL(recipe.url)
                                .setTimestamp()
                                .setFooter({
                                    text: "Category: " + recipe.category ?? " ",
                                });
                            if (recipe.img !== "") {
                                recipeEmbed.setImage(recipe.img);
                            }
                            const add_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Add")
                                .setStyle(ButtonStyle.Primary);

                            const remove_favorite_recipe = new ButtonBuilder()
                                .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                                .setLabel("Remove")
                                .setStyle(ButtonStyle.Secondary);

                            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                                add_favorite_recipe,
                                remove_favorite_recipe,
                            );
                            await interaction.deferReply();
                            await interaction.editReply({
                                embeds: [recipeEmbed],
                                components: [row],
                            });
                        }
                    } else {
                        console.log("db name:", recipe.name);
                        const recipeEmbed = new EmbedBuilder()
                            .setTitle(recipe.name)
                            .setColor(constants.message.color)
                            .setDescription(recipe.desc)
                            .setURL(recipe.url)
                            .setTimestamp()
                            .setFooter({
                                text: "Category: " + recipe.category ?? " ",
                            });
                        if (recipe.img !== "") {
                            recipeEmbed.setImage(recipe.img);
                        }
                        const add_favorite_recipe = new ButtonBuilder()
                            .setCustomId(`add_favorite_recipe:${recipe._id.toString()}`)
                            .setLabel("Add")
                            .setStyle(ButtonStyle.Primary);

                        const remove_favorite_recipe = new ButtonBuilder()
                            .setCustomId(`remove_favorite_recipe:${recipe._id.toString()}`)
                            .setLabel("Remove")
                            .setStyle(ButtonStyle.Secondary);

                        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                            add_favorite_recipe,
                            remove_favorite_recipe,
                        );
                        await interaction.deferReply();
                        await interaction.editReply({
                            embeds: [recipeEmbed],
                            components: [row],
                        });
                    }
                } else await interaction.reply("No matching recipe name found");
            }
        } else
            await interaction.reply({ content: permissionError, ephemeral: true });
    },
};
