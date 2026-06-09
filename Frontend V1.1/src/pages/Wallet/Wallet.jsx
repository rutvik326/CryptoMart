import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// State Actions
import { 
  getUserWallet, 
  getWalletTransactions, 
  depositMoneySuccess 
} from "@/State/Wallet/Action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Icons
import { 
  CopyIcon, 
  DollarSign, 
  DownloadIcon, 
  ShuffleIcon, 
  UploadIcon, 
  WalletIcon,
  ArrowUpRight,
  ArrowDownLeft 
} from "lucide-react";
import { ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";

// Forms
import TopupForm from "./TopupForm";
import Withdrawal from "./Withdrawalform";
import TransferForm from "./TransferForm";

const Wallet = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams(); 
  const { userWallet, transactions, loading } = useSelector((state) => state.wallet);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const paymentIntentId = searchParams.get("payment_intent");
    const jwt = localStorage.getItem("jwt");

    if (orderId && jwt) {
      dispatch(depositMoneySuccess({ jwt, orderId, paymentId: paymentIntentId || "ST_SUCCESS" }));
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("order_id");
      newParams.delete("payment_intent");
      setSearchParams(newParams);
    }
  }, [dispatch, searchParams, setSearchParams]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWallet(jwt));
      dispatch(getWalletTransactions({ jwt }));
    }
  }, [dispatch]);

  const handleCopyWalletId = () => {
    if (userWallet?.id) {
      navigator.clipboard.writeText(userWallet.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getUserWallet(jwt));
      dispatch(getWalletTransactions({ jwt }));
    }
  };

  /**
   * UPDATED HELPER:
   * 1. Icons are now neutral (no specific color).
   * 2. Titles now show names for transfers.
   */
  const getTransactionDetails = (item) => {
    const amount = Number(item.amount) || 0;
    const type = item.type?.toUpperCase() || "";
    
    // Check if there is a name associated with the transfer
    const otherParty = item.receiverName || item.senderName || item.purpose || "";

    // 1. OUTGOING (Negative)
    if (amount < 0) {
      if (type.includes("TRANSFER")) {
        return {
          icon: <ShuffleIcon className="text-white" size={20} />,
          title: item.receiverName ? `Sent to ${item.receiverName}` : "Transfer Out",
          color: "text-red-500",
          prefix: "-"
        };
      }
      return {
        icon: <ArrowUpRight className="text-white" size={20} />,
        title: "Withdrawal",
        color: "text-red-500",
        prefix: "-"
      };
    }

    // 2. INCOMING (Positive)
    if (type.includes("TRANSFER")) {
      return {
        icon: <ShuffleIcon className="text-white" size={20} />,
        title: item.senderName ? `From ${item.senderName}` : "Transfer In",
        color: "text-green-500",
        prefix: "+"
      };
    }

    return {
      icon: <ArrowDownLeft className="text-white" size={20} />,
      title: "Deposit",
      color: "text-green-500",
      prefix: "+"
    };
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%] px-4">
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon size={30} className="text-white" />
                <div>
                  <CardTitle className="text-2xl text-white">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">#{userWallet?.id || "Loading..."}</p>
                    <button onClick={handleCopyWalletId} className="cursor-pointer text-gray-400 hover:text-white">
                      <CopyIcon size={13} />
                    </button>
                    {copied && <span className="text-xs text-green-500">Copied!</span>}
                  </div>
                </div>
              </div>
              <button onClick={handleRefresh} disabled={loading} className="text-white hover:text-gray-400 transition-colors">
                <ReloadIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-white">
              <DollarSign className="w-8 h-8" />
              <span className="text-3xl font-bold">{userWallet?.balance?.toLocaleString() || "0.00"}</span>
            </div>
            <div className="flex gap-7 mt-8">
              <WalletActionDialog title="Top Up" icon={<DownloadIcon />} label="Add Money" content={<TopupForm />} />
              <WalletActionDialog title="Withdraw" icon={<UploadIcon />} label="Withdrawal" content={<Withdrawal />} />
              <WalletActionDialog title="Transfer" icon={<ShuffleIcon />} label="Transfer" content={<TransferForm />} />
            </div>
          </CardContent>
        </Card>

        <div className="py-5 pt-10">
          <h1 className="text-2xl font-bold text-white pb-5">History</h1>

          <div className="space-y-4">
            {transactions?.length > 0 ? (
              transactions.map((item, index) => {
                const details = getTransactionDetails(item);

                return (
                  <Card key={item.id || index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardContent className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <Avatar className="h-10 w-10 bg-slate-800 border border-slate-700">
                          <AvatarFallback className="bg-transparent">{details.icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="text-sm font-semibold text-white">{details.title}</h1>
                          <p className="text-xs text-gray-500">{item.date || "Recent"}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-bold ${details.color}`}>
                          {details.prefix}{Math.abs(item.amount)?.toLocaleString()} USD
                        </p>
                        {/* Purpose often contains extra details from the backend */}
                        {item.purpose && (
                           <p className="text-[10px] text-gray-500 italic max-w-[150px] truncate">
                             {item.purpose}
                           </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-10">No history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletActionDialog = ({ title, icon, label, content }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className="h-24 w-24 bg-slate-800 hover:bg-slate-700 text-white cursor-pointer flex flex-col items-center justify-center rounded-xl transition-all border border-slate-700 shadow-md">
        {icon}
        <span className="text-xs font-medium mt-2">{label}</span>
      </div>
    </DialogTrigger>
    <DialogContent className="bg-slate-900 border-slate-800 text-white">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {content}
    </DialogContent>
  </Dialog>
);

export default Wallet;