import React from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const OutputPanel = ({ output, isRunning, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-full flex-col bg-dark-900 border-t border-slate-800 font-mono">
      {/* Console Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-dark-800/90 px-4 py-2 text-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === 'output' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Execution Console</span>
          </button>
          <button
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              activeTab === 'testcases' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Test Results</span>
          </button>
        </div>

        {output && (
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            {output.summary && (
              <>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  <span>{output.summary.executionTimeMs || 0}ms</span>
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  output.summary.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {output.summary.status}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs">
        {isRunning ? (
          <div className="flex items-center space-x-3 text-cyan-400 animate-pulse">
            <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Compiling & Executing Code...</span>
          </div>
        ) : output ? (
          activeTab === 'output' ? (
            <div className="space-y-3">
              {output.summary?.results?.map((res, idx) => (
                <div key={idx} className={`rounded-lg border p-3 ${
                  res.passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className={res.passed ? 'text-emerald-400' : 'text-red-400'}>
                      Test Case #{res.testCaseIndex}: {res.passed ? 'PASSED ✓' : 'FAILED ✗'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mt-2">
                    <div>
                      <span className="text-slate-500 block">Input:</span>
                      <pre className="bg-dark-950 p-1.5 rounded border border-slate-800 text-slate-200 mt-0.5">{res.input || '(None)'}</pre>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Expected Output:</span>
                      <pre className="bg-dark-950 p-1.5 rounded border border-slate-800 text-emerald-400 mt-0.5">{res.expectedOutput}</pre>
                    </div>
                  </div>
                  {!res.passed && (
                    <div className="mt-2">
                      <span className="text-slate-500 block text-[11px]">Your Output:</span>
                      <pre className="bg-dark-950 p-1.5 rounded border border-red-900/50 text-red-300 mt-0.5">{res.actualOutput || res.error || '(Empty output)'}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-slate-400 font-semibold mb-2">Detailed Test Suite Scorecard:</div>
              <div className="text-slate-300">
                Passed <span className="text-emerald-400 font-bold">{output.summary?.passedCount}</span> of <span className="font-bold">{output.summary?.totalCount}</span> Test Cases.
              </div>
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600 italic">
            Click "Run Code" or "Submit Solution" to see evaluation results here.
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
