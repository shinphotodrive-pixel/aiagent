import React, { useEffect } from 'react';
import { ArchitectureNode, Language } from '../types';
import { X, Code, Layers, AlertCircle, ArrowRightCircle, Sparkles, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  node: ArchitectureNode | null;
  language: Language;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<Props> = ({ node, language, onClose }) => {
  if (!node) return null;
  const isKo = language === 'ko';
  const { isLight } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const paradigmBadge = {
    llm: {
      label: 'L.L.M (ChatGPT)',
      color: isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-900/40 text-blue-300 border-blue-500/40',
    },
    rag: {
      label: 'R.A.G (Perplexity)',
      color: isLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-900/40 text-sky-300 border-sky-500/40',
    },
    agentic: {
      label: 'Agentic AI (Goover / Operator)',
      color: isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-900/40 text-purple-300 border-purple-500/40',
    },
    shared: {
      label: 'Shared Component',
      color: isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700',
    },
  }[node.paradigm];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
          isLight ? 'bg-white border-slate-300 text-slate-800 ring-1 ring-slate-900/5' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-zinc-800 bg-zinc-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
              isLight ? 'bg-slate-100 border-slate-300 text-amber-700' : 'bg-zinc-800 border-zinc-700 text-amber-400'
            }`}>
              {node.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? node.nameKo : node.name}
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${paradigmBadge.color}`}>
                  {paradigmBadge.label}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {isKo ? node.summaryKo : node.summary}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className={`overflow-y-auto p-6 space-y-5 text-xs ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
          {/* Detailed Description */}
          <div>
            <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {isKo ? '상세 기술 동작 원리' : 'Detailed Mechanism'}
            </h4>
            <p className={`leading-relaxed p-3.5 rounded-xl border ${
              isLight ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-zinc-900/40 text-zinc-300 border-zinc-800/80'
            }`}>
              {isKo ? node.details.descriptionKo : node.details.description}
            </p>
          </div>

          {/* I/O Contracts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1 ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <ArrowRightCircle className="w-3 h-3" />
                {isKo ? '입력 (Input)' : 'Input Payload'}
              </span>
              <p className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                {isKo ? node.details.inputKo : node.details.input}
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1 ${
                isLight ? 'text-sky-700' : 'text-sky-400'
              }`}>
                <ArrowRightCircle className="w-3 h-3 rotate-90" />
                {isKo ? '출력 (Output)' : 'Output Payload'}
              </span>
              <p className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                {isKo ? node.details.outputKo : node.details.output}
              </p>
            </div>
          </div>

          {/* Tech Stack Ecosystem */}
          <div>
            <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              {isKo ? '주요 기술 스택 및 생태계' : 'Tech Stack & Frameworks'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {node.details.techStack.map((tech, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                    isLight 
                      ? 'bg-slate-100 border-slate-300 text-slate-800' 
                      : 'bg-zinc-900 border-zinc-700/80 text-zinc-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div>
            <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              <Terminal className="w-3.5 h-3.5 text-pink-500" />
              {isKo ? '실제 구현 코드 예제' : 'Production Code Implementation'}
            </h4>
            <div className={`rounded-xl p-3 border font-mono text-[11px] overflow-x-auto leading-relaxed ${
              isLight 
                ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-inner' 
                : 'bg-black/90 text-zinc-300 border-zinc-800'
            }`}>
              <pre>{node.details.codeSnippet.code}</pre>
            </div>
          </div>

          {/* Key Engineering Challenges */}
          <div>
            <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              {isKo ? '엔지니어링 과제 및 해결 과제' : 'Engineering Challenges & Pitfalls'}
            </h4>
            <ul className={`space-y-1.5 list-disc list-inside ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {(isKo ? node.details.challengesKo : node.details.challenges).map((ch, i) => (
                <li key={i} className={`leading-normal ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                  {ch}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-slate-200 bg-slate-50/80 text-slate-500' : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-500'
        }`}>
          <span>{isKo ? 'ESC 키 또는 닫기를 누르세요' : 'Press ESC or Click outside to close'}</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-medium transition cursor-pointer border ${
              isLight
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            {isKo ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
