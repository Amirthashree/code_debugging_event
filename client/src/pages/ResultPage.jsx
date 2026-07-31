import React, { useEffect } from 'react';
import { Trophy, CheckCircle, Award, ArrowRight, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const ResultPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Fire celebratory confetti on view
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel rounded-3xl p-8 border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center space-y-8"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(0,240,255,0.5)]">
            <Trophy className="h-10 w-10 text-black font-extrabold" />
          </div>

          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Dev Dynasty Club Championship
            </span>
            <h1 className="text-3xl font-black text-white font-mono mt-1">Competition Completed!</h1>
            <p className="text-sm text-slate-300 mt-2">
              Great effort, <span className="text-cyan-300 font-bold">{user?.username || 'Participant'}</span>! Your debugging submission score has been officially recorded.
            </p>
          </div>

          {/* Stats Badge Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="rounded-2xl bg-dark-900/80 p-4 border border-slate-800">
              <p className="text-xs text-slate-400 font-mono">Final Score</p>
              <p className="text-3xl font-extrabold text-neon-blue font-mono mt-1">{user?.score || 0} pts</p>
            </div>
            <div className="rounded-2xl bg-dark-900/80 p-4 border border-slate-800">
              <p className="text-xs text-slate-400 font-mono">Challenges Solved</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                {user?.questionsSolved ? user.questionsSolved.length : 0}
              </p>
            </div>
            <div className="rounded-2xl bg-dark-900/80 p-4 border border-slate-800">
              <p className="text-xs text-slate-400 font-mono">Anti-Cheat Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-2 uppercase">Verified Clean ✓</p>
            </div>
          </div>

          {/* Certificate Preview Card */}
          <div className="rounded-2xl bg-dark-950 p-6 border border-slate-800 max-w-lg mx-auto text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="h-32 w-32 text-cyan-400" />
            </div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold font-mono mb-2">
              <Sparkles className="h-4 w-4" />
              <span>CERTIFICATE OF PARTICIPATION</span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono">Dev Dynasty Debugging Arena</h3>
            <p className="text-xs text-slate-400 mt-1">
              Issued to <span className="text-slate-200 font-semibold">{user?.username}</span> ({user?.collegeOrOrg || 'Dev Dynasty Club'})
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to="/leaderboard"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90"
            >
              <span>View Final Leaderboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default ResultPage;
