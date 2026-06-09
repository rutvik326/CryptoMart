import React, { useState } from "react";
import { useDispatch } from "react-redux"; 
import { transferMoney } from "@/State/Wallet/Action"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Wallet, Send, AlertCircle, ShieldCheck } from "lucide-react";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickAmounts = [50, 100, 500, 1000];
  const maxTransfer = 100000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "amount" && value) {
      if (parseFloat(value) < 10) {
        setErrors(prev => ({ ...prev, amount: "Minimum $10" }));
      } else if (parseFloat(value) > maxTransfer) {
        setErrors(prev => ({ ...prev, amount: "Max $100k" }));
      } else {
        const nextErrors = { ...errors };
        delete nextErrors.amount;
        setErrors(nextErrors);
      }
    }
  };

  const handleQuickAmount = (value) => {
    setFormData({ ...formData, amount: String(value) });
    setErrors(prev => {
        const next = {...prev};
        delete next.amount;
        return next;
    });
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.walletId) {
      setErrors({
        amount: !formData.amount ? "Required" : "",
        walletId: !formData.walletId ? "Required" : ""
      });
      return;
    }

    setIsSubmitting(true);
    const jwt = localStorage.getItem("jwt");
    const sanitizedWalletId = formData.walletId.replace(/[:\s]/g, "");

    try {
      await dispatch(transferMoney({
        jwt,
        walletId: sanitizedWalletId,
        reqData: {
          amount: parseFloat(formData.amount),
          purpose: formData.purpose || "Wallet Transfer"
        }
      }));
      
      setFormData({ amount: "", walletId: "", purpose: "" });
      alert("Transfer Successful!");
    } catch (error) {
      setErrors({ submit: error.message || "Transfer failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.amount && 
                  parseFloat(formData.amount) >= 10 && 
                  formData.walletId && 
                  !errors.amount;

  const displayAmount = formData.amount ? parseFloat(formData.amount).toLocaleString('en-US') : "0.00";

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-slate-950 scrollbar-hide rounded-xl border border-slate-800">
      <div className="space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Transfer Funds
            </h2>
            <p className="text-xs text-slate-400">Instant P2P Wallet Transfer</p>
          </div>
          <ShieldCheck className="text-emerald-500 w-6 h-6 opacity-50" />
        </div>

        {/* SECTION 1: AMOUNT */}
        <div className="space-y-3">
          <Label className="text-slate-300 font-medium">Transfer Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              name="amount"
              onChange={handleChange}
              value={formData.amount}
              className={`pl-10 h-14 bg-slate-900 border-2 text-xl font-bold text-white transition-all ${
                errors.amount ? 'border-red-500/50' : 'border-slate-800 focus:border-blue-500'
              }`}
              placeholder="0.00"
              type="number"
            />
          </div>
          {errors.amount && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={14}/> {errors.amount}</p>}

          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAmount(amt)}
                className={`flex-1 py-2 text-xs font-bold rounded-md border transition-all ${
                  formData.amount === String(amt) 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: RECIPIENT */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Recipient Wallet ID</Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                name="walletId"
                placeholder="e.g. 3"
                onChange={handleChange}
                value={formData.walletId}
                className="pl-10 h-12 bg-slate-900 border-slate-800 text-white focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-medium text-xs">Purpose</Label>
            <Input
              name="purpose"
              placeholder="What's this for? (Optional)"
              onChange={handleChange}
              value={formData.purpose}
              className="h-12 bg-slate-900 border-slate-800 text-white focus:border-blue-500"
            />
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {errors.submit && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} /> {errors.submit}
          </div>
        )}

        {/* ACTION BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full h-14 text-lg font-bold rounded-xl transition-all ${
            isValid 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            `Send $${displayAmount}`
          )}
        </Button>

        <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-medium">
          Powered by Secure Transaction Protocol
        </p>
      </div>
    </div>
  );
};

export default TransferForm;