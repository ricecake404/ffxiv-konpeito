import { MLName } from "./common";
import { CraftingStatus } from "./status";
import { Recipe } from "./recipe";

type DBTable = "CraftAction" | "Action";
type CraftActionType =
  | "first-craftsmanship"
  | "craftsmanship"
  | "control"
  | "durability"
  | "buff"
  | "other";
type CraftClassJobType =
  | "CRP"
  | "BSM"
  | "ARM"
  | "GSM"
  | "LTW"
  | "WVR"
  | "ALC"
  | "CUL";

type ClassJobId = number;
interface CraftClassJob {
  id: ClassJobId;
  type: CraftClassJobType;
}

const CraftClassJobList: CraftClassJob[] = [
  { id: 8, type: "CRP" }, //"木",
  { id: 9, type: "BSM" }, //"鍛",
  { id: 10, type: "ARM" }, //"甲",
  { id: 11, type: "GSM" }, //"彫",
  { id: 12, type: "LTW" }, //"革",
  { id: 13, type: "WVR" }, //"裁",
  { id: 14, type: "ALC" }, //"錬",
  { id: 15, type: "CUL" }, //"調",
];

interface CraftActionData {
  id: number;
  name: string;
  table: DBTable;
  level: number;
  cp: number;
  durability: number;
  efficiency: number;
  successPercentage: number;
  type: CraftActionType;
  master: boolean;
}

