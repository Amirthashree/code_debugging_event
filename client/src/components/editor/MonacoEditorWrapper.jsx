import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

export const MonacoEditorWrapper = ({
  language = 'python',
  value = '',
  onChange,
  onSave,
  disabled = false
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom dark VS Code theme configuration
    monaco.editor.defineTheme('dev-dynasty-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'function', foreground: 'dcdcaa' },
        { token: 'type', foreground: '4ec9b0' }
      ],
      colors: {
        'editor.background': '#0c1017',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#141a24',
        'editorCursor.foreground': '#00f0ff',
        'editorWhitespace.foreground': '#2e384d',
        'editorIndentGuide.background': '#1e2636',
        'editorIndentGuide.activeBackground': '#00f0ff'
      }
    });

    monaco.editor.setTheme('dev-dynasty-theme');
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0c1017] shadow-2xl">
      <Editor
        height="100%"
        language={language === 'cpp' ? 'cpp' : language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: disabled,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true
        }}
      />
      {disabled && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <span className="rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-2 text-sm font-bold text-red-400">
            Editor Locked (Disqualified / Contest Ended)
          </span>
        </div>
      )}
    </div>
  );
};

export default MonacoEditorWrapper;
