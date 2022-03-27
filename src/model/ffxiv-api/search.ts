type Url = string;

export type SearchType = "recipe";

export interface SearchEntry {
  ID: number;
  Icon: Url;
  Url: Url;
  _: SearchType;
  Name: string;
}
