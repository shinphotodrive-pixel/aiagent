import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { 
  KIM_DAESHIK_SECTIONS, 
  KIM_DAESHIK_CATEGORIES, 
  KimDaeShikSectionItem 
} from '../data/kimDaeShikData';
import { 
  GraduationCap, 
  Cpu, 
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
  X, 
  CheckCircle2, 
  GitBranch, 
  Activity, 
  Sparkles, 
  BookOpen, 
  Youtube, 
  Play, 
  Network, 
  Flame, 
  Brain, 
  Users, 
  Clock, 
  Key,
  Trophy,
  CheckCircle,
  Circle,
  RotateCcw
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface Props {
  language: Language;
}

export const KimDaeShikExplorer: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const { kimdaeshikStats, isCompleted, toggleComplete, markAllInTab } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'unlearned' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<KimDaeShikSectionItem | null>(null);
  const [activeTabVisual, setActiveTabVisual] = useState<'architecture' | 'virtual_org' | 'poc_roadmap' | 'philosophy'>('architecture');
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
    return KIM_DAESHIK_SECTIONS.filter((sec) => {
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
    startup_strategy: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    physical_ai: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    orchestrator_arch: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    safety_infrastructure: 'bg-red-950/80 text-red-300 border-red-700/60',
    poc_proposal: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    prototyping_roadmap: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
    agent_boss: 'bg-orange-950/80 text-orange-300 border-orange-700/60',
    academic_insights: 'bg-pink-950/80 text-pink-300 border-pink-700/60',
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-purple-950/30 to-zinc-900 border border-purple-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/60 shadow-inner">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>KAIST 김대식 교수 인공지능 통찰</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>30년 국방 시스템 엔지니어링 융합</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>단일 자원 100배 전력 증폭</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {isKo ? '김대식 교수 AI 인사이트 & 방산 피지컬 AI 오케스트레이터' : 'Prof. Kim Dae-shik AI Insights & Defense Physical AI'}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              {isKo 
                ? '단순 텍스트 생성을 넘어 현실 세계의 장비와 무인 플랫폼을 자율 제어하는 피지컬 AI(Physical AI)와 에이전틱 오케스트레이션. 30년간 축적된 전술 데이터링크 규격 지식과 현장 액션 데이터(Action Data)를 독점적 해자로 구축하는 6개월 PoC 제안서 및 1인 창업 전략입니다.'
                : 'Physical AI and Agentic Orchestration beyond LLMs. Transforming 30-year defense tactical data link expertise into proprietary Action Data moats.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-400">시스템 계층</div>
                  <div className="text-xs font-bold text-white">4-Layer Architecture</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-400">1인 창업 모델</div>
                  <div className="text-xs font-bold text-white">Agent Boss Fleet (4팀)</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-400">안전성 신뢰도</div>
                  <div className="text-xs font-bold text-white">0% 환각 (Safety Gate)</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-400">PoC 추진 로드맵</div>
                  <div className="text-xs font-bold text-white">6-Month & 5 Sprints</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Box: Notion Source Link */}
          <div className="flex flex-col gap-2 shrink-0 lg:w-72 bg-zinc-900/90 border border-purple-800/40 rounded-xl p-4 shadow-xl">
            <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider font-semibold">
              Source Reference
            </span>
            <div className="text-xs font-bold text-white">
              Notion: (AI) 김대식 교수
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              신바테 노션 지식베이스 정밀 동기화 완료 (35,600자 전문 수록)
            </p>
            <a
              href="https://shinbate.notion.site/AI-3f55e65cb0ec807cac21e6d39b237a16"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/30"
            >
              <span>{isKo ? '원본 노션 페이지 열기' : 'Open Notion Page'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Visual Explorer Tab Section */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800/90 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              {isKo ? '김대식 교수 핵심 프레임워크 인터랙티브 비주얼라이저' : 'Interactive Framework Visualizer'}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTabVisual('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabVisual === 'architecture'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              4계층 아키텍처
            </button>
            <button
              onClick={() => setActiveTabVisual('virtual_org')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabVisual === 'virtual_org'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              에이전트 보스 가상조직도
            </button>
            <button
              onClick={() => setActiveTabVisual('poc_roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabVisual === 'poc_roadmap'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              6개월 PoC & 5개 스프린트
            </button>
            <button
              onClick={() => setActiveTabVisual('philosophy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabVisual === 'philosophy'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              뇌과학 AI 철학 & 저서
            </button>
          </div>
        </div>

        {/* Tab 1: 4-Layer Architecture Diagram */}
        {activeTabVisual === 'architecture' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-zinc-900/80 border border-purple-900/50 p-4 flex flex-col justify-between hover:border-purple-600 transition">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/40">
                    Layer 1: 지휘통제 및 관제
                  </span>
                  <h4 className="text-xs font-bold text-purple-200 mt-2 mb-1">
                    C4I 연동 & 하드웨어 킬 스위치
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    상위 지휘통제 시스템 전술 명령 수신, Human-in-the-Loop 원클릭 승인 통제권, 소프트웨어와 완전 분리된 독립 물리 전원 차단 회로.
                  </p>
                </div>
                <span className="text-[10px] text-purple-400 font-mono mt-3">Tactical COP / Hardware Interlock</span>
              </div>

              <div className="rounded-xl bg-zinc-900/80 border border-red-900/50 p-4 flex flex-col justify-between hover:border-red-600 transition">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800/40">
                    Layer 2: 결정론적 안전 가드레일
                  </span>
                  <h4 className="text-xs font-bold text-red-200 mt-2 mb-1">
                    Deterministic Safety Gate
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    비-AI 룰 엔진(C++/Rust) 샌드박스. 최대 속도·선회각·지오펜싱·교전수칙(ROE) 한계선을 강제 검증하여 AI 환각·기만 0% 원천 차단.
                  </p>
                </div>
                <span className="text-[10px] text-red-400 font-mono mt-3">Non-AI Sandbox / ROE Filter</span>
              </div>

              <div className="rounded-xl bg-zinc-900/80 border border-blue-900/50 p-4 flex flex-col justify-between hover:border-blue-600 transition">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800/40">
                    Layer 3: 지휘자 에이전트 & A2A
                  </span>
                  <h4 className="text-xs font-bold text-blue-200 mt-2 mb-1">
                    Master Orchestrator
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    다종 에이전트 통신 버스(A2A), 선후관계 꼬임 방지 필요/충분조건 제어 엔진, DDIL(전자기 재밍/통신단절) 대응 로컬 분산 자율성.
                  </p>
                </div>
                <span className="text-[10px] text-blue-400 font-mono mt-3">A2A Bus / DAG Scheduler</span>
              </div>

              <div className="rounded-xl bg-zinc-900/80 border border-emerald-900/50 p-4 flex flex-col justify-between hover:border-emerald-600 transition">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    Layer 4: 스마트 래퍼 & 엣지 자산
                  </span>
                  <h4 className="text-xs font-bold text-emerald-200 mt-2 mb-1">
                    Link-16/VMF ↔ MCP Wrapper
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Link-16, VMF, CoT 등 군용 전술 데이터링크와 레거시 시리얼/CAN 신호를 AI 표준 JSON/gRPC로 실시간 변환. UAV/UGV 엣지 직접 제어.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-3">gRPC / MCP Tool Protocol</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>💡 상위 명령 하달 흐름: Layer 1 (C4I 승인) → Layer 2 (안전 가드레일 통과) → Layer 3 (A2A 임무 스케줄링) → Layer 4 (스마트 래퍼 물리 제어)</span>
              <span className="text-purple-400 font-mono font-bold shrink-0 ml-2">Latency &lt; 15ms</span>
            </div>
          </div>
        )}

        {/* Tab 2: Agent Boss Virtual Organization */}
        {activeTabVisual === 'virtual_org' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-zinc-900 border border-purple-800/50 text-center">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-purple-900/80 text-purple-200 border border-purple-700/60 font-bold">
                COMMANDER IN CHIEF
              </span>
              <h4 className="text-sm font-extrabold text-white mt-1.5">
                창업자 (Agent Boss) · 30년 차 국방 시스템 엔지니어
              </h4>
              <p className="text-xs text-zinc-300 max-w-xl mx-auto mt-1">
                직접 코딩하고 문서 쓰는 실무자가 아닌, 4대 가상 AI 에이전트 팀에게 미션을 부여하고 최종 승인(Sign-off)하는 지휘관
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Team 1</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">아키텍트</span>
                </div>
                <h5 className="text-xs font-bold text-white">가상 표준규격 분석 에이전트</h5>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• STANAG, MIL-STD, CoT 분석</li>
                  <li>• 군용 규격서 ↔ MCP 스키마 도출</li>
                  <li>• 고수준 시스템 인터페이스 설계</li>
                </ul>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Team 2</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">개발팀</span>
                </div>
                <h5 className="text-xs font-bold text-white">가상 바이브 코더 (Vibe Coder)</h5>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• FastAPI / Python 기반 CoT 파서</li>
                  <li>• gRPC / Redis A2A 통신 버스 구현</li>
                  <li>• ROS2 / Gazebo 가상 플랫폼 연동</li>
                </ul>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400">Team 3</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">QA 검증</span>
                </div>
                <h5 className="text-xs font-bold text-white">가상 가드레일 검증 에이전트</h5>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• 1,000회 모의 환각 및 부정명령 주입</li>
                  <li>• 지오펜스 이탈 100% 차단 시험</li>
                  <li>• 국방 안전성 검증 성적서 생성</li>
                </ul>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Team 4</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">사업기획</span>
                </div>
                <h5 className="text-xs font-bold text-white">가상 제안서 분석가 (B2G BM)</h5>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• 방위사업청 / 팁스(TIPS) 제안서 작성</li>
                  <li>• 평가위원 브리핑 슬라이드 덱 구조화</li>
                  <li>• 한화/KAI/LIG넥스원 미팅 아젠다 수립</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 6-Month PoC & 5 Sprints */}
        {activeTabVisual === 'poc_roadmap' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-xs font-extrabold text-purple-400 block mb-1">Sprint 1 (1~2주)</span>
                <h5 className="text-xs font-bold text-white mb-1.5">스마트 래퍼 개발</h5>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  CoT/VMF 패킷 파서 및 레거시 시리얼 더미 소켓 연동, MCP 도구 규격 정의.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-xs font-extrabold text-blue-400 block mb-1">Sprint 2 (3~4주)</span>
                <h5 className="text-xs font-bold text-white mb-1.5">A2A 통신 버스 구축</h5>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  Redis/gRPC 기반 이벤트 버스, 가상 UAV/UGV 노드 등록 및 위치·경로 제어 도구 연동.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-xs font-extrabold text-red-400 block mb-1">Sprint 3 (5~6주)</span>
                <h5 className="text-xs font-bold text-white mb-1.5">결정론적 안전게이트</h5>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  비-AI 룰 엔진 샌드박스, 지오펜스 및 물리 한계 검증, 모의 환각 100% 차단 테스트.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-xs font-extrabold text-cyan-400 block mb-1">Sprint 4 (7~9주)</span>
                <h5 className="text-xs font-bold text-white mb-1.5">지휘자 에이전트 스케줄링</h5>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  LangGraph 필요/충분조건 미션 스케줄러, DDIL 통신 단절 대응 분산 자율성 검증.
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-xs font-extrabold text-emerald-400 block mb-1">Sprint 5 (10~12주)</span>
                <h5 className="text-xs font-bold text-white mb-1.5">통합 시연 데모 패키징</h5>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  웹 기반 전술상황도(COP) 구축, 3분 시연 영상 및 방산 대기업/팁스 제안서 완성.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">변환 지연시간</span>
                <span className="text-xs font-bold text-emerald-400">&lt; 15ms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">오케스트레이션 성공률</span>
                <span className="text-xs font-bold text-emerald-400">&gt; 98%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">부정명령 차단율</span>
                <span className="text-xs font-bold text-red-400">100% (0건 허용)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-400 block">PoC 시연 준비</span>
                <span className="text-xs font-bold text-purple-400">3분 데모 완성</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Kim Dae-shik Philosophy & Books */}
        {activeTabVisual === 'philosophy' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-pink-400">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">뇌과학자의 AI 문명관</span>
                </div>
                <h5 className="text-xs font-bold text-white">"AI는 팔과 다리를 얻기 시작했다"</h5>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  인간의 뇌에서 언어(대뇌피질)보다 운동 제어(소뇌)가 먼저 진화했듯이, AI도 챗봇을 지나 물리적 세계를 탐색하고 장비를 제어하는 피지컬 AI로 이동하고 있습니다. 인터넷에 없는 현장 제어 신호와 코너 케이스를 가진 엔지니어가 최고의 자본가가 됩니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">김대식 교수 대표 저서 4선</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                  <div className="p-2 rounded bg-black/50 border border-zinc-800">
                    <span className="font-bold text-white block">《인공지능이란 무엇인가》</span>
                    <span className="text-zinc-400 text-[10px]">기계 지능의 기원과 한계</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-zinc-800">
                    <span className="font-bold text-white block">《챗GPT에게 묻는 인류미래》</span>
                    <span className="text-zinc-400 text-[10px]">문명과 지식의 대전환</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-zinc-800">
                    <span className="font-bold text-white block">《메타버스 사피엔스》</span>
                    <span className="text-zinc-400 text-[10px]">물리와 가상의 결합</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-zinc-800">
                    <span className="font-bold text-white block">《AI 에이전트 혁명》</span>
                    <span className="text-zinc-400 text-[10px]">1인 대기업과 자율 지능</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Progress Mastery Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-950 border border-purple-800/40 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-purple-400" />
                {isKo ? '김대식 교수 피지컬 AI 탐색기 학습 달성도' : 'Prof. Kim Physical AI Learning Mastery'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-bold">
                {kimdaeshikStats.percent}% {isKo ? '완료' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-black text-white font-mono">
                {kimdaeshikStats.completed} <span className="text-sm font-normal text-zinc-400">/ {kimdaeshikStats.total} {isKo ? '모듈' : 'modules'}</span>
              </div>
              <span className="text-xs text-zinc-400">
                {kimdaeshikStats.percent === 100
                  ? (isKo ? '🎉 8개 전 과정 피지컬 AI 마스터 완료!' : '🎉 All 8 physical AI modules mastered!')
                  : (isKo ? `남은 ${kimdaeshikStats.total - kimdaeshikStats.completed}개 모듈을 학습하여 행동하는 피지컬 AI를 정복하세요.` : `${kimdaeshikStats.total - kimdaeshikStats.completed} modules left to complete.`)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500"
                style={{ width: `${kimdaeshikStats.percent}%` }}
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
                {isKo ? '전체 (8)' : 'All (8)'}
              </button>
              <button
                onClick={() => setCompletionFilter('unlearned')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'unlearned'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `미학습 (${kimdaeshikStats.total - kimdaeshikStats.completed})` : `Unlearned (${kimdaeshikStats.total - kimdaeshikStats.completed})`}
              </button>
              <button
                onClick={() => setCompletionFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'completed'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `완료됨 (${kimdaeshikStats.completed})` : `Learned (${kimdaeshikStats.completed})`}
              </button>
            </div>

            <button
              onClick={() => markAllInTab('kimdaeshik', kimdaeshikStats.completed < kimdaeshikStats.total)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            >
              {kimdaeshikStats.completed < kimdaeshikStats.total
                ? (isKo ? '전체 완료 체크' : 'Mark all done')
                : (isKo ? '진도 초기화' : 'Reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {KIM_DAESHIK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
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
            placeholder={isKo ? '김대식 교수, 피지컬 AI, PoC 검색...' : 'Search modules, PoC, Physical AI...'}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
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

      {/* Grid of 8 Master Modules */}
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
                ? 'border-purple-500/60 shadow-lg shadow-purple-950/20'
                : 'border-zinc-800/80 hover:border-purple-600/60'
            } p-5 transition-all duration-200 hover:shadow-xl hover:shadow-purple-600/10 cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
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
                        ? 'bg-purple-950/80 text-purple-300 border-purple-600/60 shadow-sm shadow-purple-500/20'
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
                        <CheckCircle className="w-3 h-3 text-purple-400" />
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

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug line-clamp-2 mb-2">
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
                    <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-purple-400 font-medium group-hover:text-purple-300">
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
          <p className="text-xs mt-1">{isKo ? '다른 검색어나 카테고리 필터를 선택해 보세요.' : 'Try adjusting your search query or category filter.'}</p>
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
                  <span className="w-6 h-6 rounded-md bg-zinc-800 text-purple-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
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
                      ? 'bg-purple-950/90 text-purple-300 border-purple-600/70 shadow-sm shadow-purple-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  }`}
                  title={isCompleted(activeItem.id) ? (isKo ? '학습 완료됨 (클릭하여 취소)' : 'Mark as unlearned') : (isKo ? '학습 완료로 표시' : 'Mark as completed')}
                >
                  {isCompleted(activeItem.id) ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
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
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
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
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200">
                <h5 className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
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
                          {isKo ? '추천 유튜브 특강 & 학술 인사이트' : 'Curated YouTube Lecture'}
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
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 selection:bg-purple-500 selection:text-white">
                {activeItem.contentMarkdown}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
              <span className="text-[11px]">
                출처: Notion Knowledge Base · (AI) 김대식 교수
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
