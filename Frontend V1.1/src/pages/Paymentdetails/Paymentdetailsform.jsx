import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentDetails, updatePaymentDetails } from "@/State/Withdrawal/Action";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckCircle2, Lock, Loader2 } from "lucide-react";

const paymentDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Name must be at least 2 characters"),
  ifsc: z.string().min(11, "IFSC code must be 11 characters").max(11, "IFSC code must be 11 characters"),
  accountNumber: z.string().min(9, "Account number must be at least 9 digits"),
  confirmAccountNumber: z.string().min(9, "Confirm account number"),
  bankName: z.string().min(2, "Bank name required"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

const PaymentDetailsForm = () => {
  const dispatch = useDispatch();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Get existing details and loading state from Redux
  const { paymentDetails, loading } = useSelector((state) => state.withdrawal || {});

  const form = useForm({
    resolver: zodResolver(paymentDetailsSchema),
    mode: "onChange",
    defaultValues: {
      accountHolderName: paymentDetails?.accountHolderName || "",
      ifsc: paymentDetails?.ifsc || "",
      accountNumber: paymentDetails?.accountNumber || "",
      confirmAccountNumber: paymentDetails?.accountNumber || "",
      bankName: paymentDetails?.bankName || "",
    },
  });

  const onSubmit = (data) => {
    const jwt = localStorage.getItem("jwt");
    const payload = {
      accountHolderName: data.accountHolderName,
      ifsc: data.ifsc,
      accountNumber: data.accountNumber,
      bankName: data.bankName
    };

    // LOGIC: If paymentDetails exists in Redux, we call UPDATE (PATCH)
    const action = paymentDetails 
      ? updatePaymentDetails({ paymentDetails: payload, jwt }) 
      : addPaymentDetails({ paymentDetails: payload, jwt });

    dispatch(action)
      .then(() => {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      })
      .catch((err) => console.error("Operation failed", err));
  };

  const isFormValid = form.formState.isValid;
  const progress = Object.keys(form.formState.dirtyFields).length;

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="px-4 sm:px-6 py-8 space-y-6 bg-slate-950">
        
        {/* Header - Changes based on Add/Update */}
        <div className="space-y-2 sticky top-0 bg-slate-950 pb-4 z-10 border-b border-slate-800/50">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-400" />
            {paymentDetails ? "Update Bank Account" : "Bank Account Verification"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {paymentDetails ? "Modify your linked withdrawal account" : "Secure your withdrawal details"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Form Completion</p>
            <p className="text-xs font-semibold text-slate-300">{progress}/5</p>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(progress / 5) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Account Holder Name</FormLabel>
                    <FormControl>
                      <Input className="bg-slate-950 border-slate-800 text-white" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Bank Name</FormLabel>
                    <FormControl>
                      <Input className="bg-slate-950 border-slate-800 text-white" placeholder="HDFC Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">IFSC Code</FormLabel>
                    <FormControl>
                      <Input className="bg-slate-950 border-slate-800 text-white uppercase" placeholder="HDFC0001234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Account Number</FormLabel>
                    <FormControl>
                      <Input type="password" 
                        className="bg-slate-950 border-slate-800 text-white" 
                        placeholder="••••••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Confirm Account Number</FormLabel>
                    <FormControl>
                      <Input type="password" 
                        className="bg-slate-950 border-slate-800 text-white" 
                        placeholder="••••••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {submitSuccess && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-md text-sm">
                <CheckCircle2 className="w-4 h-4" /> Bank details saved successfully!
              </div>
            )}

            <div className="sticky bottom-0 bg-slate-950 pt-4 flex gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 border-slate-700 text-white">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (paymentDetails ? "Update Account" : "Save & Verify")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentDetailsForm;