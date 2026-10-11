import React, { useState } from 'react';
import { ActiveTab, Language } from '../types';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { DEFENSE_AGENT_SECTIONS } from '../data/defenseAgentData';
import { ONTOLOGY_AGENT_SECTIONS } from '../data/ontologyAgentData';
import { KIM_DAESHIK_SECTIONS } from '../data/kimDaeShikData';
import {
  Compass,
  Milestone,
  ArrowRight,
  CheckCircle2,
  Circle,
  Trophy,
  Star,
  Sparkles,
  Brain,
  Network,
  Crosshair,
  Shield,
  Zap,
  Layers,
  ChevronRight,
  RotateCcw,
  Clock,
  Target,
  BarChart2,
  Check,
  CheckCircle,
  ExternalLink,
  Flame,
  Lightbulb,
  ArrowUpRight,
  Award
} from 'lucide-react';
import { CertificateExportModal } from './CertificateExportModal';

interface Props {
  language: Language;
  onNavigateTab: (tab: ActiveTab) => void;
}

type ViewMode = 'timeline' | 'curriculum' | 'matrix' | 'tracks';

export const LearningRoadmap: React.FC<Props> = ({ language, onNavigateTab }) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const {
    defenseStats,
    ontologyStats,
    kimdaeshikStats,
    overallStats,
    isCompleted,
    toggleComplete,
    markAllInTab,
    resetAll,
  } = useProgress();

  const [activeStepId, setActiveStepId] = useState<'kim' | 'ontology' | 'defense'>('kim');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedTrack, setSelectedTrack] = useState<'standard' | 'knowledge' | 'defense'>('standard');

  // Roadmap Stages ordered by Complexity
  const roadmapSteps = [
    {
      id: 'kim' as const,
      tabId: 'kimdaeshik' as ActiveTab,
      stepNumber: '01',
      complexityLevel: 1,
      complexityStars: 1,
      levelLabelKo: '기초 입문 (Foundational)',
      levelLabelEn: 'Level 1: Foundational',
      titleKo: '김대식 교수: 인지 패러다임 & 피지컬 AI 기초',
      titleEn: 'Prof. Kim: Cognitive Paradigms & Physical AI',
      shortTitleKo: '김대식 교수 모듈',
      shortTitleEn: 'Prof. Kim Module',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      themeColor: 'purple',
      estimatedHours: '3~4 hrs',
      stats: kimdaeshikStats,
      sections: KIM_DAESHIK_SECTIONS,
      accentBg: isLight ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-purple-950/40 border-purple-800/60 text-purple-300',
      badgeBg: isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-900/60 text-purple-300 border-purple-700',
      rationaleKo:
        '가장 먼저 학습해야 하는 핵심 관문입니다. 복잡한 기호 그래프나 무인 무기 체계를 다루기 전에, 뇌과학 관점에서 생성형 AI의 작동 원리와 근본 한계(환각, 비결정성), 텍스트 생성에서 현실 장비 조작(Physical AI)으로의 패러다임 전환, 그리고 액션 데이터(Action Data)의 전략적 가치를 체득해야 합니다.',
      rationaleEn:
        'The foundational starting gate. Before diving into complex symbolic knowledge graphs or mission-critical autonomous agents, engineers must understand cognitive boundaries, the leap from LLM token prediction to Physical AI, action data assets, and 1-person Agent Boss workflows.',
      prerequisitesKo: ['기본 LLM 및 프롬프트 개념 이해', '소프트웨어 엔지니어링 기본 상식'],
      prerequisitesEn: ['Basic LLM & prompt engineering concept', 'Fundamental software engineering knowledge'],
      keyCompetenciesKo: [
        '인간 뇌 vs LLM 인지 메커니즘 차이 및 한계 파악',
        '텍스트 챗봇에서 행동하는 피지컬 AI(Physical AI) 전환 논리',
        '4계층 물리 AI 오케스트레이터 및 안전 가드레일 설계',
        '1인 에이전트 보스(Agent Boss) 창업 조직 및 6개월 PoC 로드맵 수립'
      ],
      keyCompetenciesEn: [
        'Grasp brain vs LLM cognition disparities and inherent limits',
        'Transition strategy from text chatbot to tool-wielding Physical AI',
        '4-Layer physical agent orchestrator & safety gate engineering',
        '1-Person Agent Boss organization & 6-month PoC roadmap execution'
      ],
      transitionToNextKo: '인지적 한계를 명확히 이해했다면, 이제 환각을 영구적으로 방지하기 위한 정형화된 지식 그래프 단계로 나아갑니다.',
      transitionToNextEn: 'Once cognitive limits are understood, advance to structured knowledge graphs to permanently ground LLMs.'
    },
    {
      id: 'ontology' as const,
      tabId: 'ontology' as ActiveTab,
      stepNumber: '02',
      complexityLevel: 2,
      complexityStars: 2,
      levelLabelKo: '중급 구조화 (Intermediate)',
      levelLabelEn: 'Level 2: Intermediate',
      titleKo: '온톨로지 AI: 뉴로-심볼릭 지식 그래프 & Graph RAG',
      titleEn: 'Ontology AI: Neuro-Symbolic Knowledge Graphs & Graph RAG',
      shortTitleKo: '온톨로지 AI 모듈',
      shortTitleEn: 'Ontology AI Module',
      icon: <Network className="w-5 h-5 text-indigo-400" />,
      themeColor: 'indigo',
      estimatedHours: '5~6 hrs',
      stats: ontologyStats,
      sections: ONTOLOGY_AGENT_SECTIONS,
      accentBg: isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300',
      badgeBg: isLight ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
      rationaleKo:
        '2단계는 정형화된 의미 구조(Semantic Structure)와 결정론적 추론의 영역입니다. 국방이나 고신뢰 산업에서는 1%의 환각도 치명적입니다. 단순 벡터 유사도 검색(Vector RAG)의 단편적 한계를 극복하고, RDF/OWL 시맨틱 온톨로지와 그래프 데이터베이스(Neo4j)를 결합하여 LLM의 답변을 논리적으로 검증(Grounding)하는 아키텍처를 완성합니다.',
      rationaleEn:
        'Stage 2 bridges neural intuition with deterministic symbolic reasoning. In high-assurance environments, hallucinations are fatal. Learners master how Graph RAG overcomes Vector RAG limits via RDF/OWL ontologies, multi-hop relationship traversal, and verified knowledge grounding.',
      prerequisitesKo: ['1단계 김대식 교수 인지/피지컬 AI 개념', '관계형 데이터 모델 또는 그래프 기본 지식'],
      prerequisitesEn: ['Stage 1 Prof. Kim cognitive foundation', 'Basic database/relational or graph concepts'],
      keyCompetenciesKo: [
        'Vector RAG vs Graph RAG 다중 홉(Multi-hop) 경로 추론 비교',
        '3계층 온톨로지 스키마(도메인, 태스크, 애플리케이션) 모델링',
        'W3C RDF/OWL 시맨틱 웹 표준 규격 및 Neo4j Cypher 질의',
        '비정형 텍스트로부터 실시간 엔티티-관계 추출 파이프라인 구축'
      ],
      keyCompetenciesEn: [
        'Vector RAG vs Graph RAG multi-hop relationship path traversal',
        '3-tier ontology schema modeling (Domain, Task, Application)',
        'W3C RDF/OWL standards and Neo4j Cypher query construction',
        'Real-time automated entity-relation extraction pipelines'
      ],
      transitionToNextKo: '신뢰할 수 있는 지식 기반이 마련되었으므로, 이제 극한의 실시간성과 보안이 요구되는 미션 크리티컬 국방 전술 체계로 도약합니다.',
      transitionToNextEn: 'With a verified knowledge backbone established, leap into mission-critical real-time tactical defense deployments.'
    },
    {
      id: 'defense' as const,
      tabId: 'defense' as ActiveTab,
      stepNumber: '03',
      complexityLevel: 3,
      complexityStars: 3,
      levelLabelKo: '고급 실전 (Advanced / Critical)',
      levelLabelEn: 'Level 3: Advanced / Critical',
      titleKo: '국방 AI: 에어갭 미션 크리티컬 & 무인 복합체계',
      titleEn: 'Defense AI: Air-Gapped Mission-Critical & Manned-Unmanned Teaming',
      shortTitleKo: '국방 AI 모듈',
      shortTitleEn: 'Defense AI Module',
      icon: <Crosshair className="w-5 h-5 text-emerald-400" />,
      themeColor: 'emerald',
      estimatedHours: '6~8 hrs',
      stats: defenseStats,
      sections: DEFENSE_AGENT_SECTIONS,
      accentBg: isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
      badgeBg: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
      rationaleKo:
        '최고 난이도의 최종 완성 단계입니다. 인터넷이 단절된 전술 에어갭(Air-Gapped) 환경, 서브초 단위 OODA 루프(관측-판단-결심-행동), Link-16 전술 데이터링크 연동, 그리고 물리적 킬 스위치(Kill Switch)와 페일세이프(Fail-Safe) 안전 하네스를 결합하여 실전 투입 가능한 초고신뢰 국방 에이전트를 완성합니다.',
      rationaleEn:
        'The ultimate, highest-complexity stage. Integrates tactical air-gapped containerized edge LLMs, sub-second OODA loops, Link-16 datalink protocols, and dual physical kill switches for mission-critical unmanned defense autonomy.',
      prerequisitesKo: ['1단계 인지/피지컬 AI + 2단계 온톨로지 지식 접지', '분산 시스템 및 하드웨어 연동/보안 기초'],
      prerequisitesEn: ['Stage 1 Cognitive + Stage 2 Ontology grounding', 'Distributed systems & secure edge concepts'],
      keyCompetenciesKo: [
        '전술 엣지 경량 SLM/LLM 에어갭 온프레미스 배포 및 최적화',
        'C4I 체계 및 전술 OODA 루프 초단위 실시간 의사결정 오케스트레이션',
        '소프트웨어/하드웨어 이중 킬 스위치(Kill Switch) 및 안전 가드레일',
        'Link-16 / VMF / CoT 전술 통신 규격 래퍼 및 이종 무인기 군집 합의'
      ],
      keyCompetenciesEn: [
        'Tactical edge quantized micro-LLM air-gapped deployment',
        'C4I & real-time OODA loop sub-second autonomous orchestration',
        'Dual software/hardware kill switches and fail-safe safety gates',
        'Link-16 / CoT protocol smart wrappers & swarm consensus'
      ],
      transitionToNextKo: '전 과정 이수 완료! 국방·피지컬·온톨로지 AI 통합 아키텍트 역량을 보유하게 됩니다.',
      transitionToNextEn: 'Roadmap complete! You have attained elite full-stack architectural mastery.'
    }
  ];

  const activeStep = roadmapSteps.find((s) => s.id === activeStepId) || roadmapSteps[0];

  // Determine user's current recommended next step
  const recommendedStep = (() => {
    if (kimdaeshikStats.percent < 80) return 'kim';
    if (ontologyStats.percent < 80) return 'ontology';
    if (defenseStats.percent < 80) return 'defense';
    return 'defense';
  })();

  return (
    <div className="w-full max-w-[1320px] mx-auto space-y-6">
      {/* Top Banner & Overview */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-md'
            : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border-amber-500/30 text-amber-500">
              <Compass className="w-3.5 h-3.5" />
              <span>{isKo ? '난이도 기반 단계별 추천 로드맵' : 'Complexity-Based Adaptive Learning Roadmap'}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                Level 1 → 2 → 3
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? 'AI 아키텍처 학습 로드맵' : 'AI Architecture Learning Roadmap'}
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {isKo
                ? '기초 인지 패러다임(김대식 교수)부터 정형 시맨틱 지식 그래프(온톨로지 AI), 미션 크리티컬 에어갭 체계(국방 AI)까지 난이도와 인지 발달에 맞춘 최적의 탐색 순서를 제공합니다.'
                : 'A guided 3-stage progression from cognitive & physical AI paradigms (Prof. Kim) to deterministic knowledge engineering (Ontology AI) and mission-critical air-gapped autonomy (Defense AI).'}
            </p>
          </div>

          {/* Overall Completion Gauge Card */}
          <div
            className={`w-full lg:w-72 p-4 rounded-xl border flex flex-col gap-3 shrink-0 ${
              isLight
                ? 'bg-slate-50 border-slate-200 shadow-inner'
                : 'bg-black/60 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-1.5 text-amber-500">
                <Trophy className="w-4 h-4" />
                {isKo ? '전체 로드맵 달성도' : 'Total Roadmap Progress'}
              </span>
              <span className="font-mono font-bold text-sm text-amber-400">
                {overallStats.percent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallStats.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>{isKo ? '완료 모듈' : 'Completed'}: <strong className={`${isLight ? 'text-slate-800' : 'text-white'}`}>{overallStats.completed}</strong> / {overallStats.total}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                {overallStats.percent === 100 ? (isKo ? '전 과정 마스터 🏆' : 'Master 🏆') : (isKo ? '학습 진행 중 🔥' : 'In Progress 🔥')}
              </span>
            </div>

            {/* Certificate of Completion & PDF Summary Export Button */}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="w-full mt-1 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>{isKo ? '수료증 및 PDF 요약서 내보내기' : 'Export Certificate & PDF Summary'}</span>
            </button>
          </div>
        </div>

        {/* Navigation View Modes */}
        <div className="mt-6 pt-4 border-t border-zinc-800/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'timeline'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-bold'
                    : 'bg-zinc-800 text-amber-300 shadow border border-zinc-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Milestone className="w-3.5 h-3.5" />
              <span>{isKo ? '단계별 타임라인 파이프라인' : 'Step-by-Step Pipeline'}</span>
            </button>
            <button
              onClick={() => setViewMode('curriculum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'curriculum'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-bold'
                    : 'bg-zinc-800 text-amber-300 shadow border border-zinc-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isKo ? '모듈 상세 커리큘럼' : 'Curriculum Drill-Down'}</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'matrix'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-bold'
                    : 'bg-zinc-800 text-amber-300 shadow border border-zinc-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{isKo ? '난이도 & 복잡도 비교 매트릭스' : 'Complexity Matrix'}</span>
            </button>
            <button
              onClick={() => setViewMode('tracks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'tracks'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-bold'
                    : 'bg-zinc-800 text-amber-300 shadow border border-zinc-700'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isKo ? '맞춤 학습 트랙 추천' : 'Learning Track Advisor'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                isLight
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isKo ? '개념 연계 지식 그래프 보기 →' : 'View Knowledge Graph →'}</span>
            </button>
          </div>

          {/* Quick status guide */}
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              {isKo ? '1단계 김대식 (기초)' : 'Step 1: Kim (Level 1)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              {isKo ? '2단계 온톨로지 (중급)' : 'Step 2: Ontology (Level 2)'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {isKo ? '3단계 국방 (고급)' : 'Step 3: Defense (Level 3)'}
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: TIMELINE PIPELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {/* Visual Step-by-Step Flow Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
            {roadmapSteps.map((step, idx) => {
              const isSelected = activeStepId === step.id;
              const isRecommended = recommendedStep === step.id;
              const isStepDone = step.stats.percent === 100;

              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Step Card */}
                  <div
                    onClick={() => setActiveStepId(step.id)}
                    className={`h-full p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-amber-500 shadow-lg ring-2 ring-amber-500/20'
                          : 'bg-zinc-900 border-amber-400/80 shadow-2xl ring-2 ring-amber-400/20'
                        : isLight
                        ? 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
                    }`}
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center border shadow-sm ${
                              step.themeColor === 'purple'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                                : step.themeColor === 'indigo'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            }`}
                          >
                            {step.stepNumber}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${step.badgeBg}`}>
                            {isKo ? step.levelLabelKo : step.levelLabelEn}
                          </span>
                        </div>

                        {/* Complexity Stars */}
                        <div className="flex items-center gap-0.5" title={`Complexity: Level ${step.complexityLevel}`}>
                          {Array.from({ length: 3 }).map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx < step.complexityStars
                                  ? 'text-amber-400 fill-amber-400'
                                  : isLight ? 'text-slate-300' : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40 shrink-0 mt-0.5">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className={`text-base font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {isKo ? step.titleKo : step.titleEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span>{isKo ? `예상 소요시간: ${step.estimatedHours}` : `Est. ${step.estimatedHours}`}</span>
                            <span>·</span>
                            <span>{step.sections.length} {isKo ? '개 모듈' : 'Modules'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rationale Excerpt */}
                      <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                        {isKo ? step.rationaleKo : step.rationaleEn}
                      </p>
                    </div>

                    {/* Footer: Progress & Direct Jump */}
                    <div className="space-y-3 pt-3 border-t border-zinc-800/40">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 flex items-center gap-1">
                          {isStepDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Target className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          {isKo ? '모듈 달성도' : 'Module Progress'}
                        </span>
                        <span className="font-mono font-bold text-xs">
                          {step.stats.completed}/{step.stats.total} ({step.stats.percent}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`}>
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            step.themeColor === 'purple'
                              ? 'bg-purple-500'
                              : step.themeColor === 'indigo'
                              ? 'bg-indigo-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${step.stats.percent}%` }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab(step.tabId);
                          }}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            isLight
                              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700/80 shadow'
                          }`}
                        >
                          <span>{isKo ? `${step.shortTitleKo} 바로가기` : `Explore ${step.shortTitleEn}`}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow Indicator between cards (Desktop) */}
                  {idx < roadmapSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400 items-center justify-center shadow">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Pedagogical Bridge Callout */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-amber-950/20 border-amber-900/50 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <strong className="font-bold text-sm block">
                  {isKo ? '💡 왜 이 순서(김대식 → 온톨로지 → 국방)로 탐색해야 할까요?' : '💡 Why this recommended sequence (Kim → Ontology → Defense)?'}
                </strong>
                <p className={`${isLight ? 'text-amber-900' : 'text-amber-300/80'}`}>
                  {isKo
                    ? '1단계에서 뇌과학적 인지 한계와 피지컬 AI의 필요성을 깨닫고, 2단계에서 환각을 잡는 온톨로지 지식 그래프를 익힌 뒤, 3단계에서 극한의 에어갭·실시간 국방 체계로 완성하는 것이 가장 완벽한 엔지니어링 성장 곡선입니다.'
                    : '1. Recognize neural limits & physical action data → 2. Ground answers deterministically via ontology graphs → 3. Deploy fail-safe air-gapped tactical defense agents.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab(activeStep.tabId)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                isLight
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-black'
              }`}
            >
              <span>{isKo ? `현재 선택 단계 (${activeStep.shortTitleKo}) 탐색하기` : `Explore ${activeStep.shortTitleEn}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Selected Stage Deep-Dive Details */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isLight
                ? 'bg-white border-slate-200 shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
                  {activeStep.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      STAGE {activeStep.stepNumber}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${activeStep.badgeBg}`}>
                      {isKo ? activeStep.levelLabelKo : activeStep.levelLabelEn}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isKo ? activeStep.titleKo : activeStep.titleEn}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAllInTab(activeStep.tabId as 'defense' | 'ontology' | 'kimdaeshik', true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isKo ? '이 단계 모두 완료 표시' : 'Mark All Completed'}</span>
                </button>
                <button
                  onClick={() => onNavigateTab(activeStep.tabId)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                    isLight
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-amber-400 text-black hover:bg-amber-300'
                  }`}
                >
                  <span>{isKo ? '탐색기 탭으로 이동' : 'Open Explorer'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stage Grid: Rationale, Prerequisites, Competencies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Box 1: Pedagogical Rationale */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    {isKo ? '인지적 권장 이유' : 'Pedagogical Rationale'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {isKo ? activeStep.rationaleKo : activeStep.rationaleEn}
                  </p>
                </div>
              </div>

              {/* Box 2: Prerequisites */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {isKo ? '요구 사전 지식' : 'Prerequisites'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {(isKo ? activeStep.prerequisitesKo : activeStep.prerequisitesEn).map((req, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold shrink-0">✓</span>
                        <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Box 3: Target Competencies */}
              <div
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    {isKo ? '달성 핵심 역량 (KPI)' : 'Key Target Competencies'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {(isKo ? activeStep.keyCompetenciesKo : activeStep.keyCompetenciesEn).map((comp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">★</span>
                        <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Real-time Curriculum Modules Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>{isKo ? `${activeStep.shortTitleKo} 핵심 커리큘럼 (${activeStep.sections.length}개 모듈)` : `${activeStep.shortTitleEn} Curriculum (${activeStep.sections.length} Modules)`}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {activeStep.stats.completed} / {activeStep.sections.length} {isKo ? '완료' : 'Done'}
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {isKo ? '체크박스를 클릭하여 학습 완료 상태를 즉시 토글할 수 있습니다.' : 'Click checkboxes to toggle completion.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeStep.sections.map((sec, secIdx) => {
                  const done = isCompleted(sec.id);
                  return (
                    <div
                      key={sec.id}
                      onClick={() => toggleComplete(sec.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        done
                          ? isLight
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                            : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                          : 'bg-black/30 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComplete(sec.id);
                        }}
                        className="mt-0.5 shrink-0 focus:outline-none"
                      >
                        {done ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
                            #{secIdx + 1}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium truncate ${
                            isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-zinc-800/80 text-zinc-400'
                          }`}>
                            {sec.badge || (sec as any).categoryKo || 'Module'}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold leading-snug line-clamp-1 ${
                          done ? (isLight ? 'text-emerald-900 line-through' : 'text-emerald-300 line-through') : (isLight ? 'text-slate-900' : 'text-zinc-200')
                        }`}>
                          {sec.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL CURRICULUM DRILL-DOWN VIEW */}
      {viewMode === 'curriculum' && (
        <div className="space-y-6">
          {roadmapSteps.map((step) => {
            return (
              <div
                key={step.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-md'
                    : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800/40">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                        step.themeColor === 'purple'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                          : step.themeColor === 'indigo'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${step.badgeBg}`}>
                          {isKo ? step.levelLabelKo : step.levelLabelEn}
                        </span>
                        <span className="text-xs text-zinc-400">· {step.estimatedHours}</span>
                      </div>
                      <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {isKo ? step.titleKo : step.titleEn}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {step.stats.completed}/{step.stats.total} ({step.stats.percent}%)
                    </span>
                    <button
                      onClick={() => onNavigateTab(step.tabId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow ${
                        isLight
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-amber-400 text-black hover:bg-amber-300'
                      }`}
                    >
                      <span>{isKo ? '해당 탭 이동' : 'Open Tab'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className={`text-xs mb-4 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {isKo ? step.rationaleKo : step.rationaleEn}
                </p>

                {/* Section Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {step.sections.map((sec, secIdx) => {
                    const done = isCompleted(sec.id);
                    return (
                      <div
                        key={sec.id}
                        onClick={() => toggleComplete(sec.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          done
                            ? isLight
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                              : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            : 'bg-black/40 border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              #{secIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(sec.id);
                              }}
                              className="focus:outline-none"
                            >
                              {done ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-500" />
                              )}
                            </button>
                          </div>
                          <h5 className={`text-xs font-semibold leading-snug line-clamp-2 mb-1.5 ${
                            done ? (isLight ? 'text-emerald-900 line-through' : 'text-emerald-300 line-through') : (isLight ? 'text-slate-900' : 'text-zinc-200')
                          }`}>
                            {sec.title}
                          </h5>
                        </div>
                        <p className={`text-[11px] line-clamp-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {sec.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: COMPLEXITY & CAPABILITIES MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-md'
              : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
          }`}
        >
          <div className="mb-6">
            <h3 className={`text-xl font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? '단계별 아키텍처 난이도 & 복잡도 비교 매트릭스' : 'Complexity & Architectural Dimension Comparison Matrix'}
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {isKo
                ? '5가지 핵심 엔지니어링 차원(이론적 추상도, 시스템 통합성, 안전성 리스크, 실시간 제약, 진입 장벽)을 기준으로 3개 모듈의 난이도 계층을 정밀 비교합니다.'
                : 'Compare the three educational modules across 5 engineering dimensions to understand why this sequence is optimal.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-zinc-800 bg-black/40 text-zinc-300'}`}>
                  <th className="p-3 font-bold w-40">{isKo ? '평가 차원' : 'Dimension'}</th>
                  <th className="p-3 font-bold text-purple-400 w-1/3">
                    {isKo ? '1단계: 김대식 교수 (기초)' : 'Stage 1: Prof. Kim (Foundational)'}
                  </th>
                  <th className="p-3 font-bold text-indigo-400 w-1/3">
                    {isKo ? '2단계: 온톨로지 AI (중급)' : 'Stage 2: Ontology AI (Intermediate)'}
                  </th>
                  <th className="p-3 font-bold text-emerald-400 w-1/3">
                    {isKo ? '3단계: 국방 AI (고급)' : 'Stage 3: Defense AI (Advanced)'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {/* Row 1: 난이도 지수 */}
                <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'}>
                  <td className="p-3 font-semibold text-amber-500">{isKo ? '종합 난이도 등급' : 'Overall Complexity'}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-bold text-purple-400">
                      ⭐ Level 1 (기초 입문)
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-bold text-indigo-400">
                      ⭐⭐ Level 2 (중급 구조화)
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      ⭐⭐⭐ Level 3 (고급 실전)
                    </span>
                  </td>
                </tr>

                {/* Row 2: 핵심 패러다임 */}
                <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'}>
                  <td className="p-3 font-semibold">{isKo ? '핵심 패러다임' : 'Core Paradigm'}</td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '신경망 인지 한계 & 피지컬 액션 데이터 자산화' : 'Cognitive limits & physical action data'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '뉴로-심볼릭 융합 & Graph RAG 결정론적 접지' : 'Neuro-symbolic & Graph RAG deterministic grounding'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '에어갭 C4I OODA 루프 & 유무인 복합 체계' : 'Air-gapped C4I OODA loops & MUM-T teaming'}
                  </td>
                </tr>

                {/* Row 3: 안전성/오류 리스크 */}
                <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'}>
                  <td className="p-3 font-semibold">{isKo ? '안전성 요구도' : 'Safety / Criticality'}</td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '중간 (비즈니스 PoC 및 제품 수준 예외처리)' : 'Moderate (Product PoC & general fail-safe)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '높음 (지식 베이스 무결성 및 환각 제로 검증)' : 'High (Knowledge integrity & zero-hallucination)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    <span className="text-red-400 font-bold">
                      {isKo ? '극도 (미션 크리티컬 인명 안전 & 이중 킬 스위치)' : 'Extreme (Life-critical & dual kill switches)'}
                    </span>
                  </td>
                </tr>

                {/* Row 4: 실시간 지연시간(Latency) 제약 */}
                <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'}>
                  <td className="p-3 font-semibold">{isKo ? '실시간성 제약' : 'Latency Constraints'}</td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '수 초 ~ 수 분 (비동기 오케스트레이션)' : 'Seconds to minutes (Asynchronous orchestration)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '수백 밀리초 (Cypher 그래프 질의 최적화)' : 'Sub-second / Hundreds of ms (Cypher traversal)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    <span className="text-amber-400 font-bold">
                      {isKo ? '서브초 단위 실시간 (초당 수십 회 센서 루프)' : 'Real-time hard sub-second (Sensor fusion OODA)'}
                    </span>
                  </td>
                </tr>

                {/* Row 5: 진입 장벽 & 사전 요구 지식 */}
                <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-zinc-800/30'}>
                  <td className="p-3 font-semibold">{isKo ? '엔지니어링 진입장벽' : 'Entry Barrier'}</td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '낮음~보통 (소프트웨어 기본기 및 직관적 이해 가능)' : 'Low~Medium (Intuitive software engineering)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '중간 (시맨틱 웹 표준, 그래프 DB, 지식 모델링)' : 'Medium~High (Semantic schemas, Graph DB, Cypher)'}
                  </td>
                  <td className="p-3 text-zinc-300">
                    {isKo ? '대단히 높음 (국방 전술 규격, SI, 임베디드, 에어갭)' : 'Very High (Tactical Link-16, SI, embedded air-gapped)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: PERSONALIZED LEARNING TRACK ADVISOR */}
      {viewMode === 'tracks' && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isLight
                ? 'bg-white border-slate-200 shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
            }`}
          >
            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isKo ? '목표별 맞춤 학습 트랙 추천 가이드' : 'Goal-Oriented Learning Track Advisor'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {isKo
                  ? '학습자의 전문 분야나 관심사에 맞춘 3가지 특화 코스를 안내합니다.'
                  : 'Tailored study tracks designed for different career goals and technical backgrounds.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Track 1 */}
              <div
                onClick={() => setSelectedTrack('standard')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack === 'standard'
                    ? isLight
                      ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-amber-950/20 border-amber-400 shadow-xl ring-2 ring-amber-400/20'
                    : isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 mb-2">
                    ★ {isKo ? '가장 추천하는 정석 트랙' : 'Most Recommended'}
                  </div>
                  <h4 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isKo ? '풀스택 AI 아키텍트 완성 코스' : 'Full-Stack AI Architect Mastery'}
                  </h4>
                  <p className="text-xs text-zinc-400 mb-3">
                    {isKo ? '순서: 김대식 (1단계) → 온톨로지 (2단계) → 국방 (3단계)' : 'Order: Kim → Ontology → Defense'}
                  </p>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {isKo
                      ? '모든 영역을 체계적으로 섭렵하여 신경망-기호주의 융합과 초고신뢰 미션 시스템을 아우르는 최고 수준의 AI 아키텍트로 거듭납니다.'
                      : 'Systematically master the full spectrum from cognition and semantic graph grounding to air-gapped critical systems.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/40">
                  <span className="text-xs font-bold text-amber-500">
                    {isKo ? '총 24개 마스터 모듈 완주' : '24 Total Modules'}
                  </span>
                </div>
              </div>

              {/* Track 2 */}
              <div
                onClick={() => setSelectedTrack('knowledge')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack === 'knowledge'
                    ? isLight
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-indigo-950/20 border-indigo-400 shadow-xl ring-2 ring-indigo-400/20'
                    : isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 mb-2">
                    🧠 {isKo ? '엔터프라이즈 특화' : 'Enterprise Track'}
                  </div>
                  <h4 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isKo ? '엔터프라이즈 지식공학 & RAG 코스' : 'Knowledge Engineering & Graph RAG'}
                  </h4>
                  <p className="text-xs text-zinc-400 mb-3">
                    {isKo ? '순서: 김대식 (1단계) → 온톨로지 (2단계)' : 'Order: Kim → Ontology'}
                  </p>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {isKo
                      ? '기업 사내 데이터베이스, 금융/의료 등 환각이 금기시되는 분야에서 정확한 지식 그래프와 결합된 Graph RAG 시스템 구축에 집중합니다.'
                      : 'Focus on enterprise knowledge management, Neo4j graphs, and deterministic multi-hop reasoning for zero-hallucination compliance.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/40">
                  <span className="text-xs font-bold text-indigo-400">
                    {isKo ? '총 16개 핵심 모듈 집중' : '16 Core Modules'}
                  </span>
                </div>
              </div>

              {/* Track 3 */}
              <div
                onClick={() => setSelectedTrack('defense')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack === 'defense'
                    ? isLight
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-emerald-950/20 border-emerald-400 shadow-xl ring-2 ring-emerald-400/20'
                    : isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-black/40 border-zinc-800'
                }`}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 mb-2">
                    ⚔️ {isKo ? '방산 & 피지컬 특화' : 'Physical Defense'}
                  </div>
                  <h4 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isKo ? '피지컬 국방 & 무인 에이전트 패스트트랙' : 'Physical Defense & Autonomous Agents'}
                  </h4>
                  <p className="text-xs text-zinc-400 mb-3">
                    {isKo ? '순서: 김대식 (1단계) → 국방 (3단계)' : 'Order: Kim → Defense'}
                  </p>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {isKo
                      ? '30년 국방 SI 경험자와 하드웨어·로보틱스 엔지니어를 위한 속성 트랙. 실제 전술 데이터링크와 에어갭 킬 스위치 구현에 빠르게 진입합니다.'
                      : 'Fast-track for defense SI engineers and roboticists targeting tactical edge datalinks, air-gapped kill switches, and MUM-T swarms.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/40">
                  <span className="text-xs font-bold text-emerald-400">
                    {isKo ? '총 16개 실전 모듈 집중' : '16 Tactical Modules'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Global Roadmap Actions */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-zinc-950/80 border-zinc-800 text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-zinc-500" />
          <span>{isKo ? '학습 데이터 관리:' : 'Progress Management:'}</span>
          <button
            onClick={() => {
              if (window.confirm(isKo ? '모든 학습 완료 기록을 초기화하시겠습니까?' : 'Reset all learning progress?')) {
                resetAll();
              }
            }}
            className="text-red-400 hover:text-red-300 hover:underline cursor-pointer font-semibold ml-1"
          >
            {isKo ? '전체 학습 진도 초기화' : 'Reset All Progress'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-zinc-400">
            {isKo ? '💡 진행률은 브라우저에 안전하게 영구 저장됩니다.' : '💡 Progress is automatically saved locally.'}
          </span>
          <button
            onClick={() => onNavigateTab(recommendedStep as ActiveTab)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shadow ${
              isLight
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-black'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isKo
                ? `추천 다음 모듈 (${
                    recommendedStep === 'kim'
                      ? '김대식 교수'
                      : recommendedStep === 'ontology'
                      ? '온톨로지 AI'
                      : '국방 AI'
                  }) 학습하기`
                : 'Continue Recommended Step'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Certificate Export Modal */}
      {showCertificateModal && (
        <CertificateExportModal
          language={language}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
};
