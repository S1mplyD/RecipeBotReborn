export interface LanguageTranscription {
  help: {
    title: string;

    help: {
      Name: string;
      Value: string;
    };
    randomRecipe: {
      Name: string;
      Value: string;
    };
    specificRecipe: {
      Name: string;
      Value: string;
    };
    listAvaiableLanguages: {
      Name: string;
      Value: string;
    };
    changeBotLanguage: {
      Name: string;
      Value: string;
    };
    changeRecipeLanguage: {
      Name: string;
      Value: string;
    };
    changePrefix: {
      Name: string;
      Value: string;
    };
    timerAdd: {
      Name: string;
      Value: string;
    };
    timerOff: {
      Name: string;
      Value: string;
    };
    categoryList: {
      Name: string;
      Value: string;
    };
    showFavoriteList: {
      Name: string;
      Value: string;
    };
    support: {
      Name: string;
      Value: string;
    };
    donate: {
      Name: string;
      Value: string;
    };
    telegram: {
      Name: string;
      Value: string;
    };
    vote: {
      Name: string;
      Value: string;
    };

    footer: string;
  };

  favorite: {
    title: string;
    delete: {
      name: string;
      value?: string;
    };
    empty: {
      name: string;
      value: string;
    };
  };

  languages: {
    title: string;
  };

  recipeLanguages: {
    title: string;
  };

  categoryList: {
    title: string;
  };

  time: {
    title?: string;
    empty: {
      name: string;
      value?: string;
    };
    current: {
      name: string;
      value?: string;
    };
    invalid: {
      name: string;
      value?: string;
    };
  };
}
