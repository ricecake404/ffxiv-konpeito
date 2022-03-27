import { SearchType } from "../model/ffxiv-api/search";
import { PageResult } from "../model/ffxiv-api/common";
import { SearchRecipe } from "../model/ffxiv-api/recipe";
import { Language } from "../model/eorzea/common";

const HOST = "https://cafemaker.wakingsands.com";

export const search = (
  query: string,
  type: SearchType,
  language: Language = "chs"
): Promise<PageResult<SearchRecipe>> => {
  return fetch(HOST + `/search?string=${query}&indexes=${type}`).then((it) => {
    if (it.ok) {
      return it.json();
    } else {
      throw Error(`Fetch Search Result Failed with q: ${query}, t: ${type}`);
    }
  });
};
