import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { 
  DEFENSE_AGENT_SECTIONS, 
  DEFENSE_CATEGORIES, 
  DefenseSectionItem 
} from '../data/defenseAgentData';
import { 
  Crosshair, 
  ShieldAlert, 
  Database, 
  Users, 
  Cpu, 
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
  AlertTriangle,
  Youtube,
  Play,
  Trophy,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface Props {
  language: Language;
}

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
  return match ? match[1] : '';
};

export const DefenseAIExplorer: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const { defenseStats, isCompleted, toggleComplete, markAllInTab } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'unlearned' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<DefenseSectionItem | null>(null);
  const [activeBlueprint, setActiveBlueprint] = useState<'mcp' | 'approval' | 'db' | 'fleet'>('mcp');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredSections = useMemo(() => {
    return DEFENSE_AGENT_SECTIONS.filter((sec) => {
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
    career_vision: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    startup_strategy: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    mcp_architecture: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    approval_gate: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
    db_schema: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
    solopreneur_fleet: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-4 flex flex-col gap-6 text-zinc-100">
      {/* Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-600/50 shadow-sm">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                {isKo ? '국방 AI 에이전트 마스터 가이드' : 'Defense AI Agent Master Guide'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                24 Modules · Complete Knowledge
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              (국방) Agent: 30년 시스템 엔지니어링 × MCP 에이전트 아키텍처
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isKo 
                ? '국방 분야 30년의 소프트웨어·하드웨어 개발, 시스템 통합, 데이터링크(MIL-STD-1553B, Link-16, DDS) 경력을 AI 에이전트 시대의 대체 불가능한 핵심 자산으로 결합한 국방 장비 MCP 연동 규격, 다층 보안 승인 게이트(Approval Gate), 하이브리드 DB 스키마 및 1인 대기업(Solo-preneur) 에이전트 사단 운영 체계입니다.'
                : 'Combining 30 years of defense system engineering, hardware/software integration, and datalinks (MIL-STD-1553B, Link-16, DDS) with modern MCP agent architectures, multi-layered Approval Gates, hybrid DB schemas, and Solo-preneur agent fleets.'}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 font-medium">핵심 엔지니어링 모듈</div>
                <div className="text-lg font-bold text-white mt-0.5">24개 전과정</div>
                <div className="text-[10px] text-emerald-400">Notion 원문 100% 수록</div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 font-medium">국방 장비 MCP 표준</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5">1553B / Link-16</div>
                <div className="text-[10px] text-zinc-400">DDS & 6단계 프로세스</div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 font-medium">안전 승인 게이트</div>
                <div className="text-lg font-bold text-rose-300 mt-0.5">Approval Gate</div>
                <div className="text-[10px] text-zinc-400">HMAC 서명 & 15분 TTL</div>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3">
                <div className="text-[11px] text-zinc-400 font-medium">1인 창업 에이전트 사단</div>
                <div className="text-lg font-bold text-purple-300 mt-0.5">Solo-preneur</div>
                <div className="text-[10px] text-zinc-400">CTO/CFO MCP 툴콜 명세</div>
              </div>
            </div>
          </div>

          {/* Original Link Button & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="https://shinbate.notion.site/Agent-3ca5e65cb0ec80088e9de1f77f471502"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-400/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isKo ? 'Notion 원문 페이지 바로가기' : 'Open Notion Source Page'}</span>
            </a>
            <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800 text-xs text-zinc-400">
              <span className="text-zinc-200 font-semibold block mb-1">🔗 공유 링크</span>
              <span className="font-mono text-[11px] text-zinc-400 break-all select-all">
                shinbate.notion.site/Agent-3ca5e65cb0...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Blueprint Switcher */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              {isKo ? '국방 AI 4대 핵심 아키텍처 다이어그램' : 'Defense AI 4 Core Architecture Blueprints'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isKo 
                ? '장비 연동 MCP 파이프라인, 승인 게이트, 하이브리드 DB, 1인 대기업 조직도를 시각적으로 탐색하세요.'
                : 'Explore interactive system blueprints across MCP, Approval Gate, DB Schema, and Agent Fleet.'}
            </p>
          </div>

          {/* Blueprint Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 overflow-x-auto">
            <button
              onClick={() => setActiveBlueprint('mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeBlueprint === 'mcp'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. 장비 MCP 연동 6단계
            </button>
            <button
              onClick={() => setActiveBlueprint('approval')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeBlueprint === 'approval'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Approval Gate 파이프라인
            </button>
            <button
              onClick={() => setActiveBlueprint('db')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeBlueprint === 'db'
                  ? 'bg-cyan-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. 하이브리드 DB 4계층
            </button>
            <button
              onClick={() => setActiveBlueprint('fleet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeBlueprint === 'fleet'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              4. 1인 대기업 사단 포메이션
            </button>
          </div>
        </div>

        {/* Blueprint Visual Rendering */}
        {activeBlueprint === 'mcp' && (
          <div className="bg-black/70 rounded-xl p-5 border border-zinc-800/80">
            <div className="text-xs text-amber-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              국방 장비 MCP 6단계 엔지니어링 흐름 (물리 장비 → 프로토콜 어댑터 → MCP 서버 → 승인 게이트 → AI 관제)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { step: 'Step 1', title: '장비 인터페이스 추상화', desc: 'MIL-STD-1553B / Link-16 / DDS 패킷을 JSON/REST 표준 드라이버로 변환', color: 'border-blue-500/50' },
                { step: 'Step 2', title: 'MCP 툴콜 표준 명세', desc: 'get_equipment_telemetry, parse_datalink_packet 등 JSON Schema 엄격 정의', color: 'border-cyan-500/50' },
                { step: 'Step 3', title: '격리 샌드박스 실행', desc: '도커 컨테이너 & gVisor 기반 네트워크 단방향 다이오드 환경 격리', color: 'border-amber-500/50' },
                { step: 'Step 4', title: 'Approval Gate 인터셉트', desc: '고위험 장비 조작 명령 감지 시 자동 PENDING 및 HMAC 서명 대기', color: 'border-rose-500/50' },
                { step: 'Step 5', title: '장비 제어 집행 & 모니터링', desc: '승인 토큰(TTL 15분) 검증 후 실제 통신 버스로 안전한 물리적 집행', color: 'border-emerald-500/50' },
                { step: 'Step 6', title: '불변 감사 추적(Audit)', desc: '호출자, 인자, 타임스탬프, 물리 응답 결과를 불변 DB 테이블에 영구 기록', color: 'border-purple-500/50' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl bg-zinc-900/90 border ${item.color} flex flex-col justify-between`}>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400">{item.step}</div>
                    <div className="text-xs font-bold text-white mt-1">{item.title}</div>
                    <p className="text-[11px] text-zinc-300 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBlueprint === 'approval' && (
          <div className="bg-black/70 rounded-xl p-5 border border-zinc-800/80">
            <div className="text-xs text-rose-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              승인 게이트(Approval Gate) 파이프라인: "명령 생성"과 "물리적 집행"의 엄격한 분리
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-rose-900/50">
                <div className="text-[11px] font-mono text-rose-400 font-semibold">1. 고위험 툴콜 감지</div>
                <h4 className="text-xs font-bold text-white mt-1">execute_device_control</h4>
                <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                  에이전트가 무기체계 조작 또는 1,000만 원 이상 예산 집행 툴콜 호출 시 위험도 점수(0~100)를 산출하고 즉시 인터셉트합니다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-amber-900/50">
                <div className="text-[11px] font-mono text-amber-400 font-semibold">2. PENDING 티켓 생성</div>
                <h4 className="text-xs font-bold text-white mt-1">agent_tickets & approval_gates</h4>
                <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                  상태를 `PENDING`으로 격리하고, 관제 대시보드 및 담당관(Human Operator) 모바일로 실시간 승인 요청 푸시를 발송합니다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-900/50">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">3. HMAC 서명 및 TTL 검증</div>
                <h4 className="text-xs font-bold text-white mt-1">HMAC-SHA256 Token</h4>
                <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                  사람 운용자가 승인 시 15분 만료시간(TTL)을 가진 암호화 토큰이 발행되며, 유효기간 내에만 게이트 통과를 허용합니다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-purple-900/50">
                <div className="text-[11px] font-mono text-purple-400 font-semibold">4. 집행 및 불변 감사 기록</div>
                <h4 className="text-xs font-bold text-white mt-1">Immutable Audit Trail</h4>
                <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                  장비 실행 결과를 수신하여 최종 티켓을 `COMPLETED`로 마감하고, 위변조 방지 감사 로그에 영구 저장합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeBlueprint === 'db' && (
          <div className="bg-black/70 rounded-xl p-5 border border-zinc-800/80">
            <div className="text-xs text-cyan-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              국방 에이전트 DB 스키마 4대 계층 (정형 규격 + 시계열 텔레메트리 + pgvector 시멘틱 + 감사 추적)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-cyan-800/60">
                <div className="text-[11px] text-cyan-400 font-bold mb-1">1. 장비 & ICD 규격 레이어</div>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• equipments (장비 마스터)</li>
                  <li>• icd_specifications (1553B/Link-16/DDS)</li>
                  <li>• device_signals (수신 신호/패킷 로그)</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-blue-800/60">
                <div className="text-[11px] text-blue-400 font-bold mb-1">2. 텔레메트리 & 시계열 레이어</div>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• telemetry_logs (초당 수천 건 센서 데이터)</li>
                  <li>• TimescaleDB 하이퍼테이블 파티셔닝</li>
                  <li>• 30일 압축 & 실시간 이상치 탐지</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-emerald-800/60">
                <div className="text-[11px] text-emerald-400 font-bold mb-1">3. 지식 & 시멘틱 메모리 레이어</div>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• sop_documents (야전 교범/정비 가이드)</li>
                  <li>• sop_embeddings (pgvector HNSW 색인)</li>
                  <li>• agent_memories (장기 세션 기억/대화)</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-rose-800/60">
                <div className="text-[11px] text-rose-400 font-bold mb-1">4. 에이전트 관제 & 감사 레이어</div>
                <ul className="text-[11px] text-zinc-300 space-y-1">
                  <li>• agent_tickets (장비 장애/작전 티켓)</li>
                  <li>• approval_gates (고위험 명령 승인 게이트)</li>
                  <li>• audit_logs (불변 감사 로그)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeBlueprint === 'fleet' && (
          <div className="bg-black/70 rounded-xl p-5 border border-zinc-800/80">
            <div className="text-xs text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              1인 대기업(Solo-preneur) AI 에이전트 사단 조직도 & 거버넌스 체계
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-600/60 md:col-span-1 flex flex-col justify-center text-center">
                <span className="text-[10px] uppercase font-mono text-purple-300">Human Leader</span>
                <h4 className="text-sm font-bold text-white mt-1">1인 창업자 (Chairman)</h4>
                <p className="text-[10px] text-zinc-300 mt-1">비전 수립, 최종 승인 게이트, 핵심 안건 결재</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-mono text-blue-400 font-semibold">CTO Agent</div>
                <h4 className="text-xs font-bold text-white mt-1">기술 & 프로토콜 총괄</h4>
                <p className="text-[10px] text-zinc-400 mt-1">1553B/DDS 연동 드라이버 개발, CI/CD 배포, 클라우드 인프라 모니터링</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-mono text-emerald-400 font-semibold">CFO Agent</div>
                <h4 className="text-xs font-bold text-white mt-1">재무 & Runway 관리</h4>
                <p className="text-[10px] text-zinc-400 mt-1">자금 집행 검증, API 토큰 비용 ROI 분석, 손익분기 및 지출 모니터링</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-mono text-amber-400 font-semibold">CMO Agent</div>
                <h4 className="text-xs font-bold text-white mt-1">국방 B2G / B2B 마케팅</h4>
                <p className="text-[10px] text-zinc-400 mt-1">방산 전시회 브리핑 생성, 고객 요구사항(RFP) 분석, 솔루션 제안서 초안</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-mono text-rose-400 font-semibold">COO Agent</div>
                <h4 className="text-xs font-bold text-white mt-1">운영 관제 & QA</h4>
                <p className="text-[10px] text-zinc-400 mt-1">장비 장애 알림 큐 관제, 일일 운영 리포트 종합, 이상치 자동 리포팅</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Learning Progress Mastery Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-800/40 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-emerald-400" />
                {isKo ? '국방 AI 탐색기 학습 달성도' : 'Defense AI Learning Mastery'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 font-bold">
                {defenseStats.percent}% {isKo ? '완료' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-black text-white font-mono">
                {defenseStats.completed} <span className="text-sm font-normal text-zinc-400">/ {defenseStats.total} {isKo ? '모듈' : 'modules'}</span>
              </div>
              <span className="text-xs text-zinc-400">
                {defenseStats.percent === 100
                  ? (isKo ? '🎉 24개 전 과정 마스터 완료!' : '🎉 All 24 modules mastered!')
                  : (isKo ? `남은 ${defenseStats.total - defenseStats.completed}개 모듈을 학습하여 국방 AI 체계를 정복하세요.` : `${defenseStats.total - defenseStats.completed} modules left to complete.`)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-500"
                style={{ width: `${defenseStats.percent}%` }}
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
                {isKo ? '전체 (24)' : 'All (24)'}
              </button>
              <button
                onClick={() => setCompletionFilter('unlearned')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'unlearned'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `미학습 (${defenseStats.total - defenseStats.completed})` : `Unlearned (${defenseStats.total - defenseStats.completed})`}
              </button>
              <button
                onClick={() => setCompletionFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  completionFilter === 'completed'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isKo ? `완료됨 (${defenseStats.completed})` : `Learned (${defenseStats.completed})`}
              </button>
            </div>

            <button
              onClick={() => markAllInTab('defense', defenseStats.completed < defenseStats.total)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            >
              {defenseStats.completed < defenseStats.total
                ? (isKo ? '전체 완료 체크' : 'Mark all done')
                : (isKo ? '진도 초기화' : 'Reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DEFENSE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 shadow-md font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {isKo ? cat.labelKo : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKo ? '주제, 키워드(1553B, SQL, CTO, HMAC) 검색...' : 'Search modules, keywords...'}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Count Label */}
      <div className="text-xs text-zinc-500 flex items-center justify-between px-1">
        <span>
          {isKo 
            ? `총 24개 주제 중 ${filteredSections.length}개 모듈 표시 중` 
            : `Showing ${filteredSections.length} of 24 modules`}
        </span>
        {searchQuery && (
          <span className="text-amber-400">
            "{searchQuery}" 검색 결과
          </span>
        )}
      </div>

      {/* Grid of 24 Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSections.map((sec) => {
          const badgeClass = categoryBadgeColors[sec.category] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
          return (
            <div
              key={sec.id}
              className={`group relative bg-zinc-950/80 border ${
                isCompleted(sec.id)
                  ? 'border-emerald-600/50 shadow-lg shadow-emerald-950/20'
                  : 'border-zinc-800 hover:border-zinc-700'
              } rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-black/50`}
            >
              <div>
                {/* Header: Index, Category, Learning Toggle Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-[11px] font-bold text-amber-400">
                      {String(sec.index).padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                      {isKo ? sec.categoryKo : sec.categoryEn}
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
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60 shadow-sm shadow-emerald-500/20'
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
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>{isKo ? '학습 완료' : 'Learned'}</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3 h-3 text-zinc-500" />
                          <span>{isKo ? '학습 전' : 'To Learn'}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {sec.badge}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {sec.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {sec.summary}
                </p>

                {/* Curated YouTube Video Teaser */}
                {sec.youtubeUrl && (
                  <div className="mt-3 p-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/35 border border-red-900/30 transition-colors">
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

                {/* Key Takeaways */}
                <div className="mt-3 pt-3 border-t border-zinc-900 space-y-1.5">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {isKo ? '핵심 포인트' : 'Key Takeaways'}
                  </div>
                  {sec.keyPoints.slice(0, 3).map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                      <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-1">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Open Modal */}
              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400">
                  {sec.contentMarkdown.length.toLocaleString()} chars
                </span>
                <button
                  onClick={() => {
                    setActiveItem(sec);
                    setShowVideoPlayer(false);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 cursor-pointer transition"
                >
                  <span>{isKo ? '세부 내용 & 코드 보기' : 'View Full Details & Code'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Full Content Inspection */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900/80 flex items-start justify-between gap-4 shrink-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-zinc-950">
                    Module #{String(activeItem.index).padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryBadgeColors[activeItem.category]}`}>
                    {isKo ? activeItem.categoryKo : activeItem.categoryEn}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                    {activeItem.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {activeItem.fullTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleComplete(activeItem.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                    isCompleted(activeItem.id)
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70 shadow-sm shadow-emerald-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  }`}
                  title={isCompleted(activeItem.id) ? (isKo ? '학습 완료됨 (클릭하여 취소)' : 'Mark as unlearned') : (isKo ? '학습 완료로 표시' : 'Mark as completed')}
                >
                  {isCompleted(activeItem.id) ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isKo ? '학습 완료됨 ✓' : 'Completed ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{isKo ? '학습 완료로 체크' : 'Mark Completed'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCopy(activeItem.contentMarkdown, activeItem.id)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Copy full content"
                >
                  {copiedId === activeItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 hidden sm:inline">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">전체 복사</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveItem(null);
                    setShowVideoPlayer(false);
                  }}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Rendered Markdown Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm text-zinc-200 leading-relaxed font-sans">
              <div className="bg-black/60 rounded-xl p-4 border border-zinc-800/80 mb-4">
                <div className="text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  {isKo ? '모듈 요약 및 핵심 목표' : 'Module Summary & Objectives'}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              {/* Curated YouTube Deep Learning Section */}
              {activeItem.youtubeUrl && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-zinc-950 border border-red-800/50 shadow-lg mb-4">
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

              {/* Formatted Content Renderer */}
              <div className="prose prose-invert max-w-none space-y-3">
                {activeItem.contentMarkdown.split('\n\n').map((block, bIdx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  // Handle Code blocks
                  if (trimmed.startsWith('```')) {
                    const codeLines = trimmed.split('\n');
                    const lang = codeLines[0].replace('```', '').trim() || 'text';
                    const codeBody = codeLines.slice(1, -1).join('\n');
                    const codeId = `code-${activeItem.id}-${bIdx}`;

                    return (
                      <div key={bIdx} className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
                          <span className="flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-amber-400" />
                            {lang.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleCopy(codeBody, codeId)}
                            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-amber-300 cursor-pointer transition"
                          >
                            {copiedId === codeId ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">복사 완료</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>코드 복사</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed bg-black/80">
                          <code>{codeBody}</code>
                        </pre>
                      </div>
                    );
                  }

                  // Handle Headers
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h4 key={bIdx} className="text-base font-bold text-amber-300 mt-4 mb-2 flex items-center gap-1.5 border-b border-zinc-800/80 pb-1">
                        <span className="w-1.5 h-3.5 bg-amber-400 rounded-sm inline-block" />
                        {trimmed.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h3 key={bIdx} className="text-lg font-bold text-white mt-5 mb-2">
                        {trimmed.replace('## ', '')}
                      </h3>
                    );
                  }

                  // Handle Quotes / Notes
                  if (trimmed.startsWith('> ')) {
                    return (
                      <div key={bIdx} className="p-3.5 rounded-xl bg-zinc-900/90 border-l-4 border-amber-400 text-xs text-zinc-300 my-2">
                        {trimmed.replace('> ', '')}
                      </div>
                    );
                  }

                  // Handle Bullet lists
                  if (trimmed.startsWith('* ') || trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
                    const listItems = trimmed.split('\n');
                    return (
                      <ul key={bIdx} className="space-y-1.5 my-2 pl-2">
                        {listItems.map((li, liIdx) => (
                          <li key={liIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            <span className="text-amber-400 shrink-0 mt-1">•</span>
                            <span>{li.replace(/^(\*|\d+\.|-)\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Standard paragraph
                  return (
                    <p key={bIdx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed my-2">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400 shrink-0">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                {isKo ? '국방 AI 에이전트 지식 체계' : 'Defense AI Knowledge Base'}
              </span>
              <button
                onClick={() => {
                  setActiveItem(null);
                  setShowVideoPlayer(false);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition cursor-pointer text-xs"
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
