import {
  // EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export function supportButton() {
  const error_support = new ButtonBuilder() //TODO: Add this response method to other command errors
    .setCustomId("error_support") //TODO: Handle button interaction in buttonHandler
    .setLabel("Contact support")
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    error_support
  );
  // const embed = new EmbedBuilder();
  // embed
  //   .setTitle("An error occured")
  //   .setTimestamp(new Date())
  //   .setURL("https://discord.gg/PrGRP3w")
  //   .setDescription("An error has occured, please join the support server and report this.");
  // const reply = {embeds: [embed], componets: [row]};
  return row;
}
