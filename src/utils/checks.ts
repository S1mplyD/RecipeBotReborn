// permissionsUtils.ts
import { CommandInteraction } from "discord.js";
import constants from "./constants";

import { VoteClient } from "topgg-votes";
const topGGToken = process.env.TOPGG_TOKEN || "";
const votesClient = new VoteClient({
  token: topGGToken,
});

export function checkPermissions(interaction: CommandInteraction) {
  if (interaction.guild?.members.me) {
    const permissions = interaction.guild?.members.me.permissionsIn(
      interaction.channelId
    );

    // Checks bot permissions
    const missingPermissions = constants.requiredPermissions.filter(
      (permission) => !permissions.has(permission)
    );

    // Checks bot missing permissions
    const missingPermissionNames = missingPermissions.map(
      (permission) => constants.permissionNamesMap[Number(permission)]
    );

    // Checks if bot has all permissions (no missing permissions)
    if (missingPermissions.length > 0) {
      const errorMessage = `***| Error | Missing channel permissions:***\n- ${missingPermissionNames.join(
        "\n- "
      )}`;
      return errorMessage;
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkVoteAndAnswer(user) {
  const voted = await votesClient.hasVoted(user);

  if (voted) {
    console.log("User has voted!");
    return true;
  } else {
    console.log("User has not voted!");

    const content =
      "Looks like you haven't voted the bot yet\n[Click here](https://top.gg/bot/657369551121678346/vote) to go to the voting page";

    return content;
  }
}
