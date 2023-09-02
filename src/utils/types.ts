export type GuildType = {
  guildId: string;
  name: string;
  region: string;
  memberCount: number;
  lang: string;
  recipe_lang: string;
  premium: boolean;
};

export type RecipeType = {
  url: string;
  img: string;
  name: string;
  category: string;
  desc: string;
  lang: string;
};
