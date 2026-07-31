import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Code2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/instructions');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-panel rounded-3xl p-8 border-slate-800 shadow-[0_0_50px_rgba(0,240,255,0.15)]"
        >
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Code2 className="h-6 w-6 text-black font-bold" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono">Sign In to Arena</h2>
            <p className="text-xs text-slate-400">Dev Dynasty Club Online Debugging Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="participant@devdynasty.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-black shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-dark-900/60 p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-cyan-400">Demo Admin Credentials:</p>
            <p>Email: <span className="font-mono text-slate-200">admin@devdynasty.com</span></p>
            <p>Password: <span className="font-mono text-slate-200">admin123</span></p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:underline">
              Register here
            </Link>
          </div>
        </motion.div>
      </main>
    </AuroraBackground>
  );
};

export default LoginPage;
