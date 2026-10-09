import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slice/authSlice';
import type { RootState } from '../store/store';
import {
    User,
    Mail,
    Lock,
    Sparkles,
    ArrowRight,
    Loader2,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertCircle,
} from 'lucide-react';

export const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const { loading, error } = useAppSelector((state: RootState) => state.auth);
    const { isDark } = useAppSelector((state: RootState) => state.theme);

    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: '', color: 'bg-transparent' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
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

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordError('');
        dispatch(clearError());

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            await dispatch(register({ name, email, password })).unwrap();
            navigate('/dashboard'); 
        } catch (err: unknown) {
            if (typeof err === 'string') {
                setPasswordError(err);
            } else if (err && typeof err === 'object' && 'message' in err) {
                setPasswordError(String((err as { message: string }).message));
            } else {
                setPasswordError('Registration failed');
            }
        }
    };

    return (
        <div className={`relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden ${
            isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50/70 text-slate-900'
        }`}>
            {/* Ambient luxury lighting */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-violet-600/25 via-indigo-600/20 to-pink-500/20 blur-[130px] rounded-full" />
            <div className="pointer-events-none absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[110px] rounded-full" />

            <div className={`relative w-full max-w-md rounded-3xl p-8 sm:p-10 backdrop-blur-2xl border transition-all duration-300 shadow-2xl overflow-hidden z-10 ${
                isDark 
                    ? 'bg-slate-900/60 border-slate-800/80 shadow-black/50' 
                    : 'bg-white/85 border-slate-200/80 shadow-slate-200/80'
            }`}>
                {/* Top iridescent glow line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Elite Membership</span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                        Create Your Account
                    </h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Start your high-performance productivity workspace today.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15'
                                }`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15'
                                }`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Password
                            </label>
                            {password && (
                                <span className={`text-[11px] font-semibold ${
                                    strength.score <= 1 ? 'text-rose-500' : strength.score === 2 ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                    {strength.label}
                                </span>
                            )}
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15'
                                }`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError('');
                                    if (error) dispatch(clearError());
                                }}
                                required
                                placeholder="At least 8 characters"
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Password strength progress bar */}
                        {password && (
                            <div className="mt-2 flex items-center gap-1.5">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                            step <= strength.score ? strength.color : isDark ? 'bg-slate-800' : 'bg-slate-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 ${
                                    isDark
                                        ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                                        : 'bg-slate-50/70 border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/15'
                                }`}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (passwordError) setPasswordError('');
                                    if (error) dispatch(clearError());
                                }}
                                required
                                placeholder="Re-enter your password"
                                minLength={8}
                                autoComplete="new-password"
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

                    {/* Error Notice */}
                    {(passwordError || error) && (
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{passwordError || error}</span>
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
                        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                        {!loading && <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />}
                    </button>

                    {/* Footer Links */}
                    <div className="text-center pt-2">
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Already have an account?{' '}
                        </span>
                        <Link
                            to="/login"
                            className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 hover:underline transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;