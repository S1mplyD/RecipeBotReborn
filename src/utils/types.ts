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

export type TimerType = {
  guildId: string;
  channelId: string;
  time: number;
  status: boolean;
  lang: string;
};

export type Interval = {
  interval: NodeJS.Timeout;
  channelId: string;
  guildId: string;
};
