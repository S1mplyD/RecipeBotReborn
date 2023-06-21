export default {
  botImage:
    "https://images.discordapp.net/avatars/657369551121678346/01263371e45d9b162e86961bcc7f5947.png?size=128",
  message: {
    color: 0xf57200,
  },
  adminIds: ["159294480585850881", "406817041157193728", "158935953275092992"],
  dateFormat: "MM-DD-YYYY",
  permission: [
    "SEND_MESSAGES",
    "ADD_REACTIONS",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
  ],
};

const AviableLanguages: Array<string> = ["en", "it"]; //['en', 'it', 'es', 'fr', 'ru'];
const AviableLanguagesRecipe: Array<string> = ["en", "it", "es", "be", "ru"];
const LanguageToEmote = {
  en: "🇬🇧",
  it: "🇮🇹",
  es: "🇪🇸",
  fr: "🇫🇷",
  ru: "🇷🇺",
  be: "🇧🇪",
};

export { AviableLanguages, LanguageToEmote, AviableLanguagesRecipe };
