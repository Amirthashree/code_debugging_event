import React from 'react';

const LANGUAGES = [
  { id: 'python', name: 'Python 3', monacoLang: 'python' },
  { id: 'java', name: 'Java 17', monacoLang: 'java' },
  { id: 'c', name: 'C (GCC)', monacoLang: 'c' },
  { id: 'cpp', name: 'C++ (G++)', monacoLang: 'cpp' }
];

export const LanguageSelector = ({ selectedLanguage, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Language:</span>
      <select
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-dark-800 border border-slate-700/80 px-3 py-1.5 text-xs font-mono font-semibold text-cyan-400 focus:border-cyan-400 focus:outline-none backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id} className="bg-dark-900 text-slate-200">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
