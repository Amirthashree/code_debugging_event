import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export const QuestionModal = ({ isOpen, onClose, question, onSaved }) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
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
    }
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (question && question._id) {
        await API.put(`/questions/${question._id}`, formData);
        toast.success('Question updated successfully!');
      } else {
        await API.post('/questions', formData);
        toast.success('New debugging challenge created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error('Failed to save question');
    }
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '', isPublic: true }]
    });
  };

  const removeTestCase = (index) => {
    const updated = [...formData.testCases];
    updated.splice(index, 1);
    setFormData({ ...formData, testCases: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="max-w-4xl w-full glass-panel rounded-2xl p-6 border-slate-700 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white font-mono">
            {question ? 'Edit Question' : 'Create New Debugging Question'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Title & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1 font-semibold">Question Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-100"
                placeholder="e.g. Fix Binary Search Infinite Loop"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-cyan-300 bg-dark-900"
              >
                <option value="easy">Easy (100 pts)</option>
                <option value="medium">Medium (150 pts)</option>
                <option value="hard">Hard (250 pts)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Problem Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input rounded-xl px-3 py-2 text-slate-100 font-sans"
              placeholder="Explain problem constraints, buggy logic behavior..."
            />
          </div>

          {/* Buggy Code Templates */}
          <div>
            <h4 className="font-bold text-cyan-400 mb-2 font-mono">Buggy Code Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Python Buggy Template</label>
                <textarea
                  rows={4}
                  value={formData.buggyCode?.python || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    buggyCode: { ...formData.buggyCode, python: e.target.value }
                  })}
                  className="w-full glass-input rounded-xl p-2 font-mono text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Java Buggy Template</label>
                <textarea
                  rows={4}
                  value={formData.buggyCode?.java || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    buggyCode: { ...formData.buggyCode, java: e.target.value }
                  })}
                  className="w-full glass-input rounded-xl p-2 font-mono text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-cyan-400 font-mono">Test Cases</h4>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Plus className="h-4 w-4" />
                <span>Add Test Case</span>
              </button>
            </div>
            <div className="space-y-3">
              {formData.testCases.map((tc, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-dark-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Input (e.g. 5)"
                      value={tc.input}
                      onChange={(e) => {
                        const updated = [...formData.testCases];
                        updated[idx].input = e.target.value;
                        setFormData({ ...formData, testCases: updated });
                      }}
                      className="glass-input rounded-lg px-2.5 py-1 font-mono text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Expected Output (e.g. 13)"
                      value={tc.expectedOutput}
                      onChange={(e) => {
                        const updated = [...formData.testCases];
                        updated[idx].expectedOutput = e.target.value;
                        setFormData({ ...formData, testCases: updated });
                      }}
                      className="glass-input rounded-lg px-2.5 py-1 font-mono text-emerald-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTestCase(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              <span>Save Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
