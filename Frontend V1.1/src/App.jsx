import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/State/Auth/action';

// Page Imports
import Activity from '@/pages/Activity/Activity';
import Home from '@/pages/Home/Home';
import Navbar from '@/pages/Navbar/Navbar';
import NotFound from '@/pages/NotFound/NotFound';
import PaymentDetails from '@/pages/PaymentDetails/PaymentDetails';
import Portfolio from '@/pages/Portfolio/Portfolio';
import Profile from '@/pages/Profile/Profile';
import Searchccoin from '@/pages/Search/Searchcoin';
import StockDetails from '@/pages/StockDetails/StockDetails';
import Wallet from '@/pages/Wallet/Wallet';
import Watchlist from '@/pages/Watchlist/Watchlist';
import Withdrawal from '@/pages/Withdrawal/Withdrawal';
import Auth from '@/pages/Auth/Auth';

document.documentElement.classList.add('dark');

function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = auth.jwt || localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser(token));
    }
  }, [auth.jwt, dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {auth.user ? (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            
            {/* FIXED ROUTE: Matches /PaymentDetails link */}
            <Route path="/PaymentDetails" element={<PaymentDetails />} />
            
            <Route path="/market/:id" element={<StockDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Searchccoin />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;