const CraftActionDataList: CraftActionData[] = [
  {
    id: 100001,
    name: "制作",
    table: "CraftAction",
    level: 1,
    cp: 0,
    durability: 10,
    efficiency: 100,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100002,
    name: "加工",
    table: "CraftAction",
    level: 5,
    cp: 18,
    durability: 10,
    efficiency: 100,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100003,
    name: "精修",
    table: "CraftAction",
    level: 7,
    cp: 88,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "durability",
    master: false,
  },
  {
    id: 100363,
    name: "高速制作",
    table: "CraftAction",
    level: 9,
    cp: 0,
    durability: 10,
    efficiency: 250,
    successPercentage: 50,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100355,
    name: "仓促",
    table: "CraftAction",
    level: 9,
    cp: 0,
    durability: 10,
    efficiency: 100,
    successPercentage: 60,
    type: "control",
    master: false,
  },
  {
    id: 100010,
    name: "观察",
    table: "CraftAction",
    level: 13,
    cp: 7,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "other",
    master: false,
  },
  {
    id: 100371,
    name: "秘诀",
    table: "CraftAction",
    level: 13,
    cp: 0,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "other",
    master: false,
  },
  {
    id: 19297,
    name: "崇敬",
    table: "Action",
    level: 15,
    cp: 18,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "buff",
    master: false,
  },
  {
    id: 4631,
    name: "俭约",
    table: "Action",
    level: 15,
    cp: 56,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "durability",
    master: false,
  },
  {
    id: 100004,
    name: "中级加工",
    table: "CraftAction",
    level: 18,
    cp: 32,
    durability: 10,
    efficiency: 125,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 260,
    name: "阔步",
    table: "Action",
    level: 21,
    cp: 32,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "buff",
    master: false,
  },
  {
    id: 19004,
    name: "改革",
    table: "Action",
    level: 26,
    cp: 18,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "buff",
    master: false,
  },
  {
    id: 100001,
    name: "制作",
    table: "CraftAction",
    level: 31,
    cp: 0,
    durability: 10,
    efficiency: 120,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 19012,
    name: "最终确认",
    table: "Action",
    level: 42,
    cp: 1,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "other",
    master: false,
  },
  {
    id: 4639,
    name: "长期俭约",
    table: "Action",
    level: 47,
    cp: 98,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "durability",
    master: false,
  },
  {
    id: 100339,
    name: "比尔格的祝福",
    table: "CraftAction",
    level: 50,
    cp: 24,
    durability: 10,
    efficiency: 100,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100128,
    name: "集中加工",
    table: "CraftAction",
    level: 53,
    cp: 18,
    durability: 10,
    efficiency: 150,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100379,
    name: "坚信",
    table: "CraftAction",
    level: 54,
    cp: 6,
    durability: 10,
    efficiency: 300,
    successPercentage: 100,
    type: "first-craftsmanship",
    master: false,
  },
  {
    id: 100395,
    name: "设计变动",
    table: "CraftAction",
    level: 55,
    cp: 0,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "other",
    master: true,
  },
  {
    id: 100203,
    name: "模范制作",
    table: "CraftAction",
    level: 62,
    cp: 4,
    durability: 10,
    efficiency: 150,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100363,
    name: "高速制作",
    table: "CraftAction",
    level: 63,
    cp: 0,
    durability: 10,
    efficiency: 500,
    successPercentage: 50,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 4574,
    name: "掌握",
    table: "Action",
    level: 65,
    cp: 96,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "durability",
    master: false,
  },
  {
    id: 100227,
    name: "俭约加工",
    table: "CraftAction",
    level: 66,
    cp: 25,
    durability: 5,
    efficiency: 100,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100235,
    name: "注视制作",
    table: "CraftAction",
    level: 67,
    cp: 5,
    durability: 10,
    efficiency: 200,
    successPercentage: 50,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100243,
    name: "注视加工",
    table: "CraftAction",
    level: 68,
    cp: 18,
    durability: 10,
    efficiency: 150,
    successPercentage: 50,
    type: "control",
    master: false,
  },
  {
    id: 100387,
    name: "闲静",
    table: "CraftAction",
    level: 69,
    cp: 6,
    durability: 10,
    efficiency: 100,
    successPercentage: 100,
    type: "first-craftsmanship",
    master: false,
  },
  {
    id: 100299,
    name: "坯料加工",
    table: "CraftAction",
    level: 71,
    cp: 40,
    durability: 20,
    efficiency: 200,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100403,
    name: "坯料制作",
    table: "CraftAction",
    level: 72,
    cp: 18,
    durability: 20,
    efficiency: 300,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100323,
    name: "精密制作",
    table: "CraftAction",
    level: 76,
    cp: 32,
    durability: 10,
    efficiency: 100,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100315,
    name: "集中制作",
    table: "CraftAction",
    level: 78,
    cp: 6,
    durability: 10,
    efficiency: 400,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100283,
    name: "工匠的神速技巧",
    table: "CraftAction",
    level: 80,
    cp: 250,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "first-craftsmanship",
    master: false,
  },
  {
    id: 100203,
    name: "模范制作",
    table: "CraftAction",
    level: 82,
    cp: 7,
    durability: 10,
    efficiency: 180,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100411,
    name: "上级加工",
    table: "CraftAction",
    level: 84,
    cp: 46,
    durability: 10,
    efficiency: 150,
    successPercentage: 100,
    type: "control",
    master: false,
  },
  {
    id: 100403,
    name: "坯料制作",
    table: "CraftAction",
    level: 86,
    cp: 18,
    durability: 20,
    efficiency: 360,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100419,
    name: "专心致志",
    table: "CraftAction",
    level: 86,
    cp: 0,
    durability: 0,
    efficiency: 0,
    successPercentage: 100,
    type: "other",
    master: true,
  },
  {
    id: 100427,
    name: "俭约制作",
    table: "CraftAction",
    level: 88,
    cp: 18,
    durability: 5,
    efficiency: 180,
    successPercentage: 100,
    type: "craftsmanship",
    master: false,
  },
  {
    id: 100435,
    name: "工匠的神技",
    table: "CraftAction",
    level: 90,
    cp: 32,
    durability: 0,
    efficiency: 100,
    successPercentage: 100,
    type: "control",
    master: false,
  },
];

export interface CraftAction extends Omit<CraftActionData, "id" | "name"> {
  id: string;
  classJobActions: Map<ClassJobId, number>;
  name: MLName;
  table: DBTable;
  level: number;
  cp: number;
  durability: number;
  efficiency: number;
  successPercentage: number;
  type: CraftActionType;
  master: boolean;
}

