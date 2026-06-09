import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, Shield, Clock, AlertCircle, CheckCircle2, ShieldOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  sendVerificationOtp, 
  enableTwoFactorAuthentication, 
  disableTwoFactorAuthentication,
  getUser 
} from "@/State/Auth/action";

const AccountVerificationForm = ({ handleSubmit }) => {
  const [value, setValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();

  const isTwoFactorEnabled = auth.user?.twoFactorAuth?.enabled;

  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    try {
      await dispatch(sendVerificationOtp());
      setOtpSent(true);
      setDialogOpen(true);
      setSuccess("OTP sent to your email!");
      console.log("OTP sent to email");
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    if (value.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(enableTwoFactorAuthentication(value));
      
      const jwt = localStorage.getItem("jwt");
      await dispatch(getUser(jwt));
      
      setSuccess("Two-Factor Authentication enabled successfully!");
      setValue("");
      setOtpSent(false);
      
      setTimeout(() => {
        setDialogOpen(false);
      }, 1000);
      
      if (handleSubmit) {
        handleSubmit();
      }
      
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      console.error("Verify OTP error:", error);
    }
  };

  const handleDisable2FA = async () => {
    setError("");
    setSuccess("");
    
    try {
      await dispatch(disableTwoFactorAuthentication());
      
      const jwt = localStorage.getItem("jwt");
      await dispatch(getUser(jwt));
      
      setSuccess("Two-Factor Authentication disabled successfully!");
      setShowDisableConfirm(false);
      
      if (handleSubmit) {
        handleSubmit();
      }
      
    } catch (error) {
      setError("Failed to disable 2FA. Please try again.");
      console.error("Disable 2FA error:", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Email Verification Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
          <div className="p-2 rounded-lg bg-secondary shrink-0">
            <Mail className="w-4 h-4" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Email Address
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {auth.user?.email || "Not available"}
            </p>
          </div>
        </div>

        {/* Enable or Disable Button Based on Current Status */}
        {!isTwoFactorEnabled ? (
          // ✅ Enable 2FA Flow
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full gap-2 font-medium"
                size="lg"
                onClick={handleSendOTP}
                disabled={auth.loading}
              >
                <Shield className="w-4 h-4" strokeWidth={2} />
                {auth.loading ? "Sending..." : "Enable Two-Factor Authentication"}
              </Button>
            </DialogTrigger>

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
                    {auth.user?.email}
                  </span>
                </p>
              </DialogHeader>

              <Separator className="my-4" />

              <div className="space-y-6 py-2">
                <div className="flex justify-center">
                  <InputOTP 
                    value={value} 
                    onChange={(value) => setValue(value)} 
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
                    The verification code will expire in 5 minutes.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                    <p className="text-xs leading-relaxed">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 text-green-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                    <p className="text-xs leading-relaxed">{success}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    onClick={handleVerifyOTP} 
                    size="lg"
                    className="w-full font-medium"
                    disabled={value.length !== 6 || auth.loading}
                  >
                    {auth.loading ? "Verifying..." : "Verify and Enable"}
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full font-medium"
                    onClick={handleSendOTP}
                    disabled={auth.loading}
                  >
                    Resend Code
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you didn't request this code, please ignore this message.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          // ✅ Disable 2FA Flow
          <Dialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive"
                className="w-full gap-2 font-medium"
                size="lg"
                disabled={auth.loading}
              >
                <ShieldOff className="w-4 h-4" strokeWidth={2} />
                Disable Two-Factor Authentication
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <ShieldOff className="w-5 h-5 text-destructive" strokeWidth={2} />
                  </div>
                  <DialogTitle className="text-xl font-semibold">
                    Disable Two-Factor Authentication?
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your account will be less secure without two-factor authentication.
                </p>
              </DialogHeader>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={2} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Warning</p>
                    <p className="text-xs leading-relaxed">
                      Disabling 2FA will make your account more vulnerable to unauthorized access.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                    <p className="text-xs leading-relaxed">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 text-green-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                    <p className="text-xs leading-relaxed">{success}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    variant="destructive"
                    onClick={handleDisable2FA} 
                    size="lg"
                    className="w-full font-medium"
                    disabled={auth.loading}
                  >
                    {auth.loading ? "Disabling..." : "Yes, Disable 2FA"}
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full font-medium"
                    onClick={() => setShowDisableConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Status Messages */}
      {otpSent && !error && !isTwoFactorEnabled && (
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 text-green-600">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-xs leading-relaxed">
            Verification code has been sent to your email address.
          </p>
        </div>
      )}

      {isTwoFactorEnabled && (
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 text-green-600">
          <Shield className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-xs leading-relaxed">
            Two-Factor Authentication is currently enabled and protecting your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountVerificationForm;
