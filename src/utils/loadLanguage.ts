import langs from "../languages/index";
import { LanguageTranscription } from "../languages/languageTranscription";

export default function loadLanguage(language = "en"): {
  name: string;
  code: LanguageTranscription;
} {
  if (Object.keys(langs).includes(language)) {
    return {
      name: langs[language].name,
      code: langs[language].translations,
    };
  }
  console.error(`Language ${language} not found!`);
  return {
    name: langs.en.name,
    code: langs.en.code,
  };
}
