import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, UserCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import API from '../../services/api';
import { getSocket } from '../../services/socketService';

export const ParticipantMonitorTable = () => {
  const [participants, setParticipants] = useState([]);
  const [violationsStream, setViolationsStream] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipantsData = async () => {
    try {
      const [pRes, vRes] = await Promise.all([
        API.get('/admin/participants'),
        API.get('/admin/violations')
      ]);
      setParticipants(pRes.data);
      setViolationsStream(vRes.data);
    } catch (err) {
      console.error('Failed to fetch monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantsData();

    const socket = getSocket();
    socket.on('admin:violation_stream', (violationEvent) => {
      setViolationsStream((prev) => [violationEvent, ...prev.slice(0, 49)]);
      fetchParticipantsData();
    });

    socket.on('leaderboard:updated', () => {
      fetchParticipantsData();
    });

    return () => {
      socket.off('admin:violation_stream');
      socket.off('leaderboard:updated');
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Participants Live Status Table */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            <span>Active Participant Telemetry ({participants.length})</span>
          </h3>
          <button
            onClick={fetchParticipantsData}
            className="text-slate-400 hover:text-cyan-400 p-1"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-3">Participant</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Solved</th>
                <th className="py-3 px-3">Anti-Cheat Warnings</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {participants.map((p) => (
                <tr key={p._id || p.id} className="hover:bg-dark-800/50">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{p.username}</div>
                    <div className="text-[10px] text-slate-500">{p.collegeOrOrg}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{p.score} pts</td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {p.questionsSolved ? p.questionsSolved.length : 0}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      p.violationsCount >= 5
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : p.violationsCount > 0
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {p.violationsCount || 0} / 5
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.isDisqualified
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : p.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.isDisqualified ? 'DISQUALIFIED' : p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Anti-Cheat Violation Event Stream */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <span>Real-time Anti-Cheat Alerts</span>
        </h3>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {violationsStream.map((v, idx) => (
            <div key={idx} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="text-amber-300">{v.username}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(v.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>
              <div className="font-mono text-red-400 font-bold uppercase text-[11px] mb-1">
                ⚠️ {v.type}
              </div>
              <div className="text-[10px] text-slate-400">{v.details || 'Browser rule infraction'}</div>
            </div>
          ))}
          {violationsStream.length === 0 && (
            <div className="text-xs text-slate-500 italic text-center py-6">
              No anti-cheat infractions logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantMonitorTable;
