import React, { useState, useEffect } from "react"; // Added useEffect
import { useDispatch, useSelector } from "react-redux";
import { depositMoney } from "@/State/Wallet/Action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, AlertCircle, Check, Zap, TrendingUp } from "lucide-react";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  
  // 1. Get paymentOrder from Redux state
  const { loading, paymentOrder } = useSelector(state => state.wallet);

  // 2. TRIGGER REDIRECT: Watch for the payment_url from the backend
  useEffect(() => {
    if (paymentOrder?.payment_url) {
      console.log("Redirecting to Stripe:", paymentOrder.payment_url);
      window.location.href = paymentOrder.payment_url;
    }
  }, [paymentOrder]);

  const quickAmounts = [100, 500, 1000, 5000];
  const fees = amount ? (parseFloat(amount) * 0.02).toFixed(2) : "0.00";
  const total = amount ? (parseFloat(amount) + parseFloat(fees)).toFixed(2) : "0.00";
  const displayAmount = amount ? parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(value && parseFloat(value) < 10 ? "Minimum amount is $10" : "");
  };

  const handleQuickAmount = (value) => {
    setAmount(String(value));
    setError("");
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) < 10) {
      setError("Minimum amount is $10");
      return;
    }
    
    const jwt = localStorage.getItem("jwt");
    
    // 3. Dispatch action with required parameters for your backend
    dispatch(depositMoney({ 
        jwt, 
        amount: parseFloat(amount), 
        paymentMethod: "STRIPE" 
    }));
  };

  const isValid = amount && parseFloat(amount) >= 10;

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
      <div className="space-y-5 p-4 sm:p-6 bg-slate-900 rounded-lg">
        
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Add Funds
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">Secure and instant fund transfer</p>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <h3 className="text-sm sm:text-base font-semibold text-white">Transfer Amount</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center justify-between">
              <span>Enter Amount</span>
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
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs sm:text-sm mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                className={`h-9 sm:h-10 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  amount === String(amt) ? "bg-white text-black" : "bg-slate-800 text-white border border-slate-700"
                }`}
                onClick={() => handleQuickAmount(amt)}
              >
                ${amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Payment Method Card */}
        <Card className="border-2 bg-white/5 border-white shadow-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-md px-2 py-1">
                        <img 
                            className="h-4 sm:h-5" 
                            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                            alt="Stripe" 
                        />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-semibold text-white">Stripe</p>
                        <p className="text-[10px] text-slate-400">All Card Types • Instant</p>
                    </div>
                </div>
                <Badge className="bg-white text-black font-bold">Active</Badge>
            </div>
        </Card>

        {/* Summary */}
        {isValid && (
          <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 border border-white/10">
            <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Amount</span>
                <span className="text-white">${displayAmount}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm border-t border-slate-700 pt-2 font-bold">
                <span className="text-white">Total Charge</span>
                <span className="text-white">${total}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className={`w-full h-12 font-bold rounded-lg flex gap-2 ${
            isValid ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-slate-500'
          }`}
          disabled={!isValid || loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Contacting Stripe...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Add Funds ${displayAmount}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TopupForm;