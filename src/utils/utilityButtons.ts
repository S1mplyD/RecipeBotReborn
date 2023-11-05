import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function supportButton() {
  const error_support = new ButtonBuilder() //TODO: Add this response method to other command errors
    .setCustomId("error_support") //TODO: Handle button interaction in buttonHandler
    .setLabel("Contact support")
    .setStyle(ButtonStyle.Primary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    error_support
  );
  return row;
}
