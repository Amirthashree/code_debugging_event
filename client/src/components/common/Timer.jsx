import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { useContest } from '../../context/ContestContext';

export const Timer = () => {
  const { contestStatus } = useContest();
  const [timeLeft, setTimeLeft] = useState(3600); // seconds

  useEffect(() => {
    if (!contestStatus || !contestStatus.endTime) return;

    const interval = setInterval(() => {
      const end = new Date(contestStatus.endTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [contestStatus]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 600;

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
      isLowTime
        ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
        : 'bg-dark-800/80 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
    }`}>
      {isLowTime ? <ShieldAlert className="h-4 w-4 animate-bounce" /> : <Clock className="h-4 w-4 text-neon-blue" />}
      <span className="font-mono font-bold text-sm tracking-wider">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;
