import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserWatchlist, addItemToWatchlist } from "../../State/Watchlist/Action";
import { getCoinList } from "../../State/Coin/Action"; // 1. Import Live Data Action
import { useNavigate } from "react-router-dom"; 
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookmarkIcon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Sparkles,
} from "lucide-react";

const Watchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 2. Get BOTH Watchlist (DB) and CoinList (Live)
  const { items: watchlistCoins, loading } = useSelector((store) => store.watchlist);
  const { coinList } = useSelector((store) => store.coin); // Live Market Data

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("all");

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt) {
      dispatch(getUserWatchlist(jwt));
      dispatch(getCoinList(1)); // 3. Fetch Live Prices on Load
    }
  }, [dispatch]);

  // 4. MAP & MERGE LOGIC (Crucial Fix)
  const coins = watchlistCoins ? watchlistCoins.map((dbCoin) => {
    // Try to find the FRESH data in coinList
    const liveCoin = coinList?.find((c) => c.id === dbCoin.id);

    // If live data exists, use it. Otherwise, fallback to DB data.
    const price = liveCoin ? liveCoin.current_price : dbCoin.current_price;
    const change = liveCoin ? liveCoin.price_change_percentage_24h : dbCoin.price_change_percentage_24h;
    const volume = liveCoin ? liveCoin.total_volume : dbCoin.total_volume;
    const marketCap = liveCoin ? liveCoin.market_cap : dbCoin.market_cap;
    const rank = liveCoin ? liveCoin.market_cap_rank : dbCoin.market_cap_rank;
    const high24h = liveCoin ? liveCoin.high_24h : dbCoin.high_24h;
    const low24h = liveCoin ? liveCoin.low_24h : dbCoin.low_24h;

    return {
        id: dbCoin.id,
        name: dbCoin.name,
        symbol: dbCoin.symbol.toUpperCase(),
        image: dbCoin.image,
        volume: volume,
        marketCap: marketCap,
        change: change,
        price: price,
        isPositive: change >= 0,
        rank: rank,
        high24h: high24h,
        low24h: low24h,
    };
  }) : [];

  const handleRemove = (id, e) => {
    e.stopPropagation(); 
    const jwt = localStorage.getItem("jwt");
    // FIXED: Changed from passing an object to passing separate arguments
    dispatch(addItemToWatchlist(id, jwt)); 
  };

  const formatCurrency = (num) => {
    if (!num) return "$0.00";
    return "$" + Number(num).toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  // 5. Statistics (Now using live data)
  const totalCoins = coins.length;
  const gainers = coins.filter(c => c.isPositive).length;
  const losers = coins.filter(c => !c.isPositive).length;
  const avgChange = coins.length > 0 
    ? (coins.reduce((sum, c) => sum + (c.change || 0), 0) / coins.length).toFixed(2)
    : 0;

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    if (sortBy === "gainers") return matchesSearch && coin.isPositive;
    if (sortBy === "losers") return matchesSearch && !coin.isPositive;
    return matchesSearch;
  });

  if (loading && coins.length === 0) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Watchlist...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-slate-900 rounded-lg border border-slate-800">
                <BookmarkIcon className="w-6 h-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white">Watchlist</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Track your favorite cryptocurrencies</p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-white rounded"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Statistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Watching</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{totalCoins}</p>
                      <p className="text-xs text-slate-500 mt-2">Total coins</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Gainers</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-500">{gainers}</p>
                      <p className="text-xs text-slate-500 mt-2">24h positive</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Losers</p>
                      <p className="text-2xl sm:text-3xl font-bold text-red-500">{losers}</p>
                      <p className="text-xs text-slate-500 mt-2">24h negative</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Avg Change</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {avgChange >= 0 ? '+' : ''}{avgChange}%
                      </p>
                      <p className="text-xs text-slate-500 mt-2">24h average</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 sm:p-6">
            
            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-white rounded"></div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Search & Filter</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-11 bg-slate-800 border-slate-700 text-sm text-white placeholder-slate-500 focus:border-slate-600 transition-all"
                    placeholder="Search coins..."
                  />
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <Button
                    variant={sortBy === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("all")}
                    className={`text-xs sm:text-sm ${sortBy === "all" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    All ({totalCoins})
                  </Button>
                  <Button
                    variant={sortBy === "gainers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("gainers")}
                    className={`text-xs sm:text-sm ${sortBy === "gainers" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    Gainers ({gainers})
                  </Button>
                  <Button
                    variant={sortBy === "losers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("losers")}
                    className={`text-xs sm:text-sm ${sortBy === "losers" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    Losers ({losers})
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-800 bg-slate-800">
                    <TableHead className="py-4 text-slate-300 font-semibold text-xs sm:text-sm">Rank</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Asset</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">24h Change</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">24h High/Low</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Volume</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Market Cap</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoins.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <BookmarkIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                        <p className="text-slate-300 font-semibold mb-1">No coins in watchlist</p>
                        <p className="text-slate-500 text-sm">
                          {searchQuery ? `No results for "${searchQuery}"` : "Add coins to start tracking"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredCoins.map((coin) => (
                    <TableRow
                      key={coin.id}
                      onClick={() => navigate(`/market/${coin.id}`)}
                      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group text-xs sm:text-sm"
                    >
                      <TableCell className="py-4">
                        <Badge variant="outline" className="border-slate-600 text-slate-300 bg-slate-800 font-bold">
                          #{coin.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-slate-800 group-hover:border-slate-700 transition-all">
                            <AvatarImage src={coin.image} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{coin.name}</p>
                            <p className="text-xs text-slate-400">{coin.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-white">
                        {formatCurrency(coin.price)}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg w-fit text-xs sm:text-sm font-semibold ${
                          coin.isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {coin.isPositive ? (
                            <>
                              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              +{coin.change?.toFixed(2)}%
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              {coin.change?.toFixed(2)}%
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs sm:text-sm">
                          <p className="text-green-500 font-semibold">{formatCurrency(coin.high24h)}</p>
                          <p className="text-red-500 font-semibold">{formatCurrency(coin.low24h)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {formatCurrency(coin.volume)}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {formatCurrency(coin.marketCap)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          onClick={(e) => handleRemove(coin.id, e)}
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 group/btn"
                        >
                          <BookmarkFilledIcon className="w-5! h-5! sm:w-6! sm:h-6! text-white group-hover/btn:scale-110 transition" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            {filteredCoins.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-400">
                  Showing {filteredCoins.length} of {coins.length} coins
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Watchlist;