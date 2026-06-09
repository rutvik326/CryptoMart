import React, { useEffect, useState } from "react";
// Removed shadcn Button import as we are using custom styled buttons now
import AssetTable from "./AssetTable";
import StockChart from "./StockChart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCoinList, getTop50CoinList } from "@/State/Coin/Action";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [backendPage, setBackendPage] = useState(1);
  
  const { coinList, top50, loading, error } = useSelector((store) => store.coin);
  const dispatch = useDispatch();

  // Define buttons configuration to match StockChart style
  const categoryButtons = [
    { label: "All", value: "all" },
    { label: "Top 50", value: "top50" },
    { label: "Top Gainers", value: "topgainers" },
    { label: "Top Losers", value: "toplosers" },
  ];

  const handleCategory = (value) => {
    setCategory(value);
    setSelectedCoin(null);
    setBackendPage(1); 
  };

  const handlePageChange = (newPage) => {
    console.log("Fetching backend page:", newPage);
    setBackendPage(newPage);
  };

  useEffect(() => {
    if (category === "all") {
      dispatch(getCoinList(backendPage));
    } else if (category === "top50") {
      dispatch(getTop50CoinList());
    }
  }, [category, backendPage, dispatch]);

  const getDisplayCoins = () => {
    switch (category) {
      case "all":
        return coinList || [];
      case "top50":
        return top50 || [];
      case "topgainers":
        return [...(coinList || [])]
          .filter(coin => coin.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      case "toplosers":
        return [...(coinList || [])]
          .filter(coin => coin.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      default:
        return coinList || [];
    }
  };

  const displayCoins = getDisplayCoins();

  useEffect(() => {
    if (displayCoins && displayCoins.length > 0 && !selectedCoin) {
      setSelectedCoin(displayCoins[0]);
    }
  }, [displayCoins, selectedCoin]);

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  const displayedCoin = selectedCoin || displayCoins?.[0];

  return (
    <div className="relative">
      <div className="lg:flex">
        {/* Left Side - Coin List */}
        <div className="lg:w-[50%] lg:border-r">
          
          {/* UPDATED BUTTON SECTION */}
          <div className="p-3 flex items-center gap-4">
            {categoryButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleCategory(btn.value)}
                className={`
                  text-sm font-medium transition-all px-4 py-1.5 rounded-md border
                  ${category === btn.value 
                    ? "text-white bg-slate-800 border-slate-700" // Active Style (Matches StockChart)
                    : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-900"} // Inactive Style
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-gray-400">Loading coins...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-red-400">Error: {error}</p>
            </div>
          ) : (
            <div className="overflow-y-scroll flex-1 scrollbar-hide pr-2" style={{ height: "calc(100vh - 120px)" }}>
              <AssetTable 
                coin={displayCoins} 
                category={category}
                onCoinSelect={handleCoinSelect}
                selectedCoinId={selectedCoin?.id}
                onPageChange={handlePageChange}
                currentBackendPage={backendPage}
              />
            </div>
          )}
        </div>

        {/* Right Side - Chart and Coin Details */}
        <div className="hidden lg:block lg:w-[50%] p-5">
          {displayedCoin ? (
            <>
              <StockChart coinId={displayedCoin.id} key={displayedCoin.id} />
              
              <div className="flex gap-5 items-center mt-5">
                <div>
                  <Avatar className="w-14 h-14">
                    <AvatarImage 
                      src={displayedCoin.image || "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png"} 
                      alt={displayedCoin.name}
                    />
                  </Avatar>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold uppercase">{displayedCoin.symbol}</p>
                    <DotIcon className="text-gray-400" />
                    <p className="text-gray-400">{displayedCoin.name}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-bold">
                      ${displayedCoin.current_price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                    <p className={displayedCoin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}>
                      <span>{displayedCoin.price_change_24h?.toFixed(2)}</span>
                      <span> ({displayedCoin.price_change_percentage_24h?.toFixed(2)}%)</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a coin to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;