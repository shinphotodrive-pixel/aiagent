import { ArchitectureNode, PresetScenario } from '../types';

export const ARCHITECTURE_NODES: Record<string, ArchitectureNode> = {
  // Column 1: Pure LLM
  'user-1': {
    id: 'user-1',
    name: 'User',
    nameKo: '사용자',
    paradigm: 'llm',
    category: 'user',
    x: 150,
    y: 100,
    colorClass: 'node-user',
    summary: 'Direct user query asking for assistance or information.',
    summaryKo: '자연어로 질문이나 작업을 직접 요청하는 사용자.',
    details: {
      description: 'The end-user provides natural language input. In pure LLM, the model has no external access or persistence, so the entire context depends on what the user types right now.',
      descriptionKo: '사용자가 자연어 질문을 입력합니다. 순수 LLM 환경에서는 모델이 외부 인터넷이나 영구 기억에 접근할 수 없으므로, 현재 입력한 프롬프트에만 전적으로 의존합니다.',
      input: 'Natural language text input',
      inputKo: '사용자 자연어 텍스트 입력',
      output: 'Prompt string dispatched to model',
      outputKo: '모델로 전달되는 텍스트 프롬프트',
      techStack: ['Web UI', 'Mobile App', 'CLI', 'API Client'],
      challenges: [
        'User prompt ambiguity',
        'Lack of real-time context',
        'Model training cut-off unawareness'
      ],
      challengesKo: [
        '모호한 질문 입력 시 부정확한 결과',
        '실시간 정보 부재',
        '학습 데이터 컷오프 시점 인식 불가'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `const userQuery = "Explain how transformer self-attention works.";`
      }
    }
  },
  'prompt-1': {
    id: 'prompt-1',
    name: 'Prompt',
    nameKo: '프롬프트 (Prompt)',
    paradigm: 'llm',
    category: 'prompt',
    x: 150,
    y: 220,
    colorClass: 'node-rect bg-green-light',
    summary: 'Raw system instructions and user query tokenized for generation.',
    summaryKo: '시스템 지시문과 사용자 질의가 토큰화되어 신경망으로 전달되는 프롬프트.',
    details: {
      description: 'Text packaged with system role instructions and sent directly to the model layers without any retrieval injection or external fact verification.',
      descriptionKo: '외부 지식 주입이나 검증 과정 없이 시스템 프롬프트와 사용자 텍스트가 모델 신경망으로 곧바로 전송됩니다.',
      input: 'User input + optional system instruction',
      inputKo: '사용자 입력 + 기본 시스템 지침',
      output: 'Tokenized tensor input (B, Seq_Len)',
      outputKo: '토큰화된 텐서 시퀀스',
      techStack: ['BPE Tokenizer', 'SentencePiece', 'Tiktoken'],
      challenges: [
        'Context window limits',
        'Prompt injection vulnerabilities',
        'Inability to fetch private data'
      ],
      challengesKo: [
        '컨텍스트 윈도우 크기 한계',
        '프롬프트 인젝션 취약점',
        '비공개 사내 데이터 접근 불가'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `const prompt = \`System: You are a helpful assistant.\\nUser: \${userQuery}\`;`
      }
    }
  },
  'llm-1': {
    id: 'llm-1',
    name: 'LLM',
    nameKo: 'LLM (대형 언어 모델)',
    paradigm: 'llm',
    category: 'llm',
    x: 150,
    y: 400,
    colorClass: 'node-rect bg-blue',
    summary: 'Frozen parametric neural network weights predicting next tokens.',
    summaryKo: '사전 학습된 정적 신경망 가중치(Weights)로 다음 토큰을 자가회귀 예측.',
    details: {
      description: 'The foundation model performs a single forward autoregressive inference pass purely based on weights frozen during pre-training. It has no web connectivity, no tool execution, and no state between independent requests.',
      descriptionKo: '사전 학습 시 동결된 정적 가중치에만 의존하여 자가회귀(Autoregressive) 방식으로 답변을 생성합니다. 실시간 웹 검색이나 도구 호출 권한이 없습니다.',
      input: 'Token IDs sequence',
      inputKo: '토큰 ID 시퀀스',
      output: 'Probability logits & sampled tokens',
      outputKo: '로짓 확률 기반 생성 토큰',
      techStack: ['Transformer Decoder', 'Attention Mechanism', 'GPU Clusters (H100/TPU)'],
      challenges: [
        'Hallucination on unknown facts',
        'Static knowledge cutoff date',
        'Cannot verify factual citations'
      ],
      challengesKo: [
        '모르는 사실에 대한 그럴듯한 환각(Hallucination)',
        '학습 시점(Cutoff) 이후 지식 부재',
        '출처 사실 검증 불가능'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// Pure LLM direct generation
const response = await ai.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: prompt
});`
      }
    }
  },
  'answer-1': {
    id: 'answer-1',
    name: 'Answer',
    nameKo: '답변 (Answer)',
    paradigm: 'llm',
    category: 'answer',
    x: 150,
    y: 550,
    colorClass: 'node-rect bg-orange',
    summary: 'Unverifiable text output based purely on internal memorization.',
    summaryKo: '모델 내부 암기 가중치에만 근거한 정적 텍스트 출력.',
    details: {
      description: 'Raw generated text streamed back to the user. Fast and direct, but cannot guarantee accuracy for temporal, private, or complex multi-step reasoning tasks.',
      descriptionKo: '사용자에게 즉시 반환되는 텍스트 응답입니다. 지연 시간은 매우 짧으나, 최신 데이터나 검증된 인용 링크가 제공되지 않습니다.',
      input: 'Model generated token stream',
      inputKo: '모델 출력 토큰 스트림',
      output: 'Rendered chat message or plain text',
      outputKo: '렌더링된 채팅 메시지',
      techStack: ['SSE (Server-Sent Events)', 'Markdown Renderer'],
      challenges: [
        'No source links',
        'No real-world actions executed',
        'High hallucination vulnerability'
      ],
      challengesKo: [
        '출처 링크/근거 문서 부재',
        '외부 작업/트랜잭션 실행 불가',
        '환각 발생 시 사용자가 직접 감별해야 함'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `return { answer: response.text, citations: [], toolsUsed: [] };`
      }
    }
  },

  // Column 2: R.A.G (Perplexity)
  'user-2': {
    id: 'user-2',
    name: 'User',
    nameKo: '사용자',
    paradigm: 'rag',
    category: 'user',
    x: 450,
    y: 100,
    colorClass: 'node-user',
    summary: 'User seeking accurate, source-cited information.',
    summaryKo: '정확한 출처와 근거 자료를 원하는 사용자.',
    details: {
      description: 'The user submits an inquiry that may require domain-specific documents, recent updates, or private enterprise knowledge.',
      descriptionKo: '최신 정보나 사내 문서 등 검증 가능한 지식이 필요한 질문을 제출합니다.',
      input: 'User search query or question',
      inputKo: '사용자 검색 질의 또는 질문',
      output: 'Query text dispatched for retrieval',
      outputKo: '검색 엔진/벡터 저장소로 라우팅되는 질의',
      techStack: ['Enterprise Portal', 'Research Engine UI'],
      challenges: ['Keyword mismatch', 'Complex question formulation'],
      challengesKo: ['키워드 불일치', '복합 질의 분해 필요성'],
      codeSnippet: {
        lang: 'typescript',
        code: `const query = "What were the key findings in the 2026 AI compute efficiency report?";`
      }
    }
  },
  'prompt-2': {
    id: 'prompt-2',
    name: 'Prompt',
    nameKo: '프롬프트 (Prompt)',
    paradigm: 'rag',
    category: 'prompt',
    x: 450,
    y: 220,
    colorClass: 'node-rect bg-green-light',
    summary: 'Original query split into retrieval query and final augmented template.',
    summaryKo: '검색 쿼리 생성 및 최종 컨텍스트 결합용 프롬프트 파이프라인.',
    details: {
      description: 'Coordinates search query generation, semantic embedding, and later accepts retrieved text chunks to produce an augmented prompt for the LLM.',
      descriptionKo: '질의를 바탕으로 검색어를 정제하거나 임베딩을 생성한 뒤, 검색된 외부 문서를 주입받을 템플릿을 준비합니다.',
      input: 'User input + Search query reformulator',
      inputKo: '사용자 입력 + 검색 쿼리 변환기',
      output: 'Embedding query vector & Augmented prompt template',
      outputKo: '임베딩 벡터 및 증강 프롬프트 템플릿',
      techStack: ['Query Expansion (HyDE)', 'Dense Retrieval Vectorizer'],
      challenges: ['Lost in the middle', 'Context window dilution'],
      challengesKo: ['컨텍스트 중간 소실 현상', '불필요한 노이즈 청크 유입'],
      codeSnippet: {
        lang: 'typescript',
        code: `const queryEmbedding = await embedText(query);`
      }
    }
  },
  'search-2': {
    id: 'search-2',
    name: 'Search',
    nameKo: '검색 (Search)',
    paradigm: 'rag',
    category: 'search',
    x: 650,
    y: 220,
    colorClass: 'node-rect-sm bg-green-dark',
    summary: 'Hybrid dense vector + sparse keyword search across knowledge bases.',
    summaryKo: '벡터 임베딩 유사도 및 키워드 기반 하이브리드 검색 파이프라인.',
    details: {
      description: 'Executes similarity queries against vector databases or web search APIs to fetch relevant passages, documents, or chunks with high cosine similarity.',
      descriptionKo: '벡터 DB나 웹 검색 API를 통해 질문과 의미적으로 가장 연관된 상위 k개 문서 청크를 고속 인덱싱으로 검색합니다.',
      input: 'Query vector & keyword filters',
      inputKo: '쿼리 벡터 및 필터 조건',
      output: 'Top-K ranked document chunks with similarity scores',
      outputKo: '유사도 순위가 매겨진 상위 K개 문서 청크',
      techStack: ['HNSW Index', 'BM25 + Dense RRF', 'Cohere Rerank', 'Google Search Grounding'],
      challenges: [
        'Out-of-domain vocabulary',
        'Chunk boundary truncation',
        'Reranking latency overhead'
      ],
      challengesKo: [
        '어휘 불일치 문제',
        '청크 분할 시 문맥 단절',
        '재순위화(Reranking) 지연 시간'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// Hybrid search over vector database
const chunks = await vectorDb.query({
  vector: queryEmbedding,
  topK: 5,
  includeMetadata: true
});`
      }
    }
  },
  'context-2': {
    id: 'context-2',
    name: 'Context',
    nameKo: '컨텍스트 (Context DB)',
    paradigm: 'rag',
    category: 'context',
    x: 650,
    y: 330,
    colorClass: 'node-db bg-db-blue',
    summary: 'Vector database storing indexed embeddings and document metadata.',
    summaryKo: '사내 지식 문서 및 인덱싱된 임베딩을 저장하는 벡터 데이터베이스.',
    details: {
      description: 'Enterprise knowledge repository or indexed web documents stored as multi-dimensional vectors (e.g., 768 or 1536 dims) for rapid sub-millisecond nearest neighbor search.',
      descriptionKo: '다차원 임베딩 벡터로 변환된 문서들이 저장된 지식 베이스입니다. 코사인 유사도 등을 통해 즉시 관련 청크를 반환합니다.',
      input: 'Processed document corpus, PDF/Notion embeddings',
      inputKo: '전처리된 사내 문서, PDF/위키 임베딩',
      output: 'Matched context text + source metadata',
      outputKo: '일치된 원문 청크 및 출처 메타데이터',
      techStack: ['Pinecone', 'pgvector / Cloud SQL', 'Milvus', 'ChromaDB', 'Qdrant'],
      challenges: [
        'Index synchronization & staleness',
        'Chunking chunk size optimization (256 vs 512 tokens)',
        'Storage scaling costs'
      ],
      challengesKo: [
        '문서 갱신 시 인덱스 동기화',
        '최적 청크 크기 산정 (Chunking Strategy)',
        '대규모 벡터 저장소 비용'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// Retrieved context injected into prompt
const contextText = chunks.map((c, i) => \`[\${i+1}] \${c.text}\`).join('\\n');`
      }
    }
  },
  'llm-2': {
    id: 'llm-2',
    name: 'LLM',
    nameKo: 'LLM (증강 추론 모델)',
    paradigm: 'rag',
    category: 'llm',
    x: 450,
    y: 400,
    colorClass: 'node-rect bg-blue',
    summary: 'LLM constrained to answer solely using the injected context.',
    summaryKo: '검색된 컨텍스트를 주입받아 근거에 입각해 답변을 합성하는 LLM.',
    details: {
      description: 'Receives the original query along with retrieved context. Instructed strictly to ground its response in the provided passages and cite numbered sources.',
      descriptionKo: '사용자 질문과 주입된 컨텍스트를 결합하여 사실에 근거한 답변을 생성합니다. 모르는 내용은 임의로 지어내지 않고 검색 결과만 인용하도록 지침이 부여됩니다.',
      input: 'Prompt + Injected Context Chunks [1][2]',
      inputKo: '프롬프트 + 주입된 외부 문서 청크',
      output: 'Fact-grounded synthesis with citations',
      outputKo: '출처 인용이 포함된 사실 기반 합성 텍스트',
      techStack: ['Context-Window Grounding', 'In-Context Learning', 'Gemini Flash Grounding'],
      challenges: [
        'Context conflict handling',
        'Model ignoring context on strong priors',
        'Increased input token costs'
      ],
      challengesKo: [
        '검색 결과 간 상충되는 내용 처리',
        '사전 학습 가중치가 검색 결과를 무시하는 현상',
        '입력 토큰 증가에 따른 비용 및 지연'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `const groundedPrompt = \`Based ONLY on the following context, answer the query:
Context: \${contextText}
Query: \${query}\`;`
      }
    }
  },
  'answer-2': {
    id: 'answer-2',
    name: 'Answer',
    nameKo: '답변 (Answer with Citations)',
    paradigm: 'rag',
    category: 'answer',
    x: 450,
    y: 550,
    colorClass: 'node-rect bg-orange',
    summary: 'Grounded response backed by verifiable source citations.',
    summaryKo: '검증 가능한 출처 링크와 인용구가 포함된 신뢰도 높은 답변.',
    details: {
      description: 'Delivers high factual accuracy, reducing hallucination by anchoring statements to retrieved excerpts. Users can verify citations directly by clicking sources.',
      descriptionKo: '각 문장마다 출처 번호[1][2]가 매핑되어 있어 사용자가 즉시 사실 여부를 검증할 수 있습니다. 환각율이 대폭 감소합니다.',
      input: 'Synthesized grounded text',
      inputKo: '합성된 근거 기반 텍스트',
      output: 'Answer with clickable citations and excerpts',
      outputKo: '클릭 가능한 출처 링크 및 인용문',
      techStack: ['Citation Parsers', 'Source Card UI', 'Perplexity style UI'],
      challenges: ['Static answer only (no external action/transactions performed)'],
      challengesKo: ['여전히 읽기 전용(Read-only)이며 실제 시스템 수정/액션 불가'],
      codeSnippet: {
        lang: 'typescript',
        code: `return {
  answer: result.text,
  citations: chunks.map(c => ({ title: c.title, url: c.url }))
};`
      }
    }
  },

  // Column 3: Agentic AI (Goover / Operator)
  'user-3': {
    id: 'user-3',
    name: 'User',
    nameKo: '사용자',
    paradigm: 'agentic',
    category: 'user',
    x: 820,
    y: 100,
    colorClass: 'node-user',
    summary: 'User defining high-level objective, constraints, and delegated goals.',
    summaryKo: '고수준의 복합 목표와 제약 조건을 위임하는 사용자.',
    details: {
      description: 'Instead of just asking for a static explanation, the user gives an operational goal: e.g. "Research recent pricing, find anomalies, book the server instance, and notify the team on Slack."',
      descriptionKo: '단순 질의응답을 넘어 "최신 지표를 분석하고 이상치를 발견하면 담당자에게 보고하고 티켓을 생성해줘"와 같은 고수준의 위임 목표를 제시합니다.',
      input: 'Complex multi-step goal / delegation task',
      inputKo: '복합 다단계 목표 / 위임 작업',
      output: 'Autonomous objective assigned to Agent system',
      outputKo: '에이전트 시스템에 할당된 자율 목표',
      techStack: ['Agent Cockpit UI', 'Command Palette', 'Voice/Chat Interface'],
      challenges: ['Permission scoping', 'Safety guardrails and human-in-the-loop triggers'],
      challengesKo: ['권한 범위 설정', '위험한 액션 시 인간 승인(Human-in-the-loop) 필요'],
      codeSnippet: {
        lang: 'typescript',
        code: `const agentGoal = "Book 2 seats under $200, sync to Google Calendar, and send email invite.";`
      }
    }
  },
  'prompt-3': {
    id: 'prompt-3',
    name: 'Prompt',
    nameKo: '프롬프트 (Goal Specification)',
    paradigm: 'agentic',
    category: 'prompt',
    x: 820,
    y: 220,
    colorClass: 'node-rect bg-green-light',
    summary: 'Goal parsing, role definitions, and tool schema initialization.',
    summaryKo: '목표 파싱, 사용 가능한 도구(Tool) 스키마 주입 및 실행 규칙 설정.',
    details: {
      description: 'Transforms the user goal into structured operational prompts containing tool definitions (JSON schemas), safety boundaries, and planning guidelines.',
      descriptionKo: '사용자의 목표를 도구 목록(함수 정의), 허용된 시스템 권한, 추론 단계 지침이 포함된 구조화된 프롬프트로 변환합니다.',
      input: 'User goal + Tool Schema Catalog + Security Policies',
      inputKo: '사용자 목표 + 도구 카탈로그 스키마 + 보안 정책',
      output: 'Agent initialization state',
      outputKo: '에이전트 초기화 상태 객체',
      techStack: ['MCP (Model Context Protocol)', 'OpenAI Function Calling schema', 'LangChain ToolSpecs'],
      challenges: ['Token bloat from too many tool definitions', 'Schema ambiguity'],
      challengesKo: ['수많은 도구 정의로 인한 프롬프트 토큰 비대화', '도구 설명 모호성'],
      codeSnippet: {
        lang: 'typescript',
        code: `const agentPrompt = {
  task: agentGoal,
  tools: [searchApi, calendarApi, emailApi],
  policy: "Require user confirmation before billing transactions."
};`
      }
    }
  },
  'search-3': {
    id: 'search-3',
    name: 'Search',
    nameKo: '검색 (Search Tool)',
    paradigm: 'agentic',
    category: 'search',
    x: 1020,
    y: 220,
    colorClass: 'node-rect-sm bg-green-dark',
    summary: 'Dynamic on-demand search invoked iteratively as a tool.',
    summaryKo: '에이전트의 필요에 따라 실시간으로 호출되는 검색 도구.',
    details: {
      description: 'Unlike static RAG which searches once at the start, Agentic AI can formulate multiple targeted queries dynamically as new questions arise during planning.',
      descriptionKo: '질문 시작 시 단 1회 검색하는 RAG와 달리, 에이전트가 추론 과정에서 추가 사실이 필요할 때마다 자율적으로 여러 차례 검색 쿼리를 수정하여 실행합니다.',
      input: 'Dynamically generated queries by LLM',
      inputKo: 'LLM이 필요 시점에 생성한 타겟 검색 쿼리',
      output: 'Real-time search results fed back to Agent context',
      outputKo: '에이전트 컨텍스트로 환류되는 실시간 검색 결과',
      techStack: ['Tavily API', 'Google Search Grounding', 'SerpAPI', 'Headless Browser Crawler'],
      challenges: ['Infinite query loops', 'Rate limits', 'Distinguishing signal from noise'],
      challengesKo: ['반복적인 쿼리 루프', 'API 호출 제한', '노이즈 정보 필터링'],
      codeSnippet: {
        lang: 'typescript',
        code: `// Agent invokes search tool dynamically
const searchResult = await tools.searchWeb({ query: "Flight discounts SFO to ICN next week" });`
      }
    }
  },
  'context-3': {
    id: 'context-3',
    name: 'Context',
    nameKo: '컨텍스트 (Active Working State)',
    paradigm: 'agentic',
    category: 'context',
    x: 1020,
    y: 310,
    colorClass: 'node-db bg-db-blue',
    summary: 'Short-term working scratchpad holding tool call outputs & observations.',
    summaryKo: '현재 작업 중인 도구 실행 결과, 관찰(Observations) 및 세션 작업대.',
    details: {
      description: 'Stores the immediate scratchpad and observation history of the current task run: tool return values, downloaded file data, browser DOM snapshots, and intermediate tables.',
      descriptionKo: '현재 실행 중인 태스크의 단기 작업대입니다. 방금 실행한 툴의 반환값, 파싱된 JSON, 브라우저 스크린샷 등이 보관되어 다음 추론 단계에 전달됩니다.',
      input: 'Tool output payloads, scraped DOM trees, intermediate artifacts',
      inputKo: '도구 반환 페이로드, DOM 트리, 중간 아티팩트',
      output: 'Observation fed back to LLM reasoning loop',
      outputKo: 'LLM 추론 루프로 전달되는 관찰(Observation) 데이터',
      techStack: ['Redis In-Memory', 'Ephemeral Context Buffer', 'LangGraph State'],
      challenges: ['Context window overflow during long execution loops', 'State serialization'],
      challengesKo: ['장기 루프 실행 시 컨텍스트 윈도우 초과', '상태 직렬화 복잡도'],
      codeSnippet: {
        lang: 'typescript',
        code: `agentState.scratchpad.push({ tool: "searchWeb", observation: searchResult });`
      }
    }
  },
  'memory-3': {
    id: 'memory-3',
    name: 'Memory',
    nameKo: '장기 기억 (Long-term Memory)',
    paradigm: 'agentic',
    category: 'memory',
    x: 620,
    y: 310,
    colorClass: 'node-db bg-db-gold text-black font-semibold',
    summary: 'Persistent episodic & semantic memory retaining past runs, preferences, and identity.',
    summaryKo: '과거 대화 이력, 사용자 선호도, 성공했던 워크플로우를 영구 보관하는 장기 기억.',
    details: {
      description: 'Persistent memory layer that remembers user preferences, past successes, error corrections, and domain knowledge across distinct sessions and days.',
      descriptionKo: '세션이 종료되어도 유지되는 영구 메모리 계층입니다. "사용자는 대한항공을 선호함", "지난주 발급한 API 키 정보" 등 에피소딕/시맨틱 기억을 유지합니다.',
      input: 'Reflection summaries, user preferences, past execution traces',
      inputKo: '자기 반성(Reflection) 요약, 사용자 성향, 과거 성공 기록',
      output: 'Recall of relevant memories and entity relationships',
      outputKo: '관련 기억 회상(Recall) 및 사용자 프로필 데이터',
      techStack: ['Mem0', 'Zep', 'Knowledge Graphs (Neo4j)', 'Vector Store with Metadata Filters'],
      challenges: ['Memory drift', 'Conflicting facts over time', 'Privacy & GDPR forgetting rights'],
      challengesKo: ['기억 왜곡(Memory Drift)', '시간 경과에 따른 정보 충돌', '개인정보 삭제(잊힐 권리) 보장'],
      codeSnippet: {
        lang: 'typescript',
        code: `// Retrieve user preferences from long-term memory
const userMemory = await memory.recall({ userId: "u123", query: "airline preference" });
// Result: "Prefers window seat, Star Alliance / Korean Air"`
      }
    }
  },
  'reasoning-3': {
    id: 'reasoning-3',
    name: 'Reasoning & Planning',
    nameKo: '추론 & 계획 (Reasoning & Planning)',
    paradigm: 'agentic',
    category: 'reasoning',
    x: 620,
    y: 490,
    colorClass: 'node-vertical bg-green-dark text-white font-medium',
    summary: 'Autonomous plan formulation, goal decomposition, and self-reflection loop.',
    summaryKo: '복합 목표를 하위 과업으로 분해하고, 단계별 계획 수립 및 자기 수정(Self-Correction) 반복.',
    details: {
      description: 'The cognitive heart of the agent. Decomposes large objectives into a Directed Acyclic Graph (DAG) or ReAct (Reason + Act) loop, evaluates whether intermediate steps succeeded, and dynamically adjusts the plan when errors occur.',
      descriptionKo: '에이전트의 두뇌 역할을 합니다. 복잡한 목표를 단계별 실행 계획(DAG)으로 분해하고, "생각(Thought) ➔ 행동(Action) ➔ 관찰(Observation) ➔ 반성(Reflection)" 루프를 수행하며 실패 시 스스로 계획을 수정합니다.',
      input: 'Objective + Long-term Memory + Current Observations',
      inputKo: '목표 + 장기 기억 + 현재 관찰 상태',
      output: 'Next step decision: (Call tool X, Ask user, or Finish)',
      outputKo: '다음 실행 결정 (도구 X 호출, 추가 정보 요청, 또는 완료)',
      techStack: ['ReAct Framework', 'Tree of Thoughts (ToT)', 'LangGraph', 'Plan-and-Solve Prompting'],
      challenges: [
        'Infinite looping in deadlock states',
        'Error compounding across steps',
        'High latency from multiple reasoning cycles'
      ],
      challengesKo: [
        '무한 루프(Deadlock) 탈출 실패',
        '초기 오류가 다음 단계로 누적 전파되는 문제',
        '다단계 추론으로 인한 높은 응답 지연'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// ReAct Loop: Thought -> Action -> Observation -> Next Thought
const plan = [
  "1. Search flights under $200",
  "2. Check seat availability for window seat",
  "3. Book ticket via API",
  "4. Dispatch calendar invite"
];`
      }
    }
  },
  'llms-3': {
    id: 'llms-3',
    name: 'LLMs',
    nameKo: 'LLMs (다중 에이전트 오케스트레이터)',
    paradigm: 'agentic',
    category: 'llm',
    x: 820,
    y: 440,
    colorClass: 'node-rect bg-blue text-lg font-semibold',
    summary: 'Multi-model orchestrator coordinating specialized sub-agents and tool calls.',
    summaryKo: '특화된 서브 에이전트들과 도구 호출을 지휘하는 멀티 모델 오케스트레이터.',
    details: {
      description: 'In modern agentic setups, multiple models work together: a reasoning heavy model (like Gemini Pro / Claude 3.7) plans, fast models (like Gemini Flash) parse outputs, and specialized code models write scripts.',
      descriptionKo: '단일 모델을 넘어 계획 수립용 모델, 고속 도구 파싱용 모델, 코드 실행 모델 등 여러 LLM이 상호작용하며 협업하는 다중 에이전트(Multi-Agent) 체계입니다.',
      input: 'Structured prompts from Reasoning & Tool results',
      inputKo: '추론 계획 및 도구 결과로부터 생성된 구조화 프롬프트',
      output: 'Tool call arguments (JSON) or multi-modal answer blocks',
      outputKo: '도구 호출 인자(JSON) 또는 멀티모달 출력 블록',
      techStack: ['Gemini 3.8 Flash', 'CrewAI', 'AutoGen', 'Multi-Agent Router'],
      challenges: ['Inter-agent communication overhead', 'Consensus divergence'],
      challengesKo: ['에이전트 간 통신 비용 및 프로토콜 불일치', '의견 불일치 조율'],
      codeSnippet: {
        lang: 'typescript',
        code: `const agentResponse = await ai.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: currentConversation,
  config: { tools: [{ functionDeclarations: [bookTicketTool, calendarTool] }] }
});`
      }
    }
  },
  'tools-3': {
    id: 'tools-3',
    name: 'Tools / Agents',
    nameKo: '도구 / 서브 에이전트 (Tools / Agents)',
    paradigm: 'agentic',
    category: 'tools',
    x: 1020,
    y: 440,
    colorClass: 'node-pill bg-purple font-medium',
    summary: 'Executable functions, external APIs, code sandbox, and specialized workers.',
    summaryKo: '실행 가능한 함수, 외부 API 연동, 코드 샌드박스 및 전문 서브 에이전트 군.',
    details: {
      description: 'External capabilities that give the AI arms and legs: Database querying, Bash command execution, Web browsing (Playwright), Stripe payments, GitHub commits, Slack messaging.',
      descriptionKo: 'AI에게 손과 발을 달아주는 외부 실행 모듈입니다. 데이터베이스 쓰기, 깃허브 커밋, 브라우저 조작(Playwright), 결제 API 호출, 슬랙 메시지 발송 등을 수행합니다.',
      input: 'Function name + JSON arguments validated against schema',
      inputKo: '함수 이름 + 스키마 검증된 JSON 인자',
      output: 'Real-world execution return value or status code',
      outputKo: '실제 외부 시스템 실행 결과값 및 상태 코드',
      techStack: ['Model Context Protocol (MCP)', 'E2B Sandboxes', 'Playwright Browser', 'Stripe API'],
      challenges: [
        'Security: Tool injection & privilege escalation',
        'Irreversible external side effects',
        'API schema versioning drift'
      ],
      challengesKo: [
        '보안: 도구 인젝션 및 무단 권한 상승 방지',
        '되돌릴 수 없는 외부 부작용(잘못된 결제, DB 삭제 등)',
        '외부 API 변경 시 에러 처리'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// Executing real tool action
const toolResult = await executeTool(call.name, call.args);
// returns: { status: "confirmed", bookingRef: "KR-99410", seat: "14A" }`
      }
    }
  },
  'answer-3': {
    id: 'answer-3',
    name: 'Multi-modal Answers',
    nameKo: '멀티모달 답변 (Multi-modal Answers)',
    paradigm: 'agentic',
    category: 'answer',
    x: 820,
    y: 580,
    colorClass: 'node-rect bg-orange text-sm font-semibold',
    summary: 'Interactive rich UI components, charts, files, and verified execution reports.',
    summaryKo: '인터랙티브 UI 컴포넌트, 차트, 생성된 파일 및 작업 완수 증빙 리포트.',
    details: {
      description: 'Unlike plain text, Agentic AI delivers rich artifacts: generated interactive React components, plotted financial charts, downloadable CSV/PDF reports, and verified transaction receipts.',
      descriptionKo: '단순 텍스트를 넘어 동적 대화형 UI 카드, 시각화 차트, 다운로드 가능한 생성 파일(CSV, PDF), 예약 완료 확인서 등 풍부한 멀티모달 산출물을 제공합니다.',
      input: 'Synthesized results from Reasoning + Action verification',
      inputKo: '추론 및 실제 액션 검증 결과의 집대성',
      output: 'Interactive widgets, receipts, visualization graphs',
      outputKo: '대화형 위젯, 영수증, 시각화 그래프, 생성 아티팩트',
      techStack: ['Dynamic React Components', 'Vega/Chart.js', 'Artifacts Renderer'],
      challenges: ['Complex state synchronisation with frontend UI'],
      challengesKo: ['프론트엔드 UI와의 복잡한 상태 동기화 및 렌더링 비용'],
      codeSnippet: {
        lang: 'typescript',
        code: `return {
  type: "interactive_report",
  text: "Flight confirmed and calendar synced successfully.",
  artifacts: [{ type: "calendar_card", eventId: "cal_883" }]
};`
      }
    }
  },
  'action-3': {
    id: 'action-3',
    name: 'Action (Act)',
    nameKo: '액션 실행 (Action / Act)',
    paradigm: 'agentic',
    category: 'action',
    x: 1020,
    y: 580,
    colorClass: 'node-rect-sm bg-pink font-semibold',
    summary: 'Autonomous mutation of real-world state (APIs, DBs, emails, purchases).',
    summaryKo: '현실 세계 상태를 실제로 변경하는 자율 실행 (API 결제, DB 커밋, 메일 발송).',
    details: {
      description: 'The defining characteristic of Agentic AI. The loop does not stop at giving advice; it acts in the digital and physical world, closing the loop with external confirmations.',
      descriptionKo: 'Agentic AI의 가장 결정적인 차별점입니다. 단순 조언에서 멈추지 않고, 실제 결제 승인, DB 트랜잭션 커밋, 캘린더 등록 등 실제 세계의 상태를 변화시키는 동작을 완수합니다.',
      input: 'Validated parameters from Agent planning',
      inputKo: '에이전트가 검증한 액션 파라미터',
      output: 'Permanent real-world side-effect (Mutation completed)',
      outputKo: '영구적인 실제 시스템 변경 완료 (Mutation)',
      techStack: ['Webhook Dispatchers', 'OAuth Delegated Tokens', 'Browser Agent Actors (Operator)'],
      challenges: [
        'Idempotency on retries',
        'Irreversible operations requiring human approval',
        'Audit logging and accountability'
      ],
      challengesKo: [
        '재시도 시 멱등성(Idempotency) 보장',
        '취소 불가능한 금융/보안 작업 시 사람 승인 필수',
        '감사 로그 및 작업 책임성 추적'
      ],
      codeSnippet: {
        lang: 'typescript',
        code: `// Real-world external mutation
await calendarApi.createEvent({
  title: "Flight to ICN",
  start: "2026-10-10T10:00:00Z",
  attendees: ["shinphotodrive@gmail.com"]
});`
      }
    }
  }
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'actionable-booking',
    title: 'Trip Booking & Calendar Sync',
    titleKo: '항공권 특가 예약 및 일정 등록',
    prompt: 'Find a flight from Seoul to Tokyo under $250 next Friday, book seat 12A, and add it to my Google Calendar.',
    promptKo: '다음 주 금요일 서울발 도쿄행 250달러 이하 항공권을 찾아 12A 좌석으로 예약하고 구글 캘린더에 일정을 등록해줘.',
    category: 'Action & Multi-Tool'
  },
  {
    id: 'financial-analysis',
    title: 'Q3 Financial Earnings & Graph',
    titleKo: '최신 실적 분석 및 경쟁사 비교 차트',
    prompt: 'Compare Tesla vs BYD Q3 2026 global EV delivery numbers, analyze gross margin trends, and generate a comparison table.',
    promptKo: '2026년 3분기 테슬라와 BYD의 글로벌 전기차 인도량을 비교하고 마진 추이를 분석하여 비교 표와 차트를 작성해줘.',
    category: 'Research & Grounding'
  },
  {
    id: 'bug-fix-pr',
    title: 'Code Debugging & Git PR Commit',
    titleKo: '코드 버그 분석 및 깃허브 PR 자동 제출',
    prompt: 'Analyze memory leak in repo issue #42, write a regression test in vitest, fix the leak, and submit a pull request.',
    promptKo: '깃허브 이슈 #42의 메모리 누수 원인을 분석하고, 회귀 테스트 작성 후 코드를 수정하여 PR을 올려줘.',
    category: 'Engineering Agent'
  },
  {
    id: 'conceptual-qa',
    title: 'Physics Concept Explanation',
    titleKo: '양자 얽힘(Quantum Entanglement) 원리 설명',
    prompt: 'Explain Quantum Entanglement simply using an analogy for a high school student.',
    promptKo: '고등학생이 이해하기 쉽게 비유를 들어 양자 얽힘 원리를 설명해줘.',
    category: 'General Knowledge'
  }
];

