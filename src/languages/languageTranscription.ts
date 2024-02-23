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
    timer: {
      Name: string;
      Value: string;
    };
    categoryList: {
      Name: string;
      Value: string;
    };
    // showFavoriteList: {
    //   Name: string;
    //   Value: string;
    // };
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

  recipe: {
    tags: string;
    category: string;
  };

  favorite: {
    title: string;
    empty: string;
    notFavorite: string;
    removed: string;
  };

  languages: {
    title: string;
    set: string;
    setAlt: string;
    same: string;
    error: string;
  };

  categoryList: {
    title: string;
    notFound: string;
  };

  timer: {
    empty: {
      name: string;
    };
    current: {
      current: string;
      updated: string;
      set: string;
      interval: string;
      valueOne: string;
      valueMany: string;
      status: string;
      category: string;
    };
    invalid: {
      name: string;
      value: string;
    };
    stopped: string;
    started: string;
    notFound: string;
  };

  timerError: {
    less: string;
    more: string;
    failure: string;
  };
}
