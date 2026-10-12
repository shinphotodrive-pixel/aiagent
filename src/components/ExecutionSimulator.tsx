import React, { useState, useEffect } from 'react';
import { Language, PresetScenario, SimulationResult, SimulationBookmark } from '../types';
import { PRESET_SCENARIOS } from '../data/architectureData';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { SimulationBookmarkList } from './SimulationBookmarkList';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  Search, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Coins, 
  ShieldCheck, 
  Database, 
  Wrench, 
  Sparkles,
  ArrowRight,
  Send,
  ExternalLink,
  Code,
  Bookmark,
  BookmarkPlus,
  BookmarkCheck,
  ListFilter,
  Layers,
  X,
  Check,
  Tag,
  Share2
} from 'lucide-react';

interface Props {
  language: Language;
  onHighlightNode?: (nodeId: string | null) => void;
}

const BOOKMARK_STORAGE_KEY = 'ai_dashboard_simulation_bookmarks_v1';

// Initial default seed bookmarks to provide rich comparative examples immediately
const DEFAULT_SEED_BOOKMARKS: SimulationBookmark[] = [
  {
    id: 'seed-flight-booking',
    title: '자율 항공권 예약 및 캘린더 등록',
    titleKo: '자율 항공권 예약 및 캘린더 등록',
    prompt: '다음 주 금요일 서울발 도쿄행 250달러 이하 항공권을 찾아 12A 좌석으로 예약하고 구글 캘린더에 일정을 등록해줘.',
    scenarioId: 'flight-booking',
    scenarioTitle: 'Flight Booking & Calendar Sync',
    scenarioTitleKo: '항공권 예약 및 캘린더 등록',
    createdAt: Date.now() - 86400000,
    tags: ['Action', 'Tool-Calling', 'High-Impact', 'API'],
    notes: '순수 LLM vs RAG vs Agentic AI의 결정적 차이인 외부 시스템 상태 변경(Action)과 장기 기억(Memory) 실례.',
    result: {
      summary: '자율 도구 실행과 외부 API 변경이 필요한 시나리오로, 순수 LLM은 텍스트 안내에 그치고 RAG는 검색만 가능하지만 Agentic AI는 실제 예약 API 및 캘린더 등록 액션을 완료합니다.',
      llm: {
        status: '정적 텍스트 안내 (실행 불가)',
        answer: '서울-도쿄 항공편을 예약하려면 항공사 공식 웹사이트나 스카이스캐너를 방문하여 날짜를 선택하고 결제하세요. 저는 실시간 조회 및 예약 권한이 없습니다.',
        latencyMs: 390,
        tokens: 280,
        costCents: 0.04,
        hallucinationRisk: '중간 (구체적 좌석/요금 거짓 정보 위험)',
        steps: ['프롬프트 수신', '사전 학습 파라미터 기반 생성', '일반 안내문 반환']
      },
      rag: {
        status: '항공권 규정 및 운임 검색 증강',
        queryGenerated: '서울-도쿄 금요일 항공편 운임 규정 및 스케줄',
        retrievedChunks: [
          { source: 'Aviation Schedule DB [Doc #1]', snippet: 'HND/NRT 노선 금요일 평균 최저가는 사전 예약 시 $210~$240 선에서 형성됨.' },
          { source: 'Fare Policy API Docs [Doc #2]', snippet: '사전 좌석 지정 12A는 비상구열 또는 전방 선호 좌석으로 추가 수수료 규정 적용 가능.' }
        ],
        answer: '검색된 운임 데이터에 따르면 다음 주 금요일 서울발 도쿄행 항공권 최저가는 약 $230선에서 예약 가능합니다. 단, RAG 파이프라인은 읽기 전용이므로 직접 항공사 사이트에서 12A 좌석을 선택하셔야 합니다.',
        latencyMs: 1240,
        tokens: 1350,
        costCents: 0.18,
        hallucinationRisk: '낮음 (문서 기반 출처 인용)',
        steps: ['임베딩 벡터화', '운임 지식 DB 검색', '컨텍스트 주입', '출처 인용 답변 생성']
      },
      agentic: {
        status: 'ReAct 루프: 실시간 가격 비교 ➔ 12A 좌석 예약 ➔ 캘린더 동기화',
        memoryRetrieved: 'User Travel Profile: 여권 번호 보유, 선호 항공사 스타얼라이언스, 알림 캘린더 ID: user@work.com',
        plan: [
          '1. 장기 기억에서 사용자 여권/결제 프로필 및 캘린더 계정 확인',
          '2. Flight Search API로 $250 이하 서울-도쿄 12A 좌석 조회 (결과: JL092 $238 확정)',
          '3. Booking & Payment Tool을 호출하여 좌석 예약 완료',
          '4. Google Calendar API를 호출하여 탑승 일정 및 체크인 알림 등록'
        ],
        toolExecuted: {
          name: 'book_flight_and_sync_calendar',
          args: { flight: 'JL092', seat: '12A', priceUSD: 238, calendarTitle: '도쿄 출장 비행 (JL092)' },
          result: '✅ 예약 번호 #TK-88921 발권 완료 ($238) & 구글 캘린더 동기화 완료'
        },
        answer: '🎉 서울(GMP) - 도쿄(HND) 항공편(JL092, $238) 12A 좌석 예약을 완료했습니다! 전자 항공권이 발급되었으며, 탑승 24시간 전 모바일 체크인 일정이 구글 캘린더에 자동 등록되었습니다.',
        latencyMs: 3420,
        tokens: 4180,
        costCents: 0.88,
        hallucinationRisk: '매우 낮음 (실제 API 응답 검증)',
        steps: ['목표 분석 & 프로필 메모리 확인', 'Flight API 실시간 잔여석 조회', '결제 및 예약 도구 트랜잭션 실행', 'Google Calendar 이벤트 생성', '최종 실행 보고서 반환']
      }
    }
  },
  {
    id: 'seed-financial-analysis',
    title: '2026 Q3 테슬라 vs BYD 실적 분석',
    titleKo: '2026 Q3 테슬라 vs BYD 실적 분석',
    prompt: '2026년 3분기 테슬라와 BYD의 글로벌 전기차 인도량을 비교하고 마진 추이를 분석하여 비교 표와 차트를 작성해줘.',
    scenarioId: 'financial-analysis',
    scenarioTitle: 'Q3 Financial Earnings & Graph',
    scenarioTitleKo: '최신 실적 분석 및 경쟁사 비교 차트',
    createdAt: Date.now() - 43200000,
    tags: ['Research', 'Table-Synthesis', 'Financial', 'Low-Hallucination'],
    notes: '최신 수치와 통계 계산에 있어 RAG의 인용 정확도와 Agentic의 코드 연산 도구 능력을 비교하기 좋은 케이스.',
    result: {
      summary: '최신 금융 데이터와 정량적 비교가 필요한 시나리오로, 순수 LLM은 과거 지식으로 환각 위험이 높고 RAG는 최신 SEC 보고서를 인용하며 Agentic AI는 데이터 계산 및 차트 표 코드까지 자동 검증합니다.',
      llm: {
        status: '파라메트릭 가중치 기반 추정',
        answer: '테슬라와 BYD는 글로벌 전기차 시장에서 치열한 경쟁을 벌이고 있습니다. 일반적으로 분기당 약 40~50만 대 수준을 인도하며, 마진율은 테슬라가 17~18%, BYD가 20% 내외를 기록합니다. (주의: 2026년 3분기 공식 집계치는 제 학습 데이터 컷오프 이후이므로 추정치입니다.)',
        latencyMs: 410,
        tokens: 320,
        costCents: 0.05,
        hallucinationRisk: '높음 (미래/최신 분기 데이터 환각)',
        steps: ['프롬프트 수신', '신경망 가중치 추론', '개략적 추정치 생성']
      },
      rag: {
        status: '최신 금융 IR 보고서 벡터 검색 증강',
        queryGenerated: 'Tesla vs BYD Q3 2026 deliveries margin SEC filing IR release',
        retrievedChunks: [
          { source: 'Tesla IR Press Release [Q3 2026]', snippet: 'Tesla delivered 498,000 vehicles in Q3 2026 with automotive gross margin (ex-reg credits) of 18.2%.' },
          { source: 'BYD Global Disclosure [2026-10]', snippet: 'BYD pure BEV quarterly sales reached 526,000 units, operating gross margin 21.4% driven by vertical battery integration.' }
        ],
        answer: '공식 IR 보고서 [1][2]에 따르면 2026년 Q3 순수 전기차 인도량은 BYD가 52.6만 대로 테슬라(49.8만 대)를 앞섰으며, 마진율 또한 배터리 내재화로 BYD(21.4%)가 테슬라(18.2%)보다 높은 회복세를 보였습니다.',
        latencyMs: 1190,
        tokens: 1480,
        costCents: 0.21,
        hallucinationRisk: '낮음 (IR 문서 인용)',
        steps: ['IR 벡터 DB 검색', '유사도 상위 공시자료 추출', '프롬프트 컨텍스트 주입', '인용 부호 첨부 합성']
      },
      agentic: {
        status: '다단계 리서치 ➔ 파이썬 판다스 데이터프레임 계산 ➔ 마크다운 테이블 산출',
        memoryRetrieved: 'Research Context: 이전 자동차 섹터 리서치 템플릿 로드',
        plan: [
          '1. 금융 공시 DB 및 야후 파이낸스 API 쿼리',
          '2. 파이썬 계산 툴로 YoY 성장률 및 마진 스프레드 정밀 연산',
          '3. 오차 검증 후 다차원 비교 표 및 분석 리포트 생성'
        ],
        toolExecuted: {
          name: 'calculate_margin_and_table',
          args: { tslaDeliveries: 498000, tslaMargin: 0.182, bydDeliveries: 526000, bydMargin: 0.214 },
          result: '✅ 계산 완료: BYD 인도량 +5.6% 우세, 마진 스프레드 320bps BYD 우세'
        },
        answer: '| 지표 | 테슬라 (TSLA) | BYD (비야디) | 격차 |\n|---|---|---|---|\n| Q3 인도량 | 49.8만 대 | 52.6만 대 | BYD +2.8만 대 |\n| 총 마진율 | 18.2% | 21.4% | BYD +3.2%p |\n연산 검증을 마친 정확한 수치 분석 결과입니다.',
        latencyMs: 2950,
        tokens: 3890,
        costCents: 0.79,
        hallucinationRisk: '매우 낮음 (코드 연산 검증)',
        steps: ['데이터 소스 수집', '파이썬 연산 샌드박스 실행', '테이블 포맷팅', '완료 보고서 생성']
      }
    }
  }
];

