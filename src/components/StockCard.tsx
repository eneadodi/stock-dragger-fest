
import { Stock } from "@/types/stock";
import { MoveVertical } from "lucide-react";

interface StockCardProps {
  stock: Stock;
  onTimeframeChange: (timeframe: "1D" | "1W" | "1M" | "6M" | "1Y") => void;
  isDragging?: boolean;
}

const StockCard = ({ stock, onTimeframeChange, isDragging }: StockCardProps) => {
  const formatChange = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const timeframes = ["1D", "1W", "1M", "6M", "1Y"] as const;

  return (
    <div className={`flex-1 ${isDragging ? 'dragging' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{stock.emoji}</span>
        <div>
          <span className="font-semibold text-card-text-header text-sm">
            {stock.ticker}
          </span>
          <span className="text-card-text text-xs ml-1">{stock.name}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 text-center">
          <div
            className={`text-lg font-medium ${
              stock.changes[stock.selectedTimeframe] > 0
                ? 'text-primary'
                : 'text-tertiary'
            }`}
          >
            {formatChange(stock.changes[stock.selectedTimeframe])}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 w-28">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`px-2 py-1 rounded text-xs border transition-colors ${
                stock.selectedTimeframe === timeframe
                  ? 'bg-primary text-background border-primary'
                  : 'text-primary border-primary/30 hover:bg-primary/10'
              }`}
              onClick={() => onTimeframeChange(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-move text-card-text opacity-50 hover:opacity-100 transition-opacity">
        <MoveVertical size={20} />
      </div>
    </div>
  );
};

export default StockCard;
