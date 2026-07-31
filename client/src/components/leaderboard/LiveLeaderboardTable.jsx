import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Search } from 'lucide-react';
import API from '../../services/api';
import { getSocket } from '../../services/socketService';
import { motion } from 'framer-motion';

export const LiveLeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/admin/participants');
      setLeaderboard(res.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const socket = getSocket();
    socket.on('leaderboard:updated', () => {
      fetchLeaderboard();
    });

    return () => {
      socket.off('leaderboard:updated');
    };
  }, []);

  const filtered = leaderboard.filter(p =>
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.collegeOrOrg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono">Live Competition Leaderboard</h3>
            <p className="text-xs text-slate-400">Real-time socket updates for Dev Dynasty Club</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search participant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
            <tr>
              <th className="py-3.5 px-4 text-center">Rank</th>
              <th className="py-3.5 px-4">Participant</th>
              <th className="py-3.5 px-4">College / Org</th>
              <th className="py-3.5 px-4 text-center">Challenges Solved</th>
              <th className="py-3.5 px-4 text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.map((p, idx) => {
              const rank = idx + 1;
              return (
                <motion.tr
                  key={p._id || p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`hover:bg-dark-800/80 transition-all ${
                    rank === 1 ? 'bg-amber-500/10' : rank === 2 ? 'bg-slate-400/10' : rank === 3 ? 'bg-amber-700/10' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-center font-bold">
                    {rank === 1 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        🥇 1
                      </span>
                    ) : rank === 2 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/50 text-sm">
                        🥈 2
                      </span>
                    ) : rank === 3 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-800/20 text-amber-500 border border-amber-700/50 text-sm">
                        🥉 3
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm font-semibold">#{rank}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-sans">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                        {p.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{p.username}</p>
                        {p.isDisqualified && (
                          <span className="text-[10px] text-red-400 font-bold uppercase">DISQUALIFIED</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans text-slate-400">{p.collegeOrOrg || 'Dev Dynasty Club'}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                      <Flame className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{p.questionsSolved ? p.questionsSolved.length : 0} Solved</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-base font-extrabold text-neon-blue font-mono tracking-wider">
                      {p.score} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveLeaderboardTable;
