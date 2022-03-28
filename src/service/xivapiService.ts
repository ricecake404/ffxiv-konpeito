import { SearchType } from "../model/ffxiv-api/search";
import { PageResult } from "../model/ffxiv-api/common";
import { RecipeResp, SearchRecipe } from "../model/ffxiv-api/recipe";
import { Language } from "../model/eorzea/common";
import { ActionPageResp } from "../model/ffxiv-api/action";

export const HOST = "https://cafemaker.wakingsands.com";

export const search = (
  query: string,
  type: SearchType,
  filters: string = "",
  language: Language = "chs"
): Promise<PageResult<SearchRecipe>> => {
  let url = `${HOST}/search?string=${query}&indexes=${type}&language=${language}`;
  if (filters) {
    url += `&filters=${filters}`;
  }
  return fetch(url).then((it) => {
    if (it.ok) {
      return it.json();
    } else {
      throw Error(`Fetch Search Result Failed with q: ${query}, t: ${type}`);
    }
  });
};

export const getRecipe = (
  recipeId: number,
  language: Language = "chs"
): Promise<RecipeResp> => {
  const columns = [
    "Name",
    "DifficultyFactor",
    "QualityFactor",
    "DurabilityFactor",
    "RecipeLevelTable",
  ].join(",");
  return fetch(
    HOST + `/Recipe/${recipeId}?columns=${columns}&language=${language}`
  ).then((it) => {
    if (it.ok) {
      return it.json();
    } else {
      throw Error(`Fetch actions Failed with`);
    }
  });
};

export const getActions = (actionIds: number[]): Promise<ActionPageResp> => {
  const columns = [
    "ID",
    "Name_chs",
    "Name_en",
    "Name_ja",
    "Icon",
    "IconHD",
    "IconID",
  ].join(",");
  return fetch(HOST + `/Action?ids=${actionIds}&columns=${columns}`).then(
    (it) => {
      if (it.ok) {
        return it.json();
      } else {
        throw Error(`Fetch actions Failed with`);
      }
    }
  );
};

export const getCraftActions = (
  actionIds: number[]
): Promise<ActionPageResp> => {
  const columns = [
    "ID",
    "Name_chs",
    "Name_en",
    "Name_ja",
    "Icon",
    "IconHD",
    "IconID",
  ].join(",");
  return fetch(HOST + `/CraftAction?ids=${actionIds}&columns=${columns}`).then(
    (it) => {
      if (it.ok) {
        return it.json();
      } else {
        throw Error(`Fetch actions Failed with`);
      }
    }
  );
};
