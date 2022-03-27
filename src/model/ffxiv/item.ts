type ItemId = number;

type Locale = "chs" | "en" | "ja";

type MLName = Record<Locale, string>;

export interface Item {
  id: ItemId;
  name: MLName;
}
