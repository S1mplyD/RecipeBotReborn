import { getCategories } from "../database/querys/recipe";

async function main(lang: string) {
  try {
    const inputList: string[] = await getCategories(lang);
    const uniqueWordsList = removeDuplicatesAndExtensions(inputList);
    const cleanedListWithoutRecipes = removeRecipes(uniqueWordsList);

    return cleanedListWithoutRecipes;
  } catch (error) {
    console.error("Error:", error);
  }
}

function removeDuplicatesAndExtensions(list: string[]): string[] {
  const uniqueWords: string[] = [];

  for (const word of list) {
    let isDuplicateOrExtension = false;

    for (const existingWord of uniqueWords) {
      if (word.includes(existingWord)) {
        isDuplicateOrExtension = true;
        break;
      }
      if (existingWord.includes(word)) {
        uniqueWords.splice(uniqueWords.indexOf(existingWord), 1);
      }
    }

    if (!isDuplicateOrExtension) {
      uniqueWords.push(word);
    }
  }

  return uniqueWords;
}

function removeRecipes(list: string[]): string[] {
  return list.map((word) => word.replace(/Recipes/g, "").trim());
}

// Uncomment when using just this file with "tsc src\utils\listCleaner.ts" and "node src\utils\listCleaner.js"
// main();

export function cleaned(lang: string) {
  // Use this with bot
  const cleaned = main(lang);
  return cleaned;
}
