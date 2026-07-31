import React, { useState, useEffect } from 'react';
import { Play, Send, Lightbulb, CheckCircle2, RotateCcw, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import { useContest } from '../context/ContestContext';
import { useAntiCheat } from '../context/AntiCheatContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/common/Navbar';
import MonacoEditorWrapper from '../components/editor/MonacoEditorWrapper';
import LanguageSelector from '../components/editor/LanguageSelector';
import OutputPanel from '../components/editor/OutputPanel';
import FullscreenPrompt from '../components/anticheat/FullscreenPrompt';
import ViolationModal from '../components/anticheat/ViolationModal';
import toast from 'react-hot-toast';

export const ContestPage = () => {
  const { user } = useAuth();
  const { questions, activeQuestion, setActiveQuestion } = useContest();
  const { isDisqualified, autoSubmitTrigger, setAutoSubmitTrigger } = useAntiCheat();

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState('output');
  const [showHint, setShowHint] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved');

  // Sync initial code whenever active question or language changes
  useEffect(() => {
    if (activeQuestion && activeQuestion.buggyCode) {
      const saved = localStorage.getItem(`code_${activeQuestion._id}_${language}`);
      if (saved) {
        setCode(saved);
      } else {
        setCode(activeQuestion.buggyCode[language] || '# Type your fix here');
      }
    }
  }, [activeQuestion, language]);

  // Auto save to localStorage & show indicator
  const handleCodeChange = (newVal) => {
    setCode(newVal);
    setAutoSaveStatus('Saving...');
    if (activeQuestion) {
      localStorage.setItem(`code_${activeQuestion._id}_${language}`, newVal);
    }
    setTimeout(() => setAutoSaveStatus('Saved'), 500);
  };

  // Reset code to original buggy snippet
  const handleResetCode = () => {
    if (activeQuestion && activeQuestion.buggyCode) {
      const initial = activeQuestion.buggyCode[language] || '';
      setCode(initial);
      if (activeQuestion._id) {
        localStorage.removeItem(`code_${activeQuestion._id}_${language}`);
      }
      toast.success('Code reset to original buggy template.');
    }
  };

  // Run code against sample test cases
  const handleRunCode = async () => {
    if (!activeQuestion) return;
    setIsRunning(true);
    try {
      const res = await API.post('/submissions/run', {
        questionId: activeQuestion._id,
        language,
        code
      });
      setOutput(res.data);
      setActiveConsoleTab('output');
      if (res.data.summary?.status === 'Accepted') {
        toast.success('Sample Test Cases Passed!');
      } else {
        toast.error(`Execution Status: ${res.data.summary?.status}`);
      }
    } catch (err) {
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code against all test cases
  const handleSubmitCode = async (isAuto = false) => {
    if (!activeQuestion) return;
    setIsRunning(true);
    try {
      const res = await API.post('/submissions/submit', {
        questionId: activeQuestion._id,
        language,
        code,
        isAutoSubmit: isAuto
      });
      setOutput(res.data);
      setActiveConsoleTab('output');
      if (res.data.summary?.status === 'Accepted') {
        toast.success(`🎉 Accepted! Solved challenge +${activeQuestion.points || 100} pts`);
      } else {
        toast.error(`Submission Result: ${res.data.summary?.status}`);
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle auto submit trigger from anti-cheat disqualification
  useEffect(() => {
    if (autoSubmitTrigger) {
      handleSubmitCode(true);
      setAutoSubmitTrigger(false);
    }
  }, [autoSubmitTrigger]);

  return (
    <div className="flex h-screen flex-col bg-[#07090e] text-slate-100 overflow-hidden">
      <FullscreenPrompt />
      <ViolationModal />
      <Navbar />

      {/* Main IDE Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Question Selector & Problem Description Panel */}
        <div className="w-1/3 min-w-[340px] flex flex-col border-r border-slate-800 bg-dark-900/90 backdrop-blur-md overflow-hidden">
          
          {/* Question List Bar */}
          <div className="flex items-center space-x-2 border-b border-slate-800 bg-dark-800/80 px-4 py-2 text-xs overflow-x-auto">
            <span className="font-mono font-bold text-slate-400">Challenges:</span>
            {questions.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => {
                  setActiveQuestion(q);
                  setShowHint(false);
                }}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
                  activeQuestion?._id === q._id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>

          {/* Question Details Scroll View */}
          {activeQuestion ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeQuestion.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    activeQuestion.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {activeQuestion.difficulty}
                  </span>
                  <span className="font-mono text-xs text-cyan-400 font-extrabold">
                    +{activeQuestion.points || 100} Points
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white font-mono">{activeQuestion.title}</h2>
              </div>

              {/* Problem Description */}
              <div className="rounded-2xl bg-dark-800/60 p-4 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {activeQuestion.description}
              </div>

              {/* Sample Test Cases Preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Sample Test Cases</h4>
                {activeQuestion.testCases?.filter(tc => tc.isPublic !== false).map((tc, idx) => (
                  <div key={idx} className="rounded-xl bg-dark-950 p-3 border border-slate-800 text-xs font-mono">
                    <div className="text-slate-400 mb-1 font-semibold">Sample #{idx + 1}</div>
                    <div className="text-slate-300"><span className="text-slate-500">Input:</span> {tc.input}</div>
                    <div className="text-emerald-400"><span className="text-slate-500">Expected:</span> {tc.expectedOutput}</div>
                  </div>
                ))}
              </div>

              {/* Hint Box */}
              {activeQuestion.hint && (
                <div className="pt-2">
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>Need a hint? Click here</span>
                    </button>
                  ) : (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300 font-mono">
                      💡 Hint: {activeQuestion.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-slate-500 italic">
              Loading challenges...
            </div>
          )}
        </div>

        {/* Right Side: IDE Editor & Output Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Control Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-dark-900/90 px-4 py-2.5">
            <div className="flex items-center space-x-4">
              <LanguageSelector selectedLanguage={language} onChange={setLanguage} />
              <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{autoSaveStatus}</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetCode}
                className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-dark-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500"
                title="Reset to initial buggy snippet"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                disabled={isRunning || isDisqualified}
                onClick={handleRunCode}
                className="flex items-center space-x-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Code</span>
              </button>

              <button
                disabled={isRunning || isDisqualified}
                onClick={() => handleSubmitCode(false)}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-1.5 text-xs font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden p-2">
            <MonacoEditorWrapper
              language={language}
              value={code}
              onChange={handleCodeChange}
              disabled={isDisqualified}
            />
          </div>

          {/* Bottom Execution Output Console */}
          <div className="h-56">
            <OutputPanel
              output={output}
              isRunning={isRunning}
              activeTab={activeConsoleTab}
              setActiveTab={setActiveConsoleTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestPage;
