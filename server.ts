import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route for simulating/comparing LLM vs RAG vs Agentic AI execution
app.post('/api/simulate', async (req, res) => {
  const { prompt, language = 'ko' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const isKo = language === 'ko';
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    let aiGeneratedTrace = null;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are an AI Architecture Expert explaining the concrete execution difference between 3 AI paradigms:
1. Pure LLM (ChatGPT baseline): Zero-shot parametric memory, no internet search, no tools, static output.
2. RAG (Retrieval-Augmented Generation / Perplexity style): Keyword/vector search, retrieved context passages, grounded LLM synthesis with citations.
3. Agentic AI (Goover / Operator / Claude Computer Use): Long-term memory query, planning/reasoning step, external tool use/action calling, multi-modal response, and automated real-world action execution.

Analyze the user's prompt: "${prompt}".
Respond in JSON format with language "${isKo ? 'Korean' : 'English'}".
JSON structure:
{
  "summary": "Brief 1-sentence comparison",
  "llm": {
    "status": "Parametric Generation",
    "answer": "What pure LLM answers (mention if knowledge might be cut off or hallucinated if recent)",
    "latencyMs": 420,
    "tokens": 280,
    "costCents": 0.05,
    "hallucinationRisk": "High or Medium",
    "steps": ["Prompt Input received", "Single Forward Pass via parametric weights", "Token generation complete"]
  },
  "rag": {
    "status": "Grounded Retrieval & Synthesis",
    "queryGenerated": "Generated search query for vector/web DB",
    "retrievedChunks": [
      {"source": "Web / Vector DB Doc 1", "snippet": "Relevant retrieved passage..."},
      {"source": "Doc 2", "snippet": "Another relevant excerpt..."}
    ],
    "answer": "Grounded answer citing the sources",
    "latencyMs": 1150,
    "tokens": 1250,
    "costCents": 0.18,
    "hallucinationRisk": "Low",
    "steps": ["Query vectorization", "Embedding similarity retrieval (Top-k)", "Context augmentation to LLM prompt", "Grounded generation with citations"]
  },
  "agentic": {
    "status": "Autonomous Planning & Multi-Step Action",
    "memoryRetrieved": "Relevant user profile/preferences retrieved from long-term memory",
    "plan": [
      "1. Clarify requirements & check memory",
      "2. Execute Search API for current data",
      "3. Synthesize intermediate reasoning",
      "4. Invoke Tool/Action to execute actual task"
    ],
    "toolExecuted": {
      "name": "api_execution_tool",
      "args": {"target": "External Service / API"},
      "result": "Success / Confirmed booking / File updated"
    },
    "answer": "Comprehensive multi-modal answer with actionable result confirmation",
    "latencyMs": 3200,
    "tokens": 4200,
    "costCents": 0.85,
    "hallucinationRisk": "Very Low (Self-verifying)",
    "steps": ["Goal decomp & Memory retrieval", "Reasoning & Planning loop", "Search & Context ingestion", "Tool invocation & API execution", "Action execution & Feedback loop"]
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: systemInstruction }]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        if (response.text) {
          aiGeneratedTrace = JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('Gemini API call failed, using heuristic fallback:', err);
      }
    }

    if (!aiGeneratedTrace) {
      // Dynamic fallback simulation customized to user query
      aiGeneratedTrace = generateFallbackTrace(prompt, isKo);
    }

    res.json(aiGeneratedTrace);
  } catch (error: any) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: error.message || 'Simulation failed' });
  }
});

