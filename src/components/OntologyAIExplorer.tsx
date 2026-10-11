import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { 
  ONTOLOGY_AGENT_SECTIONS, 
  ONTOLOGY_CATEGORIES, 
  OntologySectionItem 
} from '../data/ontologyAgentData';
import { 
  Network, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Rocket, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  Terminal, 
  Lock, 
  Zap, 
  ArrowUpRight,
  Maximize2,
  X,
  FileCode,
  CheckCircle2,
  GitBranch,
  Compass,
  Anchor,
  Radar,
  Activity,
  Sparkles,
  BookOpen,
  Youtube,
  Play,
  Trophy,
  CheckCircle,
  Circle,
  RotateCcw,
  Flame
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface Props {
  language: Language;
}

export const OntologyAIExplorer: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const { ontologyStats, isCompleted, toggleComplete, markAllInTab } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'unlearned' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<OntologySectionItem | null>(null);
  const [activeTabVisual, setActiveTabVisual] = useState<'dual_brain' | 'palantir' | 'poc_timeline' | 'turtle_schema'>('dual_brain');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);

  const getYoutubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredSections = useMemo(() => {
    return ONTOLOGY_AGENT_SECTIONS.filter((sec) => {
      const matchCat = selectedCategory === 'all' || sec.category === selectedCategory;
      if (!matchCat) return false;

      // Completion status filter
      if (completionFilter === 'completed' && !isCompleted(sec.id)) return false;
      if (completionFilter === 'unlearned' && isCompleted(sec.id)) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sec.title.toLowerCase().includes(q) ||
        sec.fullTitle.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.badge.toLowerCase().includes(q) ||
        (sec.youtubeTitle && sec.youtubeTitle.toLowerCase().includes(q)) ||
        (sec.youtubeSummary && sec.youtubeSummary.toLowerCase().includes(q)) ||
        sec.contentMarkdown.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery, completionFilter, isCompleted]);

  const categoryBadgeColors: Record<string, string> = {
    neuro_symbolic: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60',
    kntds_c4i: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
    k_palantir: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    ontology_schema: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    mvp_spec: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
    biz_model: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    career_moat: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    poc_strategy: 'bg-teal-950/80 text-teal-300 border-teal-700/60',
    biz_plan: 'bg-violet-950/80 text-violet-300 border-violet-700/60',
    agentic_startup: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
  };

  // Sample KNTDS Turtle Schema snippet from section 9
  const turtleSchemaCode = `@prefix def: <http://defense.korea.mil/ontology/c4i#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# 1. KNTDS 수중 전술 트랙 실시간 온톨로지 인스턴스
def:Track_SUB_20261011_04 a def:TrackEntity, def:SubsurfaceTrack ;
    def:trackId "SUB-20261011-04"^^xsd:string ;
    def:iffStatus "HOSTILE" ;              # 피아식별: 적대 표적
    def:latitude 37.8921 ;
    def:longitude 128.8412 ;
    def:speedKnots 18.5 ;                  # 항주 속도 (노트)
    def:headingDegrees 195.0 ;             # 침로 (도)
    def:threatLevel "CRITICAL" ;           # 위협도: 심각
    def:sourceLink def:Link16_Net204 ;     # 데이터링크: Link-16 전술망
    def:detectedBy def:Sonar_FFG_818 ;     # 탐지 센서: 대구급 호위함 소나
    def:nearAsset def:Asset_Incheon_Base . # 인근 방어 자산

# 2. 뉴로심볼릭 교리 제약식 (Rule & Axiom)
# [교리] 적대 수중 표적이 영해 침범 및 아군 함정 20km 이내 접근 시 즉각 경보 & 대잠초계기 자율 재정찰 할당
def:Axiom_CriticalThreatRule a owl:Class ;
    owl:equivalentClass [
        a owl:Restriction ;
        owl:onProperty def:threatLevel ;
        owl:hasValue "CRITICAL"
    ] ;
    rdfs:comment "0% 환각: 온톨로지 지식 그래프 제약식을 통과한 액션만 전술 에이전트 실행 가능" .`;

  // Sample SPARQL query
  const sparqlQueryCode = `PREFIX def: <http://defense.korea.mil/ontology/c4i#>
SELECT ?trackId ?lat ?lon ?threat ?recommendedWeapon WHERE {
  ?track a def:TrackEntity ;
         def:trackId ?trackId ;
         def:latitude ?lat ;
         def:longitude ?lon ;
         def:threatLevel ?threat .
  FILTER (?threat = "CRITICAL" || ?threat = "HIGH")
  
  # 지식 그래프 연역 추론: 가장 인접한 가용 요격 무기체계 자동 바인딩
  OPTIONAL {
    ?weapon a def:WeaponSystem ;
            def:status "READY" ;
            def:coverageRangeKm ?range ;
            def:systemName ?recommendedWeapon .
  }
}
ORDER BY DESC(?threat)
LIMIT 5`;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-4 flex flex-col gap-6 text-zinc-100">
      {/* Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-600/50 shadow-sm">
                <Network className="w-3.5 h-3.5 text-indigo-400" />
                {isKo ? '국방 특화 온톨로지 AI 에이전트' : 'Defense Specialized Ontology AI Agent'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                10 Master Modules · K-Palantir Architecture
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              (온톨로지) AI Agent: 뉴로심볼릭 AI × KNTDS C4I 전술 온톨로지
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isKo 
                ? '국방 분야 30년 체계통합(SI)·데이터링크 경험을 결합하여, 단 1%의 환각(Hallucination)도 허용되지 않는 미션 크리티컬 전술 환경을 위한 "우뇌(sLLM 문맥/직관) + 좌뇌(온톨로지 엄격 논리/0% 환각 검증)" 듀얼 브레인 아키텍처와 KNTDS 연동 온톨로지 스키마, 4개월 패스트 PoC, K-팔란티어 B2G 사업화 종합 설계서입니다.'
                : 'A comprehensive engineering guide bridging 30 years of defense SI and tactical datalinks into a Neuro-symbolic Dual Brain architecture (Intuitive sLLM + Rigorous 0%-hallucination Ontology Graph), KNTDS C4I schema, 4-month fast PoC, and K-Palantir B2G commercialization.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {isKo ? '뉴로심볼릭 3세대 AI' : 'Neuro-Symbolic 3rd Wave AI'}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Anchor className="w-3 h-3 text-cyan-400" />
                {isKo ? 'KNTDS 해군전술자료처리 연동' : 'KNTDS Naval C4I Tactical Link'}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {isKo ? '0% 환각 보장 (좌뇌 검증)' : '0% Hallucination Guarantee'}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Rocket className="w-3 h-3 text-amber-400" />
                {isKo ? '4개월 단위 패스트 PoC' : '4-Month Fast PoC'}
              </span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href="https://shinbate.notion.site/AI-Agent-3f55e65cb0ec8089a879f322a07aeb89?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
            >
              <span>{isKo ? '노션 원문 상세 보기' : 'Open Notion Source'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => handleCopy('https://shinbate.notion.site/AI-Agent-3f55e65cb0ec8089a879f322a07aeb89?source=copy_link', 'notion-link')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            >
              {copiedId === 'notion-link' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isKo ? '링크 복사됨' : 'Link Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isKo ? '노션 링크 복사' : 'Copy Notion Link'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Architecture Simulator & Blueprint Showcase */}
      <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              {isKo ? '국방 온톨로지 핵심 아키텍처 & 실행 블루프린트' : 'Defense Ontology Architecture & Blueprint'}
            </h3>
          </div>

          {/* Blueprint View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTabVisual('dual_brain')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTabVisual === 'dual_brain'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isKo ? '1. 뉴로심볼릭 듀얼 브레인' : '1. Dual Brain'}</span>
            </button>
            <button
              onClick={() => setActiveTabVisual('palantir')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTabVisual === 'palantir'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{isKo ? '2. K-팔란티어 4-Layer' : '2. 4-Layer Platform'}</span>
            </button>
            <button
              onClick={() => setActiveTabVisual('poc_timeline')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTabVisual === 'poc_timeline'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>{isKo ? '3. 4개월 패스트 PoC 로드맵' : '3. 4-Month PoC'}</span>
            </button>
            <button
              onClick={() => setActiveTabVisual('turtle_schema')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTabVisual === 'turtle_schema'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>{isKo ? '4. KNTDS RDF 스키마 & SPARQL' : '4. RDF Schema & SPARQL'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Dual Brain Visualizer */}
        {activeTabVisual === 'dual_brain' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* 우뇌: Intuitive Brain (sLLM/VLM) */}
            <div className="lg:col-span-5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-zinc-900 border border-indigo-800/40 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    우뇌 (Intuitive Brain)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">sLLM / VLM (온프레미스 경량 모델)</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  비정형 데이터 문맥 파악 및 자연어 지휘 질의 생성
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  음어 첩보, 음성 명령, 감시 드론 EO/IR 비전 영상, 복합 정황 텍스트를 고속 분석하여 지휘관 질의 의도를 파악하고 초기 가설을 생성합니다.
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-indigo-900/40 text-indigo-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>비정형 전술 보고서 & 조종사 음성 실시간 요약</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-indigo-900/40 text-indigo-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>드론 EO/IR 표적 비전 탐지 (VLM 객체 식별)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-indigo-900/40 text-[11px] text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>단독 사용 시 치명적 한계: 환각(Hallucination) 및 논리 설명 불가능성</span>
              </div>
            </div>

            {/* Bridge: Verification Link */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-600/20">
                <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-extrabold text-white">
                Graph RAG & A2A 오케스트레이션
              </span>
              <p className="text-[10px] text-zinc-400 px-2 leading-tight">
                우뇌의 가설을 좌뇌 온톨로지 제약식으로 0.001초 내 엄격 검증
              </p>
            </div>

            {/* 좌뇌: Logical Brain (Ontology Knowledge Graph) */}
            <div className="lg:col-span-5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-zinc-900 border border-cyan-800/40 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    좌뇌 (Logical Brain)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">국방 온톨로지 지식 그래프 (RDF/OWL)</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  엄격한 교리 검증, 무기체계 사거리 산출 & 0% 환각 보장
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  KNTDS 전술 트랙, Link-16 메시지, 해군 교전규칙(RoE), 기상 조건, 아군 탄약 잔여량을 그래프 공리(Axioms)로 검증하여 결함 없는 대응책만 도출합니다.
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-cyan-900/40 text-cyan-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>교리(RoE) 및 영해 침범 판정 공리(Axioms) 검증</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-cyan-900/40 text-cyan-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>SPARQL 기반 무기-표적 실시간 기하학적 매칭</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-cyan-900/40 text-[11px] text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>결과: 0% 환각 전술 실행 명령 (100% 설명 가능한 인과 그래프)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: K-Palantir 4-Layer Architecture */}
        {activeTabVisual === 'palantir' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-3.5 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                  Layer 1: 물리·데이터링크
                </span>
                <h5 className="text-xs font-bold text-white mt-1.5 mb-1">
                  이종 전술 하드웨어 연동
                </h5>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  MIL-STD-1553B 버스, Link-16/Link-K, DDS 미들웨어, KNTDS 레이더·소나 트랙 스트림을 실시간 파싱.
                </p>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono mt-2">KNTDS / MIL-STD-1553B / DDS</span>
            </div>

            <div className="rounded-xl bg-zinc-900/80 border border-cyan-900/50 p-3.5 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Layer 2: 지식 그래프 온톨로지
                </span>
                <h5 className="text-xs font-bold text-cyan-200 mt-1.5 mb-1">
                  전술 온톨로지 변환 엔진
                </h5>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  수집된 이종 수치를 RDF 트리플 및 OWL 시맨틱 지식 그래프로 실시간 객체화(Track, Sensor, Weapon).
                </p>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono mt-2">RDF / OWL / Neo4j / GraphDB</span>
            </div>

            <div className="rounded-xl bg-zinc-900/80 border border-indigo-900/50 p-3.5 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  Layer 3: 에이전틱 오케스트레이션
                </span>
                <h5 className="text-xs font-bold text-indigo-200 mt-1.5 mb-1">
                  A2A 협업 및 MCP 툴 실행
                </h5>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  상황분석·위협평가·대응추천 에이전트 간 역할 분담. MCP로 드론 비행경로 재할당 및 센서 제어.
                </p>
              </div>
              <span className="text-[10px] text-purple-400 font-mono mt-2">MCP Tool Call / A2A Protocol</span>
            </div>

            <div className="rounded-xl bg-zinc-900/80 border border-emerald-900/50 p-3.5 flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Layer 4: 전술 지휘 UI / UX
                </span>
                <h5 className="text-xs font-bold text-emerald-200 mt-1.5 mb-1">
                  지휘관 상황도 (COP) & 게이트
                </h5>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  공통작전상황도(COP) 시각화, 지휘관 최종 원클릭 승인(Human-in-the-Loop) 게이트웨이 및 사후 AAR 감사.
                </p>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-2">Tactical COP / HITL Gate</span>
            </div>
          </div>
        )}

        {/* Tab 3: 4-Month Fast PoC Timeline */}
        {activeTabVisual === 'poc_timeline' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-indigo-400">Month 1</span>
                <span className="text-[10px] font-mono text-zinc-500">Day 1 ~ 30</span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1.5">
                온톨로지 스키마 정립 & 데이터 파이프라인
              </h5>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li>• KNTDS/해안 센서 표적 온톨로지(OWL) 설계</li>
                <li>• 더미 전술 트랙 & 기상 데이터 생성 파이프라인</li>
                <li>• 폐쇄망 온프레미스 서버 환경(Docker/K8s) 셋업</li>
              </ul>
            </div>

            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-cyan-400">Month 2</span>
                <span className="text-[10px] font-mono text-zinc-500">Day 31 ~ 60</span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1.5">
                이종 센서 통합 & 실시간 그래프 변환
              </h5>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li>• EO/IR 카메라 + 레이더 트랙 시맨틱 통합</li>
                <li>• 초당 500개 트랙 실시간 RDF 인스턴스화</li>
                <li>• 이종 데이터 간 동일 표적(Data Fusion) 식별</li>
              </ul>
            </div>

            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-amber-400">Month 3</span>
                <span className="text-[10px] font-mono text-zinc-500">Day 61 ~ 90</span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1.5">
                sLLM + 온톨로지 에이전트 연동 & RoE 검증
              </h5>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li>• 온프레미스 sLLM 기반 지휘 의도 분석 모듈</li>
                <li>• 해군 교전규칙(RoE) 위반 여부 자동 검증기</li>
                <li>• 경계 드론 자율 재정찰(Re-tasking) MCP 툴 연동</li>
              </ul>
            </div>

            <div className="rounded-xl bg-zinc-900 border border-emerald-800/40 bg-emerald-950/20 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-emerald-400">Month 4</span>
                <span className="text-[10px] font-mono text-emerald-300">Day 91 ~ 120</span>
              </div>
              <h5 className="text-xs font-bold text-white mb-1.5">
                모의 전술 시연 & 지휘관 PoC 최종 평가
              </h5>
              <ul className="text-[11px] text-zinc-300 space-y-1">
                <li>• 가상 동해/서해 침투 시나리오 실시간 모의 훈련</li>
                <li>• 지휘관 대시보드(COP) 원클릭 승인 시연</li>
                <li>• 국방부/방사청 대상 3~5억 규모 본사업 제안</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Turtle Schema & SPARQL Code Viewer */}
        {activeTabVisual === 'turtle_schema' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    KNTDS 전술 트랙 Turtle (RDF/OWL) 스키마 코드
                  </span>
                  <button
                    onClick={() => handleCopy(turtleSchemaCode, 'turtle-code')}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-[10px] flex items-center gap-1"
                  >
                    {copiedId === 'turtle-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'turtle-code' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-zinc-950 text-indigo-200 font-mono text-[11px] overflow-x-auto max-h-56 leading-snug border border-indigo-950">
                  {turtleSchemaCode}
                </pre>
              </div>
              <span className="text-[10px] text-zinc-500 mt-2">
                * W3C RDF/OWL 표준 기반으로 팔란티어 온톨로지 및 군사 교리 지식베이스와 100% 호환
              </span>
            </div>

            <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    위협 표적 실시간 SPARQL 지식 질의문
                  </span>
                  <button
                    onClick={() => handleCopy(sparqlQueryCode, 'sparql-code')}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-[10px] flex items-center gap-1"
                  >
                    {copiedId === 'sparql-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'sparql-code' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-zinc-950 text-cyan-200 font-mono text-[11px] overflow-x-auto max-h-56 leading-snug border border-cyan-950">
                  {sparqlQueryCode}
                </pre>
              </div>
              <span className="text-[10px] text-zinc-500 mt-2">
                * 위협 표적 감지 즉시 사거리 내 가용 요격 무기체계를 그래프 추론으로 5ms 내 매칭
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Learning Progress Mastery Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-950 border border-indigo-800/40 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-indigo-400" />
                {isKo ? '온톨로지 AI 탐색기 학습 달성도' : 'Ontology AI Learning Mastery'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-bold">
                {ontologyStats.percent}% {isKo ? '완료' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-black text-white font-mono">
                {ontologyStats.completed} <span className="text-sm font-normal text-zinc-400">/ {ontologyStats.total} {isKo ? '모듈' : 'modules'}</span>
              </div>
              <span className="text-xs text-zinc-400">
                {ontologyStats.percent === 100
                  ? (isKo ? '🎉 10개 전 과정 온톨로지 마스터 완료!' : '🎉 All 10 ontology modules mastered!')
                  : (isKo ? `남은 ${ontologyStats.total - ontologyStats.completed}개 모듈을 학습하여 3세대 뉴로심볼릭 온톨로지를 정복하세요.` : `${ontologyStats.total - ontologyStats.completed} modules left to complete.`)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${ontologyStats.percent}%` }}
              />
            </div>
          </div>

          {/* Quick Learning Status Filter & Batch Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setCompletionFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'all'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? '전체 (10)' : 'All (10)'}
              </button>
              <button
                onClick={() => setCompletionFilter('unlearned')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'unlearned'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `미학습 (${ontologyStats.total - ontologyStats.completed})` : `Unlearned (${ontologyStats.total - ontologyStats.completed})`}
              </button>
              <button
                onClick={() => setCompletionFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'completed'
                    ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `완료됨 (${ontologyStats.completed})` : `Learned (${ontologyStats.completed})`}
              </button>
            </div>

            <button
              onClick={() => markAllInTab('ontology', ontologyStats.completed < ontologyStats.total)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            >
              {ontologyStats.completed < ontologyStats.total
                ? (isKo ? '전체 완료 체크' : 'Mark all done')
                : (isKo ? '진도 초기화' : 'Reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs scrollbar-thin">
          {ONTOLOGY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {isKo ? cat.labelKo : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:w-72 shrink-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKo ? '모듈명, KNTDS, 온톨로지, PoC 검색...' : 'Search modules, KNTDS, schema...'}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of 10 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            onClick={() => {
              setActiveItem(sec);
              setShowVideoPlayer(false);
            }}
            className={`group relative rounded-xl bg-zinc-950/70 border ${
              isCompleted(sec.id)
                ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/20'
                : 'border-zinc-800/80 hover:border-indigo-600/60'
            } p-5 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-600/10 cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center">
                    {sec.index}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${categoryBadgeColors[sec.category] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    {sec.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(sec.id);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition border cursor-pointer ${
                      isCompleted(sec.id)
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-600/60 shadow-sm shadow-indigo-500/20'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
                    }`}
                    title={
                      isCompleted(sec.id)
                        ? (isKo ? '학습 완료됨 (클릭하여 취소)' : 'Completed (click to undo)')
                        : (isKo ? '학습 완료로 표시' : 'Mark as learned')
                    }
                  >
                    {isCompleted(sec.id) ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-indigo-400" />
                        <span>{isKo ? '학습 완료' : 'Learned'}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3 h-3 text-zinc-500" />
                        <span>{isKo ? '학습 전' : 'To Learn'}</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {isKo ? sec.categoryKo : sec.categoryEn}
                  </span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2 mb-2">
                {sec.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-3">
                {sec.summary}
              </p>

              {/* Curated YouTube Video Teaser */}
              {sec.youtubeUrl && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-950/25 hover:bg-red-950/40 border border-red-900/35 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400">
                      <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{isKo ? '추천 학습 영상' : 'Curated Video'}</span>
                    </span>
                    <a
                      href={sec.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-300 hover:text-white"
                    >
                      <span>{isKo ? 'YouTube 열기' : 'Watch'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="text-[11px] font-semibold text-zinc-200 line-clamp-1">
                    {sec.youtubeTitle}
                  </div>
                  <div className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                    {sec.youtubeSummary}
                  </div>
                </div>
              )}

              {/* Key points preview pills */}
              <div className="space-y-1.5 mb-3">
                {sec.keyPoints.slice(0, 3).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium group-hover:text-indigo-300">
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <BookOpen className="w-3.5 h-3.5" />
                {sec.contentMarkdown.length.toLocaleString()}자 상세 명세서
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>{isKo ? '상세 명세서 열기' : 'View Full Document'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="p-12 text-center text-zinc-500 rounded-xl bg-zinc-950 border border-zinc-800">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
          <p className="text-sm font-medium">{isKo ? '검색 결과가 없습니다.' : 'No modules found.'}</p>
          <p className="text-xs mt-1">{isKo ? '다른 검색어나 필터를 선택해 보세요.' : 'Try adjusting your search query or category filter.'}</p>
        </div>
      )}

      {/* Full Module Inspector Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/60 shrink-0">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-zinc-800 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                    {activeItem.index}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${categoryBadgeColors[activeItem.category] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    {activeItem.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {isKo ? activeItem.categoryKo : activeItem.categoryEn}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {activeItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleComplete(activeItem.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                    isCompleted(activeItem.id)
                      ? 'bg-indigo-950/90 text-indigo-300 border-indigo-600/70 shadow-sm shadow-indigo-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  }`}
                  title={isCompleted(activeItem.id) ? (isKo ? '학습 완료됨 (클릭하여 취소)' : 'Mark as unlearned') : (isKo ? '학습 완료로 표시' : 'Mark as completed')}
                >
                  {isCompleted(activeItem.id) ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isKo ? '학습 완료됨 ✓' : 'Completed ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{isKo ? '학습 완료 체크' : 'Mark Completed'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCopy(activeItem.contentMarkdown, `modal-${activeItem.id}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  {copiedId === `modal-${activeItem.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isKo ? '복사됨' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isKo ? '마크다운 복사' : 'Copy'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveItem(null);
                    setShowVideoPlayer(false);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Render Formatted Notion Markdown */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200">
                <h5 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  {isKo ? '모듈 핵심 요약' : 'Executive Summary'}
                </h5>
                <p className="text-xs leading-relaxed text-zinc-300">
                  {activeItem.summary}
                </p>
              </div>

              {/* Curated YouTube Deep Learning Section */}
              {activeItem.youtubeUrl && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-zinc-950 border border-red-800/50 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block">
                          {isKo ? '항목별 추천 유튜브 심층 강의' : 'Curated YouTube Lecture'}
                        </span>
                        <h5 className="text-sm font-bold text-white leading-tight">
                          {activeItem.youtubeTitle}
                        </h5>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowVideoPlayer(!showVideoPlayer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-red-400" />
                        <span>{showVideoPlayer ? (isKo ? '영상 닫기' : 'Hide Player') : (isKo ? '영상 바로보기' : 'Play Video')}</span>
                      </button>
                      <a
                        href={activeItem.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
                      >
                        <span>{isKo ? 'YouTube에서 열기' : 'Open YouTube'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Embedded Player if toggled */}
                  {showVideoPlayer && (
                    <div className="mb-3 rounded-xl overflow-hidden aspect-video bg-black border border-red-900/60 shadow-2xl">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(activeItem.youtubeUrl)}?autoplay=1`}
                        title={activeItem.youtubeTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}

                  {/* YouTube Summary */}
                  <div className="bg-black/50 rounded-xl p-3 border border-red-950/60 text-xs text-zinc-300 leading-relaxed">
                    <span className="text-red-400 font-semibold mr-1.5">{isKo ? '강의 요약 및 학습 포인트:' : 'Lecture Summary & Key Concepts:'}</span>
                    {activeItem.youtubeSummary}
                  </div>
                </div>
              )}

              {/* Formatted Content Body */}
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 selection:bg-indigo-500 selection:text-white">
                {activeItem.contentMarkdown}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
              <span className="text-[11px]">
                출처: Notion AI Agent Knowledge Base · (온톨로지) AI Agent
              </span>
              <button
                onClick={() => {
                  setActiveItem(null);
                  setShowVideoPlayer(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer"
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
