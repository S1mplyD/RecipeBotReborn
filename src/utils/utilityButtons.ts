import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export function supportButton(message) {
  // Alternate error message using embed
  console.log(`message: ${message}`);
  const embed = new EmbedBuilder();
  embed
    .setTitle("An error has occured")
    .setDescription(`\`\`\`${message}\`\`\``)
    .setFooter({
      text: "Button not working?\nhttps://discord.gg/PrGRP3w",
    })
    .setColor("#ff0303");
  const invite_code = new ButtonBuilder()
    .setLabel("Contact support")
    .setURL("https://discord.gg/PrGRP3w")
    .setStyle(ButtonStyle.Link);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(invite_code);
  const reply = { embeds: [embed], ephemeral: true, components: [row] };
  return reply;
  // return row;
}
