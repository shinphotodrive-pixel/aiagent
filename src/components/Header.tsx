import React, { useState } from 'react';
import { ActiveTab, ArchitectureNode, Language } from '../types';
import { GlobalSearchBar } from './GlobalSearchBar';
import { Layers, Play, Zap, Globe, Share2, TrendingUp, BookOpen, Shield, Crosshair, Network, Brain, Trophy } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ProgressDashboardModal } from './ProgressDashboardModal';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onShare: () => void;
  onSelectNode: (node: ArchitectureNode) => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onShare,
  onSelectNode,
}) => {
  const isKo = language === 'ko';
  const [showProgressModal, setShowProgressModal] = useState(false);
  const { defenseStats, ontologyStats, kimdaeshikStats, overallStats } = useProgress();

  const navItems: Array<{ id: ActiveTab; labelKo: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'canvas', labelKo: '아키텍처 캔버스', labelEn: 'Canvas', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'simulator', labelKo: '실행 시뮬레이터', labelEn: 'Simulator', icon: <Play className="w-3.5 h-3.5 fill-current" /> },
    { id: 'defense', labelKo: '국방 AI', labelEn: 'Defense AI', icon: <Crosshair className="w-3.5 h-3.5" /> },
    { id: 'ontology', labelKo: '온톨로지 AI', labelEn: 'Ontology AI', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'kimdaeshik', labelKo: '김대식 교수', labelEn: 'Prof. Kim', icon: <Brain className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'harness', labelKo: '하네스 & OAG', labelEn: 'Harness & OAG', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'analytics', labelKo: '시각화 분석', labelEn: 'Analytics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'dictionary', labelKo: '용어 사전 (52선)', labelEn: '52 Terms', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'matrix', labelKo: '비교 매트릭스', labelEn: 'Matrix', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Brand / Logo + Title */}
        <div className="flex items-center justify-between w-full xl:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  {isKo ? '차세대 AI 아키텍처 대시보드' : 'Next-Gen AI Architecture'}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  v2026
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                Harness Engineering · Agentic AI · OAG · 52 Core AI Terms
              </p>
            </div>
          </div>

          {/* Global Search Bar (on tablet/mobile positioned here, on desktop beside nav) */}
          <div className="w-56 sm:w-64 xl:hidden">
            <GlobalSearchBar language={language} onSelectNode={onSelectNode} />
          </div>
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden xl:block w-72">
          <GlobalSearchBar language={language} onSelectNode={onSelectNode} />
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto max-w-full scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.icon}
                <span>{isKo ? item.labelKo : item.labelEn}</span>

                {/* Educational Tab Completion Percentage Badges */}
                {item.id === 'defense' && (
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold border transition-colors ${
                      defenseStats.percent === 100
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60'
                        : defenseStats.percent > 0
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700/40'
                    }`}
                    title={isKo ? `국방 AI 학습 완료율 ${defenseStats.percent}% (${defenseStats.completed}/${defenseStats.total})` : `Defense AI completion ${defenseStats.percent}%`}
                  >
                    {defenseStats.percent}%
                  </span>
                )}
                {item.id === 'ontology' && (
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold border transition-colors ${
                      ontologyStats.percent === 100
                        ? 'bg-indigo-950/90 text-indigo-300 border-indigo-600/60'
                        : ontologyStats.percent > 0
                        ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800/50'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700/40'
                    }`}
                    title={isKo ? `온톨로지 AI 학습 완료율 ${ontologyStats.percent}% (${ontologyStats.completed}/${ontologyStats.total})` : `Ontology AI completion ${ontologyStats.percent}%`}
                  >
                    {ontologyStats.percent}%
                  </span>
                )}
                {item.id === 'kimdaeshik' && (
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold border transition-colors ${
                      kimdaeshikStats.percent === 100
                        ? 'bg-purple-950/90 text-purple-300 border-purple-600/60'
                        : kimdaeshikStats.percent > 0
                        ? 'bg-purple-950/60 text-purple-400 border-purple-800/50'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700/40'
                    }`}
                    title={isKo ? `김대식 교수 학습 완료율 ${kimdaeshikStats.percent}% (${kimdaeshikStats.completed}/${kimdaeshikStats.total})` : `Kim Dae-shik completion ${kimdaeshikStats.percent}%`}
                  >
                    {kimdaeshikStats.percent}%
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Utilities: Learning Progress Dashboard, Language Toggle & Share */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Learning Progress Dashboard Modal Trigger */}
          <button
            onClick={() => setShowProgressModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-600/40 hover:border-amber-500 transition cursor-pointer shadow-sm shadow-amber-500/10 group"
            title={isKo ? '전체 학습 달성도 대시보드 열기' : 'View Educational Progress Dashboard'}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">{isKo ? '학습 달성도' : 'Progress'}</span>
            <span className="font-mono text-[11px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
              {overallStats.percent}%
            </span>
          </button>

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

      {/* Progress Dashboard Modal */}
      {showProgressModal && (
        <ProgressDashboardModal
          language={language}
          onClose={() => setShowProgressModal(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setShowProgressModal(false);
          }}
        />
      )}
    </header>
  );
};
