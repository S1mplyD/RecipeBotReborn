// permissionsUtils.ts
import { CommandInteraction } from "discord.js";
import constants from "./constants";

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
