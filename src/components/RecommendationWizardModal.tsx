import React, { useState, useMemo } from 'react';
import { ActiveTab, Language } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowRight,
  Brain,
  Shield,
  Layers,
  Network,
  Crosshair,
  BookOpen,
  Zap,
  Play,
  RotateCcw,
  Star,
  Award,
  ChevronRight,
  Lightbulb,
  Check,
  X
} from 'lucide-react';

interface Props {
  language: Language;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onShowToast?: (msg: string) => void;
}

type TabType = 'wizard' | 'presets' | 'matrix';

interface QuizOption {
  id: string;
  labelKo: string;
  labelEn: string;
  descKo: string;
  descEn: string;
  scores: {
    kimdaeshik: number;
    ontology: number;
    defense: number;
    canvas: number;
    harness: number;
  };
}

interface QuizQuestion {
  id: number;
  titleKo: string;
  titleEn: string;
  subKo: string;
  subEn: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    titleKo: '1. 현재 본인의 주요 역할이나 배경은 무엇인가요?',
    titleEn: '1. What is your primary background or role?',
    subKo: '학습 출발점의 난이도와 기술적 관점을 최적화합니다.',
    subEn: 'Optimizes entry difficulty and engineering perspective.',
    options: [
      {
        id: 'dev',
        labelKo: 'AI 소프트웨어 개발자 / 엔지니어',
        labelEn: 'AI Software Engineer / Developer',
        descKo: '구현 파이프라인, 프롬프트 엔지니어링, RAG 벡터DB 연동에 관심',
        descEn: 'Focus on pipelines, prompt engineering, vector DBs',
        scores: { canvas: 4, ontology: 3, harness: 3, kimdaeshik: 2, defense: 2 }
      },
      {
        id: 'pm',
        labelKo: '기획자 / 비즈니스 리더 / 컨설턴트',
        labelEn: 'Product Manager / Business Leader',
        descKo: 'AI 패러다임 변화, 미래 피지컬 AI 전망, ROI 및 도입 전략에 관심',
        descEn: 'Focus on AI paradigms, Physical AI outlook, business ROI',
        scores: { kimdaeshik: 5, canvas: 3, ontology: 1, harness: 2, defense: 1 }
      },
      {
        id: 'researcher',
        labelKo: '연구원 / 도메인 전문가 / 심볼릭 AI 전공',
        labelEn: 'Researcher / Domain Specialist / Symbolic AI',
        descKo: '온톨로지, 지식 그래프 추론, 환각 제거, 엄밀한 지식 표현에 관심',
        descEn: 'Focus on ontologies, knowledge graphs, symbolic reasoning',
        scores: { ontology: 5, defense: 3, harness: 3, kimdaeshik: 2, canvas: 2 }
      },
      {
        id: 'defense_gov',
        labelKo: '국방 / 항공우주 / 미션 크리티컬 종사자',
        labelEn: 'Defense / Aerospace / Mission-Critical',
        descKo: 'C2 지휘통제, 자율 무인체계, 보안 폐쇄망, 안전 가드레일에 관심',
        descEn: 'Focus on C2 command systems, unmanned robotics, safety gates',
        scores: { defense: 5, harness: 4, ontology: 3, kimdaeshik: 2, canvas: 2 }
      }
    ]
  },
  {
    id: 2,
    titleKo: '2. 당장 해결하거나 탐구하고 싶은 핵심 과제는?',
    titleEn: '2. What is the key challenge you want to explore?',
    subKo: '가장 시급하거나 관심 높은 도메인 목표를 선택하세요.',
    subEn: 'Select the objective most relevant to your interest.',
    options: [
      {
        id: 'insight',
        labelKo: '생성형 AI의 인지 한계와 피지컬 AI(로보틱스)의 미래',
        labelEn: 'Cognitive limits of LLM & future of Physical AI',
        descKo: '뇌과학 관점의 토큰 예측 한계, 액션 데이터, 1인 에이전트 보스 전략',
        descEn: 'Brain vs LLM cognitive gap, action data, 1-person Agent Boss',
        scores: { kimdaeshik: 5, canvas: 2, ontology: 1, harness: 2, defense: 1 }
      },
      {
        id: 'rag_accuracy',
        labelKo: '기업 데이터의 환각 제거와 결정론적 지식 그래프 구축',
        labelEn: 'Eliminate hallucinations & build deterministic Knowledge Graphs',
        descKo: 'RAG의 벡터 유사도 검색 한계를 넘는 심볼릭 온톨로지 추론 및 검증',
        descEn: 'Hybrid symbolic reasoning exceeding naive vector RAG search',
        scores: { ontology: 5, canvas: 3, harness: 2, defense: 2, kimdaeshik: 1 }
      },
      {
        id: 'agent_loop',
        labelKo: '도구 호출(Tool Calling)과 다단계 자율 에이전트 아키텍처',
        labelEn: 'Tool calling and multi-step autonomous agent architectures',
        descKo: 'Pure LLM vs RAG vs Agentic 3대 패러다임 비교 및 시뮬레이션',
        descEn: 'Comparative simulation of LLM vs RAG vs Agentic execution trace',
        scores: { canvas: 5, harness: 3, kimdaeshik: 2, ontology: 2, defense: 2 }
      },
      {
        id: 'safety_mission',
        labelKo: '실시간 전장 상황판단 및 실패가 용납되지 않는 자율 제어',
        labelEn: 'Real-time tactical situational awareness & mission-critical control',
        descKo: 'OODA 루프 다계층 분산 에이전트, OAG 가드레일, 인간-기계 협업(HITL)',
        descEn: 'OODA multi-tier distributed agents, OAG guardrails, HITL',
        scores: { defense: 5, harness: 4, ontology: 2, canvas: 2, kimdaeshik: 2 }
      }
    ]
  },
  {
    id: 3,
    titleKo: '3. 가장 중점을 두는 시스템 아키텍처 속성은?',
    titleEn: '3. What system architecture attribute is most critical?',
    subKo: '아키텍처 설계 시 우선 순위를 정합니다.',
    subEn: 'Determines the priority architectural quality.',
    options: [
      {
        id: 'foundational_vision',
        labelKo: '패러다임 전환 통찰 & 미래 3개년 로드맵',
        labelEn: 'Paradigm Shift Insights & 3-Year Future Roadmap',
        descKo: '인공지능의 거시적 발전 방향과 산업별 PoC 수립 프레임워크',
        descEn: 'Macroevolution of AI and industry PoC framework',
        scores: { kimdaeshik: 5, canvas: 2, ontology: 1, defense: 1, harness: 1 }
      },
      {
        id: 'ground_truth',
        labelKo: '완벽한 정답성 & 설명 가능성(XAI)',
        labelEn: 'Ground Truth Accuracy & Explainable AI (XAI)',
        descKo: '온톨로지 트리플(Triple), SPARQL 질의, 지식 인과관계 추적성',
        descEn: 'Ontology triples, SPARQL queries, causal traceability',
        scores: { ontology: 5, canvas: 2, harness: 3, defense: 2, kimdaeshik: 1 }
      },
      {
        id: 'realtime_safety',
        labelKo: '초저지연 실시간성 & 무결성 가드레일',
        labelEn: 'Ultra-low Latency & Integrity Guardrails',
        descKo: '하네스 보안 검증, 에이전트 오케스트레이션 거버넌스(OAG), 엣지 대응',
        descEn: 'Harness security audit, Agent Governance (OAG), edge deployment',
        scores: { defense: 4, harness: 5, canvas: 2, ontology: 2, kimdaeshik: 1 }
      },
      {
        id: 'systematic_execution',
        labelKo: '실행 트레이스 시각화 & 구성요소 인터랙션',
        labelEn: 'Execution Trace Visualization & Component Interactivity',
        descKo: '단계별 노드 상태 전이, 토큰 비용 및 지연시간 비교 분석',
        descEn: 'Step-by-step state transition, token cost & latency benchmarks',
        scores: { canvas: 5, harness: 2, ontology: 2, defense: 2, kimdaeshik: 1 }
      }
    ]
  },
  {
    id: 4,
    titleKo: '4. 현재 투자 가능한 예상 학습 시간은?',
    titleEn: '4. How much time do you have right now?',
    subKo: '상황에 맞는 최적의 학습 경로 길이를 추천합니다.',
    subEn: 'Recommends the best track length for your schedule.',
    options: [
      {
        id: 'fast',
        labelKo: '⚡ 15분 핵심 급행 코스 (Quick 15-Min Briefing)',
        labelEn: '⚡ 15-Min Fast Briefing',
        descKo: '핵심 캔버스 및 대표 모듈 1개의 하이라이트 집중 탐색',
        descEn: 'Focused highlight on canvas and 1 core module',
        scores: { kimdaeshik: 3, canvas: 4, ontology: 2, defense: 2, harness: 2 }
      },
      {
        id: 'medium',
        labelKo: '🔍 1시간 심화 코스 (1-Hour Deep Dive)',
        labelEn: '🔍 1-Hour Deep Dive',
        descKo: '특정 전문 모듈 전체 섹션 및 실행 시뮬레이터 실습',
        descEn: 'Full section exploration of targeted module + simulator',
        scores: { ontology: 4, defense: 4, kimdaeshik: 4, canvas: 3, harness: 3 }
      },
      {
        id: 'master',
        labelKo: '🎓 마스터 풀코스 (Full Master Curriculum)',
        labelEn: '🎓 Full Master Curriculum',
        descKo: '기초(김대식) -> 중간(온톨로지) -> 고급(국방) 3단계 완주 및 수료증 취득',
        descEn: 'Foundational -> Intermediate -> Advanced full certification',
        scores: { kimdaeshik: 4, ontology: 4, defense: 5, canvas: 4, harness: 4 }
      }
    ]
  }
];

