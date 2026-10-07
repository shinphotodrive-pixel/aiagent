import React, { useEffect } from 'react';
import { ArchitectureNode, Language } from '../types';
import { X, Code, Layers, AlertCircle, ArrowRightCircle, Sparkles, Terminal } from 'lucide-react';

interface Props {
  node: ArchitectureNode | null;
  language: Language;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<Props> = ({ node, language, onClose }) => {
  if (!node) return null;
  const isKo = language === 'ko';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const paradigmBadge = {
    llm: { label: 'L.L.M (ChatGPT)', color: 'bg-blue-900/40 text-blue-300 border-blue-500/40' },
    rag: { label: 'R.A.G (Perplexity)', color: 'bg-sky-900/40 text-sky-300 border-sky-500/40' },
    agentic: { label: 'Agentic AI (Goover / Operator)', color: 'bg-purple-900/40 text-purple-300 border-purple-500/40' },
    shared: { label: 'Shared Component', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' }
  }[node.paradigm];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-amber-400 text-sm">
              {node.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {isKo ? node.nameKo : node.name}
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${paradigmBadge.color}`}>
                  {paradigmBadge.label}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isKo ? node.summaryKo : node.summary}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-5 text-xs text-zinc-300">
          {/* Detailed Description */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isKo ? '상세 기술 동작 원리' : 'Detailed Mechanism'}
            </h4>
            <p className="text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
              {isKo ? node.details.descriptionKo : node.details.description}
            </p>
          </div>

          {/* I/O Contracts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                <ArrowRightCircle className="w-3 h-3" />
                {isKo ? '입력 (Input)' : 'Input Payload'}
              </span>
              <p className="text-zinc-300 font-mono text-[11px]">
                {isKo ? node.details.inputKo : node.details.input}
              </p>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1 mb-1">
                <ArrowRightCircle className="w-3 h-3 rotate-90" />
                {isKo ? '출력 (Output)' : 'Output Payload'}
              </span>
              <p className="text-zinc-300 font-mono text-[11px]">
                {isKo ? node.details.outputKo : node.details.output}
              </p>
            </div>
          </div>

          {/* Tech Stack Ecosystem */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              {isKo ? '주요 기술 스택 및 생태계' : 'Tech Stack & Frameworks'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {node.details.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-[11px] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-pink-400" />
              {isKo ? '실제 구현 코드 예제' : 'Production Code Implementation'}
            </h4>
            <div className="bg-black/90 rounded-xl p-3 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
              <pre>{node.details.codeSnippet.code}</pre>
            </div>
          </div>

          {/* Key Engineering Challenges */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              {isKo ? '엔지니어링 과제 및 해결 과제' : 'Engineering Challenges & Pitfalls'}
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
              {(isKo ? node.details.challengesKo : node.details.challenges).map((ch, i) => (
                <li key={i} className="text-zinc-300 leading-normal">
                  {ch}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
          <span>{isKo ? 'ESC 키 또는 닫기를 누르세요' : 'Press ESC or Click outside to close'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium transition cursor-pointer"
          >
            {isKo ? '닫기' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
