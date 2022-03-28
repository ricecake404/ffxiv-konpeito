import { PageResult } from "./common";

export interface ActionResp {
  ID: number;
  Name_chs: string;
  Name_en: string;
  Name_ja: string;
  Icon: string;
  IconHD: string;
  IconID: number;
}

export interface ActionPageResp extends PageResult<ActionResp> {}
