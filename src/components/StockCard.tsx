
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
      <div className="flex items-center gap-8 w-full p-4">
        {/* Company Info Section - Fixed width */}
        <div className="flex items-center gap-4 w-[250px] flex-shrink-0">
          <img 
            src={`https://images.financialmodelingprep.com/symbol/${stock.ticker}.png`}
            alt={stock.name}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              e.currentTarget.src = stock.emoji;
              e.currentTarget.className = "text-2xl";
            }}
          />
          <div className="min-w-0">
            <span className="font-semibold text-card-text-header text-base block">
              {stock.ticker}
            </span>
            <span className="text-card-text text-sm block truncate">
              {stock.name}
            </span>
          </div>
        </div>

        {/* Percentage Section - Fixed width */}
        <div className="w-[120px] flex-shrink-0 text-center">
          <div
            className={`text-3xl font-bold ${
              stock.changes[stock.selectedTimeframe] < 0 ? 'text-tertiary' : 'text-primary'
            }`}
          >
            {formatChange(stock.changes[stock.selectedTimeframe])}
          </div>
        </div>

        {/* Timeframe Buttons Section - Fixed width */}
        <div className="w-[180px] grid grid-cols-2 gap-2 justify-items-end">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`px-3 py-1.5 rounded text-xs border border-card-border transition-colors w-[80px] ${
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

        {/* Drag Handle */}
        <div className="border-l border-card-border pl-6 ml-auto">
          <div className="cursor-move text-card-text opacity-50 hover:opacity-100 transition-opacity">
            <MoveVertical size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
