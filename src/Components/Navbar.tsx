import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Sun, Moon, LogOut, Sparkles, CheckSquare } from "lucide-react";
import { toggleTheme } from '../store/slice/themeSlice';
import { logout } from "../store/slice/authSlice";
import { useAppDispatch } from "../store/hooks";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isDark } = useSelector((state: RootState) => state.theme);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        dispatch(logout()).unwrap().then(() => {
            navigate("/login");
        }).catch((error) => {
            console.log(error);
        });
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark
                ? "bg-[#0B0F19]/80 border-slate-800/80 text-white"
                : "bg-white/80 border-slate-200/80 text-slate-800"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <CheckSquare className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            TASKMASTER
                        </span>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 -mt-1 flex items-center gap-1">
                            Pro Suite <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        </span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-4">

                    {/* Theme Toggle Button */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${isDark
                                ? "bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/60 text-amber-400"
                                : "bg-slate-100/80 border-slate-200 hover:bg-slate-200 text-slate-700"
                            }`}
                        aria-label="Toggle theme"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Profile Link Pill */}
                            <Link
                                to="/profile"
                                className={`flex items-center gap-2.5 py-1.5 pl-1.5 pr-3.5 rounded-full border transition-all cursor-pointer ${isDark
                                        ? "bg-slate-800/60 border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800"
                                        : "bg-slate-50 border-slate-200 hover:border-indigo-500/50 hover:bg-white shadow-sm"
                                    }`}
                                title="View Account Settings"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                    {userInitial}
                                </div>
                                <span className="text-xs font-semibold max-w-[120px] truncate">
                                    {user.name}
                                </span>
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isDark
                                        ? "border-rose-900/40 text-rose-400 bg-rose-950/20 hover:bg-rose-900/40"
                                        : "border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100"
                                    }`}
                                title="Log out"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-xs font-semibold px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-md shadow-indigo-500/20 transition"
                            >
                                SignUp
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;