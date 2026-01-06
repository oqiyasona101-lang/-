import { LotteryType, LotterySet } from '../types';

// Helper to generate unique random numbers in a range
const generateRandomNumbers = (count: number, min: number, max: number): number[] => {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(nums).sort((a, b) => a - b);
};

export const generateLotterySet = (type: LotteryType, source: LotterySet['source'] = 'RANDOM'): LotterySet => {
  let redBalls: number[] = [];
  let blueBalls: number[] = [];

  if (type === LotteryType.SSQ) {
    // SSQ: 6 Red (1-33), 1 Blue (1-16)
    redBalls = generateRandomNumbers(6, 1, 33);
    blueBalls = generateRandomNumbers(1, 1, 16);
  } else {
    // DLT: 5 Red (1-35), 2 Blue (1-12)
    redBalls = generateRandomNumbers(5, 1, 35);
    blueBalls = generateRandomNumbers(2, 1, 12);
  }

  return {
    id: crypto.randomUUID(),
    type,
    redBalls,
    blueBalls,
    createdAt: Date.now(),
    source
  };
};

export const getLotteryName = (type: LotteryType) => {
  return type === LotteryType.SSQ ? '双色球' : '大乐透';
};

// Check if today is a draw day
export const isDrawDay = (type: LotteryType): boolean => {
  const day = new Date().getDay(); // 0 is Sunday
  if (type === LotteryType.SSQ) {
    // Tue (2), Thu (4), Sun (0)
    return [0, 2, 4].includes(day);
  } else {
    // Mon (1), Wed (3), Sat (6)
    return [1, 3, 6].includes(day);
  }
};