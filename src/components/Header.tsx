import React, { useState } from 'react';
import { ActiveTab, ArchitectureNode, Language } from '../types';
import { GlobalSearchBar } from './GlobalSearchBar';
import { Layers, Play, Zap, Globe, Share2, TrendingUp, BookOpen, Shield, Crosshair, Network, Brain, Trophy, Sun, Moon, Compass, Award, Sparkles } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { ProgressDashboardModal } from './ProgressDashboardModal';
import { CertificateExportModal } from './CertificateExportModal';
import { RecommendationWizardModal } from './RecommendationWizardModal';

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
  const { isLight, toggleTheme } = useTheme();
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const { defenseStats, ontologyStats, kimdaeshikStats, overallStats } = useProgress();

  const navItems: Array<{ id: ActiveTab; labelKo: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'canvas', labelKo: '아키텍처 캔버스', labelEn: 'Canvas', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'simulator', labelKo: '실행 시뮬레이터', labelEn: 'Simulator', icon: <Play className="w-3.5 h-3.5 fill-current" /> },
    { id: 'roadmap', labelKo: '학습 로드맵', labelEn: 'Roadmap', icon: <Compass className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'graph', labelKo: '지식 그래프', labelEn: 'Knowledge Graph', icon: <Network className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'defense', labelKo: '국방 AI', labelEn: 'Defense AI', icon: <Crosshair className="w-3.5 h-3.5" /> },
    { id: 'ontology', labelKo: '온톨로지 AI', labelEn: 'Ontology AI', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'kimdaeshik', labelKo: '김대식 교수', labelEn: 'Prof. Kim', icon: <Brain className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'harness', labelKo: '하네스 & OAG', labelEn: 'Harness & OAG', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'analytics', labelKo: '시각화 분석', labelEn: 'Analytics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'dictionary', labelKo: '용어 사전 (52선)', labelEn: '52 Terms', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'matrix', labelKo: '비교 매트릭스', labelEn: 'Matrix', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className={`w-full border-b sticky top-0 z-40 transition-colors ${
      isLight 
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-md backdrop-blur-md' 
        : 'bg-zinc-950/90 border-zinc-800 text-white shadow-lg backdrop-blur'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Brand / Logo + Title */}
        <div className="flex items-center justify-between w-full xl:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? '차세대 AI 아키텍처 대시보드' : 'Next-Gen AI Architecture'}
                </h1>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  v2026
                </span>
              </div>
              <p className={`text-[10px] hidden sm:block ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
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
        <nav className={`flex items-center gap-1 p-1 rounded-xl overflow-x-auto max-w-full scrollbar-none border ${
          isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-zinc-900 border-zinc-800'
        }`}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isLight
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300 font-bold'
                      : 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60 font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 font-medium'
                }`}
              >
                {item.icon}
                <span>{isKo ? item.labelKo : item.labelEn}</span>

                {/* Educational Tab Completion Percentage Badges */}
                {item.id === 'roadmap' && (
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold border transition-colors ${
                      overallStats.percent === 100
                        ? isLight
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-amber-950/90 text-amber-300 border-amber-600/60'
                        : overallStats.percent > 0
                        ? isLight
                          ? 'bg-amber-50 text-amber-800 border-amber-300/80'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                        : isLight
                        ? 'bg-slate-200 text-slate-500 border-slate-300'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700/40'
                    }`}
                    title={isKo ? `전체 학습 로드맵 완료율 ${overallStats.percent}% (${overallStats.completed}/${overallStats.total})` : `Roadmap progress ${overallStats.percent}%`}
                  >
                    {overallStats.percent}%
                  </span>
                )}
                {item.id === 'defense' && (
                  <span
                    className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold border transition-colors ${
                      defenseStats.percent === 100
                        ? isLight
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60'
                        : defenseStats.percent > 0
                        ? isLight
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                        : isLight
                        ? 'bg-slate-200 text-slate-500 border-slate-300'
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
                        ? isLight
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : 'bg-indigo-950/90 text-indigo-300 border-indigo-600/60'
                        : ontologyStats.percent > 0
                        ? isLight
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-indigo-950/60 text-indigo-400 border-indigo-800/50'
                        : isLight
                        ? 'bg-slate-200 text-slate-500 border-slate-300'
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
                        ? isLight
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-purple-950/90 text-purple-300 border-purple-600/60'
                        : kimdaeshikStats.percent > 0
                        ? isLight
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-purple-950/60 text-purple-400 border-purple-800/50'
                        : isLight
                        ? 'bg-slate-200 text-slate-500 border-slate-300'
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

        {/* Utilities: Theme Toggle, Learning Progress Dashboard, Language Toggle & Share */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button (Dark vs High-Contrast Light) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-sm ${
              isLight
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
                : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-zinc-800 hover:border-zinc-700'
            }`}
            title={
              isLight
                ? (isKo ? '현재: 고대비 라이트 모드 (클릭하여 다크 모드로 전환)' : 'Current: High-Contrast Light (Click for Dark Mode)')
                : (isKo ? '현재: 다크 모드 (클릭하여 고대비 라이트 모드로 전환)' : 'Current: Dark Mode (Click for High-Contrast Light)')
            }
            aria-label="Toggle theme"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{isKo ? '라이트 모드' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{isKo ? '다크 모드' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* AI Recommendation Wizard Trigger */}
          <button
            onClick={() => setShowRecommendationModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm group border ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200/80 text-amber-950 border-amber-300'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-amber-500/10'
            }`}
            title={isKo ? '맞춤형 AI 학습 & 아키텍처 추천 마법사' : 'AI Recommendation Advisor'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-bold">{isKo ? '추천 마법사' : 'Advisor'}</span>
          </button>

          {/* Learning Progress Dashboard Modal Trigger */}
          <button
            onClick={() => setShowProgressModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm group border ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-amber-600/40 hover:border-amber-500 shadow-amber-500/10'
            }`}
            title={isKo ? '전체 학습 달성도 대시보드 열기' : 'View Educational Progress Dashboard'}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">{isKo ? '학습 달성도' : 'Progress'}</span>
            <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border ${
              isLight 
                ? 'bg-amber-200/70 text-amber-950 border-amber-400/50' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {overallStats.percent}%
            </span>
          </button>

          {/* Certificate of Completion & PDF Export Trigger */}
          <button
            onClick={() => setShowCertificateModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm group border ${
              isLight
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 hover:from-amber-600 hover:to-amber-700'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500/50 hover:from-amber-500 hover:to-amber-600'
            }`}
            title={isKo ? '학습 수료증 및 PDF 요약서 내보내기' : 'Certificate & PDF Export'}
          >
            <Award className="w-3.5 h-3.5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-bold">{isKo ? '수료증·PDF' : 'Certificate'}</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Toggle Language"
          >
            <Globe className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
            <span>{language === 'ko' ? '한국어' : 'English'}</span>
          </button>

          {/* Share */}
          <button
            onClick={onShare}
            className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title={isKo ? '링크 복사' : 'Share link'}
          >
            <Share2 className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`} />
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
          onOpenCertificate={() => {
            setShowCertificateModal(true);
          }}
          onOpenRecommendation={() => {
            setShowRecommendationModal(true);
          }}
        />
      )}

      {/* Certificate & Learning Path Summary PDF Modal */}
      {showCertificateModal && (
        <CertificateExportModal
          language={language}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Recommendation Wizard Modal */}
      {showRecommendationModal && (
        <RecommendationWizardModal
          language={language}
          onClose={() => setShowRecommendationModal(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setShowRecommendationModal(false);
          }}
        />
      )}
    </header>
  );
};
