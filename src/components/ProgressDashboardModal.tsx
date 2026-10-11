import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Language, ActiveTab } from '../types';
import {
  X,
  Trophy,
  CheckCircle2,
  Crosshair,
  Network,
  Brain,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Compass,
  Award,
  FileDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  language: Language;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenCertificate?: () => void;
}

export const ProgressDashboardModal: React.FC<Props> = ({
  language,
  onClose,
  onNavigateTab,
  onOpenCertificate,
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const {
    defenseStats,
    ontologyStats,
    kimdaeshikStats,
    overallStats,
    resetAll,
    markAllInTab,
  } = useProgress();

  const getEncouragement = (pct: number) => {
    if (pct === 100) {
      return isKo
        ? '🏆 전 과정 100% 마스터 완료! 대한민국 최고 수준의 국방·온톨로지·피지컬 AI 아키텍트 역량을 확보하셨습니다!'
        : '🏆 100% Mastered! You have achieved elite architectural mastery in Defense, Ontology, and Physical AI!';
    }
    if (pct >= 75) {
      return isKo
        ? '🚀 최종 마스터 도달 직전! 남은 모듈을 완주하여 독보적인 AI 실전 역량을 완성하세요.'
        : '🚀 Almost there! Complete the remaining modules to finalize your practical AI architecture expertise.';
    }
    if (pct >= 50) {
      return isKo
        ? '🔥 절반 이상 돌파! 30년 국방 체계 역량과 3세대 뉴로심볼릭 온톨로지의 결합이 눈앞에 있습니다.'
        : '🔥 Over halfway through! Defense engineering and neuro-symbolic ontology are coming together.';
    }
    if (pct >= 25) {
      return isKo
        ? '⚡ 탄탄한 기초 확립 중! 매일 하나의 모듈을 학습하며 일관된 성장을 만들어가세요.'
        : '⚡ Building strong foundations! Study one module daily for consistent learning momentum.';
    }
    return isKo
      ? '🌱 새로운 배움의 여정이 시작되었습니다! 관심 있는 국방 AI 및 온톨로지 모듈부터 탐색해보세요.'
      : '🌱 Journey began! Start exploring the foundational Defense and Ontology AI modules.';
  };

  const getBarColor = (pct: number) => {
    if (pct === 100) return 'from-emerald-500 to-teal-400';
    if (pct >= 60) return 'from-indigo-500 to-emerald-400';
    if (pct >= 30) return 'from-amber-500 to-indigo-500';
    return 'from-amber-600 to-amber-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${
        isLight
          ? 'bg-white border-slate-300 text-slate-800 ring-1 ring-slate-900/5'
          : 'bg-zinc-950 border-zinc-800 text-zinc-100'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-zinc-800/80 bg-zinc-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span className={isLight ? 'text-slate-900' : 'text-white'}>
                  {isKo ? '교육 탐색기 학습 달성도 대시보드' : 'Learning Mastery Dashboard'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold border ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {overallStats.percent}%
                </span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {isKo
                  ? '국방 AI · 온톨로지 AI · 김대식 교수 3대 교육 탐색기 통합 진도율'
                  : 'Progress tracking across Defense, Ontology & Kim Dae-shik explorers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className={`flex-1 overflow-y-auto p-5 space-y-6 ${isLight ? 'text-slate-800' : 'text-zinc-100'}`}>
          {/* Overall Highlight Banner */}
          <div className={`rounded-xl border p-5 relative overflow-hidden ${
            isLight
              ? 'bg-gradient-to-br from-amber-50 via-white to-indigo-50/50 border-amber-200/80 shadow-md'
              : 'bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border-zinc-800'
          }`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <span className={`text-xs font-semibold flex items-center gap-1.5 mb-1 ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  <Flame className={`w-4 h-4 animate-pulse ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                  {isKo ? '전체 종합 학습 진행률' : 'Total Educational Progress'}
                </span>
                <div className={`text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {overallStats.percent}%{' '}
                  <span className={`text-sm font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    ({overallStats.completed} / {overallStats.total} {isKo ? '모듈 완료' : 'modules'})
                  </span>
                </div>
              </div>

              {/* Status pill & Export PDF Action */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                }`}>
                  <Target className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  {overallStats.completed === overallStats.total
                    ? isKo ? '완강 달성' : 'All Completed'
                    : isKo ? `${overallStats.total - overallStats.completed}개 남음` : `${overallStats.total - overallStats.completed} Remaining`}
                </span>
                {onOpenCertificate && (
                  <button
                    onClick={() => {
                      onOpenCertificate();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm shadow-amber-500/20"
                    title={isKo ? '수료증 및 PDF 요약서 내보내기' : 'Export Certificate & PDF'}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isKo ? '수료증·PDF 발급' : 'Certificate PDF'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border mb-3 ${
              isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-zinc-800/80 border-zinc-700/50'
            }`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getBarColor(overallStats.percent)} transition-all duration-700`}
                style={{ width: `${overallStats.percent}%` }}
              />
            </div>

            {/* Motivational message */}
            <div className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
              isLight
                ? 'bg-amber-100/40 border-amber-200 text-slate-700'
                : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-300'
            }`}>
              <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <span>{getEncouragement(overallStats.percent)}</span>
            </div>
          </div>

          {/* Tab-by-Tab Progress Cards */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              {isKo ? '탐색기 탭별 상세 진행도' : 'Progress by Educational Tab'}
            </h3>

            {/* 1. Defense AI Tab */}
            <div className={`rounded-xl border p-4 transition-all group ${
              isLight
                ? 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-xs'
                : 'bg-zinc-900/70 border-zinc-800 hover:border-emerald-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isLight
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
                  }`}>
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
                    }`}>
                      {isKo ? '국방 AI 에이전트 마스터' : 'Defense AI Agent Master'}
                    </h4>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {isKo ? '30년 국방 역량 · MCP 연동 · 승인 게이트 · DB 스키마' : '30-yr Defense SI, MCP, Approval Gates, DB Schema'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-black font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {defenseStats.percent}%
                  </div>
                  <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {defenseStats.completed} / {defenseStats.total}
                  </div>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${
                isLight ? 'bg-slate-200' : 'bg-zinc-800'
              }`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                  style={{ width: `${defenseStats.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAllInTab('defense', true)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-emerald-700' : 'text-zinc-400 hover:text-emerald-400'
                    }`}
                  >
                    {isKo ? '전체 완료 표시' : 'Mark all read'}
                  </button>
                  <span className={isLight ? 'text-slate-300' : 'text-zinc-600'}>·</span>
                  <button
                    onClick={() => markAllInTab('defense', false)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-rose-600' : 'text-zinc-400 hover:text-rose-400'
                    }`}
                  >
                    {isKo ? '초기화' : 'Reset'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('defense');
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    isLight
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700/60'
                  }`}
                >
                  <span>{isKo ? '국방 AI 학습하기' : 'Study Defense AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Ontology AI Tab */}
            <div className={`rounded-xl border p-4 transition-all group ${
              isLight
                ? 'bg-slate-50 border-slate-200 hover:border-indigo-500 shadow-xs'
                : 'bg-zinc-900/70 border-zinc-800 hover:border-indigo-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isLight
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                      : 'bg-indigo-950/80 border-indigo-700/60 text-indigo-400'
                  }`}>
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-indigo-700' : 'text-white group-hover:text-indigo-300'
                    }`}>
                      {isKo ? '온톨로지 AI (뉴로심볼릭) 탐색기' : 'Ontology AI Explorer'}
                    </h4>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {isKo ? 'KNTDS 전술자료 연동 · K-팔란티어 · 지식 그래프 스키마' : 'KNTDS C4I Link, K-Palantir, RDF/OWL Knowledge Graph'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-black font-mono ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>
                    {ontologyStats.percent}%
                  </div>
                  <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {ontologyStats.completed} / {ontologyStats.total}
                  </div>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${
                isLight ? 'bg-slate-200' : 'bg-zinc-800'
              }`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
                  style={{ width: `${ontologyStats.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAllInTab('ontology', true)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-indigo-700' : 'text-zinc-400 hover:text-indigo-400'
                    }`}
                  >
                    {isKo ? '전체 완료 표시' : 'Mark all read'}
                  </button>
                  <span className={isLight ? 'text-slate-300' : 'text-zinc-600'}>·</span>
                  <button
                    onClick={() => markAllInTab('ontology', false)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-rose-600' : 'text-zinc-400 hover:text-rose-400'
                    }`}
                  >
                    {isKo ? '초기화' : 'Reset'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('ontology');
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    isLight
                      ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-indigo-300'
                      : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700/60'
                  }`}
                >
                  <span>{isKo ? '온톨로지 학습하기' : 'Study Ontology AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Kim Dae-shik Tab */}
            <div className={`rounded-xl border p-4 transition-all group ${
              isLight
                ? 'bg-slate-50 border-slate-200 hover:border-purple-500 shadow-xs'
                : 'bg-zinc-900/70 border-zinc-800 hover:border-purple-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isLight
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-purple-950/80 border-purple-700/60 text-purple-400'
                  }`}>
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-purple-700' : 'text-white group-hover:text-purple-300'
                    }`}>
                      {isKo ? '김대식 교수 피지컬 AI 통찰' : 'Prof. Kim Physical AI Insights'}
                    </h4>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {isKo ? '피지컬 AI 액션 데이터 · 4계층 오케스트레이터 · 킬 스위치' : 'Physical AI Action Data, 4-Layer Orchestrator, Kill Switch'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-black font-mono ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                    {kimdaeshikStats.percent}%
                  </div>
                  <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {kimdaeshikStats.completed} / {kimdaeshikStats.total}
                  </div>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${
                isLight ? 'bg-slate-200' : 'bg-zinc-800'
              }`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                  style={{ width: `${kimdaeshikStats.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAllInTab('kimdaeshik', true)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-purple-700' : 'text-zinc-400 hover:text-purple-400'
                    }`}
                  >
                    {isKo ? '전체 완료 표시' : 'Mark all read'}
                  </button>
                  <span className={isLight ? 'text-slate-300' : 'text-zinc-600'}>·</span>
                  <button
                    onClick={() => markAllInTab('kimdaeshik', false)}
                    className={`text-[11px] transition cursor-pointer ${
                      isLight ? 'text-slate-500 hover:text-rose-600' : 'text-zinc-400 hover:text-rose-400'
                    }`}
                  >
                    {isKo ? '초기화' : 'Reset'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('kimdaeshik');
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    isLight
                      ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
                      : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border-purple-700/60'
                  }`}
                >
                  <span>{isKo ? '김대식 교수 특강 학습' : 'Study Kim Dae-shik'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-zinc-800 bg-zinc-900/60'
        }`}>
          <button
            onClick={() => {
              if (window.confirm(isKo ? '모든 학습 진행도를 초기화하시겠습니까?' : 'Reset all learning progress?')) {
                resetAll();
              }
            }}
            className={`flex items-center gap-1.5 text-xs transition cursor-pointer px-2 py-1 rounded ${
              isLight ? 'text-slate-500 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isKo ? '전체 진도 초기화' : 'Reset all progress'}</span>
          </button>
          <div className="flex items-center gap-2">
            {onOpenCertificate && (
              <button
                onClick={() => {
                  onOpenCertificate();
                  onClose();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-amber-600/40'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{isKo ? '수료증·PDF 발급' : 'Certificate PDF'}</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigateTab('roadmap');
                onClose();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm flex items-center gap-1.5 ${
                isLight
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                  : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-700/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{isKo ? '추천 학습 로드맵 보기' : 'View Roadmap'}</span>
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
              }`}
            >
              {isKo ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
