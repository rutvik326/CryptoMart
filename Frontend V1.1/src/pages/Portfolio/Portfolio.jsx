import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "../../State/Asset/Action";
import { getCoinList } from "../../State/Coin/Action"; // Import Coin Action for live prices
import { useNavigate } from "react-router-dom"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { 
  Wallet,
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";

const Portfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. SELECT DATA: Get Assets (DB) and CoinList (Live API)
  const { userAssets, loading } = useSelector((store) => store.asset);
  const { coinList } = useSelector((store) => store.coin);
  
  const [searchQuery, setSearchQuery] = useState("");

  // 2. FETCH DATA: Get both Assets and Live Market Data on load
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt) {
      dispatch(getUserAssets(jwt));
      dispatch(getCoinList(1)); // Fetch page 1 of live market data
    }
  }, [dispatch]);

  // 3. MERGE DATA: Combine DB Quantity with Live Price
  const assets = userAssets ? userAssets.map(item => {
    // Find the live coin data in the Redux store
    const liveCoin = coinList?.find((c) => c.id === item.coin.id);

    // PRIORITY: Use Live Data if available, otherwise fallback to DB
    const currentPrice = liveCoin ? liveCoin.current_price : item.coin.current_price;
    const priceChange = liveCoin ? liveCoin.price_change_percentage_24h : item.coin.price_change_percentage_24h;
    const image = liveCoin ? liveCoin.image : item.coin.image;

    return {
      id: item.coin.id,
      name: item.coin.name,
      symbol: item.coin.symbol.toUpperCase(),
      image: image,
      price: currentPrice, // LIVE PRICE
      units: item.quantity,
      avgBuyPrice: item.buyPrice, 
      changePercent: priceChange, // LIVE CHANGE
      isPositive: priceChange >= 0
    };
  }) : [];

  // 4. CALCULATIONS (Using the fresh 'price')
  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => total + (parseFloat(asset.price) * asset.units), 0);
  };
  
  const calculateTotalProfit = () => {
    return assets.reduce((total, asset) => total + ((parseFloat(asset.price) - parseFloat(asset.avgBuyPrice)) * asset.units), 0);
  };
  
  const calculateProfitPercent = () => {
    const totalValue = calculateTotalValue();
    const totalProfit = calculateTotalProfit();
    const investedAmount = totalValue - totalProfit;
    
    // Prevent division by zero or weird results if invested amount is 0
    if (investedAmount <= 0) return 0; 
    
    return ((totalProfit / investedAmount) * 100).toFixed(2);
  };
  
  const calculateAssetProfit = (asset) => (parseFloat(asset.price) - parseFloat(asset.avgBuyPrice)) * asset.units;
  const calculateAssetValue = (asset) => parseFloat(asset.price) * asset.units;
  
  const calculateAllocation = (asset) => {
    const totalValue = calculateTotalValue();
    return totalValue === 0 ? "0%" : ((calculateAssetValue(asset) / totalValue) * 100).toFixed(1) + "%";
  };
  
  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // 5. FILTERING
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = calculateTotalValue();
  const totalProfit = calculateTotalProfit();
  const totalProfitPercent = calculateProfitPercent();
  const isProfitable = totalProfit >= 0;

  if (loading && !userAssets) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Portfolio...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-slate-900 rounded-lg border border-slate-800">
                <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white">Portfolio</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Track and manage your crypto investments</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-white rounded"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Statistics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total Value</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700"><DollarSign className="w-6 h-6 sm:h-7 sm:w-7 text-white" /></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total Profit/Loss</p>
                      <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>{isProfitable ? '+' : ''}{formatCurrency(totalProfit)}</p>
                      <p className={`text-xs sm:text-sm mt-1 font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>{isProfitable ? '+' : ''}{totalProfitPercent}%</p>
                    </div>
                    <div className={`p-3 sm:p-4 rounded-lg border ${isProfitable ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}><TrendingUp className={`w-6 h-6 sm:w-7 sm:h-7 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} /></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2">Total Assets</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{assets.length}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-800 rounded-lg border border-slate-700"><BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" /></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-white rounded"></div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Your Assets</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 sm:pl-11 bg-slate-800 border-slate-700 text-sm text-white placeholder-slate-500 focus:border-slate-600 focus:bg-slate-800 transition-all" placeholder="Search assets..." />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-800 bg-slate-800">
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Asset</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Current Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Holdings</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Avg Buy Price</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">24h Change</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Profit/Loss</TableHead>
                    <TableHead className="text-slate-300 font-semibold text-xs sm:text-sm">Alloc.</TableHead>
                    <TableHead className="text-right text-slate-300 font-semibold text-xs sm:text-sm">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset, index) => {
                    const assetProfit = calculateAssetProfit(asset);
                    const assetValue = calculateAssetValue(asset);
                    const allocation = calculateAllocation(asset);
                    const isProfitPositive = assetProfit >= 0;

                    return (
                      <TableRow 
                        key={index}
                        onClick={() => navigate(`/market/${asset.id}`)} 
                        className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group text-xs sm:text-sm"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-slate-800 group-hover:border-slate-700 transition-all">
                              <AvatarImage src={asset.image} />
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold truncate text-xs sm:text-sm text-white">{asset.name}</p>
                              <p className="text-xs text-slate-400">{asset.symbol}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap text-white">{formatCurrency(parseFloat(asset.price))}</TableCell>
                        <TableCell className="whitespace-nowrap"><p className="font-bold text-white">{asset.units.toLocaleString()}</p></TableCell>
                        <TableCell className="text-slate-400 whitespace-nowrap">{formatCurrency(parseFloat(asset.avgBuyPrice))}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg w-fit font-semibold text-xs ${asset.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {asset.isPositive ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                            {asset.changePercent?.toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <p className={`font-bold ${isProfitPositive ? 'text-green-500' : 'text-red-500'}`}>{isProfitPositive ? '+' : ''}{formatCurrency(assetProfit)}</p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="border-slate-600 text-slate-300 bg-slate-800 hover:bg-slate-700 font-semibold text-xs transition-all">{allocation}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold whitespace-nowrap text-white">{formatCurrency(assetValue)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filteredAssets.length === 0 && (
              <div className="text-center py-12"><p className="text-slate-400 text-sm">{searchQuery ? `No assets found matching "${searchQuery}"` : "No assets in your portfolio"}</p></div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;