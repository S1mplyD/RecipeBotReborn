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
  _id: string;
  url: string;
  img: string;
  name: string;
  category: string;
  cuisine: string;
  ingredients: string[];
  desc: string;
  lang: string;
  featuredData: string[];
  directions: string;
};

export type TimerType = {
  guildId: string;
  channelId: string;
  time: number;
  status: boolean;
  lang: string;
  category: string;
  startedAt: Date;
};

export type UserType = {
  userId: string;
  favoriteRecipes: { url: string; date: Date }[];
};

export type Interval = {
  interval: NodeJS.Timeout;
  channelId: string;
  guildId: string;
};