export const COMPARISON_DIMENSIONS = [
  {
    dimension: 'Core Mechanism',
    dimensionKo: '핵심 메커니즘',
    llm: 'Next-token prediction using frozen neural network weights.',
    llmKo: '동결된 신경망 가중치 기반 다음 토큰 확률 예측.',
    rag: 'Semantic search over external Vector DB + In-context grounding.',
    ragKo: '외부 벡터 DB 시맨틱 검색 + 컨텍스트 주입 기반 증강 생성.',
    agentic: 'Autonomous ReAct loop: Goal decomposition, Memory, Planning, Tool use, and Real-world Action.',
    agenticKo: '자율 ReAct 루프: 목표 분해, 장기 기억, 계획 수립, 도구 호출 및 실제 액션 실행.'
  },
  {
    dimension: 'Knowledge Freshness',
    dimensionKo: '지식 최신성',
    llm: 'Frozen at training cut-off date. Completely blind to current events.',
    llmKo: '학습 컷오프 시점에 고정. 최신 뉴스나 실시간 데이터 인지 불가.',
    rag: 'Near real-time. Reflects latest documents indexed in vector database or live search.',
    ragKo: '준실시간. 벡터 DB에 인덱싱된 최신 문서 및 실시간 웹 검색 반영.',
    agentic: 'Real-time dynamic. Fetches live web data, queries live production APIs, and updates state.',
    agenticKo: '실시간 능동형. 필요 시 라이브 API를 직접 조회하고 최신 웹 탐색 수행.'
  },
  {
    dimension: 'State & Memory',
    dimensionKo: '상태 및 기억 지속성',
    llm: 'Stateless. Forgets everything outside the current conversational window.',
    llmKo: '무상태(Stateless). 대화창 범위를 벗어나면 이전 맥락을 기억하지 못함.',
    rag: 'Stateless or session-scoped. Relies on indexed static documents.',
    ragKo: '세션 범위 내 한정. 인덱싱된 문서 위주의 수동적 읽기 지원.',
    agentic: 'Persistent Long-term Memory. Remembers user habits, preferences, and past execution reflections.',
    agenticKo: '영구 장기 기억(Long-term Memory). 사용자 취향, 과거 성공 기록, 반성 요약 축적.'
  },
  {
    dimension: 'External Execution (Act)',
    dimensionKo: '외부 시스템 실행 (Action)',
    llm: 'None. Read-only text generator.',
    llmKo: '불가. 텍스트 출력만 가능한 읽기 전용.',
    rag: 'None. Read-only document retrieval and synthesis.',
    ragKo: '불가. 외부 문서를 읽고 요약하는 읽기 전용.',
    agentic: 'Full Autonomous Action: Calls APIs, executes shell/code, submits transactions, mutates DBs.',
    agenticKo: '자율 실행 완수: API 호출, 코드 실행, DB 쓰기, 결제 및 메일 발송 등 실제 상태 변경.'
  },
  {
    dimension: 'Hallucination Vulnerability',
    dimensionKo: '환각(Hallucination) 위험',
    llm: 'High. Plausibly invents non-existent citations, dates, and statistics.',
    llmKo: '높음. 모르는 사실에 대해 그럴듯한 거짓 정보를 생성할 위험 큼.',
    rag: 'Low. Grounded in retrieved passages with numbered source citations.',
    ragKo: '낮음. 검색된 원문 청크에 닻을 내리고 출처를 명시하여 검증 가능.',
    agentic: 'Very Low. Self-verifying feedback loops inspect tool outputs and validate results.',
    agenticKo: '매우 낮음. 도구 실행 결과를 관찰하고 스스로 오류를 검증/수정하는 피드백 루프 보유.'
  },
  {
    dimension: 'Latency Profile',
    dimensionKo: '응답 지연 시간 (Latency)',
    llm: 'Fast: ~200ms – 800ms (Single forward pass).',
    llmKo: '매우 빠름: ~200ms – 800ms (단일 순방향 추론).',
    rag: 'Moderate: ~800ms – 2,500ms (Embedding + Vector Search + LLM Synthesis).',
    ragKo: '보통: ~800ms – 2,500ms (임베딩 + 벡터 검색 + 답변 합성).',
    agentic: 'High: ~2,500ms – 15,000ms+ (Multiple planning steps, tool API roundtrips).',
    agenticKo: '높음: ~2,500ms – 15,000ms+ (다단계 추론, 외부 API 왕복 호출).',
  },
  {
    dimension: 'Cost Per Query',
    dimensionKo: '쿼리당 비용',
    llm: '$ (Lowest: single prompt + completion token charge).',
    llmKo: '$ (최저: 단일 프롬프트 및 출력 토큰만 과금).',
    rag: '$$ (Moderate: embedding API + vector database compute + context tokens).',
    ragKo: '$$ (보통: 임베딩 비용 + 벡터 DB 인프라 + 컨텍스트 토큰 과금).',
    agentic: '$$$$ (Highest: multiple iterative LLM calls, tool API fees, scratchpad context).',
    agenticKo: '$$$$ (높음: 다회 반복 추론, 외부 유료 API 연동, 긴 스크래치패드 토큰).'
  },
  {
    dimension: 'Representative Examples',
    dimensionKo: '대표적인 프로덕트',
    llm: 'ChatGPT (GPT-3.5/4 Base), Claude 3 Sonnet (Raw text), LLaMA 3 local.',
    llmKo: '순수 ChatGPT, 기본 Claude 모델, 로컬 LLaMA 3.',
    rag: 'Perplexity AI, NotebookLM, Glean, GitHub Copilot (Docs RAG).',
    ragKo: 'Perplexity, Google NotebookLM, Glean, Cursor/Copilot 문서 검색.',
    agentic: 'OpenAI Operator, Goover, AutoGPT, Devin, Claude Computer Use, Manus.',
    agenticKo: 'Goover, OpenAI Operator, Devin, Claude Computer Use, AutoGPT, Manus.'
  }
];
