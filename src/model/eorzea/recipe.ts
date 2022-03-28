import { MLName } from "./common";

export type RecipeId = number;

export interface Recipe {
  id: RecipeId;
  name: MLName;
  progressFactor: number;
  qualityFactor: number;
  durabilityFactor: number;

  rltProgress: number;
  rltQuality: number;
  rltDurability: number;
}
