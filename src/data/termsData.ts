import { AITerm } from '../types';

export const TERMS_DATA: AITerm[] = [
  { 
    id: 1, 
    name: "AI Workflow", 
    eng: "Artificial Intelligence Workflow", 
    category: "Architecture", 
    desc: "복잡한 목표 달성을 위해 계획, 도구 사용, 관찰 등의 과정을 여러 단계로 나누어 수행하는 일련의 작업 파이프라인. 교착 상태나 경로 이탈을 막기 위한 검증 로직이 요구됨.",
    youtubeUrl: "https://www.youtube.com/watch?v=sal78ACtGTc",
    youtubeTitle: "What's next for AI agentic workflows (Andrew Ng)",
    youtubeSummary: "앤드류 응 교수가 단일 프롬프트 패러다임을 넘어 반복적 피드백, 도구 사용, 계획 수립으로 성능을 극대화하는 4대 에이전트 워크플로우 디자인 패턴을 설명합니다."
  },
  { 
    id: 2, 
    name: "Agentic AI", 
    eng: "Agentic Artificial Intelligence", 
    category: "Architecture", 
    desc: "프롬프트에 수동적으로 답변하는 것을 넘어, 자율적으로 문제를 분해하고 환경과 상호작용하며 도구를 호출해 장기적인 작업을 수행하는 차세대 인공지능 아키텍처.",
    youtubeUrl: "https://www.youtube.com/watch?v=A_08flb9u2o",
    youtubeTitle: "Building Agentic AI Systems: From Theory to Production",
    youtubeSummary: "단순 텍스트 생성을 탈피하여 자율적으로 환경을 인식하고, 목표를 하위 태스크로 쪼개어 장기 과업을 완수하는 에이전틱 AI의 핵심 구조와 엔지니어링 패턴을 다룹니다."
  },
  { 
    id: 3, 
    name: "Harness Engineering", 
    eng: "Agent Harness Engineering", 
    category: "Architecture", 
    desc: "모델을 직접 튜닝하는 대신, 모델이 안정적으로 작업을 수행할 수 있도록 도구 접근, 샌드박스 실행, 파일시스템 관리, 가드레일을 결합한 외부 런타임 인프라를 구축하는 최신 공학 규율.",
    youtubeUrl: "https://www.youtube.com/watch?v=0kF43mK5C4E",
    youtubeTitle: "Harness Engineering: How to Wrap LLMs for Production Reliability",
    youtubeSummary: "모델 가중치는 그대로 두고 점진적 공개(정보 계층), 가상 샌드박스(실행 계층), 실패 궤적 자동 반영(피드백 계층)을 통해 모델을 신뢰성 높은 실행 엔진으로 변환하는 공학입니다."
  },
  { 
    id: 4, 
    name: "Ontology", 
    eng: "Enterprise Ontology", 
    category: "Knowledge", 
    desc: "기업의 물리적 자산, 관계, 비즈니스 논리, 행동 권한 등을 기계가 이해할 수 있는 객체 지향적 그래프 모델로 완벽히 구조화한 체계. OAG의 근간이자 운영 체제 역할을 함.",
    youtubeUrl: "https://www.youtube.com/watch?v=b4b_oG2hUuE",
    youtubeTitle: "Palantir Foundry: What is an Enterprise Ontology?",
    youtubeSummary: "기업 내 분산된 사일로 데이터를 '객체-관계-행동(Action)'으로 묶어 비즈니스 현실 세계를 디지털로 완벽히 미러링하고 AI가 오차 없이 조작하도록 돕는 온톨로지 개념을 소개합니다."
  },
  { 
    id: 5, 
    name: "OAG", 
    eng: "Ontology-Augmented Generation", 
    category: "Knowledge", 
    desc: "벡터 기반 텍스트 검색에 의존하는 RAG와 달리, 엄격히 정의된 온톨로지 로직과 권한 모델에 LLM을 결합시켜 무결성 높은 의사결정과 실제 시스템 제어를 구현하는 아키텍처.",
    youtubeUrl: "https://www.youtube.com/watch?v=l_aKx1YxI-U",
    youtubeTitle: "Palantir AIP: Beyond RAG with Ontology-Augmented Generation",
    youtubeSummary: "단순 텍스트 유사도 검색(RAG)의 환각 및 트랜잭션 불가 한계를 극복하고, 엄격한 비즈니스 규칙과 실시간 쓰기(Write-back) 권한이 보장된 OAG 시스템의 동작 원리를 분석합니다."
  },
  { 
    id: 6, 
    name: "LLM", 
    eng: "Large Language Model", 
    category: "LLM", 
    desc: "수십억~수천억 개의 파라미터를 통해 방대한 비정형 언어 데이터를 학습함으로써 추론, 요약, 번역, 논리 전개 등 광범위한 범용 지적 능력을 발휘하는 인공지능 기반 모델.",
    youtubeUrl: "https://www.youtube.com/watch?v=wjZofJX0v4U",
    youtubeTitle: "But what is a GPT? Visual intro to Transformers (3Blue1Brown)",
    youtubeSummary: "대형 언어 모델이 어떻게 토큰을 임베딩하고 어텐션 메커니즘을 통해 다음 단어의 확률을 예측하며 복잡한 언어 이해 능력을 발현하는지 기하학적으로 시각화합니다."
  },
  { 
    id: 7, 
    name: "Deep Learning", 
    eng: "Deep Learning", 
    category: "LLM", 
    desc: "인간의 뇌 신경망(다층 퍼셉트론 등) 구조를 모사하여 대량의 데이터 내에 내재된 비선형적인 특징과 패턴을 스스로 학습해내는 기계학습의 핵심 분파.",
    youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    youtubeTitle: "But what is a neural network? Deep learning chapter 1 (3Blue1Brown)",
    youtubeSummary: "인공신경망의 뉴런, 가중치, 편향, 활성화 함수와 역전파 알고리즘이 대규모 데이터로부터 복잡한 패턴을 스스로 학습해 나가는 근본 수학적 원리를 알기 쉽게 설명합니다."
  },
  { 
    id: 8, 
    name: "Domain Knowledge", 
    eng: "Domain Knowledge", 
    category: "Knowledge", 
    desc: "특정 산업, 의료, 법률, 기업 내부 비즈니스 등 범용 모델이 사전에 깊이 알기 어려운 전문적이고 특수한 지식군. AI의 환각을 방지하고 산업 특화 기능을 수행하는 필수 자원.",
    youtubeUrl: "https://www.youtube.com/watch?v=J_j8iE2Y9V8",
    youtubeTitle: "Domain Specific AI vs General LLMs (IBM Technology)",
    youtubeSummary: "의료, 금융, 법률 등 고도의 전문성과 보안이 요구되는 영역에서 범용 LLM의 한계를 극복하기 위해 사내 도메인 지식을 인덱싱하고 주입하는 엔지니어링 전략을 제시합니다."
  },
  { 
    id: 9, 
    name: "Reasoning", 
    eng: "Reasoning (in AI)", 
    category: "Architecture", 
    desc: "주어진 데이터와 컨텍스트를 종합하여 논리적 인과관계를 파악하고, 다단계 연산(Chain of Thought)을 통해 모순 없이 문제의 해답에 도달하는 AI의 고차원 인지 능력.",
    youtubeUrl: "https://www.youtube.com/watch?v=0k1L2uB7u2A",
    youtubeTitle: "How AI Reasoning Models Work: Chain of Thought & System 2 AI",
    youtubeSummary: "직관적 즉답(System 1)을 넘어 단계별 사고 과정(System 2)을 생성하며 자가 검증과 백트래킹을 통해 수학 및 논리적 복합 문제를 해결하는 추론 모델의 원리를 파헤칩니다."
  },
  { 
    id: 10, 
    name: "Palantir (AIP)", 
    eng: "Palantir Artificial Intelligence Platform", 
    category: "Framework", 
    desc: "온톨로지 시스템을 기반으로 데이터 결합, 로직 설계, AI 에이전트의 안전한 트랜잭션 수행 권한을 엔터프라이즈 환경에서 통합 관리할 수 있게 해주는 선도적 인프라 플랫폼.",
    youtubeUrl: "https://www.youtube.com/watch?v=XEM5FZvSwwA",
    youtubeTitle: "Palantir AIP: Deploying Generative AI in the Enterprise",
    youtubeSummary: "팔란티어 AIP가 엔터프라이즈 환경에서 환각 없는 안전한 의사결정을 보장하기 위해 가드레일, 온톨로지 바인딩, 그리고 인간 승인(HITL) 액션을 실행하는 실제 시연을 보여줍니다."
  },
  { 
    id: 11, 
    name: "Gemini", 
    eng: "Google Gemini", 
    category: "LLM", 
    desc: "구글이 구축한 차세대 기초 모델로, 텍스트, 코드, 이미지, 음성을 개별 모델 결합 없이 태생부터 통합 처리하도록 설계된 네이티브 멀티모달(Native Multi-modal) 프레임워크.",
    youtubeUrl: "https://www.youtube.com/watch?v=UIc0Kj1u2Yw",
    youtubeTitle: "Google Gemini: Native Multimodal Architecture & Live Reasoning",
    youtubeSummary: "구글 제미나이가 텍스트뿐만 아니라 오디오, 영상, 코드를 단일 신경망에서 네이티브로 이해하고 100만 토큰 이상의 초대형 컨텍스트 창을 처리하는 기술 혁신을 소개합니다."
  },
  { 
    id: 12, 
    name: "Claude", 
    eng: "Anthropic Claude", 
    category: "LLM", 
    desc: "앤스로픽이 '헌법적 AI' 원칙을 적용해 윤리성과 안전성을 극대화한 모델. 20만 토큰 이상의 방대한 컨텍스트 창을 제공하여 방대한 코드베이스나 복잡한 문서 통합 분석에 압도적임.",
    youtubeUrl: "https://www.youtube.com/watch?v=8b5r5w1gD9w",
    youtubeTitle: "Inside Anthropic's Claude 3.5 & Constitutional AI Architecture",
    youtubeSummary: "헌법적 AI(Constitutional AI) 원칙을 통해 인간의 지속적인 감독 없이도 높은 안정성과 추론력을 확보하고, 코딩 및 복잡한 시각 분석에서 최고 성능을 발휘하는 클로드의 구조를 다룹니다."
  },
  { 
    id: 13, 
    name: "OpenAI (GPT)", 
    eng: "OpenAI Generative Pre-trained Transformer", 
    category: "LLM", 
    desc: "생성형 AI 생태계를 촉발시킨 선구자. 지속적인 강화학습(RLHF) 및 고급 추론 기법을 적용하여 코딩, 논리적 문제 해결 등 다양한 벤치마크에서 업계 최고 성능을 유지하고 있음.",
    youtubeUrl: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
    youtubeTitle: "State of GPT: Pretraining, Fine-Tuning, and RLHF (Andrej Karpathy)",
    youtubeSummary: "안드레이 카파시가 GPT 모델의 사전 훈련 토큰화, 지도 미세조정(SFT), 보상 모델을 이용한 강화학습(RLHF)의 파이프라인 전체를 체계적으로 강의합니다."
  },
  { 
    id: 14, 
    name: "GROK (GLOK)", 
    eng: "xAI Grok", 
    category: "LLM", 
    desc: "일론 머스크의 xAI가 개발한 LLM. 소셜 미디어 X(구 트위터)의 실시간 데이터 파이프라인에 접근하여 검열이 적고 실시간 트렌드 및 최신 뉴스 분석에 특화된 성향을 띰.",
    youtubeUrl: "https://www.youtube.com/watch?v=8I2_4Kx4h9Q",
    youtubeTitle: "xAI Grok Architecture: Real-time Data Processing & Supercluster Training",
    youtubeSummary: "X(트위터)의 방대한 실시간 피드를 즉각적으로 인덱싱하여 시사 이슈에 실시간으로 대응하는 xAI 그록의 Colossus 슈퍼클러스터 인프라와 추론 특성을 리뷰합니다."
  },
  { 
    id: 15, 
    name: "Obsidian", 
    eng: "Obsidian", 
    category: "Knowledge", 
    desc: "데이터를 로컬 환경에 마크다운 형식으로 저장하며, 문서 간 쌍방향 연결(Bi-directional linking)을 통해 개인의 지식(Second Brain)을 시각화하고 AI와의 연동 컨텍스트로 활용하는 도구.",
    youtubeUrl: "https://www.youtube.com/watch?v=QgbLb6QCK88",
    youtubeTitle: "How to Build a Second Brain in Obsidian with AI Integration",
    youtubeSummary: "로컬 마크다운 파일과 쌍방향 링크 그래프를 활용해 개인 지식 체계를 구축하고, 로컬 LLM 및 플러그인을 결합하여 지능형 지식 탐색 엔진을 만드는 방법을 보여줍니다."
  },
  { 
    id: 16, 
    name: "Notion (AI)", 
    eng: "Notion & Notion AI", 
    category: "Knowledge", 
    desc: "유연한 데이터베이스와 협업 위키 기능을 제공하는 클라우드 워크스페이스. 사용자의 문서와 데이터를 기반으로 LLM이 내부 지식을 검색, 요약, 자동 생성하는 기능을 내장함.",
    youtubeUrl: "https://www.youtube.com/watch?v=M5Fv2X3F2xQ",
    youtubeTitle: "Notion AI Explained: How Q&A and Workspace RAG Works",
    youtubeSummary: "팀의 수만 개 위키 페이지와 프로젝트 데이터베이스를 의미 기반으로 검색하여 즉각적인 답변을 생성하고 워크플로우를 자동화하는 노션 AI의 아키텍처를 소개합니다."
  },
  { 
    id: 17, 
    name: "MCP", 
    eng: "Model Context Protocol", 
    category: "Architecture", 
    desc: "앤스로픽이 개발한 오픈 소스 표준으로, LLM 호스트가 원격의 서버들로부터 파일(리소스), 외부 시스템(도구), 템플릿(프롬프트)을 일관된 JSON-RPC 메시징으로 교환하게 하는 통신 규약.",
    youtubeUrl: "https://www.youtube.com/watch?v=kQlhzFqZp_A",
    youtubeTitle: "Anthropic's Model Context Protocol (MCP) Explained in 10 Minutes",
    youtubeSummary: "LLM 애플리케이션과 외부 데이터 소스(Postgres, Git, Slack 등)를 표준화된 JSON-RPC 프로토콜로 직접 연결하는 MCP의 Client-Host-Server 규약을 분석합니다."
  },
  { 
    id: 18, 
    name: "DSPy", 
    eng: "Declarative Structured Programming for Python", 
    category: "Framework", 
    desc: "스탠포드 대학교에서 개발. 수동 프롬프트 엔지니어링을 버리고, 모듈과 시그니처로 파이프라인을 선언하면 프레임워크가 알고리즘 기반으로 퓨샷 예제와 프롬프트를 컴파일(최적화)함.",
    youtubeUrl: "https://www.youtube.com/watch?v=41EfOY0Ldkc",
    youtubeTitle: "Stanford CS25: DSPy - Programming (Not Prompting) Foundation Models",
    youtubeSummary: "스탠포드 Omar Khattab 교수가 취약한 수작업 프롬프트 대신 선언적 모듈과 옵티마이저(MIPRO)를 통해 파이프라인을 자동으로 최적화하는 DSPy의 패러다임을 발표합니다."
  },
  { 
    id: 19, 
    name: "RAG", 
    eng: "Retrieval-Augmented Generation", 
    category: "Knowledge", 
    desc: "사용자의 질문에 대해 LLM의 내재적 기억에만 의존하지 않고 외부 벡터 DB 등에서 관련 문서를 우선 검색(Retrieval)한 후 프롬프트에 주입하여 환각을 줄이는 아키텍처.",
    youtubeUrl: "https://www.youtube.com/watch?v=T-D1OfcDW1M",
    youtubeTitle: "What is Retrieval-Augmented Generation (RAG)? (IBM Technology)",
    youtubeSummary: "LLM의 지식 컷오프와 환각 문제를 해결하기 위해 비정형 문서를 임베딩하고 벡터 검색으로 관련 컨텍스트를 동적으로 주입하는 RAG의 표준 파이프라인을 시각적으로 설명합니다."
  },
  { 
    id: 20, 
    name: "GraphRAG", 
    eng: "Graph Retrieval-Augmented Generation", 
    category: "Knowledge", 
    desc: "단순히 단어의 벡터 유사도만을 비교하는 RAG를 넘어, 지식 그래프 구조를 통해 문서 내 엔티티 간의 의미론적 관계망을 횡단하며 검색의 깊이와 복잡성을 향상시킨 기술.",
    youtubeUrl: "https://www.youtube.com/watch?v=r09tJfON6kE",
    youtubeTitle: "Microsoft GraphRAG: Knowledge Graphs for Advanced AI Retrieval",
    youtubeSummary: "마이크로소프트 연구진이 개발한 GraphRAG가 복잡한 데이터셋에서 엔티티 간 관계 그래프와 계층적 커뮤니티 요약을 구축하여 전체적인 종합 질의에 답하는 원리를 설명합니다."
  },
  { 
    id: 21, 
    name: "CoT", 
    eng: "Chain of Thought", 
    category: "Architecture", 
    desc: "모델이 즉각적으로 최종 답변을 출력하지 않고, 논리적 사고 단계를 명시적인 중간 텍스트로 풀어내도록 유도하여 복잡한 수학 및 추론 과제의 정확도를 극적으로 향상시키는 기법.",
    youtubeUrl: "https://www.youtube.com/watch?v=wVzUcYSkKwk",
    youtubeTitle: "Chain of Thought Prompting Elicits Reasoning in Large Language Models",
    youtubeSummary: "구글 브레인의 기념비적 논문을 기반으로 '단계별로 생각해봅시다(Let\\'s think step by step)'라는 간단한 유도가 복합 추론 정확도를 수직 상승시키는 메커니즘을 다룹니다."
  },
  { 
    id: 22, 
    name: "ReAct", 
    eng: "Reason + Act", 
    category: "Architecture", 
    desc: "에이전트 워크플로우의 핵심 메커니즘으로, 상황을 추론(Reason)하고 그에 따라 적절한 도구 호출 등의 행동(Act)을 한 후 결과를 관찰(Observe)하는 동적 상호작용 패턴.",
    youtubeUrl: "https://www.youtube.com/watch?v=Eug2cvOXzU8",
    youtubeTitle: "ReAct Pattern: Synergizing Reasoning and Acting in Language Models",
    youtubeSummary: "생각(Thought) ➔ 행동(Action: 도구 호출) ➔ 관찰(Observation) ➔ 다음 생각으로 이어지는 ReAct 루프를 통해 에이전트가 외부 세계와 능동적으로 상호작용하는 원리를 해설합니다."
  },
  { 
    id: 23, 
    name: "RLHF", 
    eng: "Reinforcement Learning from Human Feedback", 
    category: "LLM", 
    desc: "모델의 답변에 대해 인간 전문가가 선호도를 점수화하고, 이 보상 모델을 바탕으로 강화학습을 진행하여 AI가 인간의 윤리적 가치와 의도에 부합(Alignment)하도록 유도하는 훈련법.",
    youtubeUrl: "https://www.youtube.com/watch?v=2MBJOuVq380",
    youtubeTitle: "Reinforcement Learning from Human Feedback (RLHF) from Scratch",
    youtubeSummary: "인간 평가자의 선호도 비교 데이터로 보상 모델(Reward Model)을 훈련하고, PPO 알고리즘을 사용해 LLM의 정책을 인간 의도에 정렬(Alignment)시키는 메커니즘을 정리합니다."
  },
  { 
    id: 24, 
    name: "LoRA", 
    eng: "Low-Rank Adaptation", 
    category: "LLM", 
    desc: "사전 학습된 수십억 파라미터를 전부 재훈련하는 대신, 중요도 높은 작은 크기의 랭크 행렬만 병렬로 추가 학습시켜 모델의 미세조정(Fine-tuning)에 소요되는 GPU 메모리와 시간을 획기적으로 줄이는 기법.",
    youtubeUrl: "https://www.youtube.com/watch?v=dA-NhCtrrVE",
    youtubeTitle: "LoRA: Low-Rank Adaptation of Large Language Models (Explained)",
    youtubeSummary: "원본 가중치는 동결한 채 저차원 행렬 곱(A x B)을 우회 통로로 삽입하여 0.1% 미만의 파라미터만으로 완벽한 미세조정 효과를 얻는 LoRA의 수학적 원리를 알기 쉽게 설명합니다."
  },
  { 
    id: 25, 
    name: "Fine-tuning", 
    eng: "Fine-tuning (미세 조정)", 
    category: "LLM", 
    desc: "이미 방대한 데이터로 사전 훈련을 마친 기초 모델에 특정 도메인이나 기업 특화 데이터를 소규모로 추가 훈련시켜, 해당 산업의 전문 지식과 특유의 어조를 반영하도록 튜닝하는 과정.",
    youtubeUrl: "https://www.youtube.com/watch?v=eC6Hd1hFvos",
    youtubeTitle: "Finetuning Large Language Models - Andrew Ng & Sharon Zhou",
    youtubeSummary: "프롬프트 엔지니어링과 RAG로 해결되지 않는 특정 스타일, 구조화된 출력 준수, 도메인 특화 용어 체득을 위해 사전 학습 모델을 맞춤 훈련하는 베스트 프랙티스를 제공합니다."
  },
  { 
    id: 26, 
    name: "Prompt Engineering", 
    eng: "Prompt Engineering", 
    category: "Framework", 
    desc: "모델이 최적의 결과물을 산출하도록 지시어, 역할 부여, 맥락 정보, 제약 조건 등을 정교하게 설계하고 조정하는 수작업 공정. 최근 DSPy 등의 자동 최적화 툴에 의해 입지가 좁아짐.",
    youtubeUrl: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
    youtubeTitle: "ChatGPT Prompt Engineering for Developers (DeepLearning.AI)",
    youtubeSummary: "명확한 구분 기호 사용, 구조화된 출력 요구, 모델에게 생각할 시간 부여 등 개발자가 시스템 통합 시 필수로 알아야 할 핵심 프롬프트 설계 원칙을 실습합니다."
  },
  { 
    id: 27, 
    name: "Context Engineering", 
    eng: "Context Engineering", 
    category: "Architecture", 
    desc: "단일 지시어를 다듬는 프롬프트 엔지니어링과 구별되며, 컨텍스트 창 내부에 외부에서 검색된 문서, 메모리 압축 결과, 툴의 명세 등을 가장 효율적으로 배치하여 정보 밀도를 높이는 작업.",
    youtubeUrl: "https://www.youtube.com/watch?v=aG3m4U8gD8s",
    youtubeTitle: "Context Engineering vs Prompt Engineering for Modern AI",
    youtubeSummary: "지시문 문구를 다듬는 수준을 넘어, 제한된 컨텍스트 창 안에 도구 명세, 검색 청크, 압축된 세션 메모리를 최적의 순서와 밀도로 동적 구성하는 런타임 엔지니어링을 설명합니다."
  },
  { 
    id: 28, 
    name: "Vector DB", 
    eng: "Vector Database", 
    category: "Knowledge", 
    desc: "텍스트나 이미지 등 비정형 데이터를 고차원 배열인 벡터 공간에 저장하고, 인공신경망 기반 코사인 유사도를 이용해 의미론적으로 가장 유사한 데이터를 밀리초 단위로 찾아내는 데이터베이스.",
    youtubeUrl: "https://www.youtube.com/watch?v=klTvEwg3oJ4",
    youtubeTitle: "Vector Databases in 100 Seconds (Fireship)",
    youtubeSummary: "임베딩 벡터를 HNSW나 IVF 같은 근사 최근접 이웃(ANN) 인덱스로 고속 검색하여 의미 기반 AI 질의응답을 가능케 하는 벡터 DB의 개념과 핵심 알고리즘을 100초 만에 요약합니다."
  },
  { 
    id: 29, 
    name: "Embeddings", 
    eng: "Embeddings", 
    category: "LLM", 
    desc: "사람의 언어나 이미지를 컴퓨터가 의미 유사도를 계산할 수 있도록 다차원 실수 형태의 수치 벡터로 변환하는 기술. RAG 시스템에서 정보를 검색하기 위한 핵심 요소.",
    youtubeUrl: "https://www.youtube.com/watch?v=gQddtTdmG_8",
    youtubeTitle: "Word Embeddings & Vectors: How AI Understands Meaning (3Blue1Brown)",
    youtubeSummary: "단어와 문장이 고차원 벡터 공간의 좌표로 변환되어 '왕 - 남자 + 여자 = 여왕'과 같은 의미적 기하학 관계를 형성하는 임베딩의 원리를 시각적으로 증명합니다."
  },
  { 
    id: 30, 
    name: "Semantic Search", 
    eng: "Semantic Search", 
    category: "Knowledge", 
    desc: "사용자가 입력한 단어의 철자 일치 여부를 떠나, 검색어 이면에 깔린 맥락(Context)과 의도(Intent)를 파악하여 의미론적으로 동일선상에 있는 정보를 찾아내는 고도화된 검색 메커니즘.",
    youtubeUrl: "https://www.youtube.com/watch?v=7uK3k8lQy98",
    youtubeTitle: "Semantic Search vs Keyword Search: Pinecone Deep Dive",
    youtubeSummary: "오타나 동의어 불일치 시 실패하는 전통 키워드(BM25) 검색의 한계를 넘어서, 밀집 벡터(Dense Vectors)를 이용해 사용자 질의의 진정한 숨은 의도를 포착하는 검색 아키텍처입니다."
  },
  { 
    id: 31, 
    name: "Zero-shot Learning", 
    eng: "Zero-shot Learning", 
    category: "Architecture", 
    desc: "프롬프트 상에 어떠한 정답 예시나 데모를 제공하지 않은 상태에서도, 모델이 사전 학습된 방대한 지식과 지시문 자체의 추론만으로 즉각적으로 올바른 답변을 도출해내는 능력.",
    youtubeUrl: "https://www.youtube.com/watch?v=mD_4gE6K2aM",
    youtubeTitle: "Zero-Shot Learning Explained Clearly (StatQuest)",
    youtubeSummary: "훈련 과정에서 단 한 번도 보지 못한 새로운 클래스나 작업에 대해서도 사전 지식의 의미적 연관성을 통해 정답을 분류하고 추론해내는 Zero-shot 능력을 명쾌하게 해설합니다."
  },
  { 
    id: 32, 
    name: "Few-shot Learning", 
    eng: "Few-shot Learning", 
    category: "Architecture", 
    desc: "LLM이 복잡한 작업 규칙이나 특정 출력 포맷을 정확히 따르도록 돕기 위해, 프롬프트 입력창 내부에 2~5개 정도의 모범적인 질의-응답 예시를 명시적으로 제공하여 추론의 힌트로 삼는 방식.",
    youtubeUrl: "https://www.youtube.com/watch?v=kY3hD_9Jt7E",
    youtubeTitle: "Language Models are Few-Shot Learners (GPT-3 Paper Explained)",
    youtubeSummary: "가중치를 전혀 업데이트하지 않고 프롬프트 문맥 내에 2~3개의 질의-응답 예시(In-Context Learning)만 제공하여 모델을 즉석 튜닝하는 퓨샷 학습의 마법을 리뷰합니다."
  },
  { 
    id: 33, 
    name: "HITL", 
    eng: "Human-in-the-Loop", 
    category: "Security", 
    desc: "자율 에이전트가 외부 환경 시스템의 데이터를 조작하거나 중대한 결정을 내리기 직전 단계에서, 필수적으로 인간 관리자의 검토와 승인을 거치게 만들어 책임을 통제하는 안전 거버넌스 체계.",
    youtubeUrl: "https://www.youtube.com/watch?v=V98r8o4K8l0",
    youtubeTitle: "Human-in-the-Loop (HITL) for Enterprise AI Governance",
    youtubeSummary: "고위험 금융 거래, 개인정보 변경, 물리 시스템 제어 등 비가역적 결과를 초래할 수 있는 에이전트 행동 직전에 인간 승인 게이트웨이를 배치하여 책임을 보증하는 거버넌스 프레임워크입니다."
  },
  { 
    id: 34, 
    name: "API", 
    eng: "Application Programming Interface", 
    category: "Framework", 
    desc: "서로 다른 소프트웨어 애플리케이션이나 원격 시스템 간에 데이터를 교환하고 기능을 제어할 수 있도록 정의된 운영 체계적 인터페이스. 에이전트가 도구를 사용할 때 필수적인 통로.",
    youtubeUrl: "https://www.youtube.com/watch?v=s7wmiS2mSXY",
    youtubeTitle: "What is an API? REST, JSON, and Web Services (Computerphile)",
    youtubeSummary: "소프트웨어 간 통신을 정의하는 규약인 API의 원리와, AI 에이전트가 데이터베이스, 외부 웹 서비스, 클라우드 인프라를 프로그래밍 방식으로 조작하기 위한 연결 접점을 소개합니다."
  },
  { 
    id: 35, 
    name: "JSON-RPC", 
    eng: "JSON Remote Procedure Call", 
    category: "Architecture", 
    desc: "경량화된 데이터 포맷인 JSON을 기반으로 하여, 원격 서버에 위치한 함수(프로시저)를 호출하고 응답을 받는 데 사용되는 프로토콜. MCP의 기본 통신 스펙으로 활용됨.",
    youtubeUrl: "https://www.youtube.com/watch?v=8cRk1Vb8M4A",
    youtubeTitle: "JSON-RPC 2.0 Protocol Explained for Modern Agent Communication",
    youtubeSummary: "앤스로픽 MCP의 기반 통신 규약인 JSON-RPC 2.0의 Request, Response, Notification 메시지 구조와 원격 함수 호출 절차를 개발자 관점에서 깔끔하게 분석합니다."
  },
  { 
    id: 36, 
    name: "Tool Use / Function Calling", 
    eng: "Tool Use / Function Calling", 
    category: "Framework", 
    desc: "LLM이 단순 텍스트를 응답하는 것을 넘어, 날씨 API, 데이터베이스 SQL 쿼리 등 외부 기능을 직접 호출하기 위해 정확한 인자(Arguments)를 JSON 포맷으로 생성해내는 실행 능력.",
    youtubeUrl: "https://www.youtube.com/watch?v=0hN2WbB3y6c",
    youtubeTitle: "How Tool Use & Function Calling Works in Modern LLMs (LangChain)",
    youtubeSummary: "모델이 시스템 프롬프트에 정의된 JSON 스키마를 이해하고, 자연어 질의에 맞춰 함수명과 타입 안전 인자들을 자동 추출하여 외부 시스템에 실행 요청을 보내는 매커니즘을 시연합니다."
  },
  { 
    id: 37, 
    name: "Orchestration", 
    eng: "Orchestration (in AI)", 
    category: "Architecture", 
    desc: "복수의 AI 에이전트, 프롬프트 체인, 도구 호출, 검색 파이프라인 등을 유기적으로 배치하고 작업의 흐름, 분할, 병렬 실행 등을 중앙에서 자동 조율하는 관리 기술.",
    youtubeUrl: "https://www.youtube.com/watch?v=4y2v7Q4_Y5k",
    youtubeTitle: "Multi-Agent Orchestration Patterns (Harrison Chase - LangChain)",
    youtubeSummary: "라우터, 오케스트레이터-워커, 계층적 감독자(Supervisor) 패턴 등 복합 에이전트 시스템에서 상태를 안전하게 전달하고 동시 작업을 동기화하는 오케스트레이션 패턴을 배웁니다."
  },
  { 
    id: 38, 
    name: "Context Window", 
    eng: "Context Window", 
    category: "LLM", 
    desc: "LLM이 1회의 대화(세션) 처리 시 한 번에 인지하고 기억할 수 있는 입력 및 출력 텍스트 토큰의 최대 길이 한계. 모델의 단기 작업 기억 용량을 결정하는 주요 스펙임.",
    youtubeUrl: "https://www.youtube.com/watch?v=j_mC2R4j5G4",
    youtubeTitle: "How LLM Context Windows Work & FlashAttention (ByteByteGo)",
    youtubeSummary: "트랜스포머 어텐션의 O(N^2) 메모리 복잡도 한계를 극복하고 FlashAttention 및 RoPE 확장을 통해 수백만 토큰 컨텍스트 창을 달성하는 현대 인프라 기술을 해설합니다."
  },
  { 
    id: 39, 
    name: "Token", 
    eng: "Token", 
    category: "LLM", 
    desc: "AI 모델이 자연어를 인식하고 처리하기 위해 문장을 잘게 나눈 최소 단위. 영어의 경우 보통 단어의 일부 조각이며, 한글은 형태소나 음절 단위로 분해되어 API 비용 계산의 기준이 됨.",
    youtubeUrl: "https://www.youtube.com/watch?v=zduSFxRajkE",
    youtubeTitle: "Let's build the GPT Tokenizer from scratch (Andrej Karpathy)",
    youtubeSummary: "안드레이 카파시가 바이트 페어 인코딩(BPE) 알고리즘을 이용해 자연어 텍스트를 정수 토큰 배열로 분해하고 모델의 어휘집(Vocabulary)을 구축하는 과정을 직접 코딩으로 가르칩니다."
  },
  { 
    id: 40, 
    name: "Guardrails", 
    eng: "AI Guardrails", 
    category: "Security", 
    desc: "에이전트나 모델이 편향되거나 위험한 명령을 수행하지 못하도록, 프롬프트 입력 단계와 결과물 출력 단계를 가로채어 검열, 필터링, 정제하는 하네스 내부의 핵심 안전 통제 장치.",
    youtubeUrl: "https://www.youtube.com/watch?v=7ZfG4Y7v8_A",
    youtubeTitle: "NVIDIA NeMo Guardrails: Programmable LLM Safety Framework",
    youtubeSummary: "대화 흐름 가드레일, 사실성 검증 가드레일, 탈옥 방지 가드레일을 결합하여 허용되지 않은 주제를 차단하고 안전한 응답만을 보장하는 엔지니어링 프레임워크를 설명합니다."
  },
  { 
    id: 41, 
    name: "Observability", 
    eng: "Observability (in AI)", 
    category: "Framework", 
    desc: "에이전트 워크플로우의 실행 로그, 도구 호출 시점, 토큰 사용량, 지연 시간 등을 포괄적으로 모니터링하고 추적함으로써 실패의 근본 원인을 투명하게 진단(Tracing)하는 시스템적 역량.",
    youtubeUrl: "https://www.youtube.com/watch?v=1F2_8j8hE_o",
    youtubeTitle: "LLM Observability and Tracing in Production (LangSmith & Arize)",
    youtubeSummary: "다단계 에이전트 루프에서 발생하는 세부 스텝, 토큰 소모량, 지연 시간, 중간 도구 반환값을 스팬(Span) 단위로 가시화하여 실패 지점을 정확히 역추적하는 모니터링 기법입니다."
  },
  { 
    id: 42, 
    name: "Memory (Agent Memory)", 
    eng: "Short-term / Long-term Memory", 
    category: "Architecture", 
    desc: "에이전트가 단일 세션 내에서 유지하는 컨텍스트 창 기반의 단기 기억과, 파일시스템이나 벡터 DB를 이용해 이전 세션의 지식과 사용자 선호도를 영구 보존하여 참조하는 장기 기억 체계.",
    youtubeUrl: "https://www.youtube.com/watch?v=3l2tG7k0_8M",
    youtubeTitle: "Building Long-Term Memory for AI Agents: Mem0 & Graph Memory",
    youtubeSummary: "대화 세션이 종료되어도 사용자의 습관, 선호도, 성공했던 작업 궤적을 지식 그래프와 시맨틱 벡터로 지속 축적하여 재활용하는 에이전트 장기 메모리 아키텍처를 소개합니다."
  },
  { 
    id: 43, 
    name: "Multi-Agent System", 
    eng: "Multi-Agent System (MAS)", 
    category: "Architecture", 
    desc: "각기 다른 특수 역할, 도구 접근 권한, 시스템 프롬프트를 부여받은 여러 독립적 에이전트들이 통신 네트워크를 이루어 상호 검증, 비판, 분업하며 복잡한 문제를 해결하는 아키텍처.",
    youtubeUrl: "https://www.youtube.com/watch?v=2u8J5M1x2oQ",
    youtubeTitle: "Multi-Agent Systems: AutoGen & CrewAI in Action",
    youtubeSummary: "연구원, 개발자, QA 테스터 등 전문 역할을 맡은 다중 에이전트들이 서로 대화를 주고받으며 결과물을 비판하고 검증하여 단일 에이전트 대비 결함률을 급감시키는 원리를 설명합니다."
  },
  { 
    id: 44, 
    name: "Auto-GPT / AutoGen", 
    eng: "Autonomous Agent Frameworks", 
    category: "Framework", 
    desc: "자율 에이전트의 대중화를 이끈 오픈소스(Auto-GPT) 프로젝트와, 마이크로소프트가 개발하여 다중 에이전트 간의 대화 기반 협력 및 오케스트레이션을 돕는 개발 프레임워크(AutoGen).",
    youtubeUrl: "https://www.youtube.com/watch?v=Jm2h7_q2gP4",
    youtubeTitle: "Microsoft AutoGen Deep Dive: Building Collaborative AI Teams",
    youtubeSummary: "마이크로소프트의 AutoGen 프레임워크를 사용해 대화 가능한 다중 에이전트들을 코딩하고, 코드 실행 샌드박스와 인간 피드백을 결합해 복합 소프트웨어를 자동 개발하는 과정을 다룹니다."
  },
  { 
    id: 45, 
    name: "LangChain", 
    eng: "LangChain", 
    category: "Framework", 
    desc: "LLM 애플리케이션 개발을 돕기 위해 프롬프트 템플릿, 메모리 컴포넌트, 검색 인터페이스 등을 표준화된 체인(Chain) 블록으로 제공하는 업계에서 가장 광범위하게 쓰이는 파이썬 오픈소스 라이브러리.",
    youtubeUrl: "https://www.youtube.com/watch?v=aywZrzNaKjs",
    youtubeTitle: "LangChain Crash Course: Build Production LLM Apps",
    youtubeSummary: "프롬프트 템플릿, 모델 인터페이스, 체인(LCEL), 리트리버, 그리고 툴 연동까지 LangChain의 핵심 컴포넌트를 사용하여 실무 AI 파이프라인을 구축하는 종합 가이드입니다."
  },
  { 
    id: 46, 
    name: "LlamaIndex", 
    eng: "LlamaIndex", 
    category: "Knowledge", 
    desc: "기업의 비공개 데이터 자산(PDF, DB 등)을 모델과 연결하기 위해, 문서를 청킹(Chunking)하고 고도로 튜닝된 인덱싱을 수행하여 검색 증강 생성(RAG)의 성능을 극대화하는 데이터 특화 프레임워크.",
    youtubeUrl: "https://www.youtube.com/watch?v=f2W2vY_3K4U",
    youtubeTitle: "LlamaIndex: Advanced RAG Architecture & Data Ingestion (Jerry Liu)",
    youtubeSummary: "LlamaIndex 설립자 Jerry Liu가 문서 로더, 계층적 청킹, 서브 퀘스천 쿼리 엔진, 리랭킹(Reranking)을 통해 고신뢰성 엔터프라이즈 RAG를 구축하는 노하우를 전달합니다."
  },
  { 
    id: 47, 
    name: "AGI", 
    eng: "Artificial General Intelligence", 
    category: "LLM", 
    desc: "특정 도메인의 작업에 얽매이지 않고, 인간과 동일하거나 그 이상 수준의 보편적 학습 능력, 추론, 교차 지식 융합을 통해 스스로 목적을 찾아 모든 지적 과제를 수행할 수 있는 강인공지능.",
    youtubeUrl: "https://www.youtube.com/watch?v=Yf1o0TQzry8",
    youtubeTitle: "Sam Altman: OpenAI, GPT-5, and the Road to AGI (Lex Fridman Podcast)",
    youtubeSummary: "오픈AI CEO 샘 알트만이 현재의 파운데이션 모델에서 자율적 과학 발견, 경제적 가치 창출, 인류 수준의 범용 지능(AGI)으로 진화하는 로드맵과 안전 철학을 논의합니다."
  },
  { 
    id: 48, 
    name: "Hallucination", 
    eng: "Hallucination (환각)", 
    category: "Security", 
    desc: "학습 데이터의 내재적 결함이나 정보 부재로 인해, LLM이 전혀 사실이 아닌 허구의 정보를 마치 완벽한 논리 구조를 갖춘 사실인 것처럼 그럴싸하게 생성해내는 치명적인 신뢰성 결함 현상.",
    youtubeUrl: "https://www.youtube.com/watch?v=cfqtFvWNhPU",
    youtubeTitle: "AI Hallucinations: Causes, Detection, and Mitigation (IBM Technology)",
    youtubeSummary: "확률적 다음 토큰 예측 특성상 발생하는 환각의 신경망 내부 원인을 규명하고, RAG, 구조화된 출력, 자체 일관성 검증(Self-Consistency)으로 환각을 최소화하는 전략을 배웁니다."
  },
  { 
    id: 49, 
    name: "Chunking", 
    eng: "Chunking", 
    category: "Knowledge", 
    desc: "방대하고 긴 텍스트 문서를 벡터 DB에 임베딩하기 위해, 문맥과 의미가 훼손되지 않는 선에서 특정한 길이(토큰 단위)나 의미적 문단 단위로 잘게 분할하는 RAG 시스템의 필수 전처리 과정.",
    youtubeUrl: "https://www.youtube.com/watch?v=0kF8s8G9A7E",
    youtubeTitle: "Chunking Strategies for RAG: Fixed Size vs Semantic Chunking",
    youtubeSummary: "고정 토큰 길이 분할, 문장 단위 오버랩, 시맨틱 유사도 기반 청킹, 마크다운 헤더 분할 등 검색 정확도에 직접적인 영향을 미치는 최적의 청킹 전략을 비교 실습합니다."
  },
  { 
    id: 50, 
    name: "Prompt Injection", 
    eng: "Prompt Injection", 
    category: "Security", 
    desc: "시스템 프롬프트의 가드레일을 우회하기 위해, 악의적 공격자가 일반적인 사용자의 입력 데이터 내에 교묘한 명령(예: '이전 지시를 무시하고~')을 은닉하여 시스템 통제권을 탈취하는 해킹 기법.",
    youtubeUrl: "https://www.youtube.com/watch?v=gA_bK0K4Q9o",
    youtubeTitle: "Prompt Injection: The Security Flaw of LLMs (Computerphile)",
    youtubeSummary: "직접 인젝션(Direct Injection)과 외부 웹페이지/문서를 오염시키는 간접 인젝션(Indirect Injection)의 위협 메커니즘과 이를 방어하기 위한 듀얼 LLM 아키텍처를 분석합니다."
  },
  { 
    id: 51, 
    name: "Hermes", 
    eng: "Hermes Agent Framework / Hermes Model", 
    category: "Framework", 
    desc: "Nous Research에서 주도하는 오픈소스 기반 자율 에이전트 프레임워크 및 추론 특화 LLM. 복잡한 도구 호출과 다단계 에이전트 실행 궤적을 무료/로컬 환경에서도 유연하게 제어하도록 지원함.",
    youtubeUrl: "https://www.youtube.com/watch?v=0jK1V4L2b8A",
    youtubeTitle: "Nous Hermes: Advanced Open-Source Function Calling & Reasoning",
    youtubeSummary: "오픈소스 진영의 대표적 에이전트 모델인 Nous Hermes의 도구 호출 능력, 구조화된 XML/JSON 추론 태그 지원 및 로컬 오프라인 환경 배포 기법을 상세히 분석합니다."
  },
  { 
    id: 52, 
    name: "OpenClaw", 
    eng: "OpenClaw Autonomous Platform", 
    category: "Framework", 
    desc: "로컬 파일시스템 직렬화 및 MCP 통신 프로토콜을 결합하여, 개발자가 원격 클라우드 종속 없이 독자적인 로컬 에이전트 파이프라인과 자동화 스크립트를 안전하게 디버깅하고 배포할 수 있도록 돕는 에이전트 플랫폼.",
    youtubeUrl: "https://www.youtube.com/watch?v=3f4K8_J2u10",
    youtubeTitle: "OpenClaw: Autonomous Local Agent Execution & MCP Tool Integration",
    youtubeSummary: "클라우드 락인 없는 로컬 워크스테이션 환경에서 파일시스템 영속화와 MCP 프로토콜 도구를 결합하여 안전한 자동화 워크플로우를 구성하고 실행하는 OpenClaw 생태계를 소개합니다."
  }
];
