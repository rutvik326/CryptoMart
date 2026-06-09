import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyForgotPasswordOtp, sendForgotPasswordOtp } from '@/State/Auth/action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Shield, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const OtpPopup = ({ email, onClose }) => {
  const [value, setValue] = useState("");
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const { forgotPassword } = useSelector(store => store.auth);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (value.length !== 6) {
      return;
    }

    const result = await dispatch(verifyForgotPasswordOtp(email, value));

    if (!result.success) {
      setValue("");
    }
  };

  const handleResend = async () => {
    setValue("");
    setCountdown(120);
    setCanResend(false);
    await dispatch(sendForgotPasswordOtp(email));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Shield className="w-5 h-5" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Enter Verification Code
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {email}
            </span>
          </p>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6 py-2">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP 
              value={value} 
              onChange={(value) => setValue(value)} 
              maxLength={6}
              disabled={forgotPassword.loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer Info */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {!canResend ? (
                <>Code expires in <span className="font-medium text-foreground">{formatTime(countdown)}</span></>
              ) : (
                "Your code has expired. Please request a new one."
              )}
            </p>
          </div>

          {/* Error Message */}
          {forgotPassword.error && (
            <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-xs leading-relaxed">{forgotPassword.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={handleVerify} 
              size="lg"
              className="w-full font-medium"
              disabled={value.length !== 6 || forgotPassword.loading}
            >
              {forgotPassword.loading ? "Verifying..." : "Verify Code"}
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              className="w-full font-medium"
              onClick={handleResend}
              disabled={!canResend || forgotPassword.loading}
            >
              {canResend ? "Resend Code" : `Resend in ${formatTime(countdown)}`}
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            For your security, do not share this code with anyone.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
