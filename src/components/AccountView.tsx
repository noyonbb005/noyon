import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Package,
  Truck,
  RotateCcw,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Heart,
  Ticket,
} from 'lucide-react';

interface AccountViewProps {
  onOpenAdmin?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onOpenAdmin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('shopper@example.com');
  const [password, setPassword] = useState('••••••••');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="pb-24 bg-stone-50 min-h-screen">
      {isLoggedIn ? (
        <div>
          {/* User Header Profile */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-2xl font-bold shadow-xs">
                  AJ
                </div>
                <div>
                  <h2 className="text-base font-black">Alex Johnson</h2>
                  <p className="text-xs text-orange-100">Gold Member • 1,240 Points</p>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Loyalty bar */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-xs">
              <div className="bg-black/10 rounded-lg py-1.5 cursor-pointer">
                <p className="font-extrabold text-white">5</p>
                <p className="text-[10px] text-orange-100">Wishlist</p>
              </div>
              <div className="bg-black/10 rounded-lg py-1.5 cursor-pointer">
                <p className="font-extrabold text-white">3</p>
                <p className="text-[10px] text-orange-100">Vouchers</p>
              </div>
              <div className="bg-black/10 rounded-lg py-1.5 cursor-pointer">
                <p className="font-extrabold text-white">৳4500</p>
                <p className="text-[10px] text-orange-100">Wallet</p>
              </div>
            </div>
          </div>

          {/* My Orders Section */}
          <div className="p-3">
            <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-stone-900">My Orders</h3>
                <span className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer flex items-center gap-0.5">
                  View All &gt;
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-stone-600">
                <button className="flex flex-col items-center gap-1 hover:text-orange-600">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">To Pay</span>
                </button>

                <button className="flex flex-col items-center gap-1 hover:text-orange-600 relative">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    1
                  </span>
                  <span className="text-[10px] font-medium">To Ship</span>
                </button>

                <button className="flex flex-col items-center gap-1 hover:text-orange-600">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">To Receive</span>
                </button>

                <button className="flex flex-col items-center gap-1 hover:text-orange-600">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">To Review</span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Tools */}
          <div className="px-3 space-y-2">
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 shadow-xs text-xs">
              <div className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3 text-stone-700">
                  <Heart className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">My Saved Items</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              <div className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3 text-stone-700">
                  <Ticket className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">Coupons & Promo Codes</span>
                </div>
                <span className="text-orange-600 font-bold text-[11px]">3 Available</span>
              </div>

              <div className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3 text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">Account Security & Privacy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              <div className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
                <div className="flex items-center gap-3 text-stone-700">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">Help Center & FAQs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              {onOpenAdmin && (
                <div
                  id="account-open-admin-btn"
                  onClick={onOpenAdmin}
                  className="p-3 flex items-center justify-between hover:bg-orange-50 bg-orange-50/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 text-orange-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Store Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded">
                      Manager
                    </span>
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full py-2.5 bg-white border border-stone-200 text-stone-600 font-semibold rounded-xl text-xs hover:bg-stone-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        /* Login / Register Card */
        <div className="p-4 pt-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-xs">
                O
              </div>
              <h2 className="text-lg font-black text-stone-900">
                {authMode === 'login' ? 'Welcome Back!' : 'Create New Account'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Sign in to track orders, save vouchers, and fast checkout.
              </p>
            </div>

            <div className="flex bg-stone-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  authMode === 'register' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-500'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address or Mobile
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all mt-2"
              >
                {authMode === 'login' ? 'Sign In to OrangeShop' : 'Create Free Account'}
              </button>
            </form>

            {onOpenAdmin && (
              <div className="mt-4 pt-3 border-t border-stone-100 text-center">
                <button
                  type="button"
                  id="account-admin-login-link"
                  onClick={onOpenAdmin}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Store Manager / Admin Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
