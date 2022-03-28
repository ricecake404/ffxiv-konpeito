import { SearchEntry } from "./search";
import { Recipe } from "../eorzea/recipe";

export interface SearchRecipe extends SearchEntry {
  _: "recipe";
}

export interface RecipeResp {
  ID: number;
  DifficultyFactor: number; // 100,
  DurabilityFactor: number; // 100,
  Name_chs: string; // "Classical Wristband of Healing",
  Name_en: string;
  Name_ja: string;
  QualityFactor: number; // 140,
  RecipeLevelTable: {
    ClassJobLevel: number; // 90,
    ConditionsFlag: number; // 15,
    Difficulty: number; // 3900,
    Durability: number; // 70,
    ID: number; // 580,
    ProgressDivider: number; // 130,
    ProgressModifier: number; // 80,
    Quality: number; // 7800,
    QualityDivider: number; // 115,
    QualityModifier: number; // 70,
    Stars: number; // 2,
    SuggestedControl: number; // 2703,
    SuggestedCraftsmanship: number; // 2924
  };
}

export const toRecipe = (r: RecipeResp): Recipe => {
  return {
    id: r.ID,
    name: { chs: r.Name_chs, en: r.Name_en, ja: r.Name_ja },
    progressFactor: r.DifficultyFactor,
    qualityFactor: r.QualityFactor,
    durabilityFactor: r.DurabilityFactor,
    rltProgress: r.RecipeLevelTable.Difficulty,
    rltQuality: r.RecipeLevelTable.Quality,
    rltDurability: r.RecipeLevelTable.Durability,
  };
};
