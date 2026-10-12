import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { COMPARISON_DIMENSIONS, ARCHITECTURE_NODES } from '../data/architectureData';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeftRight,
  Cpu,
  Database,
  Bot,
  Layers,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Coins,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  Sliders,
  Check,
  ExternalLink
} from 'lucide-react';

export type ParadigmKey = 'llm' | 'rag' | 'agentic';

interface Props {
  language: Language;
  defaultLeft?: ParadigmKey;
  defaultRight?: ParadigmKey;
  onSelectParadigmOnCanvas?: (paradigm: ParadigmKey) => void;
}

interface ParadigmMeta {
  key: ParadigmKey;
  name: string;
  nameKo: string;
  shortDesc: string;
  shortDescKo: string;
  badge: string;
  color: {
    primary: string;
    bgBadge: string;
    border: string;
    cardBgLight: string;
    cardBgDark: string;
    text: string;
  };
}

const PARADIGM_METAS: Record<ParadigmKey, ParadigmMeta> = {
  llm: {
    key: 'llm',
    name: 'Pure Foundation LLM',
    nameKo: '순수 파운데이션 LLM',
    shortDesc: 'Single autoregressive forward-pass on pre-trained internal weights with zero real-time external grounding.',
    shortDescKo: '외부 연동 없는 사전학습 내부 가중치 기반 단일 순방향 추론 (ChatGPT Base).',
    badge: 'L1 • Baseline',
    color: {
      primary: '#3b82f6',
      bgBadge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      border: 'border-blue-500/30',
      cardBgLight: 'bg-blue-50/50',
      cardBgDark: 'bg-blue-950/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
  },
  rag: {
    key: 'rag',
    name: 'Retrieval-Augmented Generation (RAG)',
    nameKo: '검색 증강 생성 (RAG)',
    shortDesc: 'Dual-phase pipeline injecting dense/sparse vector retrieved documents into LLM context for verified citations.',
    shortDescKo: '외부 벡터 DB 및 웹 검색 결과를 실시간 주입하여 출처를 명시하는 검색 증강 파이프라인 (Perplexity).',
    badge: 'L2 • Grounded',
    color: {
      primary: '#0ea5e9',
      bgBadge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      border: 'border-sky-500/30',
      cardBgLight: 'bg-sky-50/50',
      cardBgDark: 'bg-sky-950/20',
      text: 'text-sky-600 dark:text-sky-400',
    },
  },
  agentic: {
    key: 'agentic',
    name: 'Autonomous Agentic AI',
    nameKo: '자율 에이전트 AI (Agentic)',
    shortDesc: 'Multi-cycle ReAct planning loop with persistent memory, tool calling sandboxes, and real-world system side-effects.',
    shortDescKo: '자율 ReAct 루프, 장기 기억, 샌드박스 도구 실행 및 현실 세계 시스템 상태 변경(Mutation)을 수행하는 최고 복잡도 아키텍처 (Goover/Operator).',
    badge: 'L3 • Autonomous Action',
    color: {
      primary: '#a855f7',
      bgBadge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      border: 'border-purple-500/30',
      cardBgLight: 'bg-purple-50/50',
      cardBgDark: 'bg-purple-950/20',
      text: 'text-purple-600 dark:text-purple-400',
    },
  },
};

// Numeric benchmarks for side-by-side performance comparison
interface PerformanceMetrics {
  avgLatencyMs: number;
  latencyDisplay: string;
  costTier: number; // 1 to 5
  costDisplay: string;
  hallucinationRiskScore: number; // 0 (none) to 100 (high)
  reasoningCycles: number;
  externalToolAccess: boolean;
  statePersistence: 'None' | 'Session' | 'Persistent Long-term';
  statePersistenceKo: '무상태 (없음)' | '세션 수준' | '영구 장기 기억';
  verifiableCitations: boolean;
  mutationSideEffects: boolean;
  tokenThroughputRelative: number; // Index 100 base
}

const PARADIGM_PERFORMANCE: Record<ParadigmKey, PerformanceMetrics> = {
  llm: {
    avgLatencyMs: 380,
    latencyDisplay: '~200 - 800ms',
    costTier: 1,
    costDisplay: '$ (Lowest: ~$0.001 / query)',
    hallucinationRiskScore: 82,
    reasoningCycles: 1,
    externalToolAccess: false,
    statePersistence: 'None',
    statePersistenceKo: '무상태 (없음)',
    verifiableCitations: false,
    mutationSideEffects: false,
    tokenThroughputRelative: 100,
  },
  rag: {
    avgLatencyMs: 1450,
    latencyDisplay: '~800 - 2,500ms',
    costTier: 2,
    costDisplay: '$$ (Moderate: ~$0.008 / query)',
    hallucinationRiskScore: 28,
    reasoningCycles: 1.5,
    externalToolAccess: true, // read-only retrieval
    statePersistence: 'Session',
    statePersistenceKo: '세션 수준',
    verifiableCitations: true,
    mutationSideEffects: false,
    tokenThroughputRelative: 65,
  },
  agentic: {
    avgLatencyMs: 7200,
    latencyDisplay: '~2,500 - 15,000ms+',
    costTier: 5,
    costDisplay: '$$$$$ (Highest: ~$0.08 - $0.45 / query)',
    hallucinationRiskScore: 12,
    reasoningCycles: 5.8,
    externalToolAccess: true,
    statePersistence: 'Persistent Long-term',
    statePersistenceKo: '영구 장기 기억',
    verifiableCitations: true,
    mutationSideEffects: true,
    tokenThroughputRelative: 18,
  },
};

export const ParadigmDiffView: React.FC<Props> = ({
  language,
  defaultLeft = 'llm',
  defaultRight = 'agentic',
  onSelectParadigmOnCanvas,
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();

  const [leftParadigm, setLeftParadigm] = useState<ParadigmKey>(defaultLeft);
  const [rightParadigm, setRightParadigm] = useState<ParadigmKey>(defaultRight);
  const [filterQuery, setFilterQuery] = useState('');
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'structural' | 'performance' | 'capabilities'>('all');

  const leftMeta = PARADIGM_METAS[leftParadigm];
  const rightMeta = PARADIGM_METAS[rightParadigm];
  const leftPerf = PARADIGM_PERFORMANCE[leftParadigm];
  const rightPerf = PARADIGM_PERFORMANCE[rightParadigm];

  // Derive structural node data for both paradigms from ARCHITECTURE_NODES
  const leftNodes = useMemo(() => {
    return Object.values(ARCHITECTURE_NODES).filter((n) => n.paradigm === leftParadigm);
  }, [leftParadigm]);

  const rightNodes = useMemo(() => {
    return Object.values(ARCHITECTURE_NODES).filter((n) => n.paradigm === rightParadigm);
  }, [rightParadigm]);

  // Unique tech stacks & challenges sets
  const leftTechs = useMemo(() => {
    const s = new Set<string>();
    leftNodes.forEach((n) => n.details.techStack.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [leftNodes]);

  const rightTechs = useMemo(() => {
    const s = new Set<string>();
    rightNodes.forEach((n) => n.details.techStack.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [rightNodes]);

  const leftChallenges = useMemo(() => {
    const arr: Array<{ en: string; ko: string }> = [];
    leftNodes.forEach((n) => {
      n.details.challenges.forEach((chEn, idx) => {
        arr.push({ en: chEn, ko: n.details.challengesKo[idx] || chEn });
      });
    });
    return arr;
  }, [leftNodes]);

  const rightChallenges = useMemo(() => {
    const arr: Array<{ en: string; ko: string }> = [];
    rightNodes.forEach((n) => {
      n.details.challenges.forEach((chEn, idx) => {
        arr.push({ en: chEn, ko: n.details.challengesKo[idx] || chEn });
      });
    });
    return arr;
  }, [rightNodes]);

  // Swap paradigms
  const handleSwap = () => {
    const prevLeft = leftParadigm;
    setLeftParadigm(rightParadigm);
    setRightParadigm(prevLeft);
  };

  // Icon getter for paradigm
  const getParadigmIcon = (key: ParadigmKey, className = 'w-5 h-5') => {
    switch (key) {
      case 'llm':
        return <Cpu className={`${className} text-blue-500`} />;
      case 'rag':
        return <Database className={`${className} text-sky-500`} />;
      case 'agentic':
        return <Bot className={`${className} text-purple-500`} />;
    }
  };

  // Dimension comparison items
  const dimensionDiffs = useMemo(() => {
    return COMPARISON_DIMENSIONS.map((dim, idx) => {
      const leftText = isKo ? dim[`${leftParadigm}Ko`] : dim[leftParadigm];
      const rightText = isKo ? dim[`${rightParadigm}Ko`] : dim[rightParadigm];
      const isIdentical = leftText.trim().toLowerCase() === rightText.trim().toLowerCase();

      return {
        id: idx,
        dimension: isKo ? dim.dimensionKo : dim.dimension,
        dimensionSub: isKo ? dim.dimension : dim.dimensionKo,
        leftValue: leftText,
        rightValue: rightText,
        isIdentical,
      };
    }).filter((item) => {
      if (onlyDifferences && item.isIdentical) return false;
      if (!filterQuery) return true;
      const q = filterQuery.toLowerCase();
      return (
        item.dimension.toLowerCase().includes(q) ||
        item.dimensionSub.toLowerCase().includes(q) ||
        item.leftValue.toLowerCase().includes(q) ||
        item.rightValue.toLowerCase().includes(q)
      );
    });
  }, [leftParadigm, rightParadigm, isKo, onlyDifferences, filterQuery]);

  // Delta calculations for performance metrics
  const latencyDelta = rightPerf.avgLatencyMs - leftPerf.avgLatencyMs;
  const latencyMultiplier = (rightPerf.avgLatencyMs / Math.max(leftPerf.avgLatencyMs, 1)).toFixed(1);

  const hallucinationDelta = rightPerf.hallucinationRiskScore - leftPerf.hallucinationRiskScore;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top Paradigm Selector Bar */}
      <div
        className={`p-5 rounded-2xl border shadow-lg transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
            : 'bg-zinc-900/90 border-zinc-800 shadow-2xl'
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? '패러다임 맞비교 (Diff View)' : 'Paradigm Diff & Side-by-Side Comparison'}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isLight
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}
            >
              Side-by-Side Dual Analysis
            </span>
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            {isKo
              ? '임의의 두 AI 아키텍처를 선택하여 노드 파이프라인 구성, 기술 스택, 레이턴시/비용 및 환각 위험도 차이를 직관적으로 대조 분석합니다.'
              : 'Compare structural pipelines, tech stack footprints, latency/cost profiles, and execution capabilities between any two AI paradigms side-by-side.'}
          </p>
        </div>

        {/* Paradigm Choosers & Swap Button */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Left Selector */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {isKo ? '기준 패러다임 (Left / Baseline)' : 'Baseline (Left)'}
            </span>
            <div className="flex rounded-xl p-1 border bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700">
              {(['llm', 'rag', 'agentic'] as const).map((key) => {
                const active = leftParadigm === key;
                return (
                  <button
                    key={`left-${key}`}
                    onClick={() => setLeftParadigm(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {getParadigmIcon(key, 'w-3.5 h-3.5')}
                    <span>{key.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Swap Button */}
          <div className="pt-4">
            <button
              onClick={handleSwap}
              title={isKo ? '좌우 패러다임 위치 맞바꾸기' : 'Swap Left & Right Paradigms'}
              className={`p-2.5 rounded-xl border transition cursor-pointer hover:rotate-180 duration-300 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
            </button>
          </div>

          {/* Right Selector */}
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {isKo ? '비교 대상 (Right / Target)' : 'Target (Right)'}
            </span>
            <div className="flex rounded-xl p-1 border bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700">
              {(['llm', 'rag', 'agentic'] as const).map((key) => {
                const active = rightParadigm === key;
                return (
                  <button
                    key={`right-${key}`}
                    onClick={() => setRightParadigm(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {getParadigmIcon(key, 'w-3.5 h-3.5')}
                    <span>{key.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Same Paradigm Warning if user selects same */}
      {leftParadigm === rightParadigm && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {isKo
              ? '동일한 패러다임이 양쪽에 선택되었습니다. 의미 있는 차이점(Diff)을 보려면 서로 다른 두 패러다임을 선택해주세요.'
              : 'You have selected identical paradigms on both sides. Select two different architectures to see meaningful structural and performance differences.'}
          </span>
        </div>
      )}

      {/* Side-by-Side Hero Cards: High-level overview & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Paradigm Hero Card */}
        <div
          className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
            isLight ? leftMeta.color.cardBgLight : leftMeta.color.cardBgDark
          } ${leftMeta.color.border}`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center">
                {getParadigmIcon(leftParadigm, 'w-5 h-5')}
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${leftMeta.color.text}`}>
                  Baseline Architecture
                </span>
                <h4 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? leftMeta.nameKo : leftMeta.name}
                </h4>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${leftMeta.color.bgBadge}`}>
              {leftMeta.badge}
            </span>
          </div>

          <p className={`text-xs mb-4 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            {isKo ? leftMeta.shortDescKo : leftMeta.shortDesc}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '파이프라인 노드' : 'Pipeline Nodes'}</div>
              <div className="font-extrabold text-sm mt-0.5">{leftNodes.length} {isKo ? '개' : 'units'}</div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '평균 지연시간' : 'Latency'}</div>
              <div className="font-extrabold text-sm mt-0.5 font-mono">{leftPerf.latencyDisplay}</div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '환각 위험 지수' : 'Hallucination'}</div>
              <div className={`font-extrabold text-sm mt-0.5 ${leftPerf.hallucinationRiskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {leftPerf.hallucinationRiskScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Paradigm Hero Card */}
        <div
          className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
            isLight ? rightMeta.color.cardBgLight : rightMeta.color.cardBgDark
          } ${rightMeta.color.border}`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center">
                {getParadigmIcon(rightParadigm, 'w-5 h-5')}
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${rightMeta.color.text}`}>
                  Target Architecture
                </span>
                <h4 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? rightMeta.nameKo : rightMeta.name}
                </h4>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rightMeta.color.bgBadge}`}>
              {rightMeta.badge}
            </span>
          </div>

          <p className={`text-xs mb-4 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            {isKo ? rightMeta.shortDescKo : rightMeta.shortDesc}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '파이프라인 노드' : 'Pipeline Nodes'}</div>
              <div className="font-extrabold text-sm mt-0.5">{rightNodes.length} {isKo ? '개' : 'units'}</div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '평균 지연시간' : 'Latency'}</div>
              <div className="font-extrabold text-sm mt-0.5 font-mono">{rightPerf.latencyDisplay}</div>
            </div>
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'}`}>
              <div className="text-[10px] font-medium text-zinc-500">{isKo ? '환각 위험 지수' : 'Hallucination'}</div>
              <div className={`font-extrabold text-sm mt-0.5 ${rightPerf.hallucinationRiskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {rightPerf.hallucinationRiskScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structural & Performance Diff Banner: Delta Summary */}
      <div
        className={`p-4 rounded-2xl border transition-colors ${
          isLight ? 'bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/70 border-indigo-200/80 text-slate-800' : 'bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-pink-950/30 border-indigo-900/50 text-zinc-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h4 className="font-bold text-xs sm:text-sm">
            {isKo
              ? `핵심 델타 차이 요약 (${leftParadigm.toUpperCase()} ➔ ${rightParadigm.toUpperCase()})`
              : `Executive Delta Highlights (${leftParadigm.toUpperCase()} vs ${rightParadigm.toUpperCase()})`}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Node count delta */}
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'}`}>
            <div className="text-[10px] text-zinc-500 font-medium flex items-center justify-between">
              <span>{isKo ? '구조적 복잡도 (노드 수)' : 'Structural Node Count'}</span>
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold">{leftNodes.length} ➔ {rightNodes.length}</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                  rightNodes.length > leftNodes.length
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : rightNodes.length < leftNodes.length
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-zinc-500/10 text-zinc-500'
                }`}
              >
                {rightNodes.length >= leftNodes.length ? `+${rightNodes.length - leftNodes.length}` : `${rightNodes.length - leftNodes.length}`}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              {rightNodes.length > leftNodes.length
                ? isKo
                  ? '파이프라인 단계 및 중간 처리 계층 대폭 증가'
                  : 'Expanded intermediate pipeline stages'
                : isKo
                ? '보다 간소화된 단일 흐름'
                : 'More consolidated single stream'}
            </p>
          </div>

          {/* Latency Trade-off delta */}
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'}`}>
            <div className="text-[10px] text-zinc-500 font-medium flex items-center justify-between">
              <span>{isKo ? '응답 지연시간 (Latency)' : 'Latency Profile'}</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold">{leftPerf.avgLatencyMs}ms ➔ {rightPerf.avgLatencyMs}ms</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                  latencyDelta > 0
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : latencyDelta < 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-zinc-500/10 text-zinc-500'
                }`}
              >
                {latencyDelta > 0 ? `+${latencyMultiplier}x` : latencyDelta < 0 ? `${latencyMultiplier}x` : 'Same'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              {latencyDelta > 0
                ? isKo
                  ? '다단계 추론/검색으로 인한 응답 지연 증가'
                  : 'Higher turnaround from multi-stage loops'
                : isKo
                ? '단일 순방향 추론으로 신속한 응답 보장'
                : 'Faster single-step forward pass'}
            </p>
          </div>

          {/* Hallucination control delta */}
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'}`}>
            <div className="text-[10px] text-zinc-500 font-medium flex items-center justify-between">
              <span>{isKo ? '환각 위험도 (Hallucination)' : 'Hallucination Risk'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold">{leftPerf.hallucinationRiskScore}% ➔ {rightPerf.hallucinationRiskScore}%</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                  hallucinationDelta < 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : hallucinationDelta > 0
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'bg-zinc-500/10 text-zinc-500'
                }`}
              >
                {hallucinationDelta < 0 ? `${hallucinationDelta}%p` : `+${hallucinationDelta}%p`}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              {hallucinationDelta < 0
                ? isKo
                  ? '검증 및 피드백 계층에 의한 환각 위험 감소'
                  : 'Better accuracy through grounded sources'
                : isKo
                ? '외부 근거가 없어 모델 환각에 노출'
                : 'Higher vulnerability to ungrounded claims'}
            </p>
          </div>

          {/* Real Action Mutation ability */}
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'}`}>
            <div className="text-[10px] text-zinc-500 font-medium flex items-center justify-between">
              <span>{isKo ? '실제 시스템 조작 (Action)' : 'Real World Mutation'}</span>
              <Zap className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1 font-bold">
              <span>{leftPerf.mutationSideEffects ? (isKo ? '가능' : 'Yes') : (isKo ? '불가' : 'No')}</span>
              <span className="text-zinc-400">➔</span>
              <span className={rightPerf.mutationSideEffects ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-500'}>
                {rightPerf.mutationSideEffects ? (isKo ? '자율 액션 가능' : 'Autonomous Mutation') : (isKo ? '읽기 전용' : 'Read-only')}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              {rightPerf.mutationSideEffects
                ? isKo
                  ? 'DB 쓰기, 결제, API 커밋 등 실제 행동 수행'
                  : 'Mutates external APIs, DBs, and services'
                : isKo
                ? '텍스트 답변만 산출하는 읽기 전용 모드'
                : 'Read-only informational synthesis'}
            </p>
          </div>
        </div>
      </div>

      {/* Structural Pipeline Breakdown: Side-by-Side Nodes & Tech Stacks */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? '1. 파이프라인 구조 및 기술 스택 비교' : '1. Pipeline Structure & Tech Stack Differences'}
            </h4>
          </div>
          <span className="text-[11px] text-zinc-500">
            {isKo ? '노드 토폴로지 대조' : 'Node Topology Comparison'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Pipeline Nodes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                {getParadigmIcon(leftParadigm, 'w-4 h-4')}
                <span className={leftMeta.color.text}>{isKo ? leftMeta.nameKo : leftMeta.name}</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {leftNodes.length} {isKo ? '개 노드' : 'nodes'}
              </span>
            </div>

            {/* Pipeline sequence visual */}
            <div className="space-y-1.5">
              {leftNodes.map((node, i) => (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] font-bold flex items-center justify-center text-zinc-500">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[11px]">{isKo ? node.nameKo : node.name}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">{isKo ? node.summaryKo : node.summary}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase">
                    {node.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech stacks chip */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-zinc-500 block mb-1.5">
                {isKo ? '활용 핵심 기술 스택' : 'Integrated Tech Stacks'} ({leftTechs.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {leftTechs.map((t, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${
                      rightTechs.includes(t)
                        ? isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        : isLight
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                        : 'bg-blue-950/40 text-blue-300 border-blue-800 font-semibold'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pipeline Nodes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                {getParadigmIcon(rightParadigm, 'w-4 h-4')}
                <span className={rightMeta.color.text}>{isKo ? rightMeta.nameKo : rightMeta.name}</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {rightNodes.length} {isKo ? '개 노드' : 'nodes'}
              </span>
            </div>

            {/* Pipeline sequence visual */}
            <div className="space-y-1.5">
              {rightNodes.map((node, i) => (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px] font-bold flex items-center justify-center text-zinc-500">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[11px]">{isKo ? node.nameKo : node.name}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">{isKo ? node.summaryKo : node.summary}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase">
                    {node.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech stacks chip */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-zinc-500 block mb-1.5">
                {isKo ? '활용 핵심 기술 스택' : 'Integrated Tech Stacks'} ({rightTechs.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {rightTechs.map((t, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${
                      leftTechs.includes(t)
                        ? isLight
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        : isLight
                        ? 'bg-purple-50 text-purple-700 border-purple-200 font-semibold'
                        : 'bg-purple-950/40 text-purple-300 border-purple-800 font-semibold'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Dimensions Diff Table */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h4 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>{isKo ? '2. 세부 차원별 Side-by-Side 텍스트 Diff' : '2. Dimension-by-Dimension Side-by-Side Text Diff'}</span>
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {isKo
                ? '8대 핵심 기술 차원에 대한 상세 서술 비교'
                : 'Side-by-side textual diff across the 8 technical dimensions'}
            </p>
          </div>

          {/* Table Filters: Only Diff & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setOnlyDifferences(!onlyDifferences)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                onlyDifferences
                  ? isLight
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-indigo-950/50 border-indigo-700 text-indigo-300'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isKo ? '차이점만 필터링' : 'Show Diff Only'}</span>
            </button>

            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={isKo ? '키워드 검색...' : 'Filter dimensions...'}
                className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border focus:outline-none transition ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Diff Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}`}>
                <th className="py-3 px-4 font-bold w-1/4 uppercase tracking-wider text-[11px]">
                  {isKo ? '비교 차원 (Dimension)' : 'Dimension'}
                </th>
                <th className={`py-3 px-4 font-bold w-[37.5%] border-l ${leftMeta.color.cardBgLight} dark:${leftMeta.color.cardBgDark}`}>
                  <div className="flex items-center gap-1.5">
                    {getParadigmIcon(leftParadigm, 'w-4 h-4')}
                    <span className={leftMeta.color.text}>{isKo ? leftMeta.nameKo : leftMeta.name}</span>
                  </div>
                </th>
                <th className={`py-3 px-4 font-bold w-[37.5%] border-l ${rightMeta.color.cardBgLight} dark:${rightMeta.color.cardBgDark}`}>
                  <div className="flex items-center gap-1.5">
                    {getParadigmIcon(rightParadigm, 'w-4 h-4')}
                    <span className={rightMeta.color.text}>{isKo ? rightMeta.nameKo : rightMeta.name}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {dimensionDiffs.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-900/50'
                  }`}
                >
                  {/* Dimension Name */}
                  <td className={`py-3.5 px-4 font-medium ${isLight ? 'bg-slate-50/70 text-slate-900' : 'bg-zinc-950/40 text-zinc-100'}`}>
                    <div className="font-bold text-[12px]">{row.dimension}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{row.dimensionSub}</div>
                  </td>

                  {/* Left Value */}
                  <td
                    className={`py-3.5 px-4 leading-relaxed border-l text-[12px] ${
                      isLight ? 'text-slate-800 border-slate-200' : 'text-zinc-200 border-zinc-800'
                    }`}
                  >
                    {row.leftValue}
                  </td>

                  {/* Right Value with Diff highlight */}
                  <td
                    className={`py-3.5 px-4 leading-relaxed border-l text-[12px] ${
                      !row.isIdentical
                        ? isLight
                          ? 'bg-indigo-50/30 text-slate-900 font-medium border-slate-200'
                          : 'bg-indigo-950/20 text-zinc-100 font-medium border-zinc-800'
                        : isLight
                        ? 'text-slate-600 border-slate-200'
                        : 'text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span>{row.rightValue}</span>
                      {!row.isIdentical && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 shrink-0 font-bold">
                          DIFF
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
