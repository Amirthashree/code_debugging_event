import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileCode2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import QuestionModal from '../components/admin/QuestionModal';
import toast from 'react-hot-toast';

export const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/questions');
      setQuestions(res.data);
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this debugging challenge?')) return;
    try {
      await API.delete(`/questions/${id}`);
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Link to="/admin/dashboard" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-white font-mono flex items-center space-x-2">
                <FileCode2 className="h-6 w-6 text-cyan-400" />
                <span>Debugging Challenges CRUD</span>
              </h1>
              <p className="text-xs text-slate-400">Configure Java, Python, C, C++ buggy code snippets & test cases</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedQuestion(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Challenge</span>
          </button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div key={q._id} className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {q.difficulty} ({q.points || 100} pts)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedQuestion(q);
                      setIsModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-cyan-400"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-mono">{q.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{q.description}</p>
              </div>

              <div className="rounded-xl bg-dark-900/80 p-3 border border-slate-800 text-xs font-mono">
                <span className="text-slate-500">Test Cases Count:</span>{' '}
                <span className="text-cyan-300 font-bold">{q.testCases?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Question Modal */}
        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={selectedQuestion}
          onSaved={fetchQuestions}
        />
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default AdminQuestionsPage;
