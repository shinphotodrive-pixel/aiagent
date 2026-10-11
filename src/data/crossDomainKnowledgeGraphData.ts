// Cross-Domain AI Concept Knowledge Graph Dataset
// Interconnecting KimDaeShik, Ontology AI, and Defense AI concepts

export type DomainCluster = 'kim' | 'ontology' | 'defense' | 'cross-synthesis';

export interface ConceptNode {
  id: string;
  labelKo: string;
  labelEn: string;
  cluster: DomainCluster;
  sourceModuleKo: string;
  sourceModuleEn: string;
  x: number;
  y: number;
  size: number; // importance weight: 14 to 28
  badgeKo: string;
  badgeEn: string;
  summaryKo: string;
  summaryEn: string;
  keyPrinciplesKo: string[];
  keyPrinciplesEn: string[];
  architecturalRoleKo: string;
  architecturalRoleEn: string;
  tags: string[];
}

export interface ConceptEdge {
  id: string;
  source: string;
  target: string;
  relationKo: string;
  relationEn: string;
  type: 'synergy' | 'grounding' | 'control' | 'evolution' | 'protocol';
  descriptionKo: string;
  descriptionEn: string;
}

export const DOMAIN_CLUSTER_META: Record<
  DomainCluster,
  {
    nameKo: string;
    nameEn: string;
    color: string;
    lightColor: string;
    bgColor: string;
    lightBgColor: string;
    borderColor: string;
    lightBorderColor: string;
    descKo: string;
    descEn: string;
  }
> = {
  kim: {
    nameKo: '김대식 교수 인지 & 피지컬 AI',
    nameEn: 'Prof. Kim: Cognitive & Physical AI',
    color: '#c084fc', // purple-400
    lightColor: '#7e22ce', // purple-700
    bgColor: 'rgba(147, 51, 234, 0.15)',
    lightBgColor: '#f3e8ff',
    borderColor: '#a855f7',
    lightBorderColor: '#c084fc',
    descKo: '뇌과학 기반 LLM 비결정성 한계 극복, 행동하는 피지컬 AI, 액션 데이터 자산화, 1인 창업 에이전트 보스',
    descEn: 'Brain cognition limits, action data acquisition, physical actuator agents, 1-person Agent Boss',
  },
  ontology: {
    nameKo: '온톨로지 AI 뉴로심볼릭 지식 그래프',
    nameEn: 'Ontology AI: Neuro-Symbolic Graph',
    color: '#818cf8', // indigo-400
    lightColor: '#4338ca', // indigo-700
    bgColor: 'rgba(99, 102, 241, 0.15)',
    lightBgColor: '#e0e7ff',
    borderColor: '#6366f1',
    lightBorderColor: '#818cf8',
    descKo: 'RDF/OWL 정형 스키마, 팔란티어 AIP식 전술 온톨로지, KNTDS C4I 실시간 센서 융합, 0% 환각 뉴로심볼릭 추론',
    descEn: 'RDF/OWL formal schema, Palantir AIP tactical ontology, C4I sensor fusion, zero-hallucination neuro-symbolic',
  },
  defense: {
    nameKo: '국방 AI 30년 체계 & 물리 에어갭',
    nameEn: 'Defense AI: 30-Yr Systems & Air-Gap',
    color: '#34d399', // emerald-400
    lightColor: '#047857', // emerald-700
    bgColor: 'rgba(16, 185, 129, 0.15)',
    lightBgColor: '#d1fae5',
    borderColor: '#10b981',
    lightBorderColor: '#34d399',
    descKo: 'RS-422/MIL-STD-1553B/Link-16 국방 MCP 연동, HITL 2단계 승인 게이트, 물리 킬 스위치, 1인 대기업 사단',
    descEn: 'MIL-STD-1553B/Link-16 defense MCPs, HITL 2-step approval gate, physical kill-switch, defense solopreneur',
  },
  'cross-synthesis': {
    nameKo: '3대 융합 핵심 노드 (Cross-Synthesis)',
    nameEn: 'Cross-Synthesis Tri-Domain Hubs',
    color: '#f59e0b', // amber-500
    lightColor: '#b45309', // amber-700
    bgColor: 'rgba(245, 158, 11, 0.2)',
    lightBgColor: '#fef3c7',
    borderColor: '#f59e0b',
    lightBorderColor: '#fbbf24',
    descKo: '3개 도메인이 직접 교차하는 융합 아키텍처: 실시간 결심 우위, 하네스 3계층 방벽, 6개월 PoC 패스트트랙',
    descEn: 'Architectural intersection points: tactical decision superiority, 3-layer harness guardrail, fast-track PoC',
  },
};

