import { CraftingStatus } from "./status";
import { Recipe } from "./recipe";
import { Action, CraftingProcessStatus } from "./action";

const calcProgress = (
  ps: CraftingProcessStatus,
  s: CraftingStatus,
  r: Recipe,
  action: Action
): number => {
  // 压制系数
  // 取rlt表中作业/加工压制列数值/100作为压制系数
  // 这个系数仅当制作职业等级小于等于配方等级时生效，在制作职业等级高于配方等级时不参与计算(或者说变为1)
  const modifier = s.level >= r.rltLevel ? 1 : r.rltProgressModifier / 100;

  // 作业/加工难度系数
  // 为了简化公式，取rlt表中作业/加工难度列数值/10作为难度系数
  const divider = r.rltProgressDivider / 10;

  // 基准进展 = rounddown(作业压制系数*(作业精度/作业难度系数+2),0)
  const basicProgress = Math.floor(modifier * (s.craftsmanship / divider + 2));

  // 效率系数=技能效率*(1+加成系数)/100
  const efficiency = (action.efficiency * (1 + action.efficiencyBuff)) / 100;

  // 作业进展=rounddown(基准进展*效率系数,0)
  const progress = Math.floor(basicProgress * efficiency);
  return progress;
};

const calcQuality = (
  ps: CraftingProcessStatus,
  s: CraftingStatus,
  r: Recipe,
  action: Action
): number => {
  // 压制系数
  // 取rlt表中作业/加工压制列数值/100作为压制系数
  // 这个系数仅当制作职业等级小于等于配方等级时生效，在制作职业等级高于配方等级时不参与计算(或者说变为1)
  const modifier = s.level >= r.rltLevel ? 1 : r.rltQualityModifier / 100;

  // 作业/加工难度系数
  // 为了简化公式，取rlt表中作业/加工难度列数值/10作为难度系数
  const divider = r.rltQualityDivider / 10;

  // 基准品质=rounddown(加工压制系数*(加工精度/加工难度系数+35),0)
  const basicQuality = Math.floor(modifier * (s.control / divider + 35));

  // 效率系数=技能效率*(1+加成系数)/100
  const efficiency = (action.efficiency * (1 + action.efficiencyBuff)) / 100;

  // 内静系数=1+0.1*内静buff层数
  // 内静buff最高10层，内静系数最大为2.0
  const innerQuiet = 1 + 0.1 * ps.innerQuietStack;

  // 加工品质=rounddown(基准品质*效率系数*内静系数*品质状态系数,0)
  const quality = Math.floor(
    basicQuality * efficiency * innerQuiet * ps.condition.factor
  );
  return quality;
};

export const craft = (
  ps: CraftingProcessStatus,
  s: CraftingStatus,
  r: Recipe,
  action: Action
): CraftingProcessStatus => {
  const toEnhanced = (action: Action, level: number) => {
    if (action.enhancedLevel) {
      return {
        ...action,
        efficiency:
          level >= action.enhancedLevel
            ? action.enhancedEfficiency!!
            : action.efficiency,
      };
    } else {
      return action;
    }
  };

  const ea = toEnhanced(action, s.level);

  const durability = ps.durability - ea.durability;
  const cp = ps.cp - ea.cp;

  let newPS = {
    ...ps,
    durability: durability,
    cp: cp,
  };

  switch (ea.name.chs) {
    case "制作":
    case "高速制作":
    case "模范制作":
    case "注视制作":
      // 连击条件：观察
      // 成功率：50%
      // 连击时成功率：100%
      newPS.progress += calcProgress(ps, s, r, ea);
      break;
    case "坯料制作":
      // 在剩余耐久不足的情况下使用时，效率会减半
      const efficiency = durability < 0 ? ea.efficiency / 2 : ea.efficiency;
      newPS.progress += calcProgress(ps, s, r, {
        ...ea,
        efficiency: efficiency,
      });
      break;
    case "精密制作":
      newPS.progress += calcProgress(ps, s, r, ea);
      newPS.quality += calcQuality(ps, s, r, ea);
      break;
    case "集中制作":
      // 只有在“高品质”及以上的状态下才能使用
      if (ps.condition.factor > 1) {
        newPS.progress += calcProgress(ps, s, r, ea);
      }
      break;
    case "俭约制作":
      // 在俭约和长期俭约状态下无法使用
      if (ps.wasteNotStack === 0) {
        newPS.progress += calcProgress(ps, s, r, ea);
      }
      break;
    default:
    // do nothing
  }

  if (newPS.wasteNotStack > 0) {
    newPS.wasteNotStack--;
  }

  return newPS;
};

