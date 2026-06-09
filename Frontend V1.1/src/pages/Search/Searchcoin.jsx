import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  ArrowUpDown,
} from "lucide-react";

import { getCoinList, getTop50CoinList, searchCoin } from "@/State/Coin/Action";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { coinList, top50, searchCoinList, loading } = useSelector((store) => store.coin);

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("market_cap");
  const [recentSearches, setRecentSearches] = useState(["Bitcoin", "Ethereum", "Solana"]);

  // 1. Fetch Initial Data
  useEffect(() => {
    dispatch(getTop50CoinList());
    dispatch(getCoinList(1));
  }, [dispatch]);

  // 2. Handle Search with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) {
        dispatch(searchCoin(searchQuery));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  // --- DERIVED DATA ---

  const gainers = [...(top50 || [])]
    .filter((c) => c.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3);

  const losers = [...(top50 || [])]
    .filter((c) => c.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 3);

  // --- FIX: Safely extract array from Search Result ---
  const getDisplayData = () => {
    if (searchQuery.length > 1) {
        // API returns { coins: [...] }, so we need to access .coins
        // We also check if it's already an array (just in case)
        return searchCoinList?.coins || (Array.isArray(searchCoinList) ? searchCoinList : []);
    }
    if (activeTab === "all") return coinList || [];
    if (activeTab === "trending") return top50 || [];
    if (activeTab === "movers") return [...gainers, ...losers];
    return [];
  };

  const displayData = getDisplayData();

  // Sort Data (Safe Check: ensure displayData is an array before sorting)
  const sortedData = Array.isArray(displayData) ? [...displayData].sort((a, b) => {
    if (searchQuery.length > 1) return 0;
    
    switch (sortBy) {
        case "market_cap":
            return (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999);
        case "volume":
            return (b.total_volume || 0) - (a.total_volume || 0);
        case "price":
            return (b.current_price || 0) - (a.current_price || 0);
        default:
            return 0;
    }
  }) : [];

  // --- HANDLERS ---

  const handleCoinClick = (coinId, coinName) => {
    if (!recentSearches.includes(coinName)) {
      setRecentSearches([coinName, ...recentSearches.slice(0, 4)]);
    }
    navigate(`/market/${coinId}`);
  };

  const handleRecentSearch = (search) => {
    setSearchQuery(search);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return "$" + price.toLocaleString();
  };

  const formatPercentage = (percent) => {
    if (percent === undefined || percent === null) return "0.00%";
    return `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  return (
    <div className="p-5 lg:px-20 pb-10 min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-8 w-8 text-blue-500" />
          <h1 className="font-bold text-3xl leading-none">Discover</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 border-green-500/50 bg-green-500/10 text-green-500">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">Market: Active</span>
          </Badge>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-7 text-lg border-gray-700 bg-slate-900 focus:ring-blue-500 rounded-xl"
            placeholder="Search by coin name, symbol..."
          />
          {searchQuery && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-800"
            >
              <Cross2Icon className="h-5 w-5 text-gray-400" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-slate-900 border-gray-700">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-gray-700 text-white">
            <SelectItem value="market_cap">Market Cap</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Results vs Tabs */}
      {searchQuery.length > 1 ? (
        <div>
           <h2 className="text-xl font-semibold mb-4">Search Results</h2>
           {loading ? (
             <p className="text-gray-500">Searching...</p>
           ) : sortedData.length === 0 ? (
             <p className="text-gray-500">No results found.</p>
           ) : (
             <div className="space-y-3">
               {sortedData.map((coin) => (
                 <div
                   key={coin.id}
                   onClick={() => handleCoinClick(coin.id, coin.name)}
                   className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-900 cursor-pointer transition border-gray-800 bg-slate-900/50"
                 >
                   <div className="flex items-center gap-4">
                     <Avatar className="h-12 w-12">
                       <AvatarImage src={coin.large || coin.thumb || coin.image} />
                     </Avatar>
                     <div>
                       <h3 className="font-semibold text-lg">{coin.name}</h3>
                       <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     {/* Search API often doesn't return price */}
                     <span className="text-xs text-blue-400">View Details</span>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      ) : (
        /* Tabs Section */
        <div>
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold">Recent Searches</h2>
                </div>
                <Button onClick={clearRecentSearches} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    variant="outline"
                    className="px-4 py-2 cursor-pointer hover:bg-slate-800 border-gray-700 text-base transition"
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-900 h-auto p-1 rounded-xl">
              <TabsTrigger value="all" className="py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">All Coins</TabsTrigger>
              <TabsTrigger value="trending" className="py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Flame className="w-4 h-4 mr-2" /> Trending
              </TabsTrigger>
              <TabsTrigger value="movers" className="py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Top Movers</TabsTrigger>
            </TabsList>

            {/* --- ALL COINS TAB --- */}
            <TabsContent value="all" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedData.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinClick(coin.id, coin.name)}
                    className="p-4 border rounded-xl hover:bg-slate-800 cursor-pointer transition border-gray-800 bg-slate-900/40"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={coin.image} />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{coin.name}</h3>
                          <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-slate-800 text-gray-300">
                        #{coin.market_cap_rank}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">{formatPrice(coin.current_price)}</p>
                        <p className="text-gray-500 text-xs">Vol: {coin.total_volume?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* --- TRENDING TAB --- */}
            <TabsContent value="trending" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedData.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinClick(coin.id, coin.name)}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-800 cursor-pointer transition border-gray-800 bg-slate-900/40"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={coin.image} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{coin.name}</h3>
                          <Badge variant="secondary" className="text-[10px] px-1 h-5 bg-slate-800 text-gray-400">
                            #{coin.market_cap_rank}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(coin.current_price)}</p>
                      <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* --- MOVERS TAB --- */}
            <TabsContent value="movers" className="space-y-6">
                <div className="space-y-3">
                    {sortedData.map((coin) => (
                    <div
                        key={coin.id}
                        onClick={() => handleCoinClick(coin.id, coin.name)}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-800 cursor-pointer transition border-gray-800 bg-slate-900/40"
                    >
                        <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={coin.image} />
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{coin.name}</h3>
                            <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(coin.current_price)}</p>
                        <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatPercentage(coin.price_change_percentage_24h)}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Search;