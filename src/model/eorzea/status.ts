export interface CraftingStatus {
  level: number;
  craftsmanship: number;
  control: number;
  cp: number;
}

export const craftingStatusToString = (cs: CraftingStatus): string => {
  return `[${cs.level}]${cs.craftsmanship}/${cs.control}/${cs.cp}`;
};

export interface Status extends CraftingStatus {
  specialist: boolean;
}

export const toCraftingStatus = (s: Status): CraftingStatus => {
  // TODO change status according to master and buffers(food, etc...)

  let craftsmanshipBuff = 0;
  let controlBuff = 0;
  let cpBuff = 0;

  if (s.specialist) {
    craftsmanshipBuff = 20;
    controlBuff = 20;
    cpBuff = 15;
  }

  return {
    level: s.level,
    craftsmanship: s.craftsmanship + craftsmanshipBuff,
    control: s.control + controlBuff,
    cp: s.cp + cpBuff,
  };
};

export const EmptyStatus: Status = {
  level: 0,
  craftsmanship: 0,
  control: 0,
  cp: 0,
  specialist: false,
};
