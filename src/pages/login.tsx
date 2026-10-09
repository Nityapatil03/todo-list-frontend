import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/slice/authSlice";
import type { RootState } from "../store/store";
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const { isDark } = useAppSelector((state: RootState) => state.theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={`relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
      isDark ? "bg-[#0B0F19] text-slate-100" : "bg-slate-50/70 text-slate-900"
    }`}>
      {/* Ambient luxury lighting */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-violet-600/25 via-indigo-600/20 to-pink-500/20 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[110px] rounded-full" />

      <div className={`relative w-full max-w-md rounded-3xl p-8 sm:p-10 backdrop-blur-2xl border transition-all duration-300 shadow-2xl overflow-hidden z-10 ${
        isDark 
          ? "bg-slate-900/60 border-slate-800/80 shadow-black/50" 
          : "bg-white/85 border-slate-200/80 shadow-slate-200/80"
      }`}>
        {/* Top iridescent glow line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Sign In to Account
          </h2>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Access your secure tasks and productivity workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                  isDark
                    ? "bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    : "bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15"
                }`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                  isDark
                    ? "bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                    : "bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15"
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            )}
            <span>{loading ? "Signing In..." : "Sign In"}</span>
            {!loading && <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />}
          </button>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
