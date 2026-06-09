import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  HomeIcon,
  DashboardIcon,
  BookmarkIcon,
  ActivityLogIcon,
  PersonIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import {
  WalletIcon,
  LandmarkIcon,
  CreditCardIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/State/Auth/action";

const menu = [
  {
    name: "Home",
    path: "/",
    icon: <HomeIcon className="w-6! h-6!" />,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: <DashboardIcon className="w-6! h-6!" />,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: <BookmarkIcon className="w-6! h-6!" />,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: <ActivityLogIcon className="w-6! h-6!" />,
  },
  {
    name: "Wallet",
    path: "/wallet",
    icon: <WalletIcon className="w-6! h-6!" />,
  },
  {
    name: "Payment Details",
    path: "/paymentdetails",
    icon: <LandmarkIcon className="w-6! h-6!" />,
  },
  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: <CreditCardIcon className="w-6! h-6!" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon className="w-6! h-6!" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <ExitIcon className="w-6! h-6!" />,
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="mt-1 space-y-2.5">
      {menu.map((item) => (
        <div key={item.name}>
          <SheetClose asChild>
            {item.name === "Logout" ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-5 py-6 w-full"
              >
                <span className="w-5">{item.icon}</span>
                <p>{item.name}</p>
              </Button>
            ) : (
              <Link to={item.path}>
                <Button variant="outline" className="flex items-center gap-5 py-6 w-full">
                  <span className="w-5">{item.icon}</span>
                  <p>{item.name}</p>
                </Button>
              </Link>
            )}
          </SheetClose>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
