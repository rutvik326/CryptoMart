import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest, getPaymentDetails } from "@/State/Withdrawal/Action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building2, ArrowUpRight, AlertCircle, Check, Wallet } from "lucide-react";

const Withdrawal = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // 1. Added 'withdrawal' to the selector to watch for success
  const { paymentDetails, loading: isSubmitting, withdrawal } = useSelector((state) => state.withdrawal);
  const { userWallet } = useSelector((state) => state.wallet);

  const jwt = localStorage.getItem("jwt");
  const availableBalance = userWallet?.balance || 230120;
  const minWithdrawal = 50;
  const quickAmounts = [100, 500, 1000, 5000];

  useEffect(() => {
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch, jwt]);

  // 2. AUTO-CLOSE LOGIC: Watch the withdrawal state
  useEffect(() => {
    if (withdrawal) {
      // Delay for 1.5 seconds so the user sees the "Processing" finish, then refresh
      const timer = setTimeout(() => {
        window.location.reload(); 
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [withdrawal]);

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && parseFloat(value) < minWithdrawal) {
      setError(`Minimum $${minWithdrawal}`);
    } else if (value && parseFloat(value) > availableBalance) {
      setError("Insufficient balance");
    } else {
      setError("");
    }
  };

  const handleQuickAmount = (value) => {
    if (value <= availableBalance) {
      setAmount(value.toString());
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) < minWithdrawal || parseFloat(amount) > availableBalance) {
      setError("Invalid amount");
      return;
    }
    
    dispatch(withdrawalRequest({ 
      jwt, 
      amount: parseFloat(amount) 
    }));
  };

  const isValid = amount && parseFloat(amount) >= minWithdrawal && parseFloat(amount) <= availableBalance;
  const newBalance = amount ? (availableBalance - parseFloat(amount)).toLocaleString() : availableBalance.toLocaleString();
  const displayAmount = amount ? parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="space-y-5 p-4 sm:p-6 bg-slate-900 rounded-lg">
        
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Withdraw Funds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">Transfer to your bank account</p>
        </div>

        {/* Available Balance */}
        <Card className="bg-slate-800/50 border-white/10">
          <div className="p-4 space-y-1">
            <p className="text-xs sm:text-sm text-slate-400">Available Balance</p>
            <div className="flex items-baseline gap-2">
              <DollarSign className="w-5 h-5 text-white" />
              <p className="text-2xl sm:text-3xl font-bold text-white">{availableBalance.toLocaleString()}</p>
              <span className="text-xs sm:text-sm text-slate-400">USD</span>
            </div>
          </div>
        </Card>

        {/* Withdrawal Amount */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center justify-between">
            <span>Withdrawal Amount</span>
            {amount && (
              <span className={`text-xs font-medium ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            )}
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              onChange={handleChange}
              value={amount}
              className={`pl-10 h-11 sm:h-12 bg-slate-800 border-2 text-base sm:text-lg font-bold rounded-lg transition-all duration-200 ${
                error ? 'border-red-500/50 bg-red-500/5 focus:border-red-500' : 
                amount && !error ? 'border-white/30 bg-white/5 focus:border-white/50' : 'border-slate-700 focus:border-slate-600'
              }`}
              placeholder="0.00"
              type="number"
              min={minWithdrawal}
              max={availableBalance}
            />
            {amount && !error && isValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-pulse">
                <Check className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm mt-1 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Quick Select */}
        <div>
          <Label className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 block">Quick Select</Label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                className={`h-9 sm:h-10 text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  amount === amt.toString()
                    ? "bg-white border-white shadow-lg text-black"
                    : "bg-slate-800 border-slate-700 text-white hover:border-white/50 hover:bg-slate-700"
                }`}
                onClick={() => handleQuickAmount(amt)}
                type="button"
              >
                ${amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Bank Account */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-semibold text-slate-300">Transfer To</Label>
          <Card className="bg-slate-800/50 border-white/10 hover:border-white/30 transition-all">
            <div className="flex items-center gap-3 p-3 sm:p-4">
              <div className="p-2 sm:p-2.5 bg-white/10 rounded-lg border border-white/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white">
                    {paymentDetails?.bankName || "YES Bank"}
                </p>
                <p className="text-xs text-slate-400">
                    •••• {paymentDetails?.accountNumber?.slice(-4) || "1651"}
                </p>
              </div>
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 text-xs shrink-0">
                Verified
              </Badge>
            </div>
          </Card>
        </div>

        {/* Summary */}
        {isValid && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 sm:p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Withdrawal Amount</span>
                  <span className="font-semibold text-white">${displayAmount}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Processing Time</span>
                  <span className="font-semibold text-white">1-3 days</span>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white text-xs sm:text-sm">New Balance</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">${newBalance}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className={`w-full h-11 sm:h-12 bg-white hover:bg-slate-100 text-black text-sm sm:text-base font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowUpRight className="w-5 h-5" />
              Withdraw ${displayAmount}
            </>
          )}
        </Button>

        {/* Info */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 text-xs text-slate-400 flex items-start gap-2">
          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>Safe & Secure transfer • Direct to your bank account</p>
            <p>Funds arrive within 1-3 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;