import { GuildType } from "../../utils/types";
import guildSchema from "../schema/guild.model";

/**
 * Function that returns all guilds from database
 * @returns Error | GuildType[]
 */
export async function getAllGuilds() {
  const guilds: GuildType[] | null = await guildSchema.find();
  if (!guilds) return new Error("Not found!");
  else return guilds;
}

/**
 * Function that add a guild to the database
 * @param guildId id of the server
 * @param name name of the server
 * @param region region of the server
 * @param memberCount number of members of the server
 * @param lang language used in the server
 * @param recipe_lang language of the recipes on the server
 * @returns Error | GuildType
 */
export async function createGuild(
  guildId: string,
  name: string,
  region: string,
  memberCount: number,
  lang: string,
  recipe_lang: string,
) {
  const newGuild: GuildType | null = await guildSchema.create({
    guildId: guildId,
    name: name,
    region: region,
    memberCount: memberCount,
    lang: lang,
    recipe_lang: recipe_lang,
  });
  if (!newGuild) return new Error("Cannot Create");
  else return newGuild;
}
