import {
  // EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export function supportButton() {
  const error_support = new ButtonBuilder()
    .setCustomId("error_support") 
    .setLabel("Contact support")
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    error_support
  );
  // Alternate error message using embed
  // const embed = new EmbedBuilder();
  // embed
  //   .setTitle("An error occured")
  //   .setTimestamp(new Date())
  //   .setURL("https://discord.gg/PrGRP3w")
  //   .setDescription("An error has occured, please join the support server and report this.");
  // const reply = {embeds: [embed], componets: [row]};
  return row;
}
