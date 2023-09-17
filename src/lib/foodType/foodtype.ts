import fs from "fs";
import { getCategories } from "../../database/querys/recipe";

export async function sortByFoodType(lang: string): Promise<string[]> {
  const categories: string[] = await getCategories(lang);

  return categories;
}

export async function getCountriesCategories() {
  let countries: string[] = [];

  const jsonRaw = fs.readFileSync("foodCountry.json");
  const json = JSON.parse(jsonRaw.toString());
  for (let i of json) {
    for (let j of i.cuisines) {
      countries.push(j);
    }
  }
  return countries;
}
