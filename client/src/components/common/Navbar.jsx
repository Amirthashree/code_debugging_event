import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Shield, Trophy, User, LogOut, LayoutDashboard, Code2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAntiCheat } from '../../context/AntiCheatContext';
import Timer from './Timer';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { violationsCount, isDisqualified } = useAntiCheat();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Title */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-all">
            <Code2 className="h-5 w-5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-xl text-white font-mono">CODE DEBUGGING</span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                DEV DYNASTY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Dev Dynasty Club Competition</p>
          </div>
        </Link>

        {/* Center Nav Items / Timer */}
        <div className="hidden md:flex items-center space-x-6">
          {user && location.pathname.includes('/contest') && <Timer />}

          <Link
            to="/leaderboard"
            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
              location.pathname === '/leaderboard' ? 'text-neon-blue' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-dark-800/80 border-slate-700 text-slate-300 hover:border-purple-500/30'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-purple-400" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* User Right Profile Control */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Anti-Cheat Violation Badge (Participants Only) */}
              {user.role === 'participant' && (
                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isDisqualified
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : violationsCount > 0
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <Shield className="h-3.5 w-3.5" />
                  <span>
                    {isDisqualified ? 'DISQUALIFIED' : `Violations: ${violationsCount}/5`}
                  </span>
                </div>
              )}

              {/* User Avatar Info */}
              <div className="flex items-center space-x-2 rounded-xl bg-dark-800/90 border border-slate-700/80 px-3 py-1.5">
                <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-black">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">{user.username}</p>
                  <p className="text-[10px] text-cyan-400 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-700/80 bg-dark-800/80 p-2 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
