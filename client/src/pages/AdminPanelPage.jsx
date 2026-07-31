import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileCode2, Trophy, ShieldAlert, Users,
  Plus, Pencil, Trash2, Save, X, Play, Pause, Square,
  Download, Search, Flame, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Clock, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { getSocket } from '../services/socketService';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

// ─── Tab IDs ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'problems',  label: 'Problems',   icon: FileCode2 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'participants', label: 'Participants', icon: Users },
];

// ─── Problem Form (inline) ─────────────────────────────────────────────────
const ProblemForm = ({ question, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    category: 'Debugging Logic',
    points: 100,
    buggyCode: { python: '', java: '', c: '', cpp: '' },
    solutionCode: { python: '', java: '', c: '', cpp: '' },
    testCases: [{ input: '', expectedOutput: '', isPublic: true }],
    hint: ''
  });
  const [saving, setSaving] = useState(false);
  const [codeTab, setCodeTab] = useState('python');

  useEffect(() => {
    if (question) setForm({ ...form, ...question });
  }, [question]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setBuggy = (lang, val) => setForm(f => ({ ...f, buggyCode: { ...f.buggyCode, [lang]: val } }));
  const setSolution = (lang, val) => setForm(f => ({ ...f, solutionCode: { ...f.solutionCode, [lang]: val } }));

  const addTC = () => set('testCases', [...form.testCases, { input: '', expectedOutput: '', isPublic: true }]);
  const removeTC = i => set('testCases', form.testCases.filter((_, idx) => idx !== i));
  const updateTC = (i, field, val) => {
    const updated = [...form.testCases];
    updated[i][field] = val;
    set('testCases', updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (question?._id) {
        await API.put(`/questions/${question._id}`, form);
        toast.success('Problem updated!');
      } else {
        await API.post('/questions', form);
        toast.success('Problem created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error('Failed to save problem');
    } finally {
      setSaving(false);
    }
  };

  const langs = ['python', 'java', 'c', 'cpp'];
  const diffOpts = [
    { value: 'easy', label: 'Easy', pts: 100 },
    { value: 'medium', label: 'Medium', pts: 150 },
    { value: 'hard', label: 'Hard', pts: 250 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 shadow-[0_0_60px_rgba(0,240,255,0.15)] my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FileCode2 className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">
                {question ? 'Edit Problem' : 'Create New Problem'}
              </h2>
              <p className="text-xs text-slate-400">Fill in the debugging challenge details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* Title + Difficulty + Points */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1.5">Problem Title *</label>
              <input
                required value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Fix Binary Search Infinite Loop"
                className="w-full glass-input rounded-xl px-3 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => {
                  const opt = diffOpts.find(d => d.value === e.target.value);
                  setForm(f => ({ ...f, difficulty: e.target.value, points: opt.pts }));
                }}
                className="w-full glass-input rounded-xl px-3 py-2.5 bg-transparent text-cyan-300 font-semibold"
              >
                {diffOpts.map(d => (
                  <option key={d.value} value={d.value}>{d.label} ({d.pts} pts)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Points</label>
              <input
                type="number" min={10} max={1000}
                value={form.points}
                onChange={e => set('points', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-emerald-400 font-bold font-mono"
              />
            </div>
          </div>

          {/* Category + Hint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 bg-transparent text-slate-100"
              >
                {['Debugging Logic', 'Array & Strings', 'Recursion', 'Sorting', 'Graph', 'Dynamic Programming', 'Pointers', 'OOP'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Hint (optional)</label>
              <input
                value={form.hint}
                onChange={e => set('hint', e.target.value)}
                placeholder="A subtle hint to guide participants..."
                className="w-full glass-input rounded-xl px-3 py-2.5 text-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Problem Description *</label>
            <textarea
              required rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the problem, what it should do, and what's wrong with the buggy code..."
              className="w-full glass-input rounded-xl px-3 py-2.5 text-slate-100 font-sans resize-none"
            />
          </div>

          {/* Buggy Code by language */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-cyan-400 font-mono">Buggy Code Templates</h4>
              <div className="flex gap-1">
                {langs.map(lang => (
                  <button
                    key={lang} type="button"
                    onClick={() => setCodeTab(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      codeTab === lang
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1.5">
                  {codeTab.toUpperCase()} — Buggy Template (shown to participants)
                </label>
                <textarea
                  rows={7} value={form.buggyCode?.[codeTab] || ''}
                  onChange={e => setBuggy(codeTab, e.target.value)}
                  placeholder={`Paste the ${codeTab} buggy code here...`}
                  className="w-full glass-input rounded-xl p-3 font-mono text-slate-200 text-[11px] resize-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1.5">
                  {codeTab.toUpperCase()} — Correct Solution (for evaluation)
                </label>
                <textarea
                  rows={7} value={form.solutionCode?.[codeTab] || ''}
                  onChange={e => setSolution(codeTab, e.target.value)}
                  placeholder={`Paste the correct ${codeTab} solution here...`}
                  className="w-full glass-input rounded-xl p-3 font-mono text-emerald-300 text-[11px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-cyan-400 font-mono">Test Cases</h4>
              <button type="button" onClick={addTC}
                className="flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold border border-cyan-500/30 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Test Case</span>
              </button>
            </div>
            <div className="space-y-2.5">
              {form.testCases.map((tc, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-xl bg-dark-900/60 border border-slate-800">
                  <div>
                    <div className="text-slate-500 text-[10px] mb-1 font-mono">INPUT</div>
                    <input
                      value={tc.input}
                      onChange={e => updateTC(i, 'input', e.target.value)}
                      placeholder="e.g. 5 3"
                      className="w-full glass-input rounded-lg px-2.5 py-1.5 font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] mb-1 font-mono">EXPECTED OUTPUT</div>
                    <input
                      value={tc.expectedOutput}
                      onChange={e => updateTC(i, 'expectedOutput', e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full glass-input rounded-lg px-2.5 py-1.5 font-mono text-emerald-400"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-slate-500 text-[10px] mb-1">PUBLIC</div>
                    <input
                      type="checkbox" checked={tc.isPublic}
                      onChange={e => updateTC(i, 'isPublic', e.target.checked)}
                      className="h-4 w-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <button type="button" onClick={() => removeTC(i)}
                    className="mt-4 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-semibold"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : (question ? 'Update Problem' : 'Create Problem')}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Main Admin Panel ──────────────────────────────────────────────────────
const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats
  const [stats, setStats] = useState({ totalParticipants: 0, activeParticipants: 0, totalSubmissions: 0, totalViolations: 0, totalQuestions: 0 });

  // Problems
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [qLoading, setQLoading] = useState(true);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  const [lSearch, setLSearch] = useState('');
  const [lLoading, setLLoading] = useState(true);

  // Participants
  const [participants, setParticipants] = useState([]);

  // Contest
  const [contest, setContest] = useState(null);
  const [contesting, setContesting] = useState(false);
  const [duration, setDuration] = useState(60);

  // ── Fetch helpers ───────────────────────────────────────────────────
  const fetchStats = async () => {
    try { const r = await API.get('/admin/dashboard'); setStats(r.data); } catch {}
  };

  const fetchQuestions = async () => {
    setQLoading(true);
    try { const r = await API.get('/questions'); setQuestions(r.data); } catch {}
    finally { setQLoading(false); }
  };

  const fetchLeaderboard = async () => {
    setLLoading(true);
    try { const r = await API.get('/admin/participants'); setLeaderboard(r.data); } catch {}
    finally { setLLoading(false); }
  };

  const fetchContest = async () => {
    try { const r = await API.get('/contest/status'); setContest(r.data); } catch {}
  };

  // ── Init + Socket ───────────────────────────────────────────────────
  useEffect(() => {
    fetchStats(); fetchQuestions(); fetchLeaderboard(); fetchContest();

    const socket = getSocket();
    socket.on('leaderboard:updated', () => { fetchLeaderboard(); fetchStats(); });
    socket.on('contest:status_changed', c => setContest(c));

    return () => { socket.off('leaderboard:updated'); socket.off('contest:status_changed'); };
  }, []);

  // ── Contest Controls ────────────────────────────────────────────────
  const contestAction = async (action) => {
    setContesting(true);
    try {
      if (action === 'start') {
        await API.post('/contest/start', { durationMinutes: duration });
        toast.success(`Contest started! Duration: ${duration} minutes`);
      } else if (action === 'pause') {
        await API.post('/contest/pause');
        toast.success('Contest paused');
      } else if (action === 'resume') {
        await API.post('/contest/resume');
        toast.success('Contest resumed');
      } else if (action === 'end') {
        await API.post('/contest/end');
        toast.success('Contest ended');
      }
      fetchContest(); fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Contest action failed');
    } finally {
      setContesting(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Delete this problem? This cannot be undone.')) return;
    try {
      await API.delete(`/questions/${id}`);
      toast.success('Problem deleted');
      fetchQuestions(); fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  const handleExport = async () => {
    try {
      const r = await API.get('/admin/export');
      if (!r.data?.length) { toast.error('No data to export'); return; }
      const csv = [Object.keys(r.data[0]).join(','), ...r.data.map(o => Object.values(o).join(','))].join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = `DevDynasty_Results_${Date.now()}.csv`;
      a.click();
      toast.success('Exported!');
    } catch { toast.error('Export failed'); }
  };

  // ── Status badge ────────────────────────────────────────────────────
  const statusColor = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    paused: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    ended:  'text-slate-400 bg-slate-500/10 border-slate-500/30',
    pending:'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  const filteredLB = leaderboard.filter(p =>
    p.username?.toLowerCase().includes(lSearch.toLowerCase()) ||
    p.collegeOrOrg?.toLowerCase().includes(lSearch.toLowerCase())
  );

  const diffBadge = { easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30', hard: 'text-red-400 bg-red-500/10 border-red-500/30' };

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-purple-400" />
            Admin Control Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dev Dynasty Club — Manage problems, monitor participants, control contest</p>
        </div>

        {/* Contest status banner */}
        {contest && (
          <div className={`mb-5 flex items-center justify-between px-5 py-3 rounded-2xl border ${statusColor[contest.status] || statusColor.pending}`}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-bold font-mono text-sm">Contest: {contest.status?.toUpperCase()}</span>
              {contest.title && <span className="text-slate-400 text-xs">— {contest.title}</span>}
            </div>
            {contest.status === 'active' && contest.endTime && (
              <span className="text-xs font-mono">Ends: {new Date(contest.endTime).toLocaleTimeString()}</span>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 glass-panel rounded-2xl border border-slate-800 w-fit">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB: DASHBOARD ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Participants', value: stats.totalParticipants, color: 'text-blue-400', icon: Users },
                  { label: 'Online Now', value: stats.activeParticipants, color: 'text-emerald-400', icon: Flame },
                  { label: 'Problems', value: stats.totalQuestions || questions.length, color: 'text-cyan-400', icon: FileCode2 },
                  { label: 'Submissions', value: stats.totalSubmissions, color: 'text-purple-400', icon: CheckCircle2 },
                  { label: 'Violations', value: stats.totalViolations, color: 'text-amber-400', icon: ShieldAlert },
                ].map(s => (
                  <div key={s.label} className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase">{s.label}</p>
                      <p className={`text-2xl font-black font-mono mt-0.5 ${s.color}`}>{s.value}</p>
                    </div>
                    <s.icon className={`h-6 w-6 ${s.color} opacity-60`} />
                  </div>
                ))}
              </div>

              {/* Contest Control */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white font-mono flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Contest Controls
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-mono">Duration (min):</label>
                    <input
                      type="number" min={1} max={300} value={duration}
                      onChange={e => setDuration(Number(e.target.value))}
                      className="glass-input rounded-lg px-3 py-1.5 w-20 text-center font-mono text-cyan-300 text-sm font-bold"
                    />
                  </div>
                  <button
                    onClick={() => contestAction('start')} disabled={contesting || contest?.status === 'active'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Play className="h-3.5 w-3.5" /> Start
                  </button>
                  <button
                    onClick={() => contestAction('pause')} disabled={contesting || contest?.status !== 'active'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </button>
                  <button
                    onClick={() => contestAction('resume')} disabled={contesting || contest?.status !== 'paused'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-black text-xs font-bold disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Play className="h-3.5 w-3.5" /> Resume
                  </button>
                  <button
                    onClick={() => contestAction('end')} disabled={contesting || !contest || contest?.status === 'ended'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Square className="h-3.5 w-3.5" /> End
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer transition-all ml-auto"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('problems')}
                  className="glass-panel rounded-2xl p-5 border border-cyan-500/20 text-left hover:border-cyan-500/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileCode2 className="h-5 w-5 text-cyan-400" />
                    <span className="font-bold text-white font-mono">Manage Problems</span>
                  </div>
                  <p className="text-xs text-slate-400">{questions.length} problems created. Click to add/edit debugging challenges.</p>
                </button>
                <button onClick={() => setActiveTab('leaderboard')}
                  className="glass-panel rounded-2xl p-5 border border-amber-500/20 text-left hover:border-amber-500/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-white font-mono">View Leaderboard</span>
                  </div>
                  <p className="text-xs text-slate-400">{leaderboard.length} participants ranked. Click to see live standings.</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── TAB: PROBLEMS ── */}
          {activeTab === 'problems' && (
            <motion.div key="problems" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-mono">Debugging Problems</h2>
                  <p className="text-xs text-slate-400">{questions.length} problems in the contest</p>
                </div>
                <button
                  onClick={() => { setEditQuestion(null); setShowForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Problem
                </button>
              </div>

              {qLoading ? (
                <div className="glass-panel rounded-2xl p-12 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
                </div>
              ) : questions.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center">
                  <FileCode2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-mono">No problems yet.</p>
                  <p className="text-slate-500 text-xs mt-1">Click "Add Problem" to create the first debugging challenge.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <motion.div
                      key={q._id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-500 font-mono">#{idx + 1}</span>
                            <h3 className="font-bold text-white font-mono text-sm truncate">{q.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBadge[q.difficulty] || diffBadge.medium}`}>
                              {q.difficulty?.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
                              {q.category}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 font-mono">{q.points} pts</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{q.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                            <span>{q.testCases?.length || 0} test cases</span>
                            <span>•</span>
                            <span className="text-cyan-500">
                              {Object.keys(q.buggyCode || {}).filter(l => q.buggyCode[l]).join(', ') || 'No code'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => { setEditQuestion(q); setShowForm(true); }}
                            className="p-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(q._id)}
                            className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB: LEADERBOARD ── */}
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Live Leaderboard
                  </h2>
                  <p className="text-xs text-slate-400">Real-time standings — updates automatically</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      value={lSearch} onChange={e => setLSearch(e.target.value)}
                      placeholder="Search participant..."
                      className="glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 w-48"
                    />
                  </div>
                  <button onClick={fetchLeaderboard} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                {lLoading ? (
                  <div className="p-12 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
                  </div>
                ) : filteredLB.length === 0 ? (
                  <div className="p-12 text-center">
                    <Trophy className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-mono text-sm">No participants yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="border-b border-slate-800 bg-slate-900/40">
                        <tr className="text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                          <th className="px-5 py-3.5 text-center">Rank</th>
                          <th className="px-5 py-3.5 text-left">Participant</th>
                          <th className="px-5 py-3.5 text-left">College / Org</th>
                          <th className="px-5 py-3.5 text-center">Solved</th>
                          <th className="px-5 py-3.5 text-right">Score</th>
                          <th className="px-5 py-3.5 text-center">Violations</th>
                          <th className="px-5 py-3.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredLB.map((p, idx) => {
                          const rank = idx + 1;
                          const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
                          return (
                            <motion.tr
                              key={p._id || p.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              className={`hover:bg-slate-800/30 transition-colors font-mono ${
                                rank === 1 ? 'bg-amber-500/5' : rank <= 3 ? 'bg-slate-400/5' : ''
                              } ${p.isDisqualified ? 'opacity-50' : ''}`}
                            >
                              <td className="px-5 py-3.5 text-center font-bold text-sm">{medalEmoji}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                    {p.username?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-100 text-xs">{p.username}</p>
                                    <p className="text-[10px] text-slate-500">{p.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-slate-400 font-sans">{p.collegeOrOrg || '—'}</td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                                  <Flame className="h-3 w-3" />
                                  {p.questionsSolved?.length || 0}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <span className="text-base font-extrabold text-neon-blue">{p.score}</span>
                                <span className="text-slate-500 text-[10px] ml-1">pts</span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                {p.violationsCount > 0
                                  ? <span className="text-amber-400 font-bold">{p.violationsCount}</span>
                                  : <span className="text-slate-600">—</span>
                                }
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                {p.isDisqualified
                                  ? <span className="text-[10px] font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">DQ</span>
                                  : <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                                }
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TAB: PARTICIPANTS ── */}
          {activeTab === 'participants' && (
            <motion.div key="participants" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Participant Monitor
                  </h2>
                  <p className="text-xs text-slate-400">Real-time anti-cheat and submission tracking</p>
                </div>
              </div>
              <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-800 bg-slate-900/40">
                      <tr className="text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                        <th className="px-5 py-3.5 text-left">Participant</th>
                        <th className="px-5 py-3.5 text-left">College</th>
                        <th className="px-5 py-3.5 text-center">Solved</th>
                        <th className="px-5 py-3.5 text-center">Score</th>
                        <th className="px-5 py-3.5 text-center">Violations</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leaderboard.map((p, idx) => (
                        <tr key={p._id || idx} className="hover:bg-slate-800/20 font-mono transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                {p.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-slate-200">{p.username}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-400 font-sans">{p.collegeOrOrg || '—'}</td>
                          <td className="px-5 py-3 text-center text-cyan-400 font-bold">{p.questionsSolved?.length || 0}</td>
                          <td className="px-5 py-3 text-center text-white font-bold">{p.score}</td>
                          <td className="px-5 py-3 text-center">
                            {p.violationsCount > 0
                              ? <span className="text-amber-400 font-bold flex items-center justify-center gap-1"><AlertTriangle className="h-3 w-3" />{p.violationsCount}</span>
                              : <span className="text-slate-600">—</span>
                            }
                          </td>
                          <td className="px-5 py-3 text-center">
                            {p.isDisqualified
                              ? <span className="text-red-400 text-[10px] font-bold border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">DISQUALIFIED</span>
                              : <span className="text-emerald-400 text-[10px] font-bold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">✓ Active</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Problem Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProblemForm
            question={editQuestion}
            onClose={() => { setShowForm(false); setEditQuestion(null); }}
            onSaved={() => { fetchQuestions(); fetchStats(); }}
          />
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
};

export default AdminPanelPage;
