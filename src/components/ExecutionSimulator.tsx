import React, { useState } from 'react';
import { Language, PresetScenario, SimulationResult } from '../types';
import { PRESET_SCENARIOS } from '../data/architectureData';
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
  Code
} from 'lucide-react';

interface Props {
  language: Language;
  onHighlightNode?: (nodeId: string | null) => void;
}

export const ExecutionSimulator: React.FC<Props> = ({ language, onHighlightNode }) => {
  const isKo = language === 'ko';
  const [selectedScenario, setSelectedScenario] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(
    isKo ? PRESET_SCENARIOS[0].promptKo : PRESET_SCENARIOS[0].prompt
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'llm' | 'rag' | 'agentic'>('all');
  const [result, setResult] = useState<SimulationResult | null>(null);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first render if no result
  React.useEffect(() => {
    if (!result) {
      handleRunSimulation();
    }
  }, []);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header and Scenario Selector */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isKo ? '실행 시뮬레이터 (Trace & Execution Sandbox)' : 'Execution Simulator & Trace Sandbox'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {isKo 
                ? '동일한 질문을 순수 LLM, RAG, Agentic AI 3가지 파이프라인으로 전송했을 때의 실행 흐름과 성능 지표를 비교합니다.'
                : 'Send the same prompt through Pure LLM, RAG, and Agentic AI to inspect the concrete execution traces side-by-side.'}
            </p>
          </div>

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
            className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition resize-none font-mono"
            placeholder={isKo ? '테스트할 프롬프트를 입력하세요...' : 'Enter prompt to compare across architectures...'}
          />
          <button
            onClick={handleRunSimulation}
            disabled={loading || !customPrompt.trim()}
            className="absolute right-3 bottom-3 p-1.5 text-zinc-400 hover:text-amber-400 disabled:opacity-30 transition"
            title="Submit"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      {result && (
        <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200 mr-2">
              {isKo ? '아키텍처 요약 비교:' : 'Architectural Takeaway:'}
            </span>
            {result.summary}
          </div>
        </div>
      )}

      {/* 3-Column Comparative Trace Cards */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ================= COLUMN 1: PURE LLM ================= */}
          <div className="bg-zinc-900/90 border border-blue-900/40 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">L.L.M</h3>
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
                      className="text-xs bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2 text-zinc-300 flex items-start gap-2 hover:border-blue-500/40 transition"
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
                <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed font-sans min-h-[90px]">
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
          <div className="bg-zinc-900/90 border border-sky-900/40 hover:border-sky-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">R.A.G</h3>
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
                      className="bg-black/50 border border-sky-950/80 rounded-lg p-2 text-[11px] text-zinc-300 hover:border-sky-500/40 transition"
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
                <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed font-sans min-h-[90px]">
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
          <div className="bg-zinc-900/90 border border-purple-900/40 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Agentic AI</h3>
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
                      className="text-[11px] text-zinc-400 flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-950/40 border border-zinc-900"
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
                <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed font-sans min-h-[90px]">
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
    </div>
  );
};
