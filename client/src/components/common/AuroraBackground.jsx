import React from 'react';

export const AuroraBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090e]">
      {/* Dynamic Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[140px] animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Grid Pattern Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;
