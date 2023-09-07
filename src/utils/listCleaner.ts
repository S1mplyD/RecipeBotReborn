import { getCategories } from "../database/querys/recipe"; // Use getCategories as inputList. Using given list for testing purposes

const inputList: string[] = [
  "Appetizers",
  "Appetizers and Snacks",
  "Apple Cake Recipes",
  "Baked Brie Recipes",
  "Beans and Peas",
  "Beef",
  "Beef Soup Recipes",
  "Beet Salad Recipes",
  "Bok Choy",
  "Borscht",
  "Breaded Chicken",
  "Breakfast Sandwich Recipes",
  "Bulgogi Recipes",
  "Cabbage",
  "Cabbage Soup Recipes",
  "Cake Roll Recipes",
  "Cakes",
  "Carrot Salad Recipes",
  "Cheese Dips and Spreads Recipes",
  "Cheesecake Recipes",
  "Chicken",
  "Chicken Breast",
  "Chicken Cordon Bleu Recipes",
  "Chicken Soup Recipes",
  "Chicken Teriyaki Recipes",
  "Chicken Thigh Recipes",
  "Chinese",
  "Chocolate Mousse Recipes",
  "Chow Mein Noodle Recipes",
  "Cream Fillings",
  "Cream Soup Recipes",
  "Creamy",
  "Creamy Potato Salad Recipes",
  "Creme Brulee Recipes",
  "Curry",
  "Custard and Cream Pies",
  "Dairy-Free Potato Salad Recipes",
  "Desserts",
  "Drinks",
  "Duck",
  "Egg",
  "Egg Roll Recipes",
  "Filet Mignon Recipes",
  "Filipino",
  "First Courses",
  "Fish Cake Recipes",
  "Fish Soup Recipes",
  "Flat Bread Recipes",
  "Flounder",
  "France",
  "French",
  "French Onion Soup Recipes",
  "Fried Rice Recipes",
  "Frittata Recipes",
  "Fruit Tart Recipes",
  "Gazpacho Recipes",
  "Greens",
  "Ham",
  "Homemade Spice Blend Recipes",
  "Hot Cheese Dip Recipes",
  "Italian",
  "Jams and Jellies Recipes",
  "Jams and Preserves",
  "Japanese",
  "Korean",
  "Leavened products",
  "Lobster",
  "Main Courses",
  "Main Dishes",
  "Meat Pie Recipes",
  "Mexican",
  "Muffin Recipes",
  "Mushrooms",
  "No Mayo",
  "Olives",
  "Omelet Recipes",
  "Onion Soup Recipes",
  "Paella Recipes",
  "Pate Recipes",
  "Pickles",
  "Pork",
  "Pork Tenderloin Recipes",
  "Quiche",
  "Rice Bowl",
  "Rolls and Buns",
  "Romaine Lettuce Salad Recipes",
  "Russian",
  "Rye Bread",
  "Salad Dressing Recipes",
  "Salads",
  "Salmon",
  "Salmon Salad Recipes",
  "Samosas",
  "Sauces",
  "Savory Tart Recipes",
  "Savory tarts",
  "Seafood",
  "Short Ribs",
  "Shrimp",
  "Side Dishes",
  "Single Courses",
  "Sweets and desserts",
  "Teriyaki Sauce and Marinade Recipes",
  "Thai",
  "Tomato Soup Recipes",
  "Trout",
  "Vegetable Soup Recipes",
  "Vegetarian",
  "White Bread Recipes",
];

async function main() {
  try {
    const uniqueWordsList = removeDuplicatesAndExtensions(inputList);
    const cleanedListWithoutRecipes = removeRecipes(uniqueWordsList);


    console.log(cleanedListWithoutRecipes);
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

export function cleaned() { // Use this with bot
  const cleaned = main();
  return cleaned;
}