export const toHQPercent = (percent: number) => {
  const idx = Quality2HQ.findIndex((it) => it.qualityPercent > percent);
  if (idx === 0) {
    throw Error("percent < 0");
  } else if (idx > 0) {
    return Quality2HQ[idx - 1].hqPercent;
  } else {
    return 100;
  }
};

interface Quality2HQType {
  qualityPercent: number;
  hqPercent: number;
}

const Quality2HQ: Quality2HQType[] = [
  { qualityPercent: 0, hqPercent: 1 },
  { qualityPercent: 0.05, hqPercent: 2 },
  { qualityPercent: 0.09, hqPercent: 3 },
  { qualityPercent: 0.13, hqPercent: 4 },
  { qualityPercent: 0.17, hqPercent: 5 },
  { qualityPercent: 0.21, hqPercent: 6 },
  { qualityPercent: 0.25, hqPercent: 7 },
  { qualityPercent: 0.29, hqPercent: 8 },
  { qualityPercent: 0.32, hqPercent: 9 },
  { qualityPercent: 0.35, hqPercent: 10 },
  { qualityPercent: 0.38, hqPercent: 11 },
  { qualityPercent: 0.41, hqPercent: 12 },
  { qualityPercent: 0.44, hqPercent: 13 },
  { qualityPercent: 0.47, hqPercent: 14 },
  { qualityPercent: 0.5, hqPercent: 15 },
  { qualityPercent: 0.53, hqPercent: 16 },
  { qualityPercent: 0.55, hqPercent: 17 },
  { qualityPercent: 0.58, hqPercent: 18 },
  { qualityPercent: 0.61, hqPercent: 19 },
  { qualityPercent: 0.63, hqPercent: 20 },
  { qualityPercent: 0.65, hqPercent: 21 },
  { qualityPercent: 0.66, hqPercent: 22 },
  { qualityPercent: 0.67, hqPercent: 23 },
  { qualityPercent: 0.68, hqPercent: 24 },
  { qualityPercent: 0.69, hqPercent: 26 },
  { qualityPercent: 0.7, hqPercent: 28 },
  { qualityPercent: 0.71, hqPercent: 31 },
  { qualityPercent: 0.72, hqPercent: 34 },
  { qualityPercent: 0.73, hqPercent: 38 },
  { qualityPercent: 0.74, hqPercent: 42 },
  { qualityPercent: 0.75, hqPercent: 47 },
  { qualityPercent: 0.76, hqPercent: 52 },
  { qualityPercent: 0.77, hqPercent: 58 },
  { qualityPercent: 0.78, hqPercent: 64 },
  { qualityPercent: 0.79, hqPercent: 68 },
  { qualityPercent: 0.8, hqPercent: 71 },
  { qualityPercent: 0.81, hqPercent: 74 },
  { qualityPercent: 0.82, hqPercent: 76 },
  { qualityPercent: 0.83, hqPercent: 78 },
  { qualityPercent: 0.84, hqPercent: 80 },
  { qualityPercent: 0.85, hqPercent: 81 },
  { qualityPercent: 0.86, hqPercent: 82 },
  { qualityPercent: 0.87, hqPercent: 83 },
  { qualityPercent: 0.88, hqPercent: 84 },
  { qualityPercent: 0.89, hqPercent: 85 },
  { qualityPercent: 0.9, hqPercent: 86 },
  { qualityPercent: 0.91, hqPercent: 87 },
  { qualityPercent: 0.92, hqPercent: 88 },
  { qualityPercent: 0.93, hqPercent: 89 },
  { qualityPercent: 0.94, hqPercent: 90 },
  { qualityPercent: 0.95, hqPercent: 91 },
  { qualityPercent: 0.96, hqPercent: 92 },
  { qualityPercent: 0.97, hqPercent: 94 },
  { qualityPercent: 0.98, hqPercent: 96 },
  { qualityPercent: 0.99, hqPercent: 98 },
  { qualityPercent: 1, hqPercent: 100 },
];
