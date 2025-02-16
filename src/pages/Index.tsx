import { useState, useEffect } from "react";
import { Stock, RankSlot } from "@/types/stock";
import StockCard from "@/components/StockCard";
import { useToast } from "@/hooks/use-toast";

const MOCK_STOCKS: Stock[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    emoji: "🍎",
    changes: { "1D": 2.5, "1W": -1.2, "1M": 5.8, "6M": 15.3, "1Y": 25.7, "5Y": 270.5 },
    selectedTimeframe: "1D"
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    emoji: "🚗",
    changes: { "1D": -1.8, "1W": 3.4, "1M": -2.1, "6M": 8.9, "1Y": 12.4, "5Y": 940.2 },
    selectedTimeframe: "1D"
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    emoji: "💻",
    changes: { "1D": 1.7, "1W": 4.2, "1M": 7.5, "6M": 22.1, "1Y": 45.2, "5Y": 320.8 },
    selectedTimeframe: "1D"
  },
  {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    emoji: "📦",
    changes: { "1D": 0.9, "1W": 2.8, "1M": 6.3, "6M": 18.7, "1Y": 32.1, "5Y": 180.4 },
    selectedTimeframe: "1D"
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    emoji: "🔍",
    changes: { "1D": 1.2, "1W": 3.1, "1M": 4.8, "6M": 16.4, "1Y": 28.9, "5Y": 150.6 },
    selectedTimeframe: "1D"
  }
];

const Index = () => {
  const { toast } = useToast();
  const [rankSlots, setRankSlots] = useState<RankSlot[]>(
    Array(5).fill({ stock: null })
  );
  const [availableStocks, setAvailableStocks] = useState<Stock[]>(MOCK_STOCKS);
  const [timeRemaining, setTimeRemaining] = useState("23:59:59");
  const [totalVotes, setTotalVotes] = useState(1234);

  useEffect(() => {
    // Update time remaining
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59);
      const diff = end.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.DragEvent, stock: Stock, fromSlot?: number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ stock, fromSlot }));
    setTimeout(() => {
      (e.target as HTMLElement).classList.add("dragging");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest("[data-drop-zone]");
    if (dropZone) {
      dropZone.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const dropZone = target.closest("[data-drop-zone]");
    if (dropZone) {
      dropZone.classList.remove("drag-over");
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropZone = target.closest("[data-drop-zone]");
    if (dropZone) {
      dropZone.classList.remove("drag-over");
    }

    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const { stock, fromSlot } = data;

    const newRankSlots = [...rankSlots];
    const newAvailableStocks = [...availableStocks];

    if (typeof fromSlot === 'number') {
      // Moving between rank slots
      newRankSlots[fromSlot] = { stock: null };
      if (newRankSlots[targetIndex].stock) {
        newRankSlots[fromSlot] = newRankSlots[targetIndex];
      }
    } else {
      // Moving from available stocks
      if (newRankSlots[targetIndex].stock) {
        newAvailableStocks.push(newRankSlots[targetIndex].stock!);
      }
      newAvailableStocks.splice(newAvailableStocks.findIndex(s => s.ticker === stock.ticker), 1);
    }

    newRankSlots[targetIndex] = { stock };
    
    setRankSlots(newRankSlots);
    setAvailableStocks(newAvailableStocks);
  };

  const handleTimeframeChange = (stock: Stock, timeframe: "1D" | "1W" | "1M" | "6M" | "1Y" | "5Y") => {
    const newRankSlots = rankSlots.map(slot => {
      if (slot.stock?.ticker === stock.ticker) {
        return {
          stock: { ...slot.stock, selectedTimeframe: timeframe }
        };
      }
      return slot;
    });
    setRankSlots(newRankSlots);
  };

  const resetRanking = () => {
    setRankSlots(Array(5).fill({ stock: null }));
    setAvailableStocks(MOCK_STOCKS);
    toast({
      title: "Ranking Reset",
      description: "Your ranking has been reset successfully.",
    });
  };

  const submitRanking = () => {
    const filledSlots = rankSlots.filter(slot => slot.stock).length;
    if (filledSlots !== rankSlots.length) {
      toast({
        title: "Cannot Submit",
        description: "Please fill all ranking slots before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Ranking Submitted",
      description: "Your stock ranking has been submitted successfully!",
    });
  };

  return (
    <div className="min-h-screen p-2 md:p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-4 text-center">
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg border border-card-border animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-2 text-text-header">
            <span className="text-xs md:text-sm">⏰ {timeRemaining}</span>
            <span className="text-xs md:text-sm">
              👥 {totalVotes.toLocaleString()}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-text-header mb-1">
            Rank This Week's Chosen Stocks
          </h1>
          <p className="text-xs text-card-text">
            And Contribute to this Community's Wisdom 😊
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto animate-slide-in">
        <div className="text-center mb-4 text-text-header">
          <p className="text-sm">Drag stocks to rank (1 = Most Bullish)</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Rank Slots */}
          <div className="space-y-3 md:col-span-2">
            {rankSlots.map((slot, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <div
                  className="relative bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-card-border transition-all duration-300"
                  data-drop-zone
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-center">
                    <span className="text-text-header font-bold text-2xl mr-3">
                      {index + 1}.
                    </span>
                    {slot.stock ? (
                      <div
                        className="flex items-center gap-2 w-full"
                        draggable
                        onDragStart={(e) => handleDragStart(e, slot.stock!, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <StockCard
                          stock={slot.stock}
                          onTimeframeChange={(timeframe) =>
                            handleTimeframeChange(slot.stock!, timeframe)
                          }
                        />
                      </div>
                    ) : (
                      <span className="text-card-text text-sm">
                        DROP STOCK HERE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Available Stocks */}
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-card-border">
            <h2 className="text-card-text-header mb-3 font-semibold text-sm">
              Available Stocks
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {availableStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  className="relative bg-card-field backdrop-blur-sm rounded-lg p-3 cursor-move border border-card-border hover:border-special transition-all duration-300"
                  draggable
                  onDragStart={(e) => handleDragStart(e, stock)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{stock.emoji}</span>
                    <div className="flex-1">
                      <span className="text-card-text-header font-semibold text-sm">
                        {stock.ticker}
                      </span>
                      <span className="block text-xs text-card-text">
                        {stock.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 md:relative mt-6 p-3 md:p-0">
          <div className="flex gap-3 justify-center max-w-7xl mx-auto">
            <button
              onClick={resetRanking}
              className="px-4 py-2 rounded-lg bg-tertiary/20 text-tertiary border border-tertiary/30 hover:bg-tertiary/30 transition-colors duration-300 text-sm"
            >
              Reset
            </button>
            <button
              onClick={submitRanking}
              className={`px-4 py-2 rounded-lg border transition-colors duration-300 text-sm ${
                rankSlots.every((slot) => slot.stock)
                  ? "bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30"
                  : "bg-gray-600/20 text-gray-400 border-gray-600/30 cursor-not-allowed"
              }`}
            >
              Submit Ranking
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
