import { LanguageTranscription } from "./languageTranscription";

export default <LanguageTranscription>{
  help: {
    title: "RecipeBot commands:",

    help: {
      Name: "Shows the Commands list",
      Value: "`help`",
    },
    randomRecipe: {
      Name: "Get a random recipe",
      Value: "`recipe`",
    },
    specificRecipe: {
      Name: "Get a specific recipe",
      Value: '`recipe "recipe name" / "category name"`',
    },
    listAvaiableLanguages: {
      Name: "Get the list of avaiable languages",
      Value: "`lang`",
    },
    changeBotLanguage: {
      Name: "Change bot language",
      Value: '`lang "language"`',
    },
    changeRecipeLanguage: {
      Name: "Change recipe language",
      Value: '`rlang "language"`',
    },
    changePrefix: {
      Name: "Change prefix",
      Value: '`prefix "symbol"`',
    },
    timerAdd: {
      Name: "Set an auto-recipe timer",
      Value: '`time "hours"`',
    },
    timerOff: {
      Name: "Turn OFF auto-recipe timer",
      Value: "`time off`",
    },
    categoryList: {
      Name: "Shows the recipe categories list",
      Value: "`list`",
    },
    showFavoriteList: {
      Name: "Shows your favorites list",
      Value: "`favorite`",
    },
    support: {
      Name: "Request support",
      Value: "`support`",
    },
    donate: {
      Name: "Donate to developers",
      Value: "`donate`",
    },
    telegram: {
      Name: "Try me on Telegram",
      Value: "`telegram`",
    },
    vote: {
      Name: "Vote the bot",
      Value: "`vote`",
    },

    footer: "Remember that recipes differ by language",
  },

  favorite: {
    title: "Favorite recipes:",
    delete: {
      name: "Select which recipe you want to delete (🗑️ Delete all, ❌ Cancel)",
    },
    empty: {
      name: "No favorites",
      value: "🍴",
    },
  },

  languages: {
    title: "**List of avaiable languages:**",
  },

  recipeLanguages: {
    title: "**List of avaiable languages:**",
  },

  categoryList: {
    title: "**Recipe categories list:**",
  },

  time: {
    empty: {
      name: "No timer set",
    },
    current: {
      name: "Current timer:",
      value: "hours",
    },
    invalid: {
      name: "Invalid time value",
    },
  },
};
