import React from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/signup";
  const isForgotPassword = location.pathname === "/forgot-password";

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Image */}
   <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2369')"
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Centered Card */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-black/50 rounded-2xl shadow-2xl border border-white/10 px-8 py-10">
          
          {/* Logo & Title */}
           <div className="flex flex-col items-center mb-8">
            <img 
              src="/images/logo-bg.png" 
              alt="CryptoMart Logo" 
              className="h-16 w-16 mb-3"
            />
            <h1 className="text-4xl font-bold text-white">CryptoMart</h1>
          </div>

          {/* Forms */}
          {isSignup ? (
            <section className="space-y-6">
              <SignUpForm />
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-300">Already have an account?</span>
                <Button 
                  onClick={() => navigate("/signin")} 
                  variant="link" 
                  className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
                >
                  Sign in
                </Button>
              </div>
            </section>
          ) : isForgotPassword ? (
            <section className="space-y-6">
              <ForgotPasswordForm />
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-300">Remember your password?</span>
                <Button 
                  onClick={() => navigate("/signin")} 
                  variant="link" 
                  className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
                >
                  Sign in
                </Button>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              <SignInForm />
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-slate-300">Don't have an account?</span>
                  <Button 
                    onClick={() => navigate("/signup")} 
                    variant="link" 
                    className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
                  >
                    Sign up
                  </Button>
                </div>
                
                <Button 
                  onClick={() => navigate("/forgot-password")} 
                  variant="ghost" 
                  className="w-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  Forgot password?
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
