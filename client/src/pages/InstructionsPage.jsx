import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Play, CheckSquare, Clock, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAntiCheat } from '../context/AntiCheatContext';

export const InstructionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const { requestFullscreen } = useAntiCheat();
  const navigate = useNavigate();

  const handleStartContest = () => {
    requestFullscreen();
    navigate('/contest');
  };

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 border-slate-800 space-y-8 shadow-2xl"
        >
          <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Dev Dynasty Club</span>
              <h1 className="text-3xl font-extrabold text-white font-mono mt-1">Official Debugging Competition Rules</h1>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-4 text-slate-300 text-sm">
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-dark-900/60 border border-slate-800">
              <Clock className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-1">Contest Timing & Auto-Submit</h4>
                <p className="text-xs text-slate-400">
                  The debugging championship has a strict duration (60 minutes). When the timer reaches 00:00, all active code buffers in Monaco Editor will be automatically evaluated and submitted.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-400 mb-1">Strict Anti-Cheat Policy</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Mandatory Fullscreen Mode is enforced. Exiting triggers an immediate warning.</li>
                  <li>Tab switching, window blur, copying, pasting, and opening DevTools are recorded.</li>
                  <li>Exceeding 5 anti-cheat violations results in automatic contest disqualification and code locking.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-xl bg-dark-900/60 border border-slate-800">
              <Code2 className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-1">Supported Programming Languages</h4>
                <p className="text-xs text-slate-400">
                  You can solve challenges in <span className="text-cyan-300 font-semibold font-mono">Python, Java, C, or C++</span>. You may switch languages at any time during the contest.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
            <input
              type="checkbox"
              id="agree-rules"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 rounded border-slate-700 bg-dark-900 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
            />
            <label htmlFor="agree-rules" className="text-xs text-slate-300 cursor-pointer font-medium select-none">
              I have read, understood, and agree to abide by the anti-cheat guidelines and contest rules.
            </label>
          </div>

          {/* Enter Button */}
          <div className="flex justify-end">
            <button
              disabled={!agreed}
              onClick={handleStartContest}
              className={`flex items-center space-x-2 rounded-xl px-8 py-4 font-bold text-black transition-all ${
                agreed
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className="h-5 w-5" />
              <span>Begin Competition & Enter Fullscreen</span>
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default InstructionsPage;
