import langs from "../languages/index";
import { LanguageTranscription } from "../languages/languageTranscription";

export default function loadLanguage(language = "en"): LanguageTranscription {
  if (Object.keys(langs).includes(language)) {
    return langs[language];
  }
  console.error(`Language ${language} not found!`);
  return langs.en;
}
