
export interface Stock {
  ticker: string;
  name: string;
  emoji: string;
  changes: {
    "1D": number;
    "1W": number;
    "1M": number;
    "6M": number;
    "1Y": number;
  };
  selectedTimeframe: "1D" | "1W" | "1M" | "6M" | "1Y";
}

export interface RankSlot {
  stock: Stock | null;
}
