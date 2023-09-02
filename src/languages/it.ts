import { LanguageTranscription } from "./languageTranscription";

export default <LanguageTranscription>{
  help: {
    title: "Comandi RecipeBot:",

    help: {
      Name: "Mostra la lista dei comandi",
      Value: "`%shelp`",
    },
    randomRecipe: {
      Name: "Fornisce una ricetta casuale",
      Value: "`%srecipe`",
    },
    specificRecipe: {
      Name: "Fornisce una ricetta specifica",
      Value: '`%srecipe "nome ricetta" / "nome categoria"`',
    },
    listAvaiableLanguages: {
      Name: "Lista delle lingue disponibili",
      Value: "`%slang`",
    },
    changeBotLanguage: {
      Name: "Cambia la lingua del bot",
      Value: '`%slang "lingua"`',
    },
    changeRecipeLanguage: {
      Name: "Cambia la lingua delle ricette",
      Value: '`%srlang "lingua"`',
    },
    changePrefix: {
      Name: "Cambia il prefisso",
      Value: '`%sprefix "simbolo"`',
    },
    timerAdd: {
      Name: "Aggiunge un timer per le ricette automatiche",
      Value: '`%stime "ore"`',
    },
    timerOff: {
      Name: "Disattiva il timer per le ricette automatiche",
      Value: "`%stime off`",
    },
    categoryList: {
      Name: "Mostra le categorie di ricette disponibili",
      Value: "`%slist`",
    },
    showFavoriteList: {
      Name: "Mostra la tua lista dei preferiti",
      Value: "`%sfavourite`",
    },
    support: {
      Name: "Richiedi supporto",
      Value: "`%ssupport`",
    },
    donate: {
      Name: "Fai una donazione agli sviluppatori",
      Value: "`%sdonate`",
    },
    telegram: {
      Name: "Provami anche su Telegram",
      Value: "`%stelegram`",
    },
    vote: {
      Name: "Vota il bot",
      Value: "`%svote`",
    },

    footer: "Ricorda che le ricette sono diverse in base alla lingua",
  },

  favorite: {
    title: "Ricette preferite:",
    delete: {
      name: "Seleziona quale ricetta vuoi rimuovere (🗑️ Rimuovi tutte, ❌ Annulla)",
    },
    empty: {
      name: "Nessun preferito",
      value: "🍴",
    },
  },

  languages: {
    title: "**Lista delle lingue disponibili:**",
  },

  recipeLanguages: {
    title: "**Lista delle lingue disponibili:**",
  },

  categoryList: {
    title: "**Lista delle categorie di ricette:**",
  },

  time: {
    empty: {
      name: "Nessun timer impostato",
    },
    current: {
      name: "Timer impostato:",
      value: "ore",
    },
    invalid: {
      name: "Intervallo inserito non valido",
    },
  },
};
