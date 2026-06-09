import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPassword, clearForgotPasswordState } from '@/State/Auth/action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const ResetPasswordPopup = ({ email, resetToken, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { forgotPassword } = useSelector(store => store.auth);

  // Password requirements (for validation only, not displayed)
  const requirements = [
    { test: (pwd) => pwd.length >= 8 },
    { test: (pwd) => /[A-Z]/.test(pwd) },
    { test: (pwd) => /[0-9]/.test(pwd) },
  ];

  const getPasswordStrength = () => {
    const passedCount = requirements.filter(req => req.test(newPassword)).length;
    if (passedCount <= 1) return { text: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500', width: '25%' };
    if (passedCount === 2) return { text: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-500', width: '50%' };
    if (passedCount === 3) return { text: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-500', width: '75%' };
    return { text: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleResetPassword = async () => {
    setPasswordError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    // Validate all requirements
    const allRequirementsMet = requirements.every(req => req.test(newPassword));
    if (!allRequirementsMet) {
      setPasswordError('Password must be at least 8 characters with uppercase, number, and special character');
      return;
    }

    // Call API
    const result = await dispatch(resetPassword(email, resetToken, newPassword, confirmPassword));

    if (result.success) {
      // Show success and redirect
      setTimeout(() => {
        dispatch(clearForgotPasswordState());
        navigate('/signin');
      }, 2000);
    } else {
      setPasswordError(result.message);
    }
  };

  // Success State
  if (forgotPassword.resetSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Password Reset Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting to sign in...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Lock className="w-5 h-5" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Create New Password
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Your new password must be different from previous passwords
          </p>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-5 py-2">
          
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={forgotPassword.loading}
                className="pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Strength:</span>
                  <span className={`text-xs font-semibold ${strength.color}`}>{strength.text}</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.bgColor} transition-all duration-300`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={forgotPassword.loading}
                className="pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-xs leading-relaxed">{passwordError}</p>
            </div>
          )}

          {/* Reset Button */}
          <Button
            onClick={handleResetPassword}
            disabled={!newPassword || !confirmPassword || forgotPassword.loading}
            size="lg"
            className="w-full font-medium"
          >
            {forgotPassword.loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Make sure your password is strong and unique to protect your account.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordPopup;
