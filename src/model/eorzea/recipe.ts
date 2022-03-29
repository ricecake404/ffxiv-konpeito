import { MLName } from "./common";

export type RecipeId = number;

export interface Recipe {
  id: RecipeId;
  name: MLName;
  progressFactor: number;
  qualityFactor: number;
  durabilityFactor: number;

  rltLevel: number;
  rltProgress: number;
  rltQuality: number;
  rltDurability: number;
  rltProgressDivider: number; // 作业难度
  rltProgressModifier: number; // 作业压制
  rltQualityDivider: number; // 加工难度
  rltQualityModifier: number; // 加工压制
}
