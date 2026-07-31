import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/60 bg-dark-900/60 py-6 text-center text-xs text-slate-500 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-medium text-slate-400">
          CODE DEBUGGING Platform &copy; 2026 <span className="text-cyan-400 font-semibold">Dev Dynasty Club</span>. All rights reserved.
        </p>
        <div className="flex items-center space-x-6 text-slate-400">
          <span>Concurrent Participants: 30-50 Engine</span>
          <span>•</span>
          <span>Multi-language Monaco Execution</span>
          <span>•</span>
          <span>Anti-Cheat Realtime Telemetry</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
