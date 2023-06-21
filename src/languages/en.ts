import { LanguageTranscription } from "./languageTranscription";

export default <LanguageTranscription>{
  help: {
    title: "RecipeBot commands:",

    help: {
      Name: "Shows the Commands list",
      Value: "`%shelp`",
    },
    randomRecipe: {
      Name: "Get a random recipe",
      Value: "`%srecipe`",
    },
    specificRecipe: {
      Name: "Get a specific recipe",
      Value: '`%srecipe "recipe name" / "category name"`',
    },
    listAvaiableLanguages: {
      Name: "Get the list of avaiable languages",
      Value: "`%slang`",
    },
    changeBotLanguage: {
      Name: "Change bot language",
      Value: '`%slang "language"`',
    },
    changeRecipeLanguage: {
      Name: "Change recipe language",
      Value: '`%srlang "language"`',
    },
    changePrefix: {
      Name: "Change prefix",
      Value: '`%sprefix "symbol"`',
    },
    timerAdd: {
      Name: "Set an auto-recipe timer",
      Value: '`%stime "hours"`',
    },
    timerOff: {
      Name: "Turn OFF auto-recipe timer",
      Value: "`%stime off`",
    },
    categoryList: {
      Name: "Shows the recipe categories list",
      Value: "`%slist`",
    },
    showFavoriteList: {
      Name: "Shows your favorites list",
      Value: "`%sfavorite`",
    },
    support: {
      Name: "Request support",
      Value: "`%ssupport`",
    },
    donate: {
      Name: "Donate to developers",
      Value: "`%sdonate`",
    },
    telegram: {
      Name: "Try me on Telegram",
      Value: "`%stelegram`",
    },
    vote: {
      Name: "Vote the bot",
      Value: "`%svote`",
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