export const CONCEPT_NODES: ConceptNode[] = [
  // --- CLUSTER 1: KIM DAE-SHIK (Cognitive & Physical AI) ---
  {
    id: 'kim-brain-cognition',
    labelKo: '뇌과학 vs LLM 인지 한계',
    labelEn: 'Brain vs LLM Cognition',
    cluster: 'kim',
    sourceModuleKo: '김대식 모듈 #8 인지 인사이트',
    sourceModuleEn: 'Kim Module #8 Academic Insights',
    x: 200,
    y: 160,
    size: 22,
    badgeKo: '인지 메커니즘',
    badgeEn: 'Cognitive Limit',
    summaryKo: '인간 뇌의 인과 추론 구조와 LLM 확률적 다음 토큰 예측의 본질적 차이. 환각과 비결정성을 상쇄하는 외부 정형 구조의 필요성 제기.',
    summaryEn: 'Disparities between human causal deduction and LLM probabilistic token prediction, justifying external symbolic structures.',
    keyPrinciplesKo: [
      '생성형 AI의 본질은 확률 통계적 패턴 매칭이며 참/거짓 판단 능력이 없음',
      '단독 LLM에 무기체계나 미션 크리티컬 결정을 위임하면 치명적 환각 발생',
      '뇌의 억제 회로처럼 LLM 출력을 제약할 하드웨어·온톨로지 가드레일 필수'
    ],
    keyPrinciplesEn: [
      'LLMs predict statistical tokens and lack intrinsic truth validation',
      'Autonomous weapon delegation requires zero-hallucination external guards',
      'Requires neuro-symbolic and hardware inhibition circuits'
    ],
    architecturalRoleKo: '모든 AI 아키텍처 설계의 출발점으로, "왜 순수 LLM만으로는 군사/산업 장비를 제어할 수 없는가"에 대한 근원적 답을 제시.',
    architecturalRoleEn: 'The philosophical foundation explaining why pure LLMs cannot safely control physical actuators.',
    tags: ['Cognition', 'LLM Limits', 'Hallucination', 'Brain Science']
  },
  {
    id: 'kim-physical-ai',
    labelKo: '피지컬 AI & 액션 데이터',
    labelEn: 'Physical AI & Action Data',
    cluster: 'kim',
    sourceModuleKo: '김대식 모듈 #2 피지컬 AI',
    sourceModuleEn: 'Kim Module #2 Physical AI',
    x: 380,
    y: 180,
    size: 26,
    badgeKo: '현실 조작 패러다임',
    badgeEn: 'Physical AI Core',
    summaryKo: '디지털 텍스트 챗봇에서 벗어나 센서와 액추에이터를 통해 현실 세계와 물리적으로 상호작용하는 물리 AI 체계.',
    summaryEn: 'Evolution from digital text chat to sensor-actuator interaction within physical environments.',
    keyPrinciplesKo: [
      '웹 크롤링 텍스트 데이터의 고갈에 따른 물리 환경 실시간 액션 데이터의 독점적 가치',
      '모터, 로봇 암, 유무인 복합기 조작 로그가 새로운 경제적 해자(Moat) 형성',
      '디지털 트윈 상의 시뮬레이션과 물리 장비 제어 오케스트레이터의 융합'
    ],
    keyPrinciplesEn: [
      'Action data from physical interaction forms an unassailable strategic moat',
      'Robot actuator, drone, and vehicle telemetry logs become primary training assets',
      'Bridges digital-twin simulation with on-device physical execution'
    ],
    architecturalRoleKo: '국방 하드웨어 장비와 온톨로지 지식 그래프가 실제로 조작해야 할 "물리적 실행체"의 정의.',
    architecturalRoleEn: 'Defines the physical actuators operated by defense protocols and ontology reasoning.',
    tags: ['Physical AI', 'Actuators', 'Action Data', 'Robotics']
  },
  {
    id: 'kim-orchestrator-arch',
    labelKo: '4계층 물리 AI 오케스트레이터',
    labelEn: '4-Layer Physical Orchestrator',
    cluster: 'kim',
    sourceModuleKo: '김대식 모듈 #3 오케스트레이터',
    sourceModuleEn: 'Kim Module #3 Orchestrator',
    x: 280,
    y: 310,
    size: 24,
    badgeKo: '계층 아키텍처',
    badgeEn: '4-Layer Stack',
    summaryKo: '물리 계층(장비) - 통신 계층(MCP) - 두뇌 계층(온톨로지/LLM) - 안전 거버넌스(가드레일)로 분리된 안정적 실행 파이프라인.',
    summaryEn: 'Separation of Physical, Protocol, Cognitive Reasoning, and Safety Governance layers.',
    keyPrinciplesKo: [
      'Layer 1: 물리 하드웨어 센서/액추에이터 인터페이스',
      'Layer 2: A2A / MCP 통신 및 장비 드라이버 프로토콜',
      'Layer 3: 인지 및 의사결정 추론 두뇌 (Neuro-Symbolic Brain)',
      'Layer 4: 안전성 가드레일 및 긴급 킬 스위치 거버넌스'
    ],
    keyPrinciplesEn: [
      'Layer 1: Physical hardware sensor/actuator bus',
      'Layer 2: MCP protocol & equipment driver layer',
      'Layer 3: Neuro-symbolic reasoning & decision core',
      'Layer 4: Safety guardrail & emergency kill switch'
    ],
    architecturalRoleKo: '국방 통신 프로토콜과 온톨로지 그래프를 하나로 묶어주는 전역 4계층 청사진.',
    architecturalRoleEn: 'The overarching architectural stack integrating defense protocols with semantic ontologies.',
    tags: ['Orchestrator', '4-Layer Stack', 'System Architecture', 'Governance']
  },
  {
    id: 'kim-agent-boss',
    labelKo: '1인 에이전트 보스 (Solo-Boss)',
    labelEn: '1-Person Agent Boss Fleet',
    cluster: 'kim',
    sourceModuleKo: '김대식 모듈 #7 에이전트 보스',
    sourceModuleEn: 'Kim Module #7 Agent Boss',
    x: 180,
    y: 440,
    size: 20,
    badgeKo: '조직 혁신',
    badgeEn: 'Solopreneur Model',
    summaryKo: '엔지니어 1인이 수십 대의 AI 특화 에이전트 조직을 거느리고 기획, 개발, 운영을 총괄하는 새로운 1인 대기업 운영 모델.',
    summaryEn: 'Single architect managing specialized sub-agent fleets to orchestrate enterprise systems.',
    keyPrinciplesKo: [
      '인지적 과부하 방지를 위한 에이전트 책임 경계 분할',
      '자율 코딩, 문서 감사, 규격 검증 에이전트의 오케스트레이션',
      '30년 경력의 베테랑이 회장 마인드셋으로 비즈니스 의사결정만 집중'
    ],
    keyPrinciplesEn: [
      'Strict cognitive domain boundaries to avoid operational fatigue',
      'Delegation of code synthesis, audit, and specification verification',
      'Direct convergence with Defense 30-year career agile fleet'
    ],
    architecturalRoleKo: '국방 및 온톨로지 복합 체계를 1인/소수 정예로 구축하고 신속 배포할 수 있는 조직적 원동력.',
    architecturalRoleEn: 'Organizational framework enabling a lean team to build defense-grade AI architectures.',
    tags: ['Agent Boss', 'Solopreneur', 'Fleet Orchestration', 'Org Model']
  },

  // --- CLUSTER 2: ONTOLOGY AI (Neuro-Symbolic & Graph RAG) ---
  {
    id: 'ont-neuro-symbolic',
    labelKo: '뉴로-심볼릭 AI 상호 검증',
    labelEn: 'Neuro-Symbolic Dual Verification',
    cluster: 'ontology',
    sourceModuleKo: '온톨로지 모듈 #1 뉴로심볼릭',
    sourceModuleEn: 'Ontology Module #1 Neuro-Symbolic',
    x: 520,
    y: 320,
    size: 28,
    badgeKo: '핵심 엔진',
    badgeEn: 'Core Engine',
    summaryKo: '딥러닝/LLM의 유연한 자연어 해석력과 지식 그래프의 엄밀한 기호 논리를 결합하여 환각율 0%와 100% 설명가능성을 보장.',
    summaryEn: 'Combines statistical neural flexibility with deterministic symbolic logic to eliminate hallucinations.',
    keyPrinciplesKo: [
      '신경망(Neural): 유연한 비정형 텍스트·음성·이미지 이해 및 가설 생성',
      '기호론(Symbolic): 온톨로지 규칙(OWL/SWRL) 기반의 수학적 논리 정합성 검증',
      '환각 억제: 온톨로지 관계에 위배되는 LLM 제안은 실행 게이트에서 즉각 기각'
    ],
    keyPrinciplesEn: [
      'Neural network generates hypotheses from unstructured intelligence',
      'Symbolic ontology (OWL/SWRL) mathematically validates logic & rules',
      'Rejects LLM hallucinations that violate tactical ontologies'
    ],
    architecturalRoleKo: '김대식 교수의 "인지 한계"를 기술적으로 해결하고, 국방 무기 체계에 "결정론적 신뢰성"을 부여하는 중심 축.',
    architecturalRoleEn: 'The technical solution to LLM cognitive limits, granting deterministic safety to defense systems.',
    tags: ['Neuro-Symbolic', 'Zero Hallucination', 'OWL/SWRL', 'Logic Verification']
  },
  {
    id: 'ont-rdf-owl-schema',
    labelKo: 'RDF/OWL 정형 스키마 & DDL',
    labelEn: 'RDF/OWL Formal Schema & DDL',
    cluster: 'ontology',
    sourceModuleKo: '온톨로지 모듈 #4 스키마 설계',
    sourceModuleEn: 'Ontology Module #4 Schema DDL',
    x: 680,
    y: 220,
    size: 22,
    badgeKo: '데이터 모델링',
    badgeEn: 'Semantic Schema',
    summaryKo: '장비, 위협, 작전구역, 지휘체계를 클래스-프로퍼티-인스턴스 트리플(Triple) 구조로 표준화하여 기계가 완벽히 추론 가능하게 정의.',
    summaryEn: 'Standardizes defense assets, threats, and rules into machine-readable RDF/OWL triples.',
    keyPrinciplesKo: [
      '주어-서술어-목적어 (Subject-Predicate-Object) 시맨틱 트리플 구조',
      '온톨로지 계층 상속(Inheritance) 및 추론 규칙(Inference Rules)',
      '단순 RAG 벡터 유사도의 한계를 넘는 3홉 이상 심층 다단계 인과 그래프 탐색'
    ],
    keyPrinciplesEn: [
      'Semantic Subject-Predicate-Object triple data representation',
      'Inheritance and formal taxonomy enabling automated graph inference',
      'Multi-hop graph traversal superior to standard vector similarity'
    ],
    architecturalRoleKo: '국방 DB 스키마(PostgreSQL/TimescaleDB)와 결합하여 이종 무기체계 간 시맨틱 상호운용성을 제공.',
    architecturalRoleEn: 'Provides semantic interoperability between relational military DBs and AI reasoning.',
    tags: ['RDF/OWL', 'Semantic Schema', 'Triples', 'Multi-hop Graph']
  },
  {
    id: 'ont-k-palantir-aip',
    labelKo: 'K-팔란티어 AIP 아키텍처',
    labelEn: 'K-Palantir AIP Architecture',
    cluster: 'ontology',
    sourceModuleKo: '온톨로지 모듈 #3 K-팔란티어',
    sourceModuleEn: 'Ontology Module #3 K-Palantir',
    x: 640,
    y: 380,
    size: 26,
    badgeKo: '국방 플랫폼',
    badgeEn: 'Defense Platform',
    summaryKo: '팔란티어 AIP 모델을 벤치마크하여 전장 자산, 전술 첩보, 의사결정 계통을 단일 인터랙티브 온톨로지로 통합하고 LLM을 지휘 통제.',
    summaryEn: 'Emulates Palantir AIP to unify tactical assets, intelligence, and commanders into an actionable ontology.',
    keyPrinciplesKo: [
      '전술 센서, 무기 가용성, 지휘관 지침의 단일 온톨로지 매핑',
      '에이전트가 온톨로지 상의 객체를 직접 조회·액션 트리거',
      '권한별 보안 제어(ACL)와 완벽한 감사 추적(Audit Trail)'
    ],
    keyPrinciplesEn: [
      'Unified ontology mapping sensor feeds, asset availability, and doctrine',
      'Agents manipulate and trigger actions directly on ontology objects',
      'Role-based access control (ACL) and full cryptographic audit trails'
    ],
    architecturalRoleKo: '미래 한국형 C4I 및 방위산업 B2G 수주전에서 게임체인저가 되는 고부가가치 솔루션 코어.',
    architecturalRoleEn: 'The high-value B2G defense platform delivering immediate tactical decision superiority.',
    tags: ['Palantir AIP', 'Tactical Ontology', 'C4I Integration', 'Decision Dominance']
  },
  {
    id: 'ont-kntds-c4i',
    labelKo: 'KNTDS 전술자료처리 연동',
    labelEn: 'KNTDS Naval Tactical C4I Link',
    cluster: 'ontology',
    sourceModuleKo: '온톨로지 모듈 #2 KNTDS 연동',
    sourceModuleEn: 'Ontology Module #2 KNTDS Link',
    x: 540,
    y: 490,
    size: 24,
    badgeKo: '전술 데이터링크',
    badgeEn: 'Tactical Data Link',
    summaryKo: '해군 KNTDS 및 3군 합동 C4I의 고속 표적 트랙(Track), 레이더/소나 수치, Link-16 전술 메시지를 초당 수천 건 실시간 스트리밍 처리.',
    summaryEn: 'High-speed ingestion of naval target tracks, radar/sonar contacts, and Link-16 tactical messages.',
    keyPrinciplesKo: [
      '초당 수 테라바이트 이종(Heterogeneous) 센서 데이터의 온톨로지 인제스천',
      '적/아/미식별 표적(IFF) 분류 및 위협 순위 자동 산정 파이프라인',
      '작전 지연시간(Latency) 50ms 미만 보장 스트리밍 큐'
    ],
    keyPrinciplesEn: [
      'Real-time ingestion of heterogeneous sensor tracks and tactical data',
      'Automated IFF identification and multi-target threat ranking',
      'Sub-50ms streaming pipeline matching strict military latency requirements'
    ],
    architecturalRoleKo: '국방 특수 통신 MCP와 직접 맞물려 온톨로지 지식 그래프에 실시간 피를 공급하는 전술 입력단.',
    architecturalRoleEn: 'The tactical input ingestion layer feeding live battlefield contacts into the ontology.',
    tags: ['KNTDS', 'C4I', 'Link-16', 'Real-time Telemetry', 'IFF']
  },

  // --- CLUSTER 3: DEFENSE AI (30-Yr Systems & Hardware Air-Gap) ---
  {
    id: 'def-mcp-protocols',
    labelKo: '국방 장비 MCP 연동 규격',
    labelEn: 'Defense Equipment MCP Spec',
    cluster: 'defense',
    sourceModuleKo: '국방 모듈 #3 MCP 규격',
    sourceModuleEn: 'Defense Module #3 Defense MCP',
    x: 820,
    y: 330,
    size: 26,
    badgeKo: '통신 표준',
    badgeEn: 'Hardware Protocols',
    summaryKo: 'MIL-STD-1553B, RS-422/485, Link-11/16, 이더넷 등 국방 하드웨어 통신 버스를 모델 컨텍스트 프로토콜(MCP)로 추상화.',
    summaryEn: 'Abstracts legacy MIL-STD-1553B, RS-422, and tactical bus protocols into Model Context Protocols.',
    keyPrinciplesKo: [
      '군용 특수 하드웨어 레거시 버스를 JSON-RPC MCP 도구(Tool)로 표준 래핑',
      '에어갭(Air-gapped) 폐쇄망 내에서 온디바이스 SLM과 1:1 직결 통신',
      '패킷 변조 방지 체크섬 및 하드웨어 시리얼 인증 핸드셰이크'
    ],
    keyPrinciplesEn: [
      'Wraps military legacy serial buses into standardized JSON-RPC MCP tools',
      'Air-gapped on-device SLM execution without cloud dependencies',
      'Checksum validation and hardware bus cryptographic handshakes'
    ],
    architecturalRoleKo: '김대식 교수의 "피지컬 AI 액추에이터"를 실제 전장 하드웨어(레이더, 발사대, 안테나)와 물리적으로 연결하는 전송로.',
    architecturalRoleEn: 'The hardware transport protocol translating AI agent intents into physical equipment signals.',
    tags: ['MCP', 'MIL-STD-1553B', 'RS-422', 'Air-gap', 'Edge SLM']
  },
  {
    id: 'def-approval-gate',
    labelKo: 'HITL 2단계 승인 게이트',
    labelEn: 'HITL 2-Stage Approval Gate',
    cluster: 'defense',
    sourceModuleKo: '국방 모듈 #4 승인 게이트',
    sourceModuleEn: 'Defense Module #4 Approval Gate',
    x: 740,
    y: 490,
    size: 24,
    badgeKo: '안전성 보증',
    badgeEn: 'Safety Assurance',
    summaryKo: 'AI 에이전트의 단독 발사/타격을 원천 차단하고, 지휘관 생체인증 및 다중 키 승인을 요구하는 휴먼인더루프(HITL) 방벽.',
    summaryEn: 'Strict Human-in-the-Loop dual-approval gate preventing unilateral lethal kinetic actions.',
    keyPrinciplesKo: [
      '1단계: 시맨틱 온톨로지 규칙에 따른 교전수칙(ROE) 자동 적합성 심사',
      '2단계: 당직사관/지휘관의 2인 복수 디지털 서명 및 물리 키 입력',
      '이상 징후 발생 시 나노초 단위 하드웨어 릴레이 킬 스위치(Kill Switch) 작동'
    ],
    keyPrinciplesEn: [
      'Phase 1: Automated ROE doctrine verification via semantic ontology',
      'Phase 2: Dual human key authorization before kinetic weapon firing',
      'Hardware relay kill-switch disconnecting actuator buses within nanoseconds'
    ],
    architecturalRoleKo: '국방 분야 AI 도입의 최대 난제인 "안전성/책임성 문제"를 완벽히 해결하는 핵심 게이트웨이.',
    architecturalRoleEn: 'Eliminates legal and tactical risk by guaranteeing human accountability over lethal actions.',
    tags: ['HITL', 'Approval Gate', 'ROE', 'Kill Switch', 'Safety Assurance']
  },
  {
    id: 'def-solopreneur-fleet',
    labelKo: '30년 역량 기반 1인 대기업 사단',
    labelEn: '30-Yr Defense Solo Fleet',
    cluster: 'defense',
    sourceModuleKo: '국방 모듈 #1 역량 & #6 사단',
    sourceModuleEn: 'Defense Module #1 & #6 Solo Fleet',
    x: 880,
    y: 190,
    size: 22,
    badgeKo: '창업 전략',
    badgeEn: 'Startup Strategy',
    summaryKo: '30년간 축적한 HW/SW/데이터링크 체계 통합 노하우를 바탕으로 AgentOps, 특화 버티컬 SaaS 등 고수익 B2B/B2G 시장 장악.',
    summaryEn: 'Monetizing 30 years of systems engineering through lean vertical B2B/B2G defense ventures.',
    keyPrinciplesKo: [
      '도메인 지식의 희소성: 일반 빅테크가 결코 모르는 국방 규격/표준 완벽 숙지',
      '초특화 니치 마켓 버티컬 SaaS: 단 20~30개 군수업체만 유치해도 고수익 달성',
      '김대식 에이전트 보스 철학과 결합된 1인 애자일 엔지니어링 프레임워크'
    ],
    keyPrinciplesEn: [
      'Scarcity of deep defense domain knowledge unreachable by generic big tech',
      'Niche vertical SaaS yielding massive margins with 20-30 enterprise defense clients',
      'Synergizes with Kim Dae-shik solopreneur principles for rapid productization'
    ],
    architecturalRoleKo: '학습된 지식을 실질적인 사업 가치와 지속 가능한 창업 비즈니스 모델로 연결하는 최종 결실.',
    architecturalRoleEn: 'Translates architectural mastery into viable defense technology commercial ventures.',
    tags: ['Solopreneur', '30-Yr Defense', 'B2G Strategy', 'Niche SaaS']
  },
  {
    id: 'def-db-schema-ddl',
    labelKo: '국방 DB 스키마 & TimescaleDB',
    labelEn: 'Defense DB Schema & Time-Series',
    cluster: 'defense',
    sourceModuleKo: '국방 모듈 #5 DB 스키마',
    sourceModuleEn: 'Defense Module #5 DB Schema',
    x: 920,
    y: 440,
    size: 20,
    badgeKo: '데이터 인프라',
    badgeEn: 'Database DDL',
    summaryKo: '군용 시계열 센서 텔레메트리, 표적 트랙 로그, 에이전트 감사 기록을 저장하는 고신뢰성 관계형/시계열 DB 아키텍처.',
    summaryEn: 'High-reliability relational and time-series database architecture storing military sensor logs.',
    keyPrinciplesKo: [
      'TimescaleDB 하이퍼테이블을 통한 초당 10만 건 센서 시계열 압축 저장',
      'PostgreSQL RLS(Row Level Security)를 통한 비밀 등급별 데이터 격리',
      '온톨로지 그래프 데이터베이스(GraphDB)와의 하이브리드 연동 DDL'
    ],
    keyPrinciplesEn: [
      'TimescaleDB hypertables handling 100k+ sensor telemetry events per sec',
      'Row Level Security (RLS) enforcing multi-level military secrecy clearance',
      'Hybrid synchronization between relational DDL and semantic graph stores'
    ],
    architecturalRoleKo: '온톨로지 트리플과 실시간 센서 로그가 저장되고 영구 감사 추적되는 견고한 데이터 베이스라인.',
    architecturalRoleEn: 'The storage foundation securing high-frequency sensor tracks and cryptographic audits.',
    tags: ['PostgreSQL', 'TimescaleDB', 'RLS Security', 'DDL Schema']
  },

  // --- CLUSTER 4: CROSS-SYNTHESIS TRI-DOMAIN HUBS ---
  {
    id: 'syn-tactical-decision',
    labelKo: '실시간 결심 우위 (Decision Dominance)',
    labelEn: 'Real-Time Decision Dominance',
    cluster: 'cross-synthesis',
    sourceModuleKo: '3대 도메인 결합체 (Tri-Domain Core)',
    sourceModuleEn: 'Tri-Domain Core Synthesis',
    x: 480,
    y: 190,
    size: 28,
    badgeKo: '최종 목표',
    badgeEn: 'Apex Objective',
    summaryKo: '김대식의 물리 센싱 + 온톨로지의 환각 0% 뉴로심볼릭 + 국방의 고속 MCP가 결합되어 적보다 빠른 OODA 루프 결심을 달성.',
    summaryEn: 'Apex synthesis of physical sensing, zero-hallucination ontology, and defense MCP execution.',
    keyPrinciplesKo: [
      'OODA(관측-판단-결심-행동) 루프의 전 과정을 5초 이내로 단축',
      '다영역(해상·공중·우주·사이버) 전장 상황을 단일 지휘관 온톨로지 뷰로 투영',
      '인간 지휘관에게 최적의 방책(COA: Course of Action) Top 3를 확률과 함께 제시'
    ],
    keyPrinciplesEn: [
      'Compresses military OODA loop cycle to under 5 seconds',
      'Synthesizes multi-domain battlespace into a unified commander ontology',
      'Recommends optimal Course of Action (COA) options with mathematical confidence'
    ],
    architecturalRoleKo: '이 모든 시스템이 지향하는 최상위 국방 군사적·산업적 목표.',
    architecturalRoleEn: 'The ultimate operational goal of the entire multi-agent architecture.',
    tags: ['Decision Dominance', 'OODA Loop', 'Tactical Superiority', 'COA']
  },
  {
    id: 'syn-fast-poc-roadmap',
    labelKo: '6개월 PoC 패스트트랙 로드맵',
    labelEn: '6-Month Fast PoC Roadmap',
    cluster: 'cross-synthesis',
    sourceModuleKo: '실전 창업 & PoC 연계 (PoC Synthesis)',
    sourceModuleEn: 'Execution Roadmap Synthesis',
    x: 360,
    y: 470,
    size: 24,
    badgeKo: '실행 로드맵',
    badgeEn: 'Fast-Track PoC',
    summaryKo: '김대식 5개 스프린트 + 온톨로지 4개월 MVP + 국방 4대 창업 모델을 관통하는 신속 프로토타이핑 실행 전략.',
    summaryEn: 'Unified agile roadmap converging Kim sprint milestones with defense MVP deployment.',
    keyPrinciplesKo: [
      'Month 1-2: 온톨로지 스키마 설계 및 합성 데이터 검증',
      'Month 3-4: MCP 국방 장비 가상 에뮬레이터 연동 및 HITL 게이트 PoC',
      'Month 5-6: 실제 폐쇄망 테스트베드 실증 및 군 시연회 개최'
    ],
    keyPrinciplesEn: [
      'Month 1-2: Formal ontology schema design & synthetic track verification',
      'Month 3-4: Defense MCP hardware emulator integration & HITL safety gate PoC',
      'Month 5-6: Live testbed deployment & high-level military leadership demo'
    ],
    architecturalRoleKo: '복잡한 이론적 아키텍처를 실제 투자 유치 및 군 실증 사업으로 전환하는 실천적 일정표.',
    architecturalRoleEn: 'Actionable timeline transforming architectural theory into validated defense contracts.',
    tags: ['PoC', 'Sprint Roadmap', 'MVP', 'Defense Demo']
  }
];

