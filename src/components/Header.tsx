import React from 'react';
import { ActiveTab, Language } from '../types';
import { Layers, Play, Zap, Globe, Share2, Sparkles } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onShare: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onShare
}) => {
  const isKo = language === 'ko';

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-zinc-950 font-black text-sm">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                AI Architecture Comparison
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                v2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              L.L.M (ChatGPT) · R.A.G (Perplexity) · Agentic AI (Goover / Operator)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isKo ? '아키텍처 캔버스' : 'Architecture Canvas'}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isKo ? '실행 시뮬레이터' : 'Execution Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isKo ? '비교 매트릭스' : 'Tradeoff Matrix'}</span>
          </button>
        </nav>

        {/* Utilities: Language Toggle & Share */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{language === 'ko' ? '한국어' : 'English'}</span>
          </button>

          {/* Share */}
          <button
            onClick={onShare}
            className="p-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            title={isKo ? '링크 복사' : 'Share link'}
          >
            <Share2 className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
