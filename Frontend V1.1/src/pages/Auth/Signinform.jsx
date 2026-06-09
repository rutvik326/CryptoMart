import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/State/Auth/action";
import { Eye, EyeOff, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TwoFactorAuthModal from "./TwoFactorAuthModal";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
});

const SignInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("📨 Submitting login...");
      
      const result = await dispatch(login({ data: data, navigate: navigate }));
      
      console.log("📥 Login result:", result);
      
      if (result && result.twoFactorAuthEnabled === true) {
        console.log("🔐 Opening OTP modal");
        setShowOtpModal(true);
      } else {
        console.log("✅ Login successful, no 2FA");
      }
      
    } catch (error) {
      console.error("❌ Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailState = form.getFieldState("email");
  const passwordState = form.getFieldState("password");

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        className={cn(
                          "w-full h-12 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 transition-all duration-200",
                          emailState.invalid && emailState.isTouched && "border-red-500 focus:border-red-500 bg-red-500/10"
                        )}
                        placeholder="Enter your email"
                        {...field}
                      />
                      {emailState.isTouched && emailState.invalid && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <XCircle className="h-5 w-5 text-red-500 animate-in fade-in zoom-in duration-200" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-400 font-medium animate-in slide-in-from-top-1 duration-200" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className={cn(
                          "w-full h-12 pr-20 bg-white/10 border-white/20 text-white placeholder:text-slate-400 transition-all duration-200",
                          passwordState.invalid && passwordState.isTouched && "border-red-500 focus:border-red-500 bg-red-500/10"
                        )}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {passwordState.isTouched && passwordState.invalid && (
                          <XCircle className="h-5 w-5 text-red-500 animate-in fade-in zoom-in duration-200" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-400 font-medium animate-in slide-in-from-top-1 duration-200" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* 2FA OTP Modal */}
      <TwoFactorAuthModal 
        open={showOtpModal} 
        onClose={() => setShowOtpModal(false)} 
      />
    </>
  );
};

export default SignInForm;