const ActionMaps: Record<number, number[]> = {
  100001: [100001, 100015, 100030, 100075, 100045, 100060, 100090, 100105],
  100002: [100002, 100016, 100031, 100076, 100046, 100061, 100091, 100106],
  100003: [100003, 100017, 100032, 100077, 100047, 100062, 100092, 100107],
  100004: [100004, 100018, 100034, 100078, 100048, 100064, 100093, 100109],
  100010: [100010, 100023, 100040, 100082, 100053, 100070, 100099, 100113],
  100128: [100128, 100129, 100130, 100131, 100132, 100133, 100134, 100135],
  100203: [100203, 100204, 100205, 100206, 100207, 100208, 100209, 100210],
  100227: [100227, 100228, 100229, 100230, 100231, 100232, 100233, 100234],
  100235: [100235, 100236, 100237, 100238, 100239, 100240, 100241, 100242],
  100243: [100243, 100244, 100245, 100246, 100247, 100248, 100249, 100250],
  100283: [100283, 100284, 100285, 100286, 100287, 100288, 100289, 100290],
  100299: [100299, 100300, 100301, 100302, 100303, 100304, 100305, 100306],
  100315: [100315, 100316, 100317, 100318, 100319, 100320, 100321, 100322],
  100323: [100323, 100324, 100325, 100326, 100327, 100328, 100329, 100330],
  100339: [100339, 100340, 100341, 100342, 100343, 100344, 100345, 100346],
  100355: [100355, 100356, 100357, 100358, 100359, 100360, 100361, 100362],
  100363: [100363, 100364, 100365, 100366, 100367, 100368, 100369, 100370],
  100371: [100371, 100372, 100373, 100374, 100375, 100376, 100377, 100378],
  100379: [100379, 100380, 100381, 100382, 100383, 100384, 100385, 100386],
  100387: [100387, 100388, 100389, 100390, 100391, 100392, 100393, 100394],
  100395: [100395, 100396, 100397, 100398, 100399, 100400, 100401, 100402],
  100403: [100403, 100404, 100405, 100406, 100407, 100408, 100409, 100410],
  100411: [100411, 100412, 100413, 100414, 100415, 100416, 100417, 100418],
  100419: [100419, 100420, 100421, 100422, 100423, 100424, 100425, 100426],
  100427: [100427, 100428, 100429, 100430, 100431, 100432, 100433, 100434],
  100435: [100435, 100436, 100437, 100438, 100439, 100440, 100441, 100442],
};

export const CraftActionList: CraftAction[] = CraftActionDataList.map(
  (data) => {
    return {
      ...data,
      id: `${data.id}-${data.level}`,
      name: { chs: data.name, en: "", ja: "" },
      classJobActions: new Map(
        CraftClassJobList.map((job, index) => {
          if (ActionMaps[data.id]) {
            return [job.id, ActionMaps[data.id][index]];
          } else {
            return [job.id, data.id];
          }
        })
      ),
    };
  }
);

export interface CraftingProcessStatus {
  cp: number;
  cpTotal: number;
  progress: number;
  progressTotal: number;
  progressPercentage: number;
  quality: number;
  qualityTotal: number;
  qualityPercentage: number;
  durability: number;
  durabilityTotal: number;
  durabilityPercentage: number;
  successPercentage: number;
}

export const EmptyCraftingProcessStatus = {
  cp: 0,
  cpTotal: 0,
  progress: 0,
  progressTotal: 0,
  progressPercentage: 0,
  quality: 0,
  qualityTotal: 0,
  qualityPercentage: 0,
  durability: 0,
  durabilityTotal: 0,
  durabilityPercentage: 0,
  successPercentage: 1,
};

export const initCraftingProcessStatus = (
  cs: CraftingStatus,
  recipe: Recipe
): CraftingProcessStatus => {
  const calcReal = (standard: number, factor: number) =>
    Math.floor((standard * factor) / 100);
  const durability = calcReal(recipe.rltDurability, recipe.durabilityFactor);
  return {
    cp: cs.cp,
    cpTotal: cs.cp,
    progress: 0,
    progressTotal: calcReal(recipe.rltProgress, recipe.progressFactor),
    progressPercentage: 0,
    quality: 0,
    qualityTotal: calcReal(recipe.rltQuality, recipe.qualityFactor),
    qualityPercentage: 0,
    durability: durability,
    durabilityTotal: durability,
    durabilityPercentage: 0,
    successPercentage: 1,
  };
};

export const craft = (
  ps: CraftingProcessStatus,
  s: CraftingStatus,
  action: CraftAction
) => {
  switch (action.name.chs) {
    case "制作*":
      return {
        ...ps,
        cp: ps.cp - action.cp,
        progress: ps.progress + action.efficiency,
      };
  }
};

export const CraftActions = [];