export const RecommendationWizardModal: React.FC<Props> = ({
  language,
  onClose,
  onNavigateTab,
  onShowToast
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const { recordActivity } = useProgress();

  const [activeTab, setActiveTab] = useState<TabType>('wizard');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCalculated, setIsCalculated] = useState(false);

  // Calculate scores
  const recommendationResult = useMemo(() => {
    const scores = {
      kimdaeshik: 0,
      ontology: 0,
      defense: 0,
      canvas: 0,
      harness: 0
    };

    QUIZ_QUESTIONS.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      if (selectedId) {
        const option = q.options.find((o) => o.id === selectedId);
        if (option) {
          scores.kimdaeshik += option.scores.kimdaeshik;
          scores.ontology += option.scores.ontology;
          scores.defense += option.scores.defense;
          scores.canvas += option.scores.canvas;
          scores.harness += option.scores.harness;
        }
      }
    });

    // Find highest score
    const entries = Object.entries(scores) as Array<[keyof typeof scores, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    const topKey = entries[0][0];

    const profiles: Record<
      keyof typeof scores,
      {
        tabId: ActiveTab;
        badgeKo: string;
        badgeEn: string;
        titleKo: string;
        titleEn: string;
        descKo: string;
        descEn: string;
        sequence: Array<{ step: string; tab: ActiveTab; labelKo: string; labelEn: string }>;
        icon: React.ReactNode;
        accentColor: string;
        keyTakeawayKo: string;
        keyTakeawayEn: string;
      }
    > = {
      kimdaeshik: {
        tabId: 'kimdaeshik',
        badgeKo: '트랙 A: 인지 패러다임 & 피지컬 AI',
        badgeEn: 'Track A: Cognitive Paradigms & Physical AI',
        titleKo: '김대식 교수 모듈 추천: 생성형 AI의 본질과 물리적 미래',
        titleEn: 'Prof. Kim Module: Foundations of Generative AI & Embodiment',
        descKo: '뇌과학 관점에서 LLM의 본질적 한계(환각, 비결정성)를 이해하고, 텍스트 챗봇에서 현실 세계를 조작하는 피지컬 AI(로보틱스) 및 1인 에이전트 보스 조직으로의 패러다임 전환을 가장 먼저 학습하는 것이 최적입니다.',
        descEn: 'Ideal starting point to understand brain vs LLM limits, transition from text chatbots to Physical AI, action data assets, and 1-person Agent Boss strategies.',
        sequence: [
          { step: '1단계', tab: 'kimdaeshik', labelKo: '김대식 교수 인지 패러다임 & 피지컬 AI', labelEn: 'Prof. Kim Module' },
          { step: '2단계', tab: 'canvas', labelKo: '아키텍처 캔버스 (LLM vs RAG vs Agentic)', labelEn: 'Architecture Canvas' },
          { step: '3단계', tab: 'roadmap', labelKo: '학습 로드맵에서 다음 심화 코스 확인', labelEn: 'Learning Roadmap' }
        ],
        icon: <Brain className="w-6 h-6 text-purple-400" />,
        accentColor: 'purple',
        keyTakeawayKo: '토큰 예측형 인지 한계 극복, 액션 데이터 확보, 4계층 물리 AI 오케스트레이터 설계',
        keyTakeawayEn: 'Overcoming token prediction limits, capturing action data, 4-tier Physical AI orchestrator'
      },
      ontology: {
        tabId: 'ontology',
        badgeKo: '트랙 B: 지식 그래프 & 심볼릭 추론',
        badgeEn: 'Track B: Knowledge Graph & Symbolic Reasoning',
        titleKo: '온톨로지 AI 모듈 추천: 기업용 신뢰성 & 환각 제로 체계',
        titleEn: 'Ontology AI Module: Enterprise Reliability & Zero-Hallucination',
        descKo: '벡터 검색(RAG)의 근본적 오차를 극복하기 위해 온톨로지 지식 그래프와 트리플(Triple) 관계망, SPARQL 추론 엔진을 결합한 하이브리드 고신뢰 AI 구조를 마스터하는 코스입니다.',
        descEn: 'Perfect for building explainable ground-truth systems combining ontologies, RDF triples, SPARQL, and neuro-symbolic reasoning to eliminate hallucinations.',
        sequence: [
          { step: '1단계', tab: 'ontology', labelKo: '온톨로지 AI 탐색기 (4대 섹션)', labelEn: 'Ontology AI Explorer' },
          { step: '2단계', tab: 'graph', labelKo: '지식 그래프 (연계 상호작용)', labelEn: 'Knowledge Graph' },
          { step: '3단계', tab: 'dictionary', labelKo: '용어 사전 52선 (심볼릭 용어 마스터)', labelEn: '52 Core Terms' }
        ],
        icon: <Network className="w-6 h-6 text-indigo-400" />,
        accentColor: 'indigo',
        keyTakeawayKo: '온톨로지 스키마 설계, 하이브리드 뉴로-심볼릭 추론, 지식 무결성 검증 파이프라인',
        keyTakeawayEn: 'Ontology schema engineering, hybrid neuro-symbolic reasoning, knowledge verification'
      },
      defense: {
        tabId: 'defense',
        badgeKo: '트랙 C: 미션 크리티컬 & 국방 자율 체계',
        badgeEn: 'Track C: Mission-Critical & Defense Autonomous Systems',
        titleKo: '국방 AI 모듈 추천: 실시간 전장 다계층 자율 에이전트',
        titleEn: 'Defense AI Module: Multi-Tier Autonomous Battlefield Systems',
        descKo: '실패가 치명적인 전장/항공/산업 환경에서 OODA 루프 기반 다계층 에이전트(전략-작전-전술)와 인간 개입(HITL), 폐쇄망 보안 거버넌스를 완벽히 구현하는 최고 난이도 코스입니다.',
        descEn: 'High-stakes curriculum mastering OODA multi-tier agent swarms, human-in-the-loop (HITL) safety, air-gapped security, and real-time mission orchestration.',
        sequence: [
          { step: '1단계', tab: 'defense', labelKo: '국방 AI 탐색기 (다계층 에이전트)', labelEn: 'Defense AI Explorer' },
          { step: '2단계', tab: 'harness', labelKo: '하네스 & OAG (에이전트 거버넌스 가드레일)', labelEn: 'Harness & OAG' },
          { step: '3단계', tab: 'simulator', labelKo: '실행 시뮬레이터 (트레이스 검증)', labelEn: 'Execution Simulator' }
        ],
        icon: <Crosshair className="w-6 h-6 text-emerald-400" />,
        accentColor: 'emerald',
        keyTakeawayKo: 'OODA 루프 다계층 분산 제어, OAG 가드레일, 인간-인공지능 팀(MUM-T) 지휘통제',
        keyTakeawayEn: 'OODA multi-tier distributed control, OAG guardrails, manned-unmanned teaming (MUM-T)'
      },
      canvas: {
        tabId: 'canvas',
        badgeKo: '트랙 D: 3대 아키텍처 비교 & 엔지니어링',
        badgeEn: 'Track D: 3-Tier Architecture Engineering',
        titleKo: '아키텍처 캔버스 & 시뮬레이터 추천: Pure LLM vs RAG vs Agentic',
        titleEn: 'Architecture Canvas & Simulator: LLM vs RAG vs Agentic AI',
        descKo: '현대 AI 엔지니어링의 핵심인 3대 패러다임(Pure LLM, RAG, Agentic AI)의 노드 간 데이터 흐름, 실행 지연시간, 토큰 비용, 그리고 복잡도를 직접 비교하고 시뮬레이션하는 실무 최적화 코스입니다.',
        descEn: 'Hands-on comparison of the 3 major paradigms, interactive node inspection, latency & token benchmarks, and step-by-step trace simulation.',
        sequence: [
          { step: '1단계', tab: 'canvas', labelKo: '아키텍처 캔버스 (패러다임 필터링 및 노드 검사)', labelEn: 'Architecture Canvas' },
          { step: '2단계', tab: 'simulator', labelKo: '실행 시뮬레이터 (스텝별 트레이스 재생)', labelEn: 'Execution Simulator' },
          { step: '3단계', tab: 'matrix', labelKo: '비교 매트릭스 (정량 지표 한눈에 비교)', labelEn: 'Comparison Matrix' }
        ],
        icon: <Layers className="w-6 h-6 text-blue-400" />,
        accentColor: 'blue',
        keyTakeawayKo: 'RAG 검색 증강 파이프라인, ReAct/Plan-and-Solve 에이전트 루프, 비용-성능 트레이드오프',
        keyTakeawayEn: 'RAG retrieval pipeline, ReAct agent loops, cost-latency engineering tradeoffs'
      },
      harness: {
        tabId: 'harness',
        badgeKo: '트랙 E: 거버넌스 & 안전 하네스',
        badgeEn: 'Track E: Governance & Safety Harness',
        titleKo: '하네스 & OAG 모듈 추천: 에이전트 통제 및 보안 엔지니어링',
        titleEn: 'Harness & OAG: Agent Governance & Safety Guardrails',
        descKo: '자율 에이전트의 오작동, 환각 유출, 권한 탈취를 방지하기 위한 시스템적 안전 장치(Harness)와 통합 오케스트레이션 거버넌스(OAG) 규격을 학습합니다.',
        descEn: 'Learn comprehensive guardrails preventing agent runaway, security breaches, and token runaway via strict harness layers and Agent Governance (OAG).',
        sequence: [
          { step: '1단계', tab: 'harness', labelKo: '하네스 & OAG 아키텍처 탐색기', labelEn: 'Harness & OAG Explorer' },
          { step: '2단계', tab: 'defense', labelKo: '국방 AI 가드레일 연계', labelEn: 'Defense AI Guardrails' },
          { step: '3단계', tab: 'dictionary', labelKo: '52선 사전에서 안전 거버넌스 용어 학습', labelEn: 'Safety Terms in Dictionary' }
        ],
        icon: <Shield className="w-6 h-6 text-amber-400" />,
        accentColor: 'amber',
        keyTakeawayKo: '시스템 인풋/아웃풋 샌드박싱, 에이전트 승인 정책(Policy Gate), 롤백 메커니즘',
        keyTakeawayEn: 'Input/output sandboxing, policy approval gates, transaction rollback mechanisms'
      }
    };

    return {
      topKey,
      profile: profiles[topKey],
      scores
    };
  }, [selectedAnswers]);

  const allAnswered = QUIZ_QUESTIONS.every((q) => selectedAnswers[q.id]);

  const handleSelectOption = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleApplyRecommendation = (tabId: ActiveTab, trackName: string) => {
    recordActivity({
      type: 'navigate_tab',
      titleKo: `추천 코스 시작: ${trackName}`,
      titleEn: `Started Recommended Track: ${trackName}`,
      detailKo: `맞춤 진단 결과에 따라 ${tabId} 모듈로 학습을 시작합니다.`,
      detailEn: `Beginning study in ${tabId} module based on personalized diagnosis.`,
      metadata: { tab: tabId }
    });
    onNavigateTab(tabId);
    if (onShowToast) {
      onShowToast(
        isKo
          ? `✨ 맞춤 추천 트랙으로 이동했습니다: ${trackName}`
          : `✨ Jumped to recommended track: ${trackName}`
      );
    }
    onClose();
  };

  const PRESET_TRACKS = [
    {
      id: 'beginner_vision',
      titleKo: '🌱 AI 패러다임 입문 & 기획자 패스트트랙',
      titleEn: '🌱 Beginner & PM Fast Track',
      badgeKo: '추천도 98% · 약 1.5시간',
      badgeEn: '98% Match · ~1.5 hrs',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      color: 'purple',
      targetTab: 'kimdaeshik' as ActiveTab,
      targetNameKo: '김대식 교수 모듈',
      targetNameEn: 'Prof. Kim Module',
      summaryKo: '생성형 AI의 인지 한계, 피지컬 AI 전환 이유, 1인 에이전트 보스 전략을 가장 직관적으로 이해할 수 있는 코스.',
      summaryEn: 'Most intuitive track to grasp LLM limits, Physical AI shift, and 1-person agent workflows.',
      tagsKo: ['뇌과학', '피지컬 AI', '액션 데이터', '입문 추천'],
      tagsEn: ['Brain Science', 'Physical AI', 'Action Data', 'Intro']
    },
    {
      id: 'enterprise_rag',
      titleKo: '🏢 엔터프라이즈 신뢰성 & 지식 그래프 트랙',
      titleEn: '🏢 Enterprise RAG & Knowledge Graph Track',
      badgeKo: '추천도 95% · 약 2.5시간',
      badgeEn: '95% Match · ~2.5 hrs',
      icon: <Network className="w-5 h-5 text-indigo-400" />,
      color: 'indigo',
      targetTab: 'ontology' as ActiveTab,
      targetNameKo: '온톨로지 AI 모듈',
      targetNameEn: 'Ontology AI Module',
      summaryKo: '기업 사내 데이터 환각을 제로화하는 심볼릭 온톨로지와 하이브리드 RAG 지식베이스 설계 전문 코스.',
      summaryEn: 'Master symbolic ontologies and hybrid RAG to eliminate enterprise hallucinations.',
      tagsKo: ['온톨로지', '지식 그래프', 'SPARQL', '환각 제로'],
      tagsEn: ['Ontology', 'Knowledge Graph', 'SPARQL', 'Zero-Hallucination']
    },
    {
      id: 'agent_engineer',
      titleKo: '⚙️ 자율 에이전트 & 아키텍처 실무 트랙',
      titleEn: '⚙️ Agentic AI & Architecture Engineering',
      badgeKo: '추천도 96% · 약 2.0시간',
      badgeEn: '96% Match · ~2.0 hrs',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      color: 'blue',
      targetTab: 'canvas' as ActiveTab,
      targetNameKo: '아키텍처 캔버스 & 시뮬레이터',
      targetNameEn: 'Architecture Canvas & Simulator',
      summaryKo: 'Pure LLM vs RAG vs Agentic 3대 패러다임의 실행 트레이스, 토큰 비용, 도구 호출 루프를 직접 비교 분석.',
      summaryEn: 'Hands-on comparison of LLM, RAG, and Agentic execution traces, token costs, and loops.',
      tagsKo: ['3대 패러다임', '도구 호출', '실행 시뮬레이터', '비용 분석'],
      tagsEn: ['3 Paradigms', 'Tool Calling', 'Simulator', 'Cost Analysis']
    },
    {
      id: 'defense_mission',
      titleKo: '🛡️ 국방 & 미션 크리티컬 최고 난이도 트랙',
      titleEn: '🛡️ Defense & Mission-Critical Mastery',
      badgeKo: '추천도 99% · 약 3.5시간',
      badgeEn: '99% Match · ~3.5 hrs',
      icon: <Crosshair className="w-5 h-5 text-emerald-400" />,
      color: 'emerald',
      targetTab: 'defense' as ActiveTab,
      targetNameKo: '국방 AI 모듈 & 하네스',
      targetNameEn: 'Defense AI & Harness',
      summaryKo: '전장 지휘통제(C2), OODA 다계층 에이전트, 안전 가드레일(OAG), 보안 폐쇄망을 완벽히 다루는 최고 난이도 코스.',
      summaryEn: 'Highest-level curriculum for C2 battlefield control, multi-tier OODA swarms, and safety guardrails.',
      tagsKo: ['국방 AI', 'OODA 루프', 'OAG 하네스', 'HITL'],
      tagsEn: ['Defense AI', 'OODA Loop', 'OAG Harness', 'HITL']
    }
  ];

  const ARCHITECTURE_DECISION_RULES = [
    {
      arch: 'Pure LLM (단순 프롬프트)',
      archEn: 'Pure LLM',
      color: 'blue',
      suitableForKo: '창의적 글쓰기, 브레인스토밍, 문장 번역/요약, 고정된 상식 기반 질의응답',
      suitableForEn: 'Creative writing, brainstorming, translation, static general QA',
      whenNotKo: '최신 사내 문서 필요 시, 사실 정확도가 절대적인 경우, 외부 도구 실행 필요 시',
      whenNotEn: 'When recent domain knowledge or tool execution is required',
      latency: '⚡ 빠름 (< 1.5s)',
      cost: '💵 낮음'
    },
    {
      arch: 'RAG Architecture (검색 증강)',
      archEn: 'RAG Architecture',
      color: 'emerald',
      suitableForKo: '사내 규정/기술 문서 질의응답, 대용량 비정형 텍스트 기반 답변, 출처 인용이 필요한 시스템',
      suitableForEn: 'Enterprise doc QA, large unstructured text search, citation grounding',
      whenNotKo: '다단계 계획(Plan)과 액션 실행이 필요한 경우, 복합 논리 추론이 필요한 경우',
      whenNotEn: 'When multi-step reasoning and automated actions are required',
      latency: '⏱️ 보통 (2.0s ~ 4.0s)',
      cost: '💵 보통 (임베딩+검색)'
    },
    {
      arch: 'Agentic AI (자율 에이전트)',
      archEn: 'Agentic AI',
      color: 'amber',
      suitableForKo: '웹 검색+DB 조회+코드 실행 등 복합 태스크, 자동 문제 해결, 워크플로 자동화',
      suitableForEn: 'Multi-tool workflows, complex automation, plan-and-solve execution',
      whenNotKo: '지연시간이 500ms 이하여야 하는 초저지연 환경, 토큰 비용에 극도로 민감한 경우',
      whenNotEn: 'Ultra-low latency (<500ms) or strictly minimal token budgets',
      latency: '⏳ 높음 (4.0s ~ 12.0s)',
      cost: '💰 높음 (다회 왕복)'
    },
    {
      arch: 'Ontology + OAG + Multi-Tier (국방/엔터프라이즈 하이브리드)',
      archEn: 'Ontology + OAG Hybrid',
      color: 'purple',
      suitableForKo: '무인 무기/의료/금융/물리 장비 제어, 실패가 용납되지 않는 미션 크리티컬 체계, 완전한 설명 가능성 요구 시',
      suitableForEn: 'Mission-critical, physical robotics, zero-error tolerance, XAI causal tracking',
      whenNotKo: '단순 프로토타입 PoC 또는 도메인 온톨로지 구축 리소스가 없는 경우',
      whenNotEn: 'Early exploratory PoC without domain ontology resources',
      latency: '⚡~⏳ 엣지 실시간 + 전략 분석 분리',
      cost: '🛡️ 고신뢰 투자'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight
              ? 'bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-slate-200'
              : 'bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  {isKo ? 'AI 아키텍처 & 학습 코스 맞춤 추천' : 'Personalized AI Architecture & Course Recommender'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  AI Advisor
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {isKo
                  ? '당신의 배경과 목표에 가장 최적화된 학습 모듈과 아키텍처를 추천해 드립니다.'
                  : 'Get tailored recommendations based on your goals, background, and system requirements.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation inside Modal */}
        <div
          className={`px-5 py-2.5 border-b flex items-center justify-between gap-2 shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'wizard'
                  ? isLight
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isKo ? '30초 맞춤 진단 퀴즈' : 'Diagnostic Quiz'}</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'presets'
                  ? isLight
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{isKo ? '추천 트랙 4선 (즉시 시작)' : '4 Curated Tracks'}</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'matrix'
                  ? isLight
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isKo ? '아키텍처 선택 가이드' : 'Architecture Selector'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
            {activeTab === 'wizard' && `${Object.keys(selectedAnswers).length} / ${QUIZ_QUESTIONS.length} ${isKo ? '응답 완료' : 'Answered'}`}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: DIAGNOSTIC WIZARD */}
          {activeTab === 'wizard' && (
            <div>
              {/* Question list or Result */}
              {!isCalculated ? (
                <div className="space-y-6">
                  {/* Progress indicator */}
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>
                      {isKo ? `문항 ${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}` : `Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}`}
                    </span>
                    <div className="flex items-center gap-1">
                      {QUIZ_QUESTIONS.map((q, idx) => (
                        <div
                          key={q.id}
                          className={`w-6 h-1.5 rounded-full transition-all ${
                            selectedAnswers[q.id]
                              ? 'bg-amber-500'
                              : idx === currentQuestionIndex
                              ? 'bg-amber-500/40 ring-2 ring-amber-500/20'
                              : isLight
                              ? 'bg-slate-200'
                              : 'bg-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Question Box */}
                  {(() => {
                    const q = QUIZ_QUESTIONS[currentQuestionIndex];
                    return (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold tracking-tight">
                            {isKo ? q.titleKo : q.titleEn}
                          </h3>
                          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {isKo ? q.subKo : q.subEn}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt) => {
                            const isSelected = selectedAnswers[q.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                  isSelected
                                    ? isLight
                                      ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-400/50'
                                      : 'bg-amber-950/30 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                                    : isLight
                                    ? 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200 text-slate-800'
                                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                    isSelected
                                      ? 'bg-amber-500 border-amber-500 text-white'
                                      : isLight
                                      ? 'border-slate-300'
                                      : 'border-zinc-700'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm">
                                    {isKo ? opt.labelKo : opt.labelEn}
                                  </div>
                                  <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                                    {isKo ? opt.descKo : opt.descEn}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation between questions */}
                        <div className="flex items-center justify-between pt-4">
                          <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                              currentQuestionIndex === 0
                                ? 'opacity-30 cursor-not-allowed border-transparent'
                                : isLight
                                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            {isKo ? '← 이전 문항' : '← Previous'}
                          </button>

                          {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
                            <button
                              disabled={!selectedAnswers[q.id]}
                              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                !selectedAnswers[q.id]
                                  ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                              }`}
                            >
                              <span>{isKo ? '다음 문항' : 'Next'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              disabled={!allAnswered}
                              onClick={() => setIsCalculated(true)}
                              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-md ${
                                !allAnswered
                                  ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
                              }`}
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>{isKo ? '맞춤 분석 결과 보기' : 'View Recommendations'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* RESULT DISPLAY */
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Top Match Hero Card */}
                  <div
                    className={`p-6 rounded-2xl border relative overflow-hidden ${
                      isLight
                        ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-300 shadow-lg'
                        : 'bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-amber-950/20 border-amber-500/40 shadow-xl'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-inner">
                          {recommendationResult.profile.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-zinc-950">
                              {isKo ? recommendationResult.profile.badgeKo : recommendationResult.profile.badgeEn}
                            </span>
                            <span className="text-xs font-mono text-amber-500 font-semibold">
                              {isKo ? '적합도 99% 매칭' : '99% Match'}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1">
                            {isKo ? recommendationResult.profile.titleKo : recommendationResult.profile.titleEn}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleApplyRecommendation(
                            recommendationResult.profile.tabId,
                            isKo ? recommendationResult.profile.badgeKo : recommendationResult.profile.badgeEn
                          )
                        }
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isKo ? '이 트랙으로 바로 시작하기 →' : 'Start This Track Now →'}</span>
                      </button>
                    </div>

                    <p className={`text-xs sm:text-sm mt-4 leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                      {isKo ? recommendationResult.profile.descKo : recommendationResult.profile.descEn}
                    </p>

                    {/* Key takeaway highlight */}
                    <div
                      className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                        isLight ? 'bg-amber-100/60 border-amber-300 text-amber-950' : 'bg-amber-950/30 border-amber-600/30 text-amber-300'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <strong>{isKo ? '핵심 학습 목표: ' : 'Core Goal: '}</strong>
                        {isKo ? recommendationResult.profile.keyTakeawayKo : recommendationResult.profile.keyTakeawayEn}
                      </div>
                    </div>

                    {/* Recommended Sequence */}
                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                        {isKo ? '권장 3단계 학습 시퀀스' : 'Recommended 3-Step Sequence'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {recommendationResult.profile.sequence.map((seq, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              handleApplyRecommendation(
                                seq.tab,
                                isKo ? seq.labelKo : seq.labelEn
                              )
                            }
                            className={`p-3 rounded-xl border transition-all cursor-pointer group hover:scale-[1.01] ${
                              isLight
                                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-500">
                              <span>{seq.step}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="text-xs font-bold mt-1 line-clamp-1">
                              {isKo ? seq.labelKo : seq.labelEn}
                            </div>
                            <div className={`text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                              {isKo ? '클릭하여 이동' : 'Click to explore'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Retake test & secondary actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setIsCalculated(false);
                        setCurrentQuestionIndex(0);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isKo ? '진단 다시 하기' : 'Retake Diagnostic'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('presets')}
                      className={`text-xs font-semibold text-amber-500 hover:underline cursor-pointer`}
                    >
                      {isKo ? '다른 추천 트랙들도 비교하기 →' : 'Compare other curated tracks →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRESET TRACKS (4 CURATED) */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold">
                    {isKo ? '목적별 큐레이션 추천 트랙 4선' : '4 Curated Recommendation Tracks by Purpose'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {isKo
                      ? '자신의 학습 목적에 맞는 코스를 선택하면 해당 모듈로 즉시 전환됩니다.'
                      : 'Select any course track to jump immediately into its curriculum.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_TRACKS.map((track) => (
                  <div
                    key={track.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-lg ${
                      isLight ? 'bg-slate-50/70 hover:bg-white border-slate-200' : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60`}>
                            {track.icon}
                          </div>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {isKo ? track.badgeKo : track.badgeEn}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base mt-2">
                        {isKo ? track.titleKo : track.titleEn}
                      </h4>

                      <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                        {isKo ? track.summaryKo : track.summaryEn}
                      </p>

                      {/* Tag badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(isKo ? track.tagsKo : track.tagsEn).map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              isLight ? 'bg-white text-slate-700 border-slate-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {isKo ? '목표 탭: ' : 'Target: '}
                        <strong>{isKo ? track.targetNameKo : track.targetNameEn}</strong>
                      </span>
                      <button
                        onClick={() =>
                          handleApplyRecommendation(track.targetTab, isKo ? track.titleKo : track.titleEn)
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform hover:scale-105"
                      >
                        <span>{isKo ? '트랙 시작' : 'Start'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE DECISION MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold">
                  {isKo ? '상황별 AI 아키텍처 선택 가이드' : 'AI Architecture Decision Guide by Scenario'}
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {isKo
                    ? '프로젝트의 요구사항(실시간성, 환각 허용도, 데이터 종류)에 따라 어떤 아키텍처를 선택해야 하는지 비교합니다.'
                    : 'Compare which architecture paradigm fits your latency, accuracy, and tooling requirements.'}
                </p>
              </div>

              <div className="space-y-3">
                {ARCHITECTURE_DECISION_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/50">
                      <div className="font-bold text-sm text-amber-500 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>{isKo ? rule.arch : rule.archEn}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${isLight ? 'bg-slate-200 text-slate-800' : 'bg-zinc-800 text-zinc-300'}`}>
                          지연시간: {rule.latency}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${isLight ? 'bg-slate-200 text-slate-800' : 'bg-zinc-800 text-zinc-300'}`}>
                          비용: {rule.cost}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-semibold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isKo ? '적합한 상황 (Best For)' : 'Best For'}</span>
                        </div>
                        <p className={isLight ? 'text-slate-700' : 'text-zinc-300'}>
                          {isKo ? rule.suitableForKo : rule.suitableForEn}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          <span>{isKo ? '부적합/주의 상황 (When to Avoid)' : 'When to Avoid'}</span>
                        </div>
                        <p className={isLight ? 'text-slate-700' : 'text-zinc-300'}>
                          {isKo ? rule.whenNotKo : rule.whenNotEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    {isKo
                      ? '더 자세한 12개 항목 정량 비교는 [비교 매트릭스] 탭에서 확인하실 수 있습니다.'
                      : 'For 12 detailed quantitative metrics, visit the [Comparison Matrix] tab.'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigateTab('matrix');
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  {isKo ? '매트릭스 보기 →' : 'View Matrix →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <div className="text-xs text-zinc-400">
            {isKo ? '⚡ 3대 패러다임 · 국방 · 온톨로지 · 김대식 교수 통합 분석' : 'Unified analysis across all AI paradigms'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNavigateTab('roadmap');
                onClose();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 inline mr-1" />
              <span>{isKo ? '전체 로드맵 보기' : 'View Roadmap'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer transition"
            >
              {isKo ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