function generateFallbackTrace(prompt: string, isKo: boolean) {
  if (isKo) {
    return {
      summary: `"${prompt}"에 대해 순수 LLM은 파라메트릭 가중치 기억만 사용하고, RAG는 최신 문서를 검색하여 인용하며, Agentic AI는 장기 기억을 확인하고 도구 실행(Action)까지 수행합니다.`,
      llm: {
        status: "파라메트릭 가중치 직접 생성",
        answer: `학습 데이터에 포함된 사전 지식만을 바탕으로 생성된 답변입니다. 최신 정보(실시간 주가, 최근 뉴스, 개인 일정 등)는 알지 못하며, 학습 컷오프 이후의 질문에는 부정확하거나 환각(Hallucination)이 발생할 수 있습니다.`,
        latencyMs: 380,
        tokens: 310,
        costCents: 0.04,
        hallucinationRisk: "중상 (최신 정보 부재 시 환각 위험)",
        steps: [
          "1. 사용자 프롬프트 수신",
          "2. 정적 파라미터 신경망 추론 (단일 패스)",
          "3. 정적 텍스트 답변 출력 및 사용자 반환"
        ]
      },
      rag: {
        status: "벡터 DB/웹 검색 기반 증강 생성",
        queryGenerated: `검색 쿼리: "${prompt}" 관련 최신 문서 및 지식 벡터 인덱스 검색`,
        retrievedChunks: [
          { source: "Vector DB / Web Article [1]", snippet: `질의에 매칭된 상위 유사도 청크 (유사도 점수: 0.892). 신뢰할 수 있는 외부 출처 내용 발췌.` },
          { source: "Internal Knowledge Doc [2]", snippet: `보충 컨텍스트 및 최신 통계 데이터 (유사도 점수: 0.841).` }
        ],
        answer: `[1][2] 외부 문서를 검색한 결과에 기반하여 답변을 구성했습니다. 프롬프트에 검색된 컨텍스트를 주입(Augmentation)하여 사실에 근거한(Grounded) 답변을 제공하며 환각을 방지했습니다.`,
        latencyMs: 1180,
        tokens: 1420,
        costCents: 0.19,
        hallucinationRisk: "낮음 (검색 데이터에 근거)",
        steps: [
          "1. 프롬프트 수신 및 임베딩 벡터화",
          "2. Context DB 검색 (Vector Search / Hybrid Search)",
          "3. 검색된 Top-K 컨텍스트를 LLM 프롬프트에 주입",
          "4. 출처 인용과 함께 신뢰도 높은 답변 합성"
        ]
      },
      agentic: {
        status: "목표 분해, 추론 & 계획, 도구 실행 및 피드백 루프",
        memoryRetrieved: "User Profile: 이전 대화 컨텍스트, 선호 포맷(JSON/표), 실행 권한 토큰 보유 확인",
        plan: [
          "Step 1: 목표 명확화 및 장기 기억(Memory) 상태 조회",
          "Step 2: 최신 정보 검색 툴 호출 (Search API)",
          "Step 3: 검색 결과와 제약 조건을 바탕으로 Reasoning & Planning 수행",
          "Step 4: 실제 시스템 변경/트랜잭션 실행 (Action Tool 실행)",
          "Step 5: 실행 결과 검증 및 멀티모달 최종 보고서 반환"
        ],
        toolExecuted: {
          name: "execute_workflow_action",
          args: { query: prompt, target: "External Service API", autoExecute: true },
          result: "✅ 도구 실행 완료: 외부 시스템 연동 및 변경 사항 커밋 완료"
        },
        answer: `목표를 자율적으로 분석하여 [계획 수립 ➔ 지식 검색 ➔ 추론 루프 ➔ 실제 도구 실행]을 완료했습니다. 텍스트 답변뿐만 아니라 실제 필요한 액션(API 호출/파일 생성/작업 예약)을 처리하였습니다.`,
        latencyMs: 3450,
        tokens: 4320,
        costCents: 0.92,
        hallucinationRisk: "매우 낮음 (자체 검증 루프 & 도구 피드백)",
        steps: [
          "1. 목표 분석 및 Memory DB 대화 이력/선호도 조회",
          "2. 추론 & 계획 (Reasoning & Planning) 단계 수립",
          "3. Search 및 Context DB 최신 데이터 수집",
          "4. LLM <-> Tools/Agents 협업을 통한 API 액션 호출",
          "5. 멀티모달 답변 생성 및 실제 외부 액션(Action) 수행 완료",
          "6. 최종 결과 피드백 루프 갱신"
        ]
      }
    };
  }

  return {
    summary: `For "${prompt}", Pure LLM queries static weights, RAG retrieves external documents for grounded citation, and Agentic AI orchestrates memory, reasoning loops, and real-world tool actions.`,
    llm: {
      status: "Parametric Weights Generation",
      answer: `Generates response purely based on frozen pre-training weights. Lacks access to real-time information or private datasets; vulnerable to hallucinations on post-cutoff queries.`,
      latencyMs: 380,
      tokens: 310,
      costCents: 0.04,
      hallucinationRisk: "Moderate to High",
      steps: [
        "1. Receive user prompt",
        "2. Single forward pass across transformer layers",
        "3. Stream raw tokens back to user"
      ]
    },
    rag: {
      status: "Context Retrieval Augmented Synthesis",
      queryGenerated: `Search query: Top semantic matches for "${prompt}" in external index`,
      retrievedChunks: [
        { source: "Vector Index Chunk #1", snippet: "High relevance context matching question semantics (cosine sim: 0.91)." },
        { source: "Live Knowledge Base #2", snippet: "Verified domain documentation and latest statistics." }
      ],
      answer: `Answer synthesized directly from retrieved external chunks [1][2], ensuring ground-truth accuracy and verifiable citations.`,
      latencyMs: 1180,
      tokens: 1420,
      costCents: 0.19,
      hallucinationRisk: "Low (grounded)",
      steps: [
        "1. Receive prompt and calculate query embedding",
        "2. Semantic similarity search over Vector DB",
        "3. Inject retrieved context into system prompt",
        "4. Synthesize final answer with citation references"
      ]
    },
    agentic: {
      status: "Autonomous Planning, Memory & Multi-Step Tool Action",
      memoryRetrieved: "Long-Term Memory: User role, persistent preferences, and active workflow state retrieved.",
      plan: [
        "Phase 1: Goal decomposition & Long-term memory query",
        "Phase 2: External Search API invocation for fresh facts",
        "Phase 3: Multi-step Reasoning & self-correction loop",
        "Phase 4: Tool execution / API mutation trigger",
        "Phase 5: Multi-modal synthesis & feedback cycle"
      ],
      toolExecuted: {
        name: "execute_action_api",
        args: { intent: prompt, channel: "Production Service" },
        result: "Success: Action dispatched and verified."
      },
      answer: `Decomposed complex goal, validated against long-term memory, orchestrated search + reasoning, and executed required real-world action successfully.`,
      latencyMs: 3450,
      tokens: 4320,
      costCents: 0.92,
      hallucinationRisk: "Very Low (self-verifying tool loop)",
      steps: [
        "1. Ingest goal & load memory context",
        "2. Formulate multi-step execution plan",
        "3. Retrieve auxiliary context via search",
        "4. Two-way agent reasoning and tool orchestration",
        "5. Execute actionable mutation (Act)",
        "6. Return multimodal response & update memory state"
      ]
    }
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
