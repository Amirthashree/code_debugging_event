import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Trophy, Cpu, ArrowRight, Zap, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Zap className="h-4 w-4 text-neon-blue animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">
              Dev Dynasty Club Official Debugging Arena
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-mono text-white leading-none"
          >
            DEBUG THE BUG.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent neon-text-glow">
              CLAIM THE DYNASTY.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            High-octane full-stack online code debugging competition platform designed for 30–50 concurrent participants. Featuring multi-language Monaco IDE, real-time Socket telemetry, and anti-cheat enforcement.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link
                to="/instructions"
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <span>Enter Debugging Arena</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 transition-all cursor-pointer"
                >
                  <span>Register Participant</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-700 bg-dark-800/80 px-8 py-4 text-base font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-dark-800 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-2xl p-8 border-slate-800 glass-panel-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">VS Code Monaco IDE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Supports Java, Python, C, and C++ with real-time test case evaluation, auto-indentation, and syntax highlighting.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border-slate-800 glass-panel-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">Anti-Cheat Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enforces fullscreen mode, tab-switch monitoring, copy/paste lockdowns, and automated disqualification rules.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border-slate-800 glass-panel-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">Live Socket Leaderboard</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant real-time ranking table with dynamic score calculation, time penalty tracking, and CSV export.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default HomePage;
