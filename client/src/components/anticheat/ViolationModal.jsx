import React from 'react';
import { AlertOctagon, X } from 'lucide-react';
import { useAntiCheat } from '../../context/AntiCheatContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ViolationModal = () => {
  const { warningModalOpen, setWarningModalOpen, violationsCount, lastViolationType, isDisqualified } = useAntiCheat();

  if (!warningModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="max-w-sm w-full glass-panel rounded-2xl p-6 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.3)] text-center relative"
        >
          <button
            onClick={() => setWarningModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-4 animate-bounce">
            <AlertOctagon className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-bold text-amber-400 font-mono mb-1">
            {isDisqualified ? 'DISQUALIFICATION NOTICE' : 'ANTI-CHEAT WARNING'}
          </h3>

          <p className="text-xs text-slate-300 mb-4">
            Violation Detected: <span className="font-bold text-white uppercase">{lastViolationType}</span>
          </p>

          <div className="rounded-xl bg-dark-900/80 p-3 border border-slate-800 text-xs mb-5">
            <p className="text-slate-400">Total Warnings Accrued:</p>
            <p className="text-2xl font-black text-amber-400 font-mono mt-1">
              {violationsCount} / 5
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {5 - violationsCount > 0 ? `${5 - violationsCount} remaining before auto-disqualification` : 'Limit Breached'}
            </p>
          </div>

          <button
            onClick={() => setWarningModalOpen(false)}
            className="w-full rounded-xl bg-amber-500/20 border border-amber-500/40 py-2.5 font-bold text-amber-300 hover:bg-amber-500/30 transition-all text-xs"
          >
            Acknowledge & Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ViolationModal;
