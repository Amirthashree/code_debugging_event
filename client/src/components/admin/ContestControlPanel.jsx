import React, { useState } from 'react';
import { Play, Pause, Square, Megaphone, Clock } from 'lucide-react';
import API from '../../services/api';
import { useContest } from '../../context/ContestContext';
import toast from 'react-hot-toast';

export const ContestControlPanel = () => {
  const { contestStatus, refreshStatus } = useContest();
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [announcement, setAnnouncement] = useState('');

  const handleUpdateStatus = async (status) => {
    try {
      await API.put('/contest/update', { status });
      toast.success(`Contest status changed to: ${status.toUpperCase()}`);
      refreshStatus();
    } catch (err) {
      toast.error('Failed to update contest status');
    }
  };

  const handleSetDuration = async () => {
    try {
      await API.put('/contest/update', { durationMinutes: Number(durationMinutes) });
      toast.success(`Duration updated to ${durationMinutes} minutes`);
      refreshStatus();
    } catch (err) {
      toast.error('Failed to update duration');
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    try {
      await API.put('/contest/update', { announcement });
      toast.success('Live broadcast message sent to all participants!');
      setAnnouncement('');
      refreshStatus();
    } catch (err) {
      toast.error('Failed to send broadcast');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
          <Clock className="h-5 w-5 text-neon-blue" />
          <span>Contest Master Controls</span>
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
          contestStatus?.status === 'active'
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            : contestStatus?.status === 'paused'
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            : 'bg-red-500/20 text-red-400 border border-red-500/40'
        }`}>
          State: {contestStatus?.status || 'Active'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleUpdateStatus('active')}
          className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-4 py-2.5 font-bold text-emerald-400 hover:bg-emerald-500/30 transition-all text-xs"
        >
          <Play className="h-4 w-4" />
          <span>Start / Resume</span>
        </button>
        <button
          onClick={() => handleUpdateStatus('paused')}
          className="flex items-center justify-center space-x-2 rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2.5 font-bold text-amber-400 hover:bg-amber-500/30 transition-all text-xs"
        >
          <Pause className="h-4 w-4" />
          <span>Pause Contest</span>
        </button>
        <button
          onClick={() => handleUpdateStatus('ended')}
          className="flex items-center justify-center space-x-2 rounded-xl bg-red-500/20 border border-red-500/40 px-4 py-2.5 font-bold text-red-400 hover:bg-red-500/30 transition-all text-xs"
        >
          <Square className="h-4 w-4" />
          <span>End Contest</span>
        </button>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-20 glass-input rounded-xl px-3 py-2 text-xs font-mono text-center"
          />
          <button
            onClick={handleSetDuration}
            className="rounded-xl border border-slate-700 bg-dark-800 px-3 py-2 text-xs font-semibold text-cyan-400 hover:border-cyan-500/40"
          >
            Set Mins
          </button>
        </div>
      </div>

      {/* Live Broadcast Announcement Input */}
      <form onSubmit={handleSendAnnouncement} className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">Broadcast Announcement to Participants</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Type live announcement message..."
            className="flex-1 glass-input rounded-xl px-3 py-2 text-xs text-slate-100"
          />
          <button
            type="submit"
            className="flex items-center space-x-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
          >
            <Megaphone className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContestControlPanel;
