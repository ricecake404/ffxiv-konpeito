import { MLName } from "./common";

type ItemId = number;

export interface Item {
  id: ItemId;
  name: MLName;
}
