import React, { useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import Tradingform from "./TradingForm"; 
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCoinDetails } from "@/State/Coin/Action"; 
import { addItemToWatchlist, getUserWatchlist } from "@/State/Watchlist/Action";
import StockChart from "../Home/StockChart";

const StockDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // This is the coinId string from the URL

  const { coinDetails, loading } = useSelector((state) => state.coin);
  const { items: watchlistCoins } = useSelector((state) => state.watchlist);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchCoinDetails({ coinId: id, jwt }));
      dispatch(getUserWatchlist(jwt));
    }
  }, [dispatch, id]);

  const coinData = coinDetails ? {
      id: coinDetails.id,
      name: coinDetails.name,
      symbol: coinDetails.symbol,
      image: typeof coinDetails.image === 'object' ? coinDetails.image.large : coinDetails.image,
      current_price: coinDetails.market_data?.current_price?.usd || coinDetails.current_price,
      price_change_percentage_24h: coinDetails.market_data?.price_change_percentage_24h || coinDetails.price_change_percentage_24h,
  } : null;

  // FIX: Ensure we check both the item ID and the nested coin ID
  const inWatchlist = watchlistCoins?.some(
    (item) => item.id === id || item.coin?.id === id
  );

  const handleAddToWatchlist = async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt && id) {
      try {
        /**
         * FIX: Most Action.js files for this project expect (coinId, jwt) 
         * as separate arguments, not as an object.
         */
        await dispatch(addItemToWatchlist(id, jwt));
        
        // Refresh the watchlist state to update the icon immediately
        dispatch(getUserWatchlist(jwt));
      } catch (error) {
        console.error("Watchlist connection error:", error);
      }
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-400"></div>
        </div>
    );
  }

  if (!coinData) return null;

  return (
    <div className="p-4 mt-2 text-white min-h-screen bg-slate-950">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        
        <div className="flex gap-5 items-center">
          <Avatar className="h-14 w-14">
            <AvatarImage src={coinData.image} />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="uppercase font-semibold text-lg">{coinData.symbol}</p>
              <DotIcon className="text-slate-500" />
              <p className="text-slate-400">{coinData.name}</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">
                ${coinData.current_price?.toLocaleString()}
              </p>
              <p className={`font-semibold ${coinData.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                <span>{coinData.price_change_percentage_24h >= 0 ? "+" : ""}{coinData.price_change_percentage_24h?.toFixed(2)}%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddToWatchlist}
            size="icon"
            className={`
              h-12 w-12 rounded-full border transition-all duration-200
              ${inWatchlist 
                ? "bg-slate-800 border-slate-700 text-white" 
                : "bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"}
            `}
          >
            {inWatchlist ? (
              <BookmarkFilledIcon className="!w-6 !h-6" />
            ) : (
              <BookmarkIcon className="!w-6 !h-6" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="h-12 px-10 rounded-md bg-slate-100 hover:bg-white text-slate-950 font-bold transition-all"
              >
                 Trade {coinData.symbol.toUpperCase()}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Trade {coinData.name}</DialogTitle>
                <DialogDescription className="sr-only">
                  Form to buy or sell {coinData.name}.
                </DialogDescription>
              </DialogHeader>
              <Tradingform coin={coinData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 border border-slate-800 rounded-lg p-4 bg-slate-950">
        <StockChart coinId={id} />
      </div>
    </div>
  );
};

export default StockDetails;