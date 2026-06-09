import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDetails } from "@/State/Withdrawal/Action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // Added import
} from "@/components/ui/dialog";
import Paymentdetailsform from "./Paymentdetailsform";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandmarkIcon, CheckCircle2, Copy, Loader2 } from "lucide-react";

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  
  const { paymentDetails, loading } = useSelector((state) => state.withdrawal);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getPaymentDetails({ jwt }));
    }
  }, [dispatch]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 sm:p-3 bg-slate-900 rounded-lg border border-slate-800">
              <LandmarkIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white">Payment Details</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your bank account information</p>
            </div>
          </div>
        </div>

        {paymentDetails ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-white rounded"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Linked Account</h2>
            </div>

            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                      {paymentDetails.bankName || "Linked Bank"}
                      <Badge className="bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">Active Withdrawal Account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-medium mb-2">A/C Number</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-bold text-white font-mono">
                      {paymentDetails.accountNumber}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => handleCopy(paymentDetails.accountNumber)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium mb-2">Account Holder Name</p>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-white rounded"></div>
                    <p className="text-base sm:text-lg font-semibold text-white">
                        {paymentDetails.accountHolderName}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium mb-2">IFSC Code</p>
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-mono text-white uppercase">
                        {paymentDetails.ifsc}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => handleCopy(paymentDetails.ifsc)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-slate-700">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        Update Bank Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Update Payment Details</DialogTitle>
                        {/* Hidden description for accessibility */}
                        <DialogDescription className="sr-only">
                          Modify your existing bank account information below.
                        </DialogDescription>
                      </DialogHeader>
                      <Paymentdetailsform initialData={paymentDetails} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-white rounded"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Add Payment Method</h2>
            </div>

            <Card className="bg-slate-900 border-slate-800 border-2 border-dashed hover:border-slate-600 transition-all">
              <CardContent className="p-8 sm:p-12 text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <LandmarkIcon className="h-8 w-8 text-slate-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Bank Linked</h3>
                  <p className="text-sm text-slate-400">Add your bank account to enable payouts to your bank.</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white hover:bg-slate-200 text-black font-semibold">
                      Add Payment Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Bank Account</DialogTitle>
                      {/* Hidden description for accessibility */}
                      <DialogDescription className="sr-only">
                        Enter your account holder name, bank name, IFSC, and account number.
                      </DialogDescription>
                    </DialogHeader>
                    <Paymentdetailsform />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;