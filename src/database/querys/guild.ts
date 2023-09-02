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
  memberCount: number
) {
  const newGuild: GuildType | null = await guildSchema.create({
    guildId: guildId,
    name: name,
    memberCount: memberCount,
  });
  if (!newGuild) return new Error("Cannot Create");
  else return newGuild;
}

export async function getServerNumber() {
  const guilds = await guildSchema.countDocuments();
  return guilds;
}

export async function getGuildByGuildId(guildId: string) {
  const guild: GuildType | null = await guildSchema.findOne({
    guildId: guildId,
  });
  if (!guild) return new Error("Not Found");
  else return guild;
}

export async function updateGuildLanguage(guildId: string, lang: string) {
  const update = await guildSchema.updateOne(
    { guildId: guildId },
    { lang: lang }
  );
  if (update.modifiedCount < 1) return new Error("Cannot Update");
}

export async function getGuildLang(guildId: string) {
  const guild: GuildType | null = await guildSchema.findOne({
    guildId: guildId,
  });
  if (!guild) return new Error("Not found");
  else return guild.lang;
}