export const ExecutionSimulator: React.FC<Props> = ({ language, onHighlightNode }) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const { recordActivity } = useProgress();

  // Active view: 'simulator' (Live Sandbox) vs 'bookmarks' (Saved Bookmarks List View)
  const [simulatorView, setSimulatorView] = useState<'simulator' | 'bookmarks'>('simulator');

  const [selectedScenario, setSelectedScenario] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(
    isKo ? PRESET_SCENARIOS[0].promptKo : PRESET_SCENARIOS[0].prompt
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<SimulationBookmark[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse bookmarks:', e);
    }
    return DEFAULT_SEED_BOOKMARKS;
  });

  // Save Bookmark Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [saveSelectedTags, setSaveSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage:', e);
    }
  }, [bookmarks]);

  const handleSelectScenario = (sc: PresetScenario) => {
    setSelectedScenario(sc);
    setCustomPrompt(isKo ? sc.promptKo : sc.prompt);
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          language
        })
      });

      if (!res.ok) {
        throw new Error(`Simulation failed: ${res.statusText}`);
      }

      const data: SimulationResult = await res.json();
      setResult(data);

      recordActivity({
        type: 'simulate',
        titleKo: `시뮬레이션 실행 완료`,
        titleEn: `Simulation Completed`,
        detailKo: `프롬프트: "${customPrompt.slice(0, 36)}..." 3-Way 비교 완료`,
        detailEn: `Prompt: "${customPrompt.slice(0, 36)}..." 3-way trace completed`,
        metadata: { tab: 'simulator' }
      });
    } catch (err) {
      console.error(err);
      showToast(isKo ? '시뮬레이션 요청에 실패했습니다.' : 'Simulation request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first render if no result
  useEffect(() => {
    if (!result) {
      handleRunSimulation();
    }
  }, []);

  // Open Save Bookmark Modal
  const openSaveModal = () => {
    if (!result) return;
    const defaultTitle = isKo
      ? (selectedScenario ? selectedScenario.titleKo : customPrompt.slice(0, 24))
      : (selectedScenario ? selectedScenario.title : customPrompt.slice(0, 24));
    setSaveTitle(defaultTitle);
    setSaveNotes('');
    setSaveSelectedTags(selectedScenario?.category ? [selectedScenario.category] : ['Sandbox']);
    setIsSaveModalOpen(true);
  };

  // Handle Save Bookmark Confirmation
  const handleConfirmSaveBookmark = () => {
    if (!result || !saveTitle.trim()) return;

    const newBookmark: SimulationBookmark = {
      id: `sim-bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: saveTitle.trim(),
      titleKo: saveTitle.trim(),
      prompt: customPrompt,
      scenarioId: selectedScenario?.id,
      scenarioTitle: selectedScenario?.title,
      scenarioTitleKo: selectedScenario?.titleKo,
      createdAt: Date.now(),
      tags: saveSelectedTags,
      notes: saveNotes.trim() || undefined,
      result: result
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
    setIsSaveModalOpen(false);

    recordActivity({
      type: 'bookmark_simulation',
      titleKo: `시뮬레이션 상태 북마크 저장`,
      titleEn: `Saved Simulation Bookmark`,
      detailKo: `"${saveTitle}" 시뮬레이션 상태를 북마크 목록에 저장했습니다.`,
      detailEn: `Saved "${saveTitle}" simulation state to bookmarks.`,
      metadata: { tab: 'simulator', bookmarkId: newBookmark.id }
    });

    showToast(isKo ? '✨ 시뮬레이션 상태가 북마크에 저장되었습니다!' : '✨ Simulation state bookmarked!');
  };

  // Load a bookmark into the live simulator
  const handleLoadBookmark = (bookmark: SimulationBookmark) => {
    setCustomPrompt(bookmark.prompt);
    if (bookmark.scenarioId) {
      const matchScenario = PRESET_SCENARIOS.find((sc) => sc.id === bookmark.scenarioId);
      if (matchScenario) setSelectedScenario(matchScenario);
    }
    setResult(bookmark.result);
    setSimulatorView('simulator');

    recordActivity({
      type: 'simulate',
      titleKo: `시뮬레이션 북마크 복원`,
      titleEn: `Restored Simulation Bookmark`,
      detailKo: `"${bookmark.title}" 상태를 라이브 시뮬레이터에 로드했습니다.`,
      detailEn: `Loaded "${bookmark.title}" into live simulator.`,
      metadata: { tab: 'simulator', bookmarkId: bookmark.id }
    });

    showToast(
      isKo 
        ? `"${bookmark.title}" 상태를 시뮬레이터로 복원했습니다.` 
        : `Restored "${bookmark.title}" into simulator.`
    );
  };

  // Delete a bookmark
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Update a bookmark
  const handleUpdateBookmark = (id: string, updates: Partial<SimulationBookmark>) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  // Reset to default seed bookmarks
  const handleResetDefaultBookmarks = () => {
    setBookmarks(DEFAULT_SEED_BOOKMARKS);
    showToast(isKo ? '기본 추천 북마크 세트가 복원되었습니다.' : 'Default bookmark presets restored.');
  };

  // Check if current state matches any existing bookmark
  const isCurrentBookmarked = bookmarks.some(
    (b) => b.prompt.trim() === customPrompt.trim() && JSON.stringify(b.result) === JSON.stringify(result)
  );

  const quickTagOptions = [
    'Action',
    'Tool-Calling',
    'Fast-LLM',
    'High-Latency',
    'Financial',
    'Engineering',
    'Grounded',
    'Hallucination-Check'
  ];

  const toggleTag = (tag: string) => {
    if (saveSelectedTags.includes(tag)) {
      setSaveSelectedTags(saveSelectedTags.filter((t) => t !== tag));
    } else {
      setSaveSelectedTags([...saveSelectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !saveSelectedTags.includes(customTagInput.trim())) {
      setSaveSelectedTags([...saveSelectedTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 fill-zinc-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Mode Navigation Pill Header: Simulator vs Bookmarks List View */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-zinc-900/90 border-zinc-800 shadow-xl backdrop-blur'
      }`}>
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSimulatorView('simulator')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              simulatorView === 'simulator'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : isLight
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simulatorView === 'simulator' ? 'fill-zinc-950' : ''}`} />
            <span>{isKo ? '3-Way 실시간 시뮬레이터' : 'Live Execution Sandbox'}</span>
          </button>

          <button
            onClick={() => setSimulatorView('bookmarks')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
              simulatorView === 'bookmarks'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : isLight
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${simulatorView === 'bookmarks' ? 'fill-zinc-950' : ''}`} />
            <span>{isKo ? '저장된 북마크 목록' : 'Saved Bookmarks'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              simulatorView === 'bookmarks'
                ? 'bg-zinc-950/20 text-zinc-950'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {bookmarks.length}
            </span>
          </button>
        </div>

        {/* Quick Simulator Header Status & Secondary Shortcut */}
        <div className="flex items-center gap-2 shrink-0">
          {simulatorView === 'simulator' && result && (
            <button
              onClick={openSaveModal}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isCurrentBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
              title={isKo ? '현재 실행 상태를 북마크에 저장' : 'Save current simulation as bookmark'}
            >
              {isCurrentBookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isKo ? '북마크 저장됨' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isKo ? '현재 결과 북마크' : 'Bookmark State'}</span>
                </>
              )}
            </button>
          )}

          {simulatorView === 'simulator' ? (
            <button
              onClick={() => setSimulatorView('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKo ? `북마크 열람 (${bookmarks.length}건)` : `View Bookmarks (${bookmarks.length})`}</span>
            </button>
          ) : (
            <button
              onClick={() => setSimulatorView('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKo ? '시뮬레이터로 복귀' : 'Return to Sandbox'}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: BOOKMARKS LIST VIEW */}
      {simulatorView === 'bookmarks' ? (
        <SimulationBookmarkList
          language={language}
          bookmarks={bookmarks}
          onLoadBookmark={handleLoadBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onUpdateBookmark={handleUpdateBookmark}
          onResetDefaultBookmarks={handleResetDefaultBookmarks}
          onSwitchToSimulator={() => setSimulatorView('simulator')}
          hasCurrentResult={result !== null}
          onOpenSaveCurrentModal={openSaveModal}
        />
      ) : (
        /* VIEW 2: LIVE SIMULATOR & TRACE SANDBOX */
        <>
          {/* Header and Scenario Selector */}
          <div className={`p-5 rounded-2xl border shadow-2xl backdrop-blur transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-slate-900/5'
              : 'bg-zinc-900/90 border-zinc-800'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className={`text-xl font-bold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {isKo ? '실행 시뮬레이터 (Trace & Execution Sandbox)' : 'Execution Simulator & Trace Sandbox'}
                </h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {isKo 
                    ? '동일한 질문을 순수 LLM, RAG, Agentic AI 3가지 파이프라인으로 전송했을 때의 실행 흐름과 성능 지표를 비교합니다.'
                    : 'Send the same prompt through Pure LLM, RAG, and Agentic AI to inspect the concrete execution traces side-by-side.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {result && (
                  <button
                    onClick={openSaveModal}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all cursor-pointer active:scale-95 ${
                      isCurrentBookmarked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>{isCurrentBookmarked ? (isKo ? '북마크됨' : 'Bookmarked') : (isKo ? '북마크 저장' : 'Bookmark State')}</span>
                  </button>
                )}

                <button
                  onClick={handleRunSimulation}
                  disabled={loading || !customPrompt.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>{isKo ? '시뮬레이션 분석 중...' : 'Simulating Traces...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-zinc-950" />
                      <span>{isKo ? '3-Way 비교 실행' : 'Run 3-Way Simulation'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preset scenario tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-zinc-400 font-medium mr-1">
                {isKo ? '추천 시나리오:' : 'Preset Scenarios:'}
              </span>
              {PRESET_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 text-amber-300 border-amber-500/50 shadow-sm'
                        : isLight
                          ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {isKo ? sc.titleKo : sc.title}
                  </button>
                );
              })}
            </div>

            {/* Input prompt field */}
            <div className="relative">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
                className={`w-full rounded-xl px-4 py-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition resize-none font-mono border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                    : 'bg-black/60 border-zinc-800 text-zinc-100 focus:border-amber-500/80'
                }`}
                placeholder={isKo ? '테스트할 프롬프트를 입력하세요...' : 'Enter prompt to compare across architectures...'}
              />
              <button
                onClick={handleRunSimulation}
                disabled={loading || !customPrompt.trim()}
                className="absolute right-3 bottom-3 p-1.5 text-zinc-400 hover:text-amber-400 disabled:opacity-30 transition cursor-pointer"
                title="Submit"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Summary Banner */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
              isLight
                ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
            }`}>
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold mr-2">
                    {isKo ? '아키텍처 요약 비교:' : 'Architectural Takeaway:'}
                  </span>
                  {result.summary}
                </div>
              </div>

              <button
                onClick={openSaveModal}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition cursor-pointer"
                title={isKo ? '이 시뮬레이션 상태를 북마크에 추가' : 'Bookmark this simulation'}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isKo ? '북마크 저장' : 'Save Bookmark'}</span>
              </button>
            </div>
          )}

          {/* 3-Column Comparative Trace Cards */}
          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* ================= COLUMN 1: PURE LLM ================= */}
              <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group border ${
                isLight
                  ? 'bg-white border-blue-200 hover:border-blue-400'
                  : 'bg-zinc-900/90 border-blue-900/40 hover:border-blue-500/50'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>L.L.M</h3>
                        <p className="text-[11px] text-zinc-400">ChatGPT (Zero-Shot Base)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                      {isKo ? '파라메트릭' : 'Parametric'}
                    </span>
                  </div>

                  {/* Telemetry Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-black/40 rounded-xl border border-zinc-800/80 p-2 text-center text-[11px]">
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isKo ? '지연시간' : 'Latency'}</span>
                      </div>
                      <div className="font-mono font-semibold text-emerald-400 mt-0.5">
                        {result.llm.latencyMs}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3" />
                        <span>{isKo ? '비용' : 'Cost'}</span>
                      </div>
                      <div className="font-mono font-semibold text-zinc-300 mt-0.5">
                        ${result.llm.costCents}¢
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span>{isKo ? '환각 위험' : 'Hallucination'}</span>
                      </div>
                      <div className="font-mono font-semibold text-amber-400 mt-0.5 text-[10px]">
                        {result.llm.hallucinationRisk}
                      </div>
                    </div>
                  </div>

                  {/* Execution Steps Trace */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                      <span>{isKo ? '실행 파이프라인 단계:' : 'Execution Pipeline:'}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">1 Pass (Direct)</span>
                    </div>
                    <div className="space-y-1.5">
                      {result.llm.steps.map((st, i) => (
                        <div 
                          key={i} 
                          className="text-xs bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2 text-zinc-300 flex items-start gap-2 hover:border-blue-500/40 transition cursor-pointer"
                          onMouseEnter={() => {
                            if (i === 0) onHighlightNode?.('prompt-1');
                            if (i === 1) onHighlightNode?.('llm-1');
                            if (i === 2) onHighlightNode?.('answer-1');
                          }}
                          onMouseLeave={() => onHighlightNode?.(null)}
                        >
                          <span className="w-4 h-4 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                            {i + 1}
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Output */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 mb-2">
                      {isKo ? '생성된 응답 결과 (Answer):' : 'Generated Answer Output:'}
                    </div>
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans min-h-[90px] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-black/60 border-zinc-800/80 text-zinc-300'
                    }`}>
                      {result.llm.answer}
                    </div>
                  </div>
                </div>

                {/* Bottom note */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span>{isKo ? '외부 검색/도구 권한 없음' : 'No Web/Tool Authority'}</span>
                  <span className="text-blue-400 font-mono text-[10px]">{result.llm.tokens} tokens</span>
                </div>
              </div>

              {/* ================= COLUMN 2: R.A.G ================= */}
              <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group border ${
                isLight
                  ? 'bg-white border-sky-200 hover:border-sky-400'
                  : 'bg-zinc-900/90 border-sky-900/40 hover:border-sky-500/50'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>R.A.G</h3>
                        <p className="text-[11px] text-zinc-400">Perplexity (Retrieval Augmented)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                      {isKo ? '지식 증강' : 'Grounded'}
                    </span>
                  </div>

                  {/* Telemetry Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-black/40 rounded-xl border border-zinc-800/80 p-2 text-center text-[11px]">
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isKo ? '지연시간' : 'Latency'}</span>
                      </div>
                      <div className="font-mono font-semibold text-sky-400 mt-0.5">
                        {result.rag.latencyMs}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3" />
                        <span>{isKo ? '비용' : 'Cost'}</span>
                      </div>
                      <div className="font-mono font-semibold text-zinc-300 mt-0.5">
                        ${result.rag.costCents}¢
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-sky-400" />
                        <span>{isKo ? '환각 위험' : 'Hallucination'}</span>
                      </div>
                      <div className="font-mono font-semibold text-sky-400 mt-0.5 text-[10px]">
                        {result.rag.hallucinationRisk}
                      </div>
                    </div>
                  </div>

                  {/* Retrieved Chunks Preview */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Search className="w-3 h-3 text-sky-400" />
                        {isKo ? '검색된 외부 문서 청크 (Context):' : 'Retrieved Context Chunks:'}
                      </span>
                      <span className="text-[10px] text-sky-400 font-mono">Top-2 Docs</span>
                    </div>
                    <div className="space-y-1.5">
                      {result.rag.retrievedChunks.map((chunk, i) => (
                        <div 
                          key={i} 
                          className="bg-black/50 border border-sky-950/80 rounded-lg p-2 text-[11px] text-zinc-300 hover:border-sky-500/40 transition cursor-pointer"
                          onMouseEnter={() => onHighlightNode?.('context-2')}
                          onMouseLeave={() => onHighlightNode?.(null)}
                        >
                          <div className="font-semibold text-sky-400 text-[10px] flex items-center justify-between">
                            <span>{chunk.source}</span>
                            <span className="text-zinc-500">sim: 0.89</span>
                          </div>
                          <p className="text-zinc-400 mt-0.5 line-clamp-2">{chunk.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Output */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 mb-2">
                      {isKo ? '출처 인용 증강 답변 (Answer):' : 'Grounded Answer with Sources:'}
                    </div>
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans min-h-[90px] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-black/60 border-zinc-800/80 text-zinc-300'
                    }`}>
                      {result.rag.answer}
                    </div>
                  </div>
                </div>

                {/* Bottom note */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span>{isKo ? '읽기 전용 출처 인용 (액션 불가)' : 'Read-only citations (No Act)'}</span>
                  <span className="text-sky-400 font-mono text-[10px]">{result.rag.tokens} tokens</span>
                </div>
              </div>

              {/* ================= COLUMN 3: AGENTIC AI ================= */}
              <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group border ${
                isLight
                  ? 'bg-white border-purple-200 hover:border-purple-400'
                  : 'bg-zinc-900/90 border-purple-900/40 hover:border-purple-500/50'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Agentic AI</h3>
                        <p className="text-[11px] text-zinc-400">Goover / Operator / Claude Act</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                      {isKo ? '자율 액션' : 'Autonomous'}
                    </span>
                  </div>

                  {/* Telemetry Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-black/40 rounded-xl border border-zinc-800/80 p-2 text-center text-[11px]">
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isKo ? '지연시간' : 'Latency'}</span>
                      </div>
                      <div className="font-mono font-semibold text-purple-400 mt-0.5">
                        {result.agentic.latencyMs}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3" />
                        <span>{isKo ? '비용' : 'Cost'}</span>
                      </div>
                      <div className="font-mono font-semibold text-amber-300 mt-0.5">
                        ${result.agentic.costCents}¢
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{isKo ? '환각 위험' : 'Hallucination'}</span>
                      </div>
                      <div className="font-mono font-semibold text-emerald-400 mt-0.5 text-[10px]">
                        {result.agentic.hallucinationRisk}
                      </div>
                    </div>
                  </div>

                  {/* Agent Plan & Tool Execution */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-purple-400" />
                        {isKo ? '자율 계획 수립 & 도구 실행 (Act):' : 'Plan & Tool Invocation:'}
                      </span>
                      <span className="text-[10px] text-purple-400 font-mono">ReAct Loop</span>
                    </div>

                    {/* Executed Tool Card */}
                    <div 
                      className="bg-black/60 border border-purple-900/60 rounded-xl p-2.5 mb-2 hover:border-purple-500/50 transition cursor-pointer"
                      onMouseEnter={() => onHighlightNode?.('tools-3')}
                      onMouseLeave={() => onHighlightNode?.(null)}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-semibold text-pink-400 flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          {result.agentic.toolExecuted.name}()
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800">
                          Executed
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950 p-1.5 rounded border border-zinc-900 mb-1 overflow-x-auto">
                        {JSON.stringify(result.agentic.toolExecuted.args)}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-medium">
                        {result.agentic.toolExecuted.result}
                      </div>
                    </div>

                    {/* Plan steps */}
                    <div className="space-y-1">
                      {result.agentic.plan.slice(0, 3).map((pl, i) => (
                        <div 
                          key={i} 
                          className="text-[11px] text-zinc-400 flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-950/40 border border-zinc-900 cursor-pointer"
                          onMouseEnter={() => onHighlightNode?.(i === 0 ? 'memory-3' : i === 1 ? 'search-3' : 'action-3')}
                          onMouseLeave={() => onHighlightNode?.(null)}
                        >
                          <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{pl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Output */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 mb-2">
                      {isKo ? '멀티모달 답변 및 완료 리포트:' : 'Multi-Modal Answer & Action Result:'}
                    </div>
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans min-h-[90px] ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-black/60 border-zinc-800/80 text-zinc-300'
                    }`}>
                      {result.agentic.answer}
                    </div>
                  </div>
                </div>

                {/* Bottom note */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span className="text-pink-400 font-medium">{isKo ? '실제 시스템 상태 변경 완료' : 'Real-world mutation completed'}</span>
                  <span className="text-purple-400 font-mono text-[10px]">{result.agentic.tokens} tokens</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SAVE BOOKMARK MODAL */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col gap-4 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">
                  {isKo ? '시뮬레이션 상태 북마크 저장' : 'Save Simulation as Bookmark'}
                </h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  {isKo ? '북마크 제목 *' : 'Bookmark Title *'}
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={isKo ? '예: 항공권 예약 및 캘린더 등록 비교' : 'e.g. Flight Booking comparison'}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-sans border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-black/60 border-zinc-700 text-zinc-100'
                  }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  {isKo ? '실행 프롬프트 (미리보기)' : 'Prompt (Preview)'}
                </label>
                <div className={`p-2.5 rounded-xl border text-xs font-mono max-h-20 overflow-y-auto leading-relaxed ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                }`}>
                  "{customPrompt}"
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  {isKo ? '분석 메모 / 학습 관찰 내용 (선택)' : 'Study Notes / Observations (Optional)'}
                </label>
                <textarea
                  value={saveNotes}
                  onChange={(e) => setSaveNotes(e.target.value)}
                  rows={2}
                  placeholder={isKo ? '이 시뮬레이션 결과에서 기억해둘 특이점 (예: RAG와 Agentic 지연시간 차이)' : 'Key observations to remember...'}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-sans border focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-black/60 border-zinc-700 text-zinc-100'
                  }`}
                />
              </div>

              {/* Tag Selection */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                  {isKo ? '태그 지정:' : 'Select Tags:'}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickTagOptions.map((tag) => {
                    const isSelected = saveSelectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : isLight
                              ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder={isKo ? '직접 태그 입력 후 Enter' : 'Custom tag and press Enter'}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-sans border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-black/60 border-zinc-800 text-zinc-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                  >
                    {isKo ? '추가' : 'Add'}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                {isKo ? '취소' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveBookmark}
                disabled={!saveTitle.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 transition cursor-pointer disabled:opacity-40"
              >
                {isKo ? '북마크 저장 완료' : 'Save to Bookmarks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
