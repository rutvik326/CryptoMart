import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Wallet,
  Coins,
  ArrowDownUp,
} from "lucide-react";

import { payOrder } from "../../State/Order/Action";
import { getUserWallet } from "../../State/Wallet/Action";
import { getUserAssets } from "../../State/Asset/Action";

const TradingForm = ({ coin }) => {
  const dispatch = useDispatch();
  
  // Redux Selectors
  const { userWallet, loading: walletLoading } = useSelector((store) => store.wallet);
  const { userAssets } = useSelector((store) => store.asset); 
  
  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");

  // Safe Data Access
  const availableBalance = userWallet?.balance || 0; 
  
  // Find if user already owns this coin
  const userAsset = userAssets?.find(a => a.coin.id === coin?.id);
  const availableQuantity = userAsset ? userAsset.quantity : 0;

  const coinPrice = coin?.current_price || 0;
  const priceChange = coin?.price_change_percentage_24h || 0;
  const coinSymbol = coin?.symbol?.toUpperCase() || "BTC";
  const coinName = coin?.name || "Bitcoin";
  const coinImage = coin?.image || "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png";

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt) {
        dispatch(getUserWallet(jwt));
        dispatch(getUserAssets(jwt)); 
    }
  }, [dispatch]);

  // Update Quantity Preview when Amount changes
  useEffect(() => {
    if (amount && coinPrice) {
      const calculatedQuantity = parseFloat(amount) / coinPrice;
      setQuantity(calculatedQuantity.toFixed(6));
    } else {
      setQuantity(0);
    }
  }, [amount, coinPrice]);

  // --- FIX 1: IMPROVED VALIDATION LOGIC ---
  useEffect(() => {
    if (!amount) return setError("");
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return setError("Please enter a valid number");
    if (numAmount <= 0) return setError("Amount must be greater than 0");

    if (orderType === "BUY") {
      if (numAmount > availableBalance) return setError("Insufficient wallet balance");
    } else {
      const requiredQuantity = numAmount / coinPrice;
      
      // FIX: Increased buffer to 0.0001 to handle floating point rounding issues
      // If required is 13.00001 and available is 13.00000, we treat it as valid.
      if (requiredQuantity > availableQuantity + 0.0001) {
        return setError("Insufficient coin quantity to sell");
      }
    }
    setError("");
  }, [amount, orderType, availableBalance, availableQuantity, coinPrice]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // --- FIX 2: SAFER MAX CALCULATION ---
  const handleMaxAmount = () => {
    if (orderType === "BUY") {
      setAmount(availableBalance.toString());
    } else {
      // Calculate max value
      const maxVal = availableQuantity * coinPrice;
      
      // Use toFixed(6) to ensure precision, but converting to string ensures input matches
      setAmount(maxVal.toFixed(6)); 
    }
  };

  const handleSubmit = async () => {
    if (!coin || !coin.id) return;
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (error) return;

    const jwt = localStorage.getItem("jwt");

    // --- FIX 3: FORCE EXACT QUANTITY ON MAX SELL ---
    // If selling, calculate quantity. If it's very close to available balance, force it to match exactly.
    let finalQuantity = quantity;
    if (orderType === "SELL") {
        const calculatedQ = parseFloat(amount) / coinPrice;
        
        // If calculated quantity is within 0.1% of available, assume user meant "MAX"
        // This fixes cases where rounding creates 0.999999 of the asset.
        if (calculatedQ >= availableQuantity * 0.999 && calculatedQ <= availableQuantity * 1.001) {
            console.log("Auto-adjusting to Max Sell Quantity");
            finalQuantity = availableQuantity;
        }
    }

    try {
        await dispatch(payOrder({
            jwt,
            amount,
            orderData: {
                coinId: coin.id, 
                quantity: finalQuantity, // Send corrected quantity
                orderType: orderType 
            }
        }));

        dispatch(getUserWallet(jwt));
        dispatch(getUserAssets(jwt));

        setAmount("");
        setQuantity(0);
        setError("");

    } catch (err) {
        console.log("Error during transaction", err);
    }
  };

  const toggleOrderType = () => {
    setOrderType(orderType === "BUY" ? "SELL" : "BUY");
    setAmount("");
    setQuantity(0);
    setError("");
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-md mx-auto rounded-xl p-6 shadow-lg space-y-5 max-h-[500px] overflow-y-auto no-scrollbar">

        {/* --- Coin Info --- */}
        <div className="flex items-center gap-4 rounded-lg border p-4 bg-card">
          <Avatar className="w-12 h-12">
            <AvatarImage src={coinImage} alt={coinName} />
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 text-lg font-semibold">
              <span>{coinSymbol}</span>
              <span className="text-muted-foreground">•</span>
              <span className="truncate">{coinName}</span>
            </div>

            <div className="flex items-center gap-3 font-bold text-xl">
              <span>${coinPrice.toLocaleString()}</span>
              <span
                className={`flex items-center gap-1 text-sm ${
                  priceChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Type Badge */}
        <div className={`flex items-center justify-center rounded-full py-1 text-sm font-semibold 
            ${orderType === "BUY" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
          {orderType} ORDER
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="w-4 h-4" />
            Amount (USD)
          </label>

          <div className="relative">
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`h-12 pr-16 ${
                error ? "border-red-500" : "border-transparent focus:border-primary"
              }`}
            />

            <button
              type="button"
              onClick={handleMaxAmount}
              className="absolute right-2 top-1/2 -translate-y-1/2 font-semibold text-primary text-xs py-0.5 px-2 rounded hover:bg-primary/10 transition"
            >
              MAX
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 mt-1 rounded bg-red-50 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Quantity Preview */}
        {amount && !error && (
          <div className="flex justify-between p-3 rounded-lg bg-secondary/50 text-sm font-semibold">
            <span>You will {orderType.toLowerCase()}</span>
            <span>
              {quantity} {coinSymbol}
            </span>
          </div>
        )}

        <Separator />

        {/* Order Details */}
        <div className="text-sm space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Order Type</span>
            <span className="font-medium">Market Order</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              {orderType === "BUY" ? "Available Cash" : "Available Quantity"}
            </span>

            <span className="font-semibold">
              {orderType === "BUY"
                ? `$${Number(availableBalance).toLocaleString()}`
                : `${Number(availableQuantity).toFixed(6)} ${coinSymbol}`}
            </span>
          </div>

          {amount && !error && (
            <div className="flex justify-between p-3 rounded-lg border border-primary/30 font-semibold bg-primary/10">
              <span>Estimated {orderType === "BUY" ? "Cost" : "Value"}</span>
              <span>${parseFloat(amount).toLocaleString()}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!amount || !!error || walletLoading}
            size="lg"
            className={`w-full text-white ${
              orderType === "BUY"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <Coins className="w-5 h-5 mr-2" />
            {orderType} {coinSymbol}
          </Button>

          <Button
            variant="ghost"
            onClick={toggleOrderType}
            className="w-full h-10 text-sm font-medium"
          >
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Switch to {orderType === "BUY" ? "SELL" : "BUY"}
          </Button>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-2 rounded border bg-card text-muted-foreground text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          Market orders are executed immediately at the current market price.
        </div>
      </div>
    </>
  );
};

export default TradingForm;