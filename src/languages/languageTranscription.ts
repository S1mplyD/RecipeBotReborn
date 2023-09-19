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
    set: string;
    setAlt: string;
    same: string;
    error: string;
  };

  categoryList: {
    title: string;
  };

  timer: {
    title?: string;
    empty: {
      name: string;
      value?: string;
    };
    current: {
      name: string;
      set: string;
      interval: string;
      valueOne?: string;
      valueMany?: string;
      status?: string;
      role?: string;
    };
    invalid: {
      name: string;
      value?: string;
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
