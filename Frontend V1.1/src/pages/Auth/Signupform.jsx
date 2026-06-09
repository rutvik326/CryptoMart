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
import { register as registerUser } from "@/State/Auth/action";
import { Eye, EyeOff, XCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
});

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError("");
    
    try {
      await dispatch(registerUser({ data: data, navigate: navigate }));
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || "Registration failed";
      
      console.log("Error caught in component:", errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes("does not exist")) {
        setApiError("This email address does not exist. Please check your email and try again.");
      } else if (errorMessage.includes("Did you mean")) {
        setApiError(errorMessage);
      } else if (errorMessage.includes("Temporary email") || errorMessage.includes("risky")) {
        setApiError("Temporary or suspicious email addresses are not allowed. Please use your personal email.");
      } else if (errorMessage.includes("already registered")) {
        setApiError("This email is already registered. Please login instead.");
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullNameState = form.getFieldState("fullName");
  const emailState = form.getFieldState("email");
  const passwordState = form.getFieldState("password");

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-white mb-6">Create Account</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90 text-sm font-medium">
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      className={cn(
                        "w-full h-12 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400",
                        fullNameState.invalid && fullNameState.isTouched && "border-red-500 bg-red-500/10"
                      )}
                      placeholder="Enter your full name"
                      {...field}
                    />
                    {fullNameState.isTouched && fullNameState.invalid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                    {fullNameState.isTouched && !fullNameState.invalid && field.value && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-400 font-medium" />
              </FormItem>
            )}
          />

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
                        "w-full h-12 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400",
                        emailState.invalid && emailState.isTouched && "border-red-500 bg-red-500/10"
                      )}
                      placeholder="Enter your email"
                      {...field}
                    />
                    {emailState.isTouched && emailState.invalid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                    {emailState.isTouched && !emailState.invalid && field.value && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-400 font-medium" />
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
                        "w-full h-12 pr-20 bg-white/10 border-white/20 text-white placeholder:text-slate-400",
                        passwordState.invalid && passwordState.isTouched && "border-red-500 bg-red-500/10"
                      )}
                      placeholder="Create a password"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {passwordState.isTouched && passwordState.invalid && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {passwordState.isTouched && !passwordState.invalid && field.value && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-400 font-medium" />
              </FormItem>
            )}
          />

          {/* API Error Message */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-900/20 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                {apiError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
