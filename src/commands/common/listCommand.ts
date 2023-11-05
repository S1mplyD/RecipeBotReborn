import {
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildType } from "../../utils/types";
import constants from "../../utils/constants";
import loadLanguage from "../../utils/loadLanguage";
import { checkPermissions } from "../../utils/checks";
import { cleaned } from "../../utils/listCleaner";
import { supportButton } from "../../utils/utilityButtons";
// import {
//   getCuisineCategories,
//   getIngredientsCategory,
// } from "../../database/querys/recipe";

module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false) // Command will not work in dm
    .setName("list")
    .setDescription("Show the list of categories"),
  // .addStringOption((option) =>
  //   option
  //     .setName("type")
  //     .setDescription("country | ingredients")
  //     .setRequired(false)
  // )
  async execute(interaction: CommandInteraction, guild: GuildType) {
    const permissionError = checkPermissions(interaction);
    const args = interaction.options.get("type");

    if (!permissionError) {
      const languagePack = loadLanguage(guild.lang);
      if (!args) {
        const categories: string[] | undefined = await cleaned(guild.lang);
        if (categories) {
          const embedMessage = async () => {
            const list = new EmbedBuilder()
              .setTitle(languagePack.code.categoryList.title)
              .setColor(constants.message.color);
            let str = " ";
            if (categories.length < 1) {
              str = `${languagePack.code.categoryList.notFound}`;
              const row = supportButton();
              interaction.reply({ content: str, components: [row] });
            } else {
              let firstLetter = categories[0] ? categories[0].charAt(0) : "";
              let currentFirstLetter = firstLetter;

              for (let i = 0; i <= categories.length; i++) {
                if (categories[i]) {
                  currentFirstLetter = categories[i].charAt(0);
                  if (currentFirstLetter == firstLetter) {
                    str += `${categories[i]}\n`;
                  } else if (currentFirstLetter != firstLetter) {
                    list.addFields({
                      name: firstLetter,
                      value: str,
                      inline: false,
                    });
                    str = `${categories[i]}\n`;
                  }
                  firstLetter = categories[i].charAt(0);
                } else if (i == categories.length) {
                  list.addFields({
                    name: firstLetter,
                    value: str,
                    inline: false,
                  });
                }
              }
            }

            str = "";
            return list;
          };
          try {
            await interaction.reply({
              embeds: [await embedMessage()],
              ephemeral: true,
            });
          } catch {
            console.log("Interaction already replied. An error occured");
          }
        }
      }
      // else {
      //   if (typeof args.value === "string") {
      //     if (args.value.toLowerCase() === "country") {
      //       const categories: string[] = await getCuisineCategories(guild.lang);

      //       let str = "";
      //       if (categories) {
      //         if (categories.length < 1) str = `${languagePack.code.categoryList.notFound}`;
      //         else {
      //           for (let i = 0; i < categories.length; i++) {
      //             str += `${i + 1}) ${categories[i]}\n`;
      //           }
      //         }
      //       }
      //       const list = new EmbedBuilder()
      //         .setTitle(languagePack.code.categoryList.title)
      //         .setColor(constants.message.color)
      //         .setDescription(str);
      //       await interaction.deferReply();
      //       await interaction.editReply({ embeds: [list] });
      //     } else if (args.value.toLowerCase() === "ingredients") {
      //       const categories: string[] = await getIngredientsCategory(
      //         guild.lang
      //       );

      //       let str = "";
      //       if (categories) {
      //         if (categories.length < 1)
      //           str = `${languagePack.code.categoryList.notFound}`;
      //         else {
      //           for (let i = 0; i < categories.length; i++) {
      //             str += `${i + 1}) ${categories[i]}\n`;
      //           }
      //         }
      //       }
      //       const list = new EmbedBuilder()
      //         .setTitle(languagePack.code.categoryList.title)
      //         .setColor(constants.message.color)
      //         .setDescription(str);
      //       await interaction.deferReply();
      //       await interaction.editReply({ embeds: [list] });
      //     }
      //   }
      // }
    } else
      await interaction.reply({ content: permissionError, ephemeral: true });
  },
};
