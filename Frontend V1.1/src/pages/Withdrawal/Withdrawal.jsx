import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added Redux hooks
import { getWithdrawalHistory } from "@/State/Withdrawal/Action"; // Import your action
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard, 
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowDownRight,
  Calendar,
  Zap,
  Eye,
  EyeOff,
  Loader2, // For loading state
} from "lucide-react";

const Withdrawal = () => {
  const [showAmount, setShowAmount] = useState(true);

  // --- REDUX CONNECTION ---
  const dispatch = useDispatch();
  const { history: withdrawals, loading, paymentDetails } = useSelector((state) => state.withdrawal);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getWithdrawalHistory(jwt));
    }
  }, [dispatch, jwt]);
  // -------------------------

  const totalWithdrawn = withdrawals
    .filter(w => w.status === "SUCCESS" || w.status === "Completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingAmount = withdrawals
    .filter(w => w.status === "PENDING" || w.status === "Pending")
    .reduce((sum, w) => sum + w.amount, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
      case "Completed":
        return (
          <Badge className="bg-white text-black flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        );
      case "PENDING":
      case "Pending":
        return (
          <Badge className="border-white/50 text-white bg-white/10">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "FAILURE":
      case "Failed":
        return (
          <Badge className="border-red-500/50 text-red-500 bg-red-500/10">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:px-20 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-3xl leading-none text-white">Withdrawal History</h1>
              <p className="text-sm text-slate-400 mt-1">Track all your withdrawals</p>
            </div>
          </div>
        </div>

        {/* SECTION 1: KEY METRICS */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-white to-slate-400 rounded"></div>
            <h2 className="text-sm font-bold text-white">Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Total Withdrawn */}
            <Card className="bg-slate-900 border-slate-800 hover:border-white/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Withdrawn</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-white">
                        {showAmount ? `$${totalWithdrawn.toFixed(2)}` : "****"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{withdrawals.filter(w => w.status === "SUCCESS" || w.status === "Completed").length} completed</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-white"
                    onClick={() => setShowAmount(!showAmount)}
                  >
                    {showAmount ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Amount */}
            <Card className="bg-slate-900 border-slate-800 hover:border-white/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-white">${pendingAmount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">{withdrawals.filter(w => w.status === "PENDING" || w.status === "Pending").length} pending</p>
                  </div>
                  <Clock className="w-6 h-6 text-white/60" />
                </div>
              </CardContent>
            </Card>

            {/* Failed */}
            <Card className="bg-slate-900 border-slate-800 hover:border-white/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-white">${withdrawals.filter(w => w.status === "FAILURE" || w.status === "Failed").reduce((sum, w) => sum + w.amount, 0).toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">{withdrawals.filter(w => w.status === "FAILURE" || w.status === "Failed").length} failed</p>
                  </div>
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
      </div>

      {/* SECTION 2: TABLE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-linear-to-b from-white to-slate-400 rounded"></div>
          <h2 className="text-sm font-bold text-white">Transactions</h2>
          <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
            {withdrawals.length} transactions
          </Badge>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-400 font-bold uppercase">Date & Time</TableHead>
                    <TableHead className="text-xs text-slate-400 font-bold uppercase">Method</TableHead>
                    <TableHead className="text-xs text-slate-400 font-bold uppercase">Amount</TableHead>
                    <TableHead className="text-xs text-slate-400 font-bold uppercase">Account</TableHead>
                    <TableHead className="text-xs text-slate-400 font-bold uppercase">Processing</TableHead>
                    <TableHead className="text-xs text-slate-400 font-bold uppercase text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-500" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    withdrawals.map((item) => (
                      <TableRow 
                        key={item.id}
                        className="border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-sm font-semibold text-white">{new Date(item.date).toLocaleDateString()}</p>
                              <p className="text-xs text-slate-500">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-semibold text-white">Bank Transfer</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold text-white">
                            {showAmount ? `$${item.amount.toFixed(2)}` : "****"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-400 font-mono">
                            {paymentDetails?.accountNumber || "***1651"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold ${
                            item.status === "PENDING" || item.status === "Pending" ? "text-white/60" : 
                            item.status === "FAILURE" || item.status === "Failed" ? "text-red-500" : 
                            "text-slate-400"
                          }`}>
                            {item.status === "PENDING" || item.status === "Pending" ? "Processing..." : "Done"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(item.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 p-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {withdrawals.length} withdrawals
              </p>
              <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800 text-xs">
                Load More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="bg-white/10 border-white/20 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-white mt-0.5 shrink-0" />
            <p className="text-xs text-white/80">
              <span className="font-semibold">Pro Tips:</span> Withdrawals typically process within 1-3 business days. You can hide amounts for privacy. Failed withdrawals will be credited back within 5 business days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawal;