import { MLName } from "./common";

export type RecipeId = number;

export interface Recipe {
  id: RecipeId;
  name: MLName;
}
