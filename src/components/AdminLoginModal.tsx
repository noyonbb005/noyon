import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin123') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Default: admin / admin123');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="admin-login-modal"
        className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white relative">
          <button
            id="close-admin-login-btn"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center mb-2.5 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-black text-white leading-tight">
            Admin Access Portal
          </h2>
          <p className="text-xs text-orange-100 mt-0.5">
            Manage store products, pricing, and customer orders
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-stone-700">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo: <strong>admin</strong> / <strong>admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider"
            >
              Fill Credentials
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="admin-submit-login-btn"
            type="submit"
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login to Admin Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
