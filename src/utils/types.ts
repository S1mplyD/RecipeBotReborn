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
  featuredData: string[];
};

export type TimerType = {
  guildId: string;
  channelId: string;
  time: number;
  status: boolean;
  lang: string;
  role: string;
  startedAt: Date;
};

export type UserType = {
  userId: string;
  favoriteRecipes: string[];
};

export type Interval = {
  interval: NodeJS.Timeout;
  channelId: string;
  guildId: string;
};
