import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  BookmarkIcon,
  Activity,
  HomeIcon,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { name: "Portfolio", path: "/portfolio", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="w-4 h-4" /> },
    { name: "Wallet", path: "/wallet", icon: <Wallet className="w-4 h-4" /> },
    { name: "Activity", path: "/activity", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.15), transparent 50%)`,
        }}
      />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <div className="text-center px-6 py-12 max-w-4xl relative z-10">
        <div className="mb-8 relative">
          <h1 className="text-9xl md:text-[200px] font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-red-500 to-purple-600 animate-gradient-x mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Oops! Lost in the Crypto Space
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          The page you're looking for seems to have disappeared into the blockchain.
          Let's get you back on track!
        </p>
        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <Button
            onClick={() => navigate(-1)}
            size="lg"
            className="flex items-center gap-2 px-8 py-6 text-lg bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {quickLinks.map((link) => (
            <div
              key={link.name}
              onClick={() => navigate(link.path)}
              className="group p-6 bg-slate-900/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:bg-slate-800 hover:border-orange-600/50 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-linear-to-br from-orange-500/20 to-purple-500/20 rounded-full group-hover:from-orange-500/30 group-hover:to-purple-500/30 transition-all">
                  {link.icon}
                </div>
                <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                  {link.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-gray-500 text-sm">
          Error Code: 404 • Page Not Found
        </p>
      </div>
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
