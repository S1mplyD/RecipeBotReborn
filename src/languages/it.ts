import { LanguageTranscription } from "./languageTranscription";

export default <LanguageTranscription>{
  help: {
    title: "Comandi RecipeBot:",

    help: {
      Name: "Mostra la lista dei comandi",
      Value: "`help`",
    },
    randomRecipe: {
      Name: "Fornisce una ricetta casuale",
      Value: "`recipe`",
    },
    specificRecipe: {
      Name: "Fornisce una ricetta specifica",
      Value: '`recipe "nome ricetta" / "nome categoria"`',
    },
    listAvaiableLanguages: {
      Name: "Lista delle lingue disponibili",
      Value: "`lang`",
    },
    changeBotLanguage: {
      Name: "Cambia la lingua del bot",
      Value: '`lang "lingua"`',
    },
    changeRecipeLanguage: {
      Name: "Cambia la lingua delle ricette",
      Value: '`rlang "lingua"`',
    },
    changePrefix: {
      Name: "Cambia il prefisso",
      Value: '`prefix "simbolo"`',
    },
    timerAdd: {
      Name: "Aggiunge un timer per le ricette automatiche",
      Value: '`time "ore"`',
    },
    timerOff: {
      Name: "Disattiva il timer per le ricette automatiche",
      Value: "`time off`",
    },
    categoryList: {
      Name: "Mostra le categorie di ricette disponibili",
      Value: "`list`",
    },
    showFavoriteList: {
      Name: "Mostra la tua lista dei preferiti",
      Value: "`favourite`",
    },
    support: {
      Name: "Richiedi supporto",
      Value: "`support`",
    },
    donate: {
      Name: "Fai una donazione agli sviluppatori",
      Value: "`donate`",
    },
    telegram: {
      Name: "Provami anche su Telegram",
      Value: "`telegram`",
    },
    vote: {
      Name: "Vota il bot",
      Value: "`vote`",
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
