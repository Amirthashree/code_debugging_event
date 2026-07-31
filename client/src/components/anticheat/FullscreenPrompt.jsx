import React from 'react';
import { Maximize2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAntiCheat } from '../../context/AntiCheatContext';
import { motion } from 'framer-motion';

export const FullscreenPrompt = () => {
  const { isFullscreen, requestFullscreen, isDisqualified } = useAntiCheat();

  if (isFullscreen || isDisqualified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass-panel rounded-2xl p-8 text-center border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 mb-6 animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-black text-white font-mono mb-2">FULLSCREEN REQUIRED</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Dev Dynasty Club competition anti-cheat policies require mandatory Fullscreen mode. Exiting or switching tabs logs violation warnings to the live Admin panel.
        </p>

        <button
          onClick={requestFullscreen}
          className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-bold text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:opacity-90 transition-all cursor-pointer"
        >
          <Maximize2 className="h-5 w-5" />
          <span>Enter Fullscreen Mode</span>
        </button>
      </motion.div>
    </div>
  );
};

export default FullscreenPrompt;
