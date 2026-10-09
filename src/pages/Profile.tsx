import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile } from '../store/slice/authSlice';
import type { RootState } from '../store/store';
import {
  User,
  Mail,
  Lock, 
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  const { isDark } = useAppSelector((state: RootState) => state.theme);

  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setName(user.name || '');
    }
  }, [isAuthenticated, user, navigate]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-transparent' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-500' };
      case 4:
      default:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword && !currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required to set a new password' });
      return;
    }

    try {
      const payload: { name: string; currentPassword?: string; newPassword?: string } = { name };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await dispatch(updateProfile(payload)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const errorMsg = typeof err === 'string' ? err : 'Failed to update profile';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`relative min-h-[calc(100vh-64px)] transition-colors duration-300 overflow-hidden ${
      isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50/70 text-slate-900'
    } py-12 px-4 sm:px-6 lg:px-8`}>
      
      {/* Ambient luxury lighting */}
      <div className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-fuchsia-600/20 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-12 right-12 w-[340px] h-[340px] bg-cyan-500/10 blur-[110px] rounded-full" />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Account Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className={`mt-1.5 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage your personal credentials and security with enhanced protection.
            </p>
          </div>
        </div>

        {/* Hero Luxury Profile Card */}
        <div className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 shadow-xl overflow-hidden ${
          isDark 
            ? 'bg-slate-900/60 border-slate-800/80 shadow-black/40' 
            : 'bg-white/80 border-slate-200/80 shadow-slate-200/60'
        }`}>
          {/* Top subtle iridescent glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Glowing Avatar */}
            <div className="relative group shrink-0">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-violet-600 to-indigo-500 shadow-lg shadow-indigo-500/30">
                <div className="w-20 h-20 rounded-[14px] bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                  {userInitial}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-slate-900 shadow" title="Active">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Profile Info & Badges */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user?.name || 'Valued Member'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Protected
                </span>
              </div>

              <div className={`flex items-center justify-center sm:justify-start gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>{user?.email || 'user@example.com'}</span>
              </div>

              <p className={`text-xs pt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Account tier: <span className="font-medium text-indigo-500">Standard Pro</span> • Real-time database sync active
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3.5 text-sm font-medium border backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-500" />
            )}
            <span className="flex-1">{message.text}</span>
          </div>
        )}

        {/* Main Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card: Personal Information */}
          <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 shadow-xl ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800/80 shadow-black/30' 
              : 'bg-white/80 border-slate-200/80 shadow-slate-200/50'
          }`}>
            <div className="flex items-center gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Personal Information</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your public display name and account email
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15'
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">Locked for security</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className={`w-full pl-10 pr-24 py-3 rounded-xl border text-sm cursor-not-allowed select-none opacity-80 ${
                      isDark
                        ? 'bg-slate-800/30 border-slate-800 text-slate-300'
                        : 'bg-slate-100/70 border-slate-200 text-slate-600'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      Primary
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Security & Password */}
          <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 shadow-xl ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800/80 shadow-black/30' 
              : 'bg-white/80 border-slate-200/80 shadow-slate-200/50'
          }`}>
            <div className="flex items-center gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800/80">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Security & Credentials</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Update your authentication key. Leave blank to keep existing password.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Current Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/15'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="newPassword" className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    New Password
                  </label>
                  {newPassword && (
                    <span className={`text-xs font-medium ${
                      strength.score <= 1 ? 'text-rose-500' : strength.score === 2 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      Strength: {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/15'
                    }`}
                    placeholder="Create a new strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bar */}
                {newPassword && (
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          step <= strength.score ? strength.color : isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Confirm New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500/20'
                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/15'
                    }`}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (user?.name) setName(user.name);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setMessage(null);
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Reset Fields
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              )}
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
              {!loading && <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;