export const CONCEPT_EDGES: ConceptEdge[] = [
  // 1. Kim Brain Cognition -> Ontology Neuro-Symbolic
  {
    id: 'e-brain-to-neurosymbolic',
    source: 'kim-brain-cognition',
    target: 'ont-neuro-symbolic',
    relationKo: '인지 한계 극복 (환각 0% 규명)',
    relationEn: 'Cognitive Grounding (Zero Hallucination)',
    type: 'grounding',
    descriptionKo: 'LLM의 확률적 비결정성 한계를 온톨로지 기호 논리(Symbolic Logic)로 수학적으로 구속하여 해결.',
    descriptionEn: 'Grounds probabilistic LLM hallucinations into deterministic symbolic graph logic.'
  },
  // 2. Kim Physical AI -> Defense MCP Protocols
  {
    id: 'e-physical-to-mcp',
    source: 'kim-physical-ai',
    target: 'def-mcp-protocols',
    relationKo: '물리 액추에이터 통신 규격화',
    relationEn: 'Actuator Protocol Abstraction',
    type: 'protocol',
    descriptionKo: '피지컬 AI의 하드웨어 조작 의도를 MIL-STD-1553B/RS-422 등 군용 표준 MCP 도구로 변환.',
    descriptionEn: 'Translates physical agent intents into hardened defense bus protocols (MIL-STD-1553B).'
  },
  // 3. Kim Orchestrator -> Ontology Neuro-Symbolic
  {
    id: 'e-orchestrator-to-neurosymbolic',
    source: 'kim-orchestrator-arch',
    target: 'ont-neuro-symbolic',
    relationKo: '두뇌 계층(Layer 3) 엔진 임베딩',
    relationEn: 'Layer 3 Reasoning Core',
    type: 'synergy',
    descriptionKo: '4계층 오케스트레이터의 인지·추론 레이어로 온톨로지 뉴로심볼릭 상호 검증 파이프라인을 탑재.',
    descriptionEn: 'Integrates neuro-symbolic verification as Layer 3 of the 4-layer orchestrator stack.'
  },
  // 4. Kim Orchestrator -> Defense Approval Gate
  {
    id: 'e-orchestrator-to-gate',
    source: 'kim-orchestrator-arch',
    target: 'def-approval-gate',
    relationKo: '안전성 거버넌스(Layer 4) 체계화',
    relationEn: 'Layer 4 Safety Governance',
    type: 'control',
    descriptionKo: '4계층 오케스트레이터 최상단에 HITL 2단계 승인 게이트와 물리 킬 스위치를 안전 제어 장치로 구축.',
    descriptionEn: 'Pins HITL approval and hardware kill-switches as Layer 4 safety governance.'
  },
  // 5. Ontology RDF/OWL -> Ontology Neuro-Symbolic
  {
    id: 'e-schema-to-neurosymbolic',
    source: 'ont-rdf-owl-schema',
    target: 'ont-neuro-symbolic',
    relationKo: '기호 논리 규칙(SWRL) 공급',
    relationEn: 'Symbolic Axiom Feed',
    type: 'grounding',
    descriptionKo: 'RDF/OWL 시맨틱 트리플과 SWRL 규칙이 뉴로심볼릭 검증의 엄밀한 수학적 판별 기준으로 작동.',
    descriptionEn: 'Provides mathematical axioms and rules for neuro-symbolic hypothesis verification.'
  },
  // 6. Ontology K-Palantir -> Cross Tactical Decision
  {
    id: 'e-palantir-to-decision',
    source: 'ont-k-palantir-aip',
    target: 'syn-tactical-decision',
    relationKo: '단일 전술 온톨로지 가시화',
    relationEn: 'Tactical Ontology Projection',
    type: 'evolution',
    descriptionKo: '팔란티어식 전술 온톨로지가 실시간 전장 상황을 단일 결심 인터페이스로 투영하여 결심 우위를 달성.',
    descriptionEn: 'Projects battlespace assets into a unified interface yielding real-time decision dominance.'
  },
  // 7. Ontology KNTDS -> Defense MCP
  {
    id: 'e-kntds-to-mcp',
    source: 'ont-kntds-c4i',
    target: 'def-mcp-protocols',
    relationKo: '전술 데이터링크 고속 인터페이스',
    relationEn: 'Tactical Data Link Interface',
    type: 'protocol',
    descriptionKo: 'KNTDS 초당 수 테라바이트 센서 트랙과 Link-16 메시지가 국방 MCP 인터페이스를 통해 초고속 유입.',
    descriptionEn: 'Feeds high-speed KNTDS contacts and Link-16 messages across defense MCP channels.'
  },
  // 8. Ontology K-Palantir -> Defense Approval Gate
  {
    id: 'e-palantir-to-gate',
    source: 'ont-k-palantir-aip',
    target: 'def-approval-gate',
    relationKo: '교전수칙(ROE) 자동 대조 검증',
    relationEn: 'Automated ROE Compliance Check',
    type: 'control',
    descriptionKo: '온톨로지 상의 군사 교전수칙 객체와 타격 목표를 실시간 대조하여 1단계 자동 승인 통과 여부 판정.',
    descriptionEn: 'Cross-checks kinetic target proposals against semantic ROE doctrine before human review.'
  },
  // 9. Defense MCP -> Defense DB Schema
  {
    id: 'e-mcp-to-db',
    source: 'def-mcp-protocols',
    target: 'def-db-schema-ddl',
    relationKo: '시계열 텔레메트리 압축 영구 기록',
    relationEn: 'Time-Series Telemetry Persistence',
    type: 'synergy',
    descriptionKo: 'MCP 통신 패킷을 TimescaleDB 하이퍼테이블로 초당 10만 건 스트리밍 저장하여 완전한 감사 추적 보장.',
    descriptionEn: 'Streams MCP telemetry frames directly into TimescaleDB hypertables for audit logs.'
  },
  // 10. Kim Agent Boss -> Defense Solopreneur Fleet
  {
    id: 'e-agentboss-to-solofleet',
    source: 'kim-agent-boss',
    target: 'def-solopreneur-fleet',
    relationKo: '1인 국방 창업 조직론 직결',
    relationEn: 'Solo Defense Enterprise Merger',
    type: 'synergy',
    descriptionKo: '김대식 교수의 1인 에이전트 보스 철학과 30년 국방 체계 통합 경력이 만나 독보적인 1인 대기업 사단 탄생.',
    descriptionEn: 'Combines Kim Dae-shik Agent Boss tenets with 30-year defense domain scarcity.'
  },
  // 11. Kim Physical AI -> Cross Tactical Decision
  {
    id: 'e-physical-to-decision',
    source: 'kim-physical-ai',
    target: 'syn-tactical-decision',
    relationKo: '실시간 물리 액션 루프 완결',
    relationEn: 'Physical Action Loop Closure',
    type: 'evolution',
    descriptionKo: '결심된 최적 방책(COA)을 실제 물리 장비(드론, 센서 마스트, 방어 시스템)에 즉각 행동으로 실행.',
    descriptionEn: 'Translates selected Courses of Action directly into physical hardware kinetic maneuvers.'
  },
  // 12. Cross Fast PoC -> Defense Solopreneur Fleet
  {
    id: 'e-poc-to-solofleet',
    source: 'syn-fast-poc-roadmap',
    target: 'def-solopreneur-fleet',
    relationKo: '신속 사업화 & 군 PoC 수주',
    relationEn: 'Commercialization & Military Contract',
    type: 'evolution',
    descriptionKo: '6개월 스프린트 로드맵을 통해 군 시연 및 방산 스타트업 PoC 수주를 성공시켜 사업 가치를 실현.',
    descriptionEn: 'Drives military demonstration validation and defense innovation contract acquisitions.'
  },
  // 13. Cross Fast PoC -> Kim Orchestrator
  {
    id: 'e-poc-to-orchestrator',
    source: 'syn-fast-poc-roadmap',
    target: 'kim-orchestrator-arch',
    relationKo: '스프린트별 아키텍처 단계 검증',
    relationEn: 'Sprint Architecture Milestones',
    type: 'synergy',
    descriptionKo: '5개 스프린트를 통해 4계층 오케스트레이터의 계층별 모듈을 점진적으로 통합 테스트.',
    descriptionEn: 'Validates each layer of the 4-layer orchestrator progressively across 5 agile sprints.'
  },
  // 14. Ontology RDF/OWL -> Defense DB Schema
  {
    id: 'e-schema-to-db',
    source: 'ont-rdf-owl-schema',
    target: 'def-db-schema-ddl',
    relationKo: '관계형-시맨틱 하이브리드 동기화',
    relationEn: 'Relational-Semantic Hybrid Sync',
    type: 'grounding',
    descriptionKo: 'PostgreSQL 관계형 스키마와 RDF 그래프 트리플 간의 실시간 매핑 및 데이터 무결성 보장.',
    descriptionEn: 'Bi-directional sync between relational PostgreSQL schemas and RDF graph triples.'
  }
];
