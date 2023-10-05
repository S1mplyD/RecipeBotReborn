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
      Value: "`recipe \"nome ricetta\" / \"nome categoria\"`",
    },
    listAvaiableLanguages: {
      Name: "Lista delle lingue disponibili",
      Value: "`lang`",
    },
    changeBotLanguage: {
      Name: "Cambia la lingua del bot",
      Value: "`lang \"lingua\"`",
    },
    timer: {
      Name: "Aggiunge un timer per le ricette automatiche",
      Value: "`timer \"on/off\" \"ore\" `",
    },
    categoryList: {
      Name: "Mostra le categorie di ricette disponibili",
      Value: "`list`",
    },
    // showFavoriteList: {
    //   Name: "Mostra la tua lista dei preferiti",
    //   Value: "`favorite`",
    // },
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

  recipe: {
    tags: "Tags alimentari",
    category: "Categoria",
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
    set: "Nuova lingua impostata:",
    setAlt: "Nuova lingua impostata",
    same: "La lingua attuale è già",
    error: "Errore nell'impostazione della lingua",
  },

  recipeLanguages: {
    title: "**Lista delle lingue disponibili:**",
  },

  categoryList: {
    title: "**Lista delle categorie di ricette:**",
  },

  timer: {
    empty: {
      name: "Nessun timer impostato. Aggiungi un tempo (in ore) dopo il comando `/timer`",
    },
    current: {
      current: "Timer attuale:",
      updated: "Timer aggiornato",
      set: "Timer impostato a",
      interval: "Intervallo:",
      valueOne: "ora",
      valueMany: "ore",
      status: "Stato:",
      category: "Categoria:",
    },
    invalid: {
      name: "Il valore",
      value: "non è un  argomento valido",
    },
    stopped: "Timer fermato",
    started: "Timer avviato",
    notFound: "Nessun timer trovato",
  },

  timerError: {
    less: "Il tempo impostato deve essere di almeno 1 ora",
    more: "Il tempo impostato non può essere maggiore di 24 ore",
    failure: "Errore nella creazione del timer",
  },
};
