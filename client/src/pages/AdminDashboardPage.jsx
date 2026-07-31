import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileCode2, ShieldAlert, Award, Download, LayoutDashboard, Plus } from 'lucide-react';
import API from '../services/api';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ContestControlPanel from '../components/admin/ContestControlPanel';
import ParticipantMonitorTable from '../components/admin/ParticipantMonitorTable';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    activeParticipants: 0,
    totalSubmissions: 0,
    totalViolations: 0,
    totalQuestions: 0
  });

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await API.get('/admin/export');
      const data = res.data;
      if (!data || data.length === 0) {
        toast.error('No participant result data to export');
        return;
      }
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
      const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DevDynasty_Debugging_Results_${Date.now()}.csv`;
      a.click();
      toast.success('Results exported successfully!');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-mono flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-purple-400" />
              <span>Admin Control Center</span>
            </h1>
            <p className="text-xs text-slate-400">Manage 30-50 concurrent participants & contest state</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/questions"
              className="flex items-center space-x-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <FileCode2 className="h-4 w-4" />
              <span>Manage Questions</span>
            </Link>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Total Participants</p>
              <p className="text-2xl font-black text-white font-mono mt-1">{stats.totalParticipants}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Active Connected</p>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.activeParticipants}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Submissions Evaluated</p>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-1">{stats.totalSubmissions}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <FileCode2 className="h-5 w-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono">Anti-Cheat Infractions</p>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">{stats.totalViolations}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Master Contest Timer & Announcement Control */}
        <ContestControlPanel />

        {/* Participant Telemetry & Anti-Cheat Realtime Stream */}
        <ParticipantMonitorTable />
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default AdminDashboardPage;
