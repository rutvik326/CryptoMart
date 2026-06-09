import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  sendForgotPasswordOtp, 
  clearForgotPasswordState 
} from "@/State/Auth/action";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import OtpPopup from "./OtpPopup";
import ResetPasswordPopup from "./ResetPasswordPopup";

const ForgotPasswordForm = () => {
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgotPassword } = useSelector(store => store.auth);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    dispatch(clearForgotPasswordState());
  }, [dispatch]);

  useEffect(() => {
    if (forgotPassword.otpSent) {
      setShowOtpPopup(true);
      setEmailError("");
    }
  }, [forgotPassword.otpSent]);

  useEffect(() => {
    if (forgotPassword.otpVerified) {
      setShowOtpPopup(false);
      setShowResetPopup(true);
    }
  }, [forgotPassword.otpVerified]);

  const onSubmit = async (data) => {
    setEmailError("");
    
    const result = await dispatch(sendForgotPasswordOtp(data.email));
    
    if (!result.success) {
      setEmailError(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-white mb-3">Reset Password</h2>
      <p className="text-slate-400 text-sm text-center mb-6">
        Enter your email and we'll send you an OTP
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="email"
                      className={`w-full h-12 pl-11 bg-white/10 border ${
                        emailError || forgotPassword.error 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-white/20 focus:border-primary'
                      } text-white placeholder:text-slate-400 focus:bg-white/15 transition-all`}
                      placeholder="Enter your email"
                      disabled={forgotPassword.loading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                
                {/* ✅ IMPROVED ERROR DISPLAY */}
                {(emailError || (forgotPassword.error && !showOtpPopup)) && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" strokeWidth={2} />
                    <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                      {emailError || forgotPassword.error}
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={forgotPassword.loading}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          >
            {forgotPassword.loading ? "Sending..." : "Send OTP"}
          </Button>

          {/* Back to Sign In */}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="w-full text-center text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </button>
        </form>
      </Form>

      {showOtpPopup && (
        <OtpPopup
          email={form.getValues("email")}
          onClose={() => setShowOtpPopup(false)}
        />
      )}

      {showResetPopup && (
        <ResetPasswordPopup
          email={form.getValues("email")}
          resetToken={forgotPassword.resetToken}
          onClose={() => setShowResetPopup(false)}
        />
      )}
    </div>
  );
};

export default ForgotPasswordForm;
