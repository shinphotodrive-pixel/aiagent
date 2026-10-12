import React, { useState, useRef, useMemo } from 'react';
import { Language } from '../types';
import { COMPARISON_DIMENSIONS, ARCHITECTURE_NODES } from '../data/architectureData';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import {
  Cpu,
  Database,
  Bot,
  Search,
  ShieldCheck,
  Zap,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  Sliders,
  Info,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  ArrowLeftRight,
  Table
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { ParadigmDiffView, ParadigmKey } from './ParadigmDiffView';

interface Props {
  language: Language;
  onShowToast?: (msg: string) => void;
}

type HeatmapMetricMode = 'overall' | 'structural' | 'techStack' | 'challenges' | 'runtime';

interface ParadigmScoreData {
  paradigm: 'llm' | 'rag' | 'agentic';
  title: string;
  titleKo: string;
  nodeCount: number;
  nodes: Array<{ id: string; name: string; nameKo: string; category: string }>;
  techStackList: string[];
  challengesList: Array<{ en: string; ko: string }>;
  scores: {
    overall: number;
    structural: number;
    techStack: number;
    challenges: number;
    runtime: number;
  };
  complexitySummary: {
    en: string;
    ko: string;
  };
}

// Pre-calculated or dynamically computed node attribute complexity per dimension
const DIMENSION_COMPLEXITY_SCORES: Record<
  number,
  {
    llm: { overall: number; structural: number; techStack: number; challenges: number; runtime: number };
    rag: { overall: number; structural: number; techStack: number; challenges: number; runtime: number };
    agentic: { overall: number; structural: number; techStack: number; challenges: number; runtime: number };
  }
> = {
  // 0: Core Mechanism
  0: {
    llm: { overall: 22, structural: 20, techStack: 25, challenges: 25, runtime: 15 },
    rag: { overall: 62, structural: 60, techStack: 68, challenges: 58, runtime: 55 },
    agentic: { overall: 96, structural: 95, techStack: 94, challenges: 98, runtime: 96 },
  },
  // 1: Knowledge Freshness
  1: {
    llm: { overall: 15, structural: 10, techStack: 15, challenges: 20, runtime: 15 },
    rag: { overall: 60, structural: 55, techStack: 65, challenges: 62, runtime: 58 },
    agentic: { overall: 90, structural: 88, techStack: 92, challenges: 86, runtime: 92 },
  },
  // 2: State & Memory
  2: {
    llm: { overall: 12, structural: 15, techStack: 10, challenges: 15, runtime: 10 },
    rag: { overall: 52, structural: 50, techStack: 58, challenges: 50, runtime: 50 },
    agentic: { overall: 94, structural: 92, techStack: 90, challenges: 95, runtime: 98 },
  },
  // 3: External Execution (Act)
  3: {
    llm: { overall: 5, structural: 5, techStack: 5, challenges: 10, runtime: 5 },
    rag: { overall: 20, structural: 25, techStack: 25, challenges: 20, runtime: 15 },
    agentic: { overall: 99, structural: 98, techStack: 98, challenges: 99, runtime: 98 },
  },
  // 4: Hallucination Vulnerability / Control Engineering
  4: {
    llm: { overall: 30, structural: 25, techStack: 20, challenges: 40, runtime: 35 },
    rag: { overall: 68, structural: 65, techStack: 72, challenges: 65, runtime: 70 },
    agentic: { overall: 92, structural: 90, techStack: 92, challenges: 94, runtime: 92 },
  },
  // 5: Latency Profile
  5: {
    llm: { overall: 18, structural: 15, techStack: 20, challenges: 20, runtime: 18 },
    rag: { overall: 56, structural: 55, techStack: 60, challenges: 55, runtime: 55 },
    agentic: { overall: 92, structural: 94, techStack: 90, challenges: 88, runtime: 95 },
  },
  // 6: Cost Per Query
  6: {
    llm: { overall: 16, structural: 12, techStack: 18, challenges: 15, runtime: 20 },
    rag: { overall: 58, structural: 52, techStack: 64, challenges: 56, runtime: 60 },
    agentic: { overall: 95, structural: 90, techStack: 95, challenges: 96, runtime: 98 },
  },
  // 7: Representative Examples / System Topology
  7: {
    llm: { overall: 25, structural: 20, techStack: 28, challenges: 25, runtime: 25 },
    rag: { overall: 64, structural: 60, techStack: 68, challenges: 62, runtime: 65 },
    agentic: { overall: 94, structural: 92, techStack: 95, challenges: 92, runtime: 96 },
  },
};

export const ComparisonMatrix: React.FC<Props> = ({ language, onShowToast }) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const { recordActivity } = useProgress();

  const [activeMatrixMode, setActiveMatrixMode] = useState<'matrix' | 'diff'>('matrix');
  const [diffLeft, setDiffLeft] = useState<ParadigmKey>('llm');
  const [diffRight, setDiffRight] = useState<ParadigmKey>('agentic');
  const [filterQuery, setFilterQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isHeatmapActive, setIsHeatmapActive] = useState(true);
  const [heatmapMetric, setHeatmapMetric] = useState<HeatmapMetricMode>('overall');
  const [selectedPatternModal, setSelectedPatternModal] = useState<'llm' | 'rag' | 'agentic' | null>(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  const matrixDocRef = useRef<HTMLDivElement>(null);

  // Compute pattern metrics dynamically from ARCHITECTURE_NODES
  const patternAttributes = useMemo<Record<'llm' | 'rag' | 'agentic', ParadigmScoreData>>(() => {
    const nodes = Object.values(ARCHITECTURE_NODES);

    const getPatternData = (
      paradigm: 'llm' | 'rag' | 'agentic',
      title: string,
      titleKo: string,
      overallScore: number,
      structuralScore: number,
      techScore: number,
      challengesScore: number,
      runtimeScore: number,
      summaryEn: string,
      summaryKo: string
    ): ParadigmScoreData => {
      const pNodes = nodes.filter((n) => n.paradigm === paradigm);
      const allTechs = new Set<string>();
      const allChallenges: Array<{ en: string; ko: string }> = [];

      pNodes.forEach((n) => {
        n.details.techStack.forEach((t) => allTechs.add(t));
        n.details.challenges.forEach((chEn, idx) => {
          allChallenges.push({
            en: chEn,
            ko: n.details.challengesKo[idx] || chEn,
          });
        });
      });

      return {
        paradigm,
        title,
        titleKo,
        nodeCount: pNodes.length,
        nodes: pNodes.map((n) => ({
          id: n.id,
          name: n.name,
          nameKo: n.nameKo,
          category: n.category,
        })),
        techStackList: Array.from(allTechs),
        challengesList: allChallenges,
        scores: {
          overall: overallScore,
          structural: structuralScore,
          techStack: techScore,
          challenges: challengesScore,
          runtime: runtimeScore,
        },
        complexitySummary: {
          en: summaryEn,
          ko: summaryKo,
        },
      };
    };

    return {
      llm: getPatternData(
        'llm',
        'Pure Foundation LLM',
        '순수 파운데이션 LLM',
        22,
        20,
        24,
        25,
        18,
        'Minimal surface: 4 linear nodes, zero external integrations, static autoregressive inference.',
        '최소 복잡도 구조: 4개 선형 노드, 외부 연동 부재, 단일 순방향 토큰 추론에만 의존.'
      ),
      rag: getPatternData(
        'rag',
        'Retrieval-Augmented Generation (RAG)',
        '검색 증강 생성 (RAG)',
        62,
        58,
        65,
        60,
        56,
        'Intermediate pipeline: 6 nodes, dual-stream retrieval (dense vector + sparse BM25), reranking & context grounding.',
        '중간 복잡도 파이프라인: 6개 노드, 벡터 DB 및 하이브리드 검색, 컨텍스트 주입 및 출처 인용 정렬.'
      ),
      agentic: getPatternData(
        'agentic',
        'Autonomous Agentic AI',
        '자율 에이전트 AI (Agentic)',
        95,
        94,
        96,
        95,
        94,
        'High complexity DAG: 10 nodes with multi-cycle ReAct loops, long-term memory, sandboxed tool mutations & self-reflection.',
        '최고 복잡도 DAG: 10개 노드, 자율 ReAct 루프, 영구 장기 기억, 샌드박스 도구 실행 및 자기 반성 피드백 루프.'
      ),
    };
  }, []);

  // Filter dimensions
  const filteredDimensions = COMPARISON_DIMENSIONS.filter((d) => {
    const text = (
      d.dimension +
      d.dimensionKo +
      d.llm +
      d.llmKo +
      d.rag +
      d.ragKo +
      d.agentic +
      d.agenticKo
    ).toLowerCase();
    return text.includes(filterQuery.toLowerCase());
  });

  // Heatmap Color Resolution Utility
  const getHeatmapColor = (score: number) => {
    if (score < 35) {
      return {
        bg: isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/15',
        border: isLight ? 'border-emerald-300' : 'border-emerald-500/30',
        text: isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold',
        badgeBg: isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950/70 text-emerald-300',
        label: isKo ? '낮음' : 'Low',
        barColor: 'bg-emerald-500',
      };
    }
    if (score < 70) {
      return {
        bg: isLight ? 'bg-sky-500/10' : 'bg-sky-500/15',
        border: isLight ? 'border-sky-300' : 'border-sky-500/30',
        text: isLight ? 'text-sky-700 font-bold' : 'text-sky-400 font-bold',
        badgeBg: isLight ? 'bg-sky-100 text-sky-800' : 'bg-sky-950/70 text-sky-300',
        label: isKo ? '보통' : 'Moderate',
        barColor: 'bg-sky-500',
      };
    }
    if (score < 88) {
      return {
        bg: isLight ? 'bg-amber-500/15' : 'bg-amber-500/20',
        border: isLight ? 'border-amber-300' : 'border-amber-500/35',
        text: isLight ? 'text-amber-800 font-bold' : 'text-amber-300 font-bold',
        badgeBg: isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-950/70 text-amber-300',
        label: isKo ? '높음' : 'High',
        barColor: 'bg-amber-500',
      };
    }
    return {
      bg: isLight ? 'bg-rose-500/15' : 'bg-rose-500/20',
      border: isLight ? 'border-rose-300' : 'border-rose-500/40',
      text: isLight ? 'text-rose-800 font-bold' : 'text-rose-300 font-bold',
      badgeBg: isLight ? 'bg-rose-100 text-rose-900' : 'bg-rose-950/70 text-rose-300',
      label: isKo ? '매우 높음' : 'Very High',
      barColor: 'bg-rose-500',
    };
  };

  const handleExportPDF = async () => {
    if (!matrixDocRef.current || isExporting) return;

    try {
      setIsExporting(true);

      const imgDataUrl = await toPng(matrixDocRef.current, {
        quality: 0.98,
        pixelRatio: 2.0,
        backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;

      pdf.addImage(imgDataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = isKo
        ? `AI_아키텍처_복잡도_히트맵_매트릭스_${dateStr}.pdf`
        : `AI_Architecture_Complexity_Heatmap_Matrix_${dateStr}.pdf`;

      pdf.save(filename);

      recordActivity({
        type: 'export_pdf',
        titleKo: '비교 매트릭스 복잡도 히트맵 PDF 다운로드',
        titleEn: 'Exported Complexity Heatmap PDF',
        detailKo: `패러다임별 노드 속성 기반 복잡도 히트맵 분석표(${heatmapMetric})를 PDF로 저장했습니다.`,
        detailEn: `Saved architecture complexity heatmap analysis table (${heatmapMetric}) as PDF.`,
        metadata: { tab: 'matrix' },
      });

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      if (onShowToast) {
        onShowToast(
          isKo
            ? '복잡도 히트맵 매트릭스 PDF가 성공적으로 다운로드되었습니다.'
            : 'Complexity Heatmap Matrix PDF exported successfully.'
        );
      }
    } catch (err) {
      console.error('Failed to generate comparison matrix PDF:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSwitchToDiff = (left?: ParadigmKey, right?: ParadigmKey) => {
    if (left) setDiffLeft(left);
    if (right) setDiffRight(right);
    setActiveMatrixMode('diff');
    recordActivity({
      type: 'diff_view',
      titleKo: '패러다임 Diff View 맞비교 모드 실행',
      titleEn: 'Switched to Paradigm Diff View',
      detailKo: `${(left || diffLeft).toUpperCase()} vs ${(right || diffRight).toUpperCase()} 아키텍처 구조 및 성능 차이를 맞비교 분석합니다.`,
      detailEn: `Analyzing structural and performance differences between ${(left || diffLeft).toUpperCase()} and ${(right || diffRight).toUpperCase()}.`,
      metadata: { tab: 'matrix', paradigm: left || diffLeft },
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Top Mode Segmented Switch: Full Matrix vs Diff View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl border bg-zinc-200/60 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 w-fit">
          <button
            onClick={() => setActiveMatrixMode('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMatrixMode === 'matrix'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200'
                  : 'bg-zinc-800 text-white shadow-md shadow-black/40'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Table className="w-4 h-4 text-amber-500" />
            <span>{isKo ? '전체 3-Way 비교 매트릭스' : '3-Way Comparison Matrix'}</span>
          </button>

          <button
            onClick={() => handleSwitchToDiff()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMatrixMode === 'diff'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200'
                  : 'bg-zinc-800 text-white shadow-md shadow-black/40'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
            <span>{isKo ? '패러다임 맞비교 (Diff View)' : 'Side-by-Side Diff View'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-500 font-bold">
              NEW
            </span>
          </button>
        </div>

        {/* Quick presets for diff view */}
        {activeMatrixMode === 'matrix' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {isKo ? '빠른 Diff 바로가기:' : 'Quick Diff:'}
            </span>
            <button
              onClick={() => handleSwitchToDiff('llm', 'rag')}
              className="text-[11px] px-2 py-1 rounded-lg border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-blue-500 hover:border-blue-400 font-bold transition cursor-pointer"
            >
              LLM vs RAG
            </button>
            <button
              onClick={() => handleSwitchToDiff('rag', 'agentic')}
              className="text-[11px] px-2 py-1 rounded-lg border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-purple-500 hover:border-purple-400 font-bold transition cursor-pointer"
            >
              RAG vs Agentic
            </button>
            <button
              onClick={() => handleSwitchToDiff('llm', 'agentic')}
              className="text-[11px] px-2 py-1 rounded-lg border bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-indigo-500 hover:border-indigo-400 font-bold transition cursor-pointer"
            >
              LLM vs Agentic
            </button>
          </div>
        )}
      </div>

      {/* Conditionally render Diff View Mode OR Standard Matrix Mode */}
      {activeMatrixMode === 'diff' ? (
        <ParadigmDiffView
          language={language}
          defaultLeft={diffLeft}
          defaultRight={diffRight}
        />
      ) : (
        <>
          {/* Header Bar */}
          <div
            className={`rounded-2xl p-6 shadow-xl backdrop-blur border transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/50'
                : 'bg-zinc-900/90 border-zinc-800 shadow-2xl'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? '아키텍처 비교 분석 매트릭스' : 'Comprehensive Architecture Comparison Matrix'}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      isLight
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    8 Dimensions
                  </span>
                  {isHeatmapActive && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-rose-500/10 text-rose-500 border-rose-500/30">
                      <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                      {isKo ? '히트맵 오버레이 활성' : 'Heatmap Overlay Active'}
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {isKo
                  ? '동작 원리, 지연 시간, 비용, 환각 제어, 외부 액션 실행 가능 여부와 더불어 노드 속성 기반 구조적 복잡도 점수(Complexity Score)를 시각적으로 분석합니다.'
                  : 'Detailed breakdown across 8 technical dimensions comparing Pure LLM, RAG, and Agentic AI, with dynamic node-attribute complexity heatmap scores.'}
              </p>
            </div>

            {/* Action Controls: Heatmap Toggle, Search & PDF Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Diff View Switcher Button in Header */}
              <button
                onClick={() => handleSwitchToDiff()}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
                    : 'bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-700/50 text-indigo-300'
                }`}
                title={isKo ? '두 패러다임 간 1:1 Diff 맞비교 모드로 전환' : 'Switch to 1:1 Side-by-Side Diff View'}
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isKo ? 'Diff 맞비교 모드' : 'Diff View Mode'}</span>
              </button>

              {/* Heatmap Overlay Toggle */}
              <button
                onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isHeatmapActive
                    ? isLight
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                      : 'bg-rose-950/40 border-rose-600/50 text-rose-300 shadow-rose-950/50'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-400'
                }`}
                title={isKo ? '복잡도 히트맵 오버레이 켜기/끄기' : 'Toggle Visual Heatmap Overlay'}
              >
                <Flame className={`w-3.5 h-3.5 ${isHeatmapActive ? 'text-rose-500' : 'text-zinc-400'}`} />
                <span>{isKo ? '복잡도 히트맵' : 'Heatmap Overlay'}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isHeatmapActive ? 'bg-rose-500 text-white' : 'bg-zinc-500/30 text-zinc-400'
                  }`}
                >
                  {isHeatmapActive ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Search filter */}
              <div className="relative w-full sm:w-44">
                <Search
                  className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isLight ? 'text-slate-400' : 'text-zinc-500'
                  }`}
                />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder={isKo ? '차원 검색...' : 'Filter dimensions...'}
                  className={`w-full pl-8 pr-3 py-2 border rounded-xl text-xs transition focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-amber-500'
                      : 'bg-black/60 border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:border-amber-500'
                  }`}
                />
              </div>

              {/* Quick Print Button */}
              <button
                onClick={handlePrint}
                title={isKo ? '문서 인쇄' : 'Print Document'}
                className={`p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* PDF Export Button */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer border ${
                  exportSuccess
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-amber-600 shadow-amber-500/20'
                } ${isExporting ? 'opacity-75 cursor-wait' : ''}`}
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isKo ? 'PDF 생성 중...' : 'Generating PDF...'}</span>
                  </>
                ) : exportSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{isKo ? '다운로드 완료!' : 'Downloaded!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{isKo ? '오프라인 학습용 PDF' : 'Export PDF'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

      {/* Heatmap Control Toolbar (Visible when Heatmap is Active) */}
      {isHeatmapActive && (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 ${
            isLight
              ? 'bg-slate-50/90 border-slate-200 text-slate-800 shadow-sm'
              : 'bg-zinc-900/70 border-zinc-800 text-zinc-200 shadow-xl'
          }`}
        >
          {/* Metric Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold flex items-center gap-1.5 mr-1 text-rose-500">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isKo ? '히트맵 평가 기준:' : 'Heatmap Metric:'}</span>
            </span>

            {[
              { id: 'overall', labelKo: '종합 복잡도 (Overall)', labelEn: 'Comprehensive' },
              { id: 'structural', labelKo: '노드 구조 및 밀도', labelEn: 'Node Density' },
              { id: 'techStack', labelKo: '기술 스택 연동 폭', labelEn: 'Tech Stack Breadth' },
              { id: 'challenges', labelKo: '엔지니어링 과제/위험도', labelEn: 'Challenge Surface' },
              { id: 'runtime', labelKo: '런타임 지연/연산 부하', labelEn: 'Runtime Load' },
            ].map((m) => {
              const active = heatmapMetric === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setHeatmapMetric(m.id as HeatmapMetricMode)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                    active
                      ? isLight
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                        : 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-950/50'
                      : isLight
                      ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {isKo ? m.labelKo : m.labelEn}
                </button>
              );
            })}
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {isKo ? '복잡도 범례:' : 'Scale:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[11px] font-medium text-emerald-500">{isKo ? '저 (0-34)' : 'Low (0-34)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span className="text-[11px] font-medium text-sky-500">{isKo ? '중 (35-69)' : 'Med (35-69)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-[11px] font-medium text-amber-500">{isKo ? '고 (70-87)' : 'High (70-87)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="text-[11px] font-medium text-rose-500">{isKo ? '초고 (88-100)' : 'Extreme (88-100)'}</span>
            </div>

            <button
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className={`p-1 rounded hover:bg-zinc-500/10 transition cursor-pointer ${
                isLight ? 'text-slate-500' : 'text-zinc-400'
              }`}
              title={isKo ? '점수 산출 기준 안내' : 'Score Calculation Methodology'}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Score Methodology Info Card (Collapsible) */}
      {isHeatmapActive && showScoreInfo && (
        <div
          className={`p-4 rounded-xl text-xs border animate-in fade-in duration-150 ${
            isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {isKo ? '노드 속성 기반 복잡도 점수 산출 방법론 (Methodology)' : 'Node Attribute Complexity Methodology'}
                </span>
                <p className="mt-1 leading-relaxed opacity-90 text-[11px]">
                  {isKo
                    ? '본 점수는 아키텍처 캔버스의 실제 노드 메타데이터(노드 개수, 기술 스택 연동 수, 기술적 난제 및 리스크 항목 수, 영구 메모리 계층 유무, 외부 자율 액션 수행 권한)를 정량화하여 100점 만점으로 정규화한 지표입니다.'
                    : 'Scores are mathematically derived from live canvas node attributes: total nodes in execution path, unique third-party tech stacks, documented engineering challenges & security risks, state persistence depth, and autonomous mutation capabilities.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowScoreInfo(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Architectural Pattern Complexity Scoreboard Cards */}
      {isHeatmapActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['llm', 'rag', 'agentic'] as const).map((pKey) => {
            const pattern = patternAttributes[pKey];
            const score = pattern.scores[heatmapMetric];
            const color = getHeatmapColor(score);
            const isLlm = pKey === 'llm';
            const isRag = pKey === 'rag';
            const isAgentic = pKey === 'agentic';

            return (
              <div
                key={pKey}
                onClick={() => setSelectedPatternModal(pKey)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.01] hover:shadow-lg ${
                  color.bg
                } ${color.border} ${
                  isLight ? 'shadow-sm' : 'shadow-md'
                }`}
              >
                {/* Top Badge & Metric Title */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isLlm && <Cpu className="w-4 h-4 text-blue-500" />}
                    {isRag && <Database className="w-4 h-4 text-sky-500" />}
                    {isAgentic && <Bot className="w-4 h-4 text-purple-500" />}
                    <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {isKo ? pattern.titleKo : pattern.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.badgeBg}`}>
                    {color.label}
                  </span>
                </div>

                {/* Score Number and Progress Bar */}
                <div className="flex items-baseline justify-between mt-1 mb-1.5">
                  <span className="text-[11px] font-medium opacity-80">
                    {isKo ? '현재 복잡도 점수' : 'Complexity Score'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${color.text}`}>{score}</span>
                    <span className="text-xs opacity-60">/ 100</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${color.barColor}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Node Attribute Micro-metrics */}
                <div
                  className={`grid grid-cols-3 gap-2 text-[10px] p-2 rounded-xl mb-2.5 border ${
                    isLight ? 'bg-white/80 border-slate-200/80' : 'bg-black/40 border-zinc-800/80'
                  }`}
                >
                  <div>
                    <div className="text-zinc-500 font-medium">{isKo ? '노드 수' : 'Nodes'}</div>
                    <div className="font-bold text-xs mt-0.5">{pattern.nodeCount} {isKo ? '개' : 'units'}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 font-medium">{isKo ? '기술 스택' : 'Tech Stack'}</div>
                    <div className="font-bold text-xs mt-0.5">{pattern.techStackList.length} {isKo ? '개' : 'items'}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 font-medium">{isKo ? '엔지니어링 난제' : 'Challenges'}</div>
                    <div className="font-bold text-xs mt-0.5">{pattern.challengesList.length} {isKo ? '개' : 'items'}</div>
                  </div>
                </div>

                {/* Summary text */}
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {isKo ? pattern.complexitySummary.ko : pattern.complexitySummary.en}
                </p>

                {/* Action buttons row */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] gap-2">
                  <span className="text-amber-500 font-semibold group-hover:underline flex items-center gap-1">
                    <span>{isKo ? '상세 속성 보기' : 'Inspect Details'}</span>
                    <span>→</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const other = pKey === 'agentic' ? 'llm' : 'agentic';
                      handleSwitchToDiff(pKey, other);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold transition"
                    title={isKo ? '다른 패러다임과 1:1 맞비교' : 'Compare Diff with another paradigm'}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>{isKo ? 'Diff 비교' : 'Diff'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Document Wrapper (used for both screen display & PDF raster capture) */}
      <div
        ref={matrixDocRef}
        className={`w-full flex flex-col gap-6 p-4 sm:p-6 rounded-2xl border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-zinc-950 border-zinc-800/80 text-zinc-100'
        }`}
      >
        {/* Offline Study Document Header (visible on export & screen) */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isLight ? 'border-slate-200' : 'border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-amber-500">
                  Engineering Syllabus & Matrix
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  v2.6 Complexity Heatmap Edition
                </span>
              </div>
              <h1 className={`text-lg sm:text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isKo
                  ? '차세대 AI 패러다임 비교 분석표 & 구조적 복잡도 히트맵'
                  : 'Next-Gen AI Paradigm Comparison Matrix & Structural Complexity Heatmap'}
              </h1>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              <Calendar className="w-3 h-3 inline mr-1" />
              {new Date().toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="text-[10px] text-amber-500/90 font-medium mt-0.5">
              Verified Educational Specification
            </div>
          </div>
        </div>

        {/* Comparison Table with Heatmap Overlay */}
        <div
          className={`overflow-x-auto rounded-xl border shadow-lg ${
            isLight ? 'border-slate-200 bg-white' : 'border-zinc-800/80 bg-zinc-950/80'
          }`}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-zinc-300 ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-900/90 border-zinc-800'
                }`}
              >
                <th
                  className={`py-3.5 px-4 font-bold w-1/5 uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-slate-600' : 'text-zinc-400'
                  }`}
                >
                  {isKo ? '비교 차원 (Dimension)' : 'Dimension'}
                </th>
                <th
                  className={`py-3.5 px-4 font-bold w-1/4 border-l ${
                    isLight
                      ? 'text-blue-700 border-slate-200 bg-blue-50/50'
                      : 'text-blue-400 border-zinc-800/80 bg-blue-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span>L.L.M (ChatGPT)</span>
                    </div>
                    {isHeatmapActive && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {patternAttributes.llm.scores[heatmapMetric]} / 100
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`py-3.5 px-4 font-bold w-1/4 border-l ${
                    isLight
                      ? 'text-sky-700 border-slate-200 bg-sky-50/50'
                      : 'text-sky-400 border-zinc-800/80 bg-sky-950/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-sky-500" />
                      <span>R.A.G (Perplexity)</span>
                    </div>
                    {isHeatmapActive && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {patternAttributes.rag.scores[heatmapMetric]} / 100
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className={`py-3.5 px-4 font-bold w-1/4 border-l ${
                    isLight
                      ? 'text-purple-700 border-slate-200 bg-purple-50/50'
                      : 'text-purple-400 border-zinc-800/80 bg-purple-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <span>Agentic AI (Goover / Operator)</span>
                    </div>
                    {isHeatmapActive && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {patternAttributes.agentic.scores[heatmapMetric]} / 100
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? 'divide-slate-200' : 'divide-zinc-800/60'
              }`}
            >
              {filteredDimensions.map((row, idx) => {
                const originalDimIndex = COMPARISON_DIMENSIONS.findIndex(
                  (d) => d.dimension === row.dimension
                );
                const dimScores =
                  DIMENSION_COMPLEXITY_SCORES[originalDimIndex] || {
                    llm: { overall: 20, structural: 20, techStack: 20, challenges: 20, runtime: 20 },
                    rag: { overall: 60, structural: 60, techStack: 60, challenges: 60, runtime: 60 },
                    agentic: { overall: 95, structural: 95, techStack: 95, challenges: 95, runtime: 95 },
                  };

                const llmScore = dimScores.llm[heatmapMetric];
                const ragScore = dimScores.rag[heatmapMetric];
                const agenticScore = dimScores.agentic[heatmapMetric];

                const llmColor = getHeatmapColor(llmScore);
                const ragColor = getHeatmapColor(ragScore);
                const agenticColor = getHeatmapColor(agenticScore);

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Dimension title */}
                    <td
                      className={`py-3.5 px-4 font-medium ${
                        isLight ? 'bg-slate-50/70 text-slate-900' : 'bg-zinc-950/40 text-zinc-100'
                      }`}
                    >
                      <div className="font-bold text-[13px]">
                        {isKo ? row.dimensionKo : row.dimension}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 font-medium ${
                          isLight ? 'text-slate-500' : 'text-zinc-500'
                        }`}
                      >
                        {isKo ? row.dimension : row.dimensionKo}
                      </div>
                    </td>

                    {/* LLM */}
                    <td
                      className={`py-3 px-4 leading-relaxed border-l transition-all ${
                        isHeatmapActive
                          ? `${llmColor.bg} border-slate-200 dark:border-zinc-800/60`
                          : isLight
                          ? 'text-slate-700 border-slate-200'
                          : 'text-zinc-300 border-zinc-800/60'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[12px]">{isKo ? row.llmKo : row.llm}</div>
                        {isHeatmapActive && (
                          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                            <span className={`font-mono ${llmColor.text}`}>
                              Score: {llmScore}/100
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className={`h-full ${llmColor.barColor}`}
                                style={{ width: `${llmScore}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* RAG */}
                    <td
                      className={`py-3 px-4 leading-relaxed border-l transition-all ${
                        isHeatmapActive
                          ? `${ragColor.bg} border-slate-200 dark:border-zinc-800/60`
                          : isLight
                          ? 'text-slate-700 border-slate-200'
                          : 'text-zinc-300 border-zinc-800/60'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[12px]">{isKo ? row.ragKo : row.rag}</div>
                        {isHeatmapActive && (
                          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                            <span className={`font-mono ${ragColor.text}`}>
                              Score: {ragScore}/100
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className={`h-full ${ragColor.barColor}`}
                                style={{ width: `${ragScore}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Agentic */}
                    <td
                      className={`py-3 px-4 leading-relaxed border-l transition-all ${
                        isHeatmapActive
                          ? `${agenticColor.bg} border-slate-200 dark:border-zinc-800/60 font-medium`
                          : isLight
                          ? 'text-purple-950 bg-purple-50/40 border-slate-200 font-medium'
                          : 'text-zinc-100 bg-purple-950/15 border-zinc-800/60'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[12px]">{isKo ? row.agenticKo : row.agentic}</div>
                        {isHeatmapActive && (
                          <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                            <span className={`font-mono ${agenticColor.text}`}>
                              Score: {agenticScore}/100
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                              <div
                                className={`h-full ${agenticColor.barColor}`}
                                style={{ width: `${agenticScore}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Decision Guide Card */}
        <div
          className={`rounded-xl p-5 border shadow-sm ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : 'bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className={`font-bold text-sm sm:text-base flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>
                {isKo
                  ? '언제 어떤 아키텍처를 선택해야 하는가? (Architecture Decision Matrix)'
                  : 'When to choose which architecture? (Architecture Decision Matrix)'}
              </span>
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border hidden sm:inline ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              Strategic Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? 'bg-blue-50/80 border-blue-200 text-slate-700'
                  : 'bg-blue-950/20 border-blue-900/40 text-zinc-300'
              }`}
            >
              <h4 className="font-bold text-blue-600 dark:text-blue-300 mb-1.5 flex items-center gap-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5" />
                <span>Pure LLM 권장 시나리오 (Low Complexity)</span>
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>{isKo ? '단순 문장 교정, 다국어 번역, 문체 변환' : 'Simple grammar, translation, tone change'}</li>
                <li>{isKo ? '초저지연(<400ms)이 필요한 즉각적인 텍스트 보완' : 'Ultra low latency autocomplete (<400ms)'}</li>
                <li>{isKo ? '창의적 글쓰기, 브레인스토밍 아이디어 생성' : 'Creative writing, brainstorming'}</li>
              </ul>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? 'bg-sky-50/80 border-sky-200 text-slate-700'
                  : 'bg-sky-950/20 border-sky-900/40 text-zinc-300'
              }`}
            >
              <h4 className="font-bold text-sky-600 dark:text-sky-300 mb-1.5 flex items-center gap-1.5 text-xs">
                <Database className="w-3.5 h-3.5" />
                <span>R.A.G 권장 시나리오 (Moderate Complexity)</span>
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>{isKo ? '사내 사규, 제품 매뉴얼, PDF 기술문서 Q&A' : 'Enterprise knowledge base, policy manuals, PDF QA'}</li>
                <li>{isKo ? '최신 뉴스 및 출처 검증(Citations)이 필수인 경우' : 'Current news with verifiable citations'}</li>
                <li>{isKo ? '환각(Hallucination)을 엄격히 방지해야 하는 리서치' : 'Zero-hallucination critical research'}</li>
              </ul>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                isLight
                  ? 'bg-purple-50/80 border-purple-200 text-slate-700'
                  : 'bg-purple-950/20 border-purple-900/40 text-zinc-300'
              }`}
            >
              <h4 className="font-bold text-purple-600 dark:text-purple-300 mb-1.5 flex items-center gap-1.5 text-xs">
                <Bot className="w-3.5 h-3.5" />
                <span>Agentic AI 권장 시나리오 (High Complexity)</span>
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>{isKo ? '실제 시스템 조작 (예약, 결제, 캘린더 등록, 이메일)' : 'Real system mutations (booking, payments, emails)'}</li>
                <li>{isKo ? '코드 디버깅 후 빌드/테스트/Git PR 자율 제출' : 'Self-debugging code, tests & Git PR submissions'}</li>
                <li>{isKo ? '복잡한 다단계 의사결정 및 동적 에러 복구 필요 시' : 'Multi-step autonomous workflow & self-recovery'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note for Print/Study */}
        <div
          className={`flex items-center justify-between text-[11px] pt-2 border-t ${
            isLight ? 'border-slate-200 text-slate-500' : 'border-zinc-800 text-zinc-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Architecture Multi-Paradigm Interactive Explorer</span>
          </div>
          <div>Defense AI • Ontology Knowledge Graph • Prof. Kim Dae-Shik Physical AI</div>
        </div>
      </div>
      </>
      )}

      {/* Pattern Node Attribute Inspector Modal */}
      {selectedPatternModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 border shadow-2xl max-h-[85vh] flex flex-col overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {isKo
                      ? `${patternAttributes[selectedPatternModal].titleKo} 노드 속성 심층 분석`
                      : `${patternAttributes[selectedPatternModal].title} Node Attributes Breakdown`}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {isKo ? '캔버스 실제 노드 속성에서 파생된 복잡도 상세 지표' : 'Detailed complexity metrics derived from canvas node attributes'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatternModal(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-500/10 transition text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto py-4 space-y-5 text-xs pr-1">
              {/* Score summary row */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  getHeatmapColor(patternAttributes[selectedPatternModal].scores.overall).bg
                } ${getHeatmapColor(patternAttributes[selectedPatternModal].scores.overall).border}`}
              >
                <div>
                  <div className="text-[11px] font-semibold text-zinc-500">
                    {isKo ? '종합 아키텍처 복잡도 점수' : 'Overall Architecture Complexity Score'}
                  </div>
                  <div className="text-2xl font-black mt-0.5">
                    {patternAttributes[selectedPatternModal].scores.overall} / 100
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      getHeatmapColor(patternAttributes[selectedPatternModal].scores.overall).badgeBg
                    }`}
                  >
                    {getHeatmapColor(patternAttributes[selectedPatternModal].scores.overall).label}
                  </span>
                </div>
              </div>

              {/* 5-Metric Breakdown */}
              <div>
                <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isKo ? '5대 세부 복잡도 지표' : '5 Core Complexity Dimensions'}</span>
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'structural', labelKo: '노드 구조 및 파이프라인 밀도', labelEn: 'Structural & Pipeline Density' },
                    { key: 'techStack', labelKo: '기술 스택 및 인프라 연동 폭', labelEn: 'Tech Stack & Infrastructure Breadth' },
                    { key: 'challenges', labelKo: '엔지니어링 난제 및 보안 취약점', labelEn: 'Engineering Challenges & Attack Surface' },
                    { key: 'runtime', labelKo: '런타임 지연 시간 및 연산 부하', labelEn: 'Runtime Latency & Compute Load' },
                  ].map((m) => {
                    const sc = patternAttributes[selectedPatternModal].scores[m.key as keyof typeof patternAttributes[typeof selectedPatternModal]['scores']];
                    const cl = getHeatmapColor(sc);
                    return (
                      <div key={m.key} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                        <span className="text-[11px] font-medium">{isKo ? m.labelKo : m.labelEn}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                            <div className={`h-full ${cl.barColor}`} style={{ width: `${sc}%` }} />
                          </div>
                          <span className={`font-mono font-bold text-[11px] w-8 text-right ${cl.text}`}>{sc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contributing Nodes List */}
              <div>
                <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {isKo
                      ? `구성 노드 목록 (${patternAttributes[selectedPatternModal].nodes.length}개 노드)`
                      : `Constituent Nodes (${patternAttributes[selectedPatternModal].nodes.length} nodes)`}
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {patternAttributes[selectedPatternModal].nodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[11px]">{isKo ? node.nameKo : node.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{node.id}</div>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {node.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Tech Stacks */}
              <div>
                <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {isKo
                      ? `연동 기술 스택 (${patternAttributes[selectedPatternModal].techStackList.length}개 항목)`
                      : `Integrated Tech Stacks (${patternAttributes[selectedPatternModal].techStackList.length} items)`}
                  </span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {patternAttributes[selectedPatternModal].techStackList.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documented Challenges */}
              <div>
                <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    {isKo
                      ? `극복해야 할 엔지니어링 난제 (${patternAttributes[selectedPatternModal].challengesList.length}개)`
                      : `Engineering Challenges & Failure Modes (${patternAttributes[selectedPatternModal].challengesList.length})`}
                  </span>
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {patternAttributes[selectedPatternModal].challengesList.map((ch, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[11px] flex items-start gap-2"
                    >
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{isKo ? ch.ko : ch.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedPatternModal(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition"
              >
                {isKo ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
