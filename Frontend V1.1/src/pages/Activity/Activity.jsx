import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "../../State/Order/Action"; 
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivityLogIcon } from "@radix-ui/react-icons";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Activity as ActivityIcon, 
  DollarSign,
  Calendar,
  ChevronDown,
} from "lucide-react";

const Activity = () => {
  const dispatch = useDispatch();
  
  // 1. Get Orders from Redux
  const { orders, loading } = useSelector((store) => store.order);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // 2. Fetch Orders on Mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt) {
      dispatch(getAllOrdersForUser({ jwt }));
    }
  }, [dispatch]);

  // 3. Map & Calculate Data (Safe Mode)
  const activities = orders ? orders.map((order) => {
    const orderItem = order.orderItem || {};
    const coin = orderItem.coin || {};
    
    const isSell = order.orderType === "SELL";
    const quantity = orderItem.quantity || 0;
    const buyPrice = orderItem.buyPrice || 0;
    const sellPrice = orderItem.sellPrice || 0;
    
    // For a BUY order, Value = BuyPrice * Qty
    // For a SELL order, Value = SellPrice * Qty
    const orderValue = isSell ? (sellPrice * quantity) : (buyPrice * quantity);

    // Profit logic: Only for SELL orders
    let profit = 0;
    if (isSell && sellPrice > 0 && buyPrice > 0) {
        profit = (sellPrice - buyPrice) * quantity;
    }

    return {
      id: order.id,
      date: new Date(order.timestamp).toLocaleDateString(),
      time: new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coinName: coin.name || "Unknown",
      symbol: coin.symbol?.toUpperCase() || "---",
      image: coin.image || "",
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      orderType: order.orderType,
      quantity: quantity,
      profit: profit,
      value: orderValue, 
      status: order.status,
      isProfit: profit >= 0,
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort Newest First
  : [];

  const formatCurrency = (num) => {
    return "$" + Number(num).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 4. Statistics Calculations
  const totalTrades = activities.length;
  const buyOrders = activities.filter(a => a.orderType === "BUY").length;
  const sellOrders = activities.filter(a => a.orderType === "SELL").length;
  
  const closedTrades = activities.filter(a => a.orderType === "SELL").length;
  const profitableTrades = activities.filter(a => a.orderType === "SELL" && a.isProfit).length;
  
  const totalProfit = activities.reduce((sum, a) => sum + a.profit, 0);
  const totalVolume = activities.reduce((sum, a) => sum + a.value, 0);
  
  const winRate = closedTrades > 0 ? ((profitableTrades / closedTrades) * 100).toFixed(1) : "0.0";

  // 5. Filtering Logic
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.coinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || activity.orderType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading && activities.length === 0) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Activity...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-slate-900 rounded-lg border border-slate-800">
                <ActivityLogIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white">Trading Activity</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Complete transaction history</p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-white rounded"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Statistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total Trades</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{totalTrades}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-800">
                          Buy: {buyOrders}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-800">
                          Sell: {sellOrders}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <ActivityIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total Volume</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(totalVolume)}</p>
                      <p className="text-xs text-slate-500 mt-2">Trading volume</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total P&L</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">Realized Profit</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${totalProfit >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      {totalProfit >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Win Rate</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{winRate}%</p>
                      <p className="text-xs text-slate-500 mt-2">{profitableTrades}/{closedTrades} profitable sells</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <TrendingUp className="w-6 h-6 text-white" />
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
                    placeholder="Search by coin name or symbol..."
                  />
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className={`text-xs sm:text-sm ${filterType === "all" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    All ({totalTrades})
                  </Button>
                  <Button
                    variant={filterType === "buy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("buy")}
                    className={`text-xs sm:text-sm ${filterType === "buy" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    Buy ({buyOrders})
                  </Button>
                  <Button
                    variant={filterType === "sell" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("sell")}
                    className={`text-xs sm:text-sm ${filterType === "sell" ? "bg-white text-black hover:bg-slate-200" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
                  >
                    Sell ({sellOrders})
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-800 bg-slate-800">
                    <TableHead className="py-4 text-slate-300 font-semibold text-xs sm:text-sm">Date & Time</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Asset</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Amount</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Buy Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Sell Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">P&L</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <ActivityIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                        <p className="text-slate-300 font-semibold mb-1">No activities found</p>
                        <p className="text-slate-500 text-sm">
                          {searchQuery ? `No results for "${searchQuery}"` : "Start trading to see your activity"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredActivities.map((activity) => (
                    <TableRow
                      key={activity.id}
                      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group text-xs sm:text-sm"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="font-semibold text-white">{activity.date}</p>
                            <p className="text-xs text-slate-400">{activity.time}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-slate-800 group-hover:border-slate-700 transition-all">
                            <AvatarImage src={activity.image} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{activity.coinName}</p>
                            <p className="text-xs text-slate-400">{activity.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-semibold text-xs ${
                            activity.orderType === "BUY"
                              ? "border-green-600/30 bg-green-900/10 text-green-500"
                              : "border-red-600/30 bg-red-900/10 text-red-500"
                          }`}
                        >
                          {activity.orderType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-white">
                        {activity.quantity.toLocaleString()} {activity.symbol}
                      </TableCell>
                      <TableCell className="text-slate-400">{formatCurrency(activity.buyPrice)}</TableCell>
                      <TableCell className="text-slate-400">
                        {activity.sellPrice > 0 ? formatCurrency(activity.sellPrice) : "-"}
                      </TableCell>
                      <TableCell>
                        {activity.orderType === "SELL" ? (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit text-xs font-semibold ${
                              activity.isProfit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {activity.isProfit ? (
                                <>
                                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                  +{formatCurrency(activity.profit)}
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {formatCurrency(activity.profit)}
                                </>
                              )}
                            </div>
                        ) : (
                            <span className="text-slate-600 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 bg-slate-800 text-xs font-semibold">
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-white">
                        {formatCurrency(activity.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Activity;