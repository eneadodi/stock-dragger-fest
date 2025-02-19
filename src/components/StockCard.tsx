
import { Stock } from "@/types/stock";
import { MoveVertical } from "lucide-react";

interface StockCardProps {
  stock: Stock;
  onTimeframeChange: (timeframe: "1D" | "1W" | "1M" | "6M" | "1Y" | "5Y") => void;
  isDragging?: boolean;
}

const StockCard = ({ stock, onTimeframeChange, isDragging }: StockCardProps) => {
  const formatChange = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const timeframes = ["1D", "1W", "1M", "6M", "1Y", "5Y"] as const;

  return (
    <div className={`flex-1 ${isDragging ? 'dragging' : ''}`}>
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <img 
            src={`https://images.financialmodelingprep.com/symbol/${stock.ticker}.png`}
            alt={stock.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = stock.emoji;
              e.currentTarget.className = "text-xl";
            }}
          />
          <div>
            <span className="font-semibold text-card-text-header text-sm">
              {stock.ticker}
            </span>
            <span className="text-card-text text-xs ml-1">{stock.name}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div
            className={`text-lg font-medium ${
              stock.changes[stock.selectedTimeframe] < 0 ? 'text-tertiary' : 'text-primary'
            }`}
          >
            {formatChange(stock.changes[stock.selectedTimeframe])}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-6 gap-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`px-2 py-1 rounded text-xs border border-card-border transition-colors ${
                stock.selectedTimeframe === timeframe
                  ? 'bg-card-field text-card-text-header'
                  : 'text-card-text hover:bg-card-field/50'
              }`}
              onClick={() => onTimeframeChange(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>

        <div className="border-l border-card-border pl-3">
          <div className="cursor-move text-card-text opacity-50 hover:opacity-100 transition-opacity">
            <MoveVertical size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
