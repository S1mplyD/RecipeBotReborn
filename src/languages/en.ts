import { LanguageTranscription } from "./languageTranscription";

export default <LanguageTranscription>{
  help: {
    title: "RecipeBot commands:",

    help: {
      Name: "Shows the Commands list",
      Value: "`/help`",
    },
    randomRecipe: {
      Name: "Get a random recipe",
      Value: "`/recipe`",
    },
    specificRecipe: {
      Name: "Get a specific recipe",
      Value: "`/recipe \"recipe name\" | \"category name\"`",
    },
    listAvaiableLanguages: {
      Name: "Get the list of avaiable languages",
      Value: "`/lang`",
    },
    changeBotLanguage: {
      Name: "Change bot language",
      Value: "`/lang \"language\"`",
    },
    timer: {
      Name: "Set an auto-recipe timer",
      Value: "`/timer \"on/off\" | \"hours\"`",
    },
    categoryList: {
      Name: "Shows the recipe categories list",
      Value: "`/list`",
    },
    showFavoriteList: {
      Name: "Shows your favorites list",
      Value: "`/favorite`",
    },
    support: {
      Name: "Request support",
      Value: "`/support`",
    },
    donate: {
      Name: "Donate to developers",
      Value: "`/donate`",
    },
    telegram: {
      Name: "Try me on Telegram",
      Value: "`/telegram`",
    },
    vote: {
      Name: "Vote the bot",
      Value: "`/vote`",
    },

    footer: "Remember that recipes differ by language",
  },

  recipe: {
    tags: "Dietary tags",
    category: "Category",
  },

  favorite: {
    title: "Favorite recipes:",
    empty: "You have no favorite recipes",
    notFavorite: "is not in your favorites",
    removed: "removed from favorites",
  },

  languages: {
    title: "**List of avaiable languages:**",
    set: "Language set to",
    setAlt: "Language set",
    same: "Language is already set to",
    error: "Error: Cannot edit language",
  },

  recipeLanguages: {
    title: "**List of avaiable languages:**",
  },

  categoryList: {
    title: "**Recipe categories list:**",
    notFound: "No categories found",
  },

  timer: {
    empty: {
      name: "No timer set. please add a time amount (in hours) after the `/timer` command",
    },
    current: {
      current: "Current timer info:",
      updated: "Timer updated",
      set: "Timer set to",
      interval: "Interval:",
      valueOne: "hour",
      valueMany: "hours",
      status: "Status:",
      category: "Category:",
    },
    invalid: {
      name: "Value",
      value: "is not a valid timer argument",
    },
    stopped: "Timer stopped",
    started: "Timer started",
    notFound: "No timer found",
  },

  timerError: {
    less: "Time can't be less than 1 hour",
    more: "Time can't be greater than 24 hours",
    failure: "Failed to create timer",
  },
};
