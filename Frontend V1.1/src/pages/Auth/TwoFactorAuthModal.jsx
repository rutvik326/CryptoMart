import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { verifyLoginOtp } from '@/State/Auth/action';

const TwoFactorAuthModal = ({ open, onClose }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  // FIX: Select only the 'auth' slice from the store.
  // This resolves the Redux "Selector unknown returned the root state" error.
  const auth = useSelector(state => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (value.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // ⭐ DEBUG LOGS
    console.log("🔐 Verifying OTP...");
    console.log("📧 OTP entered:", value);
    console.log("🎫 Session ID:", auth.session);

    try {
      // We use unwrap() if you're using Redux Toolkit, 
      // otherwise, handle the promise from your custom action.
      await dispatch(verifyLoginOtp({
        otp: value.trim(),
        session: auth.session,
        navigate: navigate
      }));
      
      console.log("✅ OTP verified successfully");
      // Optionally reset value on success
      setValue('');
      onClose();
      
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
      // Try to get error message from backend response if available
      const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <ShieldCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Two-Factor Authentication
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to your email
          </p>
        </DialogHeader>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="flex justify-center">
            <InputOTP 
              value={value} 
              onChange={(val) => setValue(val)} 
              maxLength={6}
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

          <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check your email for the verification code. It will expire in 5 minutes.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={auth.loading || value.length !== 6}
            >
              {auth.loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Verifying...
                </span>
              ) : 'Verify'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        <Separator className="my-4" />

        <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            For security purposes, you'll need to enter the code sent to your registered email address.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;