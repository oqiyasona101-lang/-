export enum LotteryType {
  SSQ = 'SSQ', // Double Color Ball (双色球)
  DLT = 'DLT'  // Super Lotto (大乐透)
}

export interface LotterySet {
  id: string;
  type: LotteryType;
  redBalls: number[];
  blueBalls: number[];
  createdAt: number;
  source: 'MANUAL' | 'RANDOM' | 'AI_LUCKY';
  note?: string;
}

export interface LuckyDailyResponse {
  luckyIndex: number; // 0-100
  element: string; // Five Elements (e.g., "Fire")
  auspiciousDirection: string;
  advice: string; // Short advice based on Huang Li
  suggestedNumbers: {
    type: LotteryType;
    redBalls: number[];
    blueBalls: number[];
    reasoning: string;
  };
}

export interface StoredData {
  savedSets: LotterySet[];
}