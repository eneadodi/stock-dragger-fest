
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
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full p-4">
        {/* Company Info Section */}
        <div className="flex items-center gap-4 w-full md:w-[250px] md:flex-shrink-0">
          <img 
            src={`https://images.financialmodelingprep.com/symbol/${stock.ticker}.png`}
            alt={stock.name}
            className="w-8 md:w-10 h-8 md:h-10 object-contain"
            onError={(e) => {
              e.currentTarget.src = stock.emoji;
              e.currentTarget.className = "text-xl md:text-2xl";
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-card-text-header text-base block">
              {stock.ticker}
            </span>
            <span className="text-card-text text-sm block truncate">
              {stock.name}
            </span>
          </div>
          
          {/* Move drag handle next to company info on mobile */}
          <div className="md:hidden border-l border-card-border pl-4">
            <div className="cursor-move text-card-text opacity-50 hover:opacity-100 transition-opacity">
              <MoveVertical size={20} />
            </div>
          </div>
        </div>

        {/* Percentage Section */}
        <div className="w-full md:w-[120px] md:flex-shrink-0 text-left md:text-center">
          <div
            className={`text-xl md:text-2xl font-bold ${
              stock.changes[stock.selectedTimeframe] < 0 ? 'text-tertiary' : 'text-amber-500'
            }`}
          >
            {formatChange(stock.changes[stock.selectedTimeframe])}
          </div>
        </div>

        {/* Timeframe Buttons Section */}
        <div className="w-full md:w-[280px] grid grid-cols-3 grid-rows-2 gap-1.5 md:gap-2 md:ml-8">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`px-1 md:px-3 py-1 md:py-1.5 rounded text-xs border border-card-border transition-colors ${
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

        {/* Desktop Drag Handle */}
        <div className="hidden md:block border-l border-card-border pl-6 ml-auto">
          <div className="cursor-move text-card-text opacity-50 hover:opacity-100 transition-opacity">
            <MoveVertical size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
