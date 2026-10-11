import React, { useState } from 'react';
import { Language } from '../types';
import { Layers, AlertTriangle, ShieldCheck, Database, Cpu, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
}

export const HarnessArchitectureExplorer: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const [activeTab, setActiveTab] = useState<'harness' | 'failure' | 'protocols' | 'oag'>('harness');

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="lg:flex lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-900/60 text-blue-300 text-[11px] font-semibold rounded-full border border-blue-700/50 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              SPECIAL REPORT & INTERACTIVE SYSTEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {isKo 
                ? '에이전트 워크플로우, 하네스 엔지니어링 & 기업용 온톨로지' 
                : 'Agent Workflow, Harness Engineering & Enterprise Ontology'}
            </h2>
            <p className="mt-3 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {isKo 
                ? "단순 프롬프트 응답을 넘어 자율적 추론과 실행을 수행하는 '에이전트 AI(Agentic AI)' 시대의 아키텍처 보고서입니다. 하네스(Harness) 3계층 구조, MCP 보안 규약, OAG(온톨로지 증강 생성) 및 핵심 AI 용어 52선을 다채로운 상호작용으로 탐색하세요."
                : 'Deep-dive architectural report for Agentic AI beyond single-prompt inference. Explore the 3-Layer Harness, MCP communication protocols, OAG (Ontology-Augmented Generation), and failure recovery mechanisms.'}
            </p>
          </div>

          {/* Quick KPI Stat Cards */}
          <div className="mt-6 lg:mt-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-72 shrink-0">
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-center shadow-md">
              <div className="text-2xl font-bold text-blue-400">52개</div>
              <div className="text-[11px] text-zinc-400 mt-1">{isKo ? '핵심 AI 용어 & 약어' : 'Core AI Terms'}</div>
            </div>
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-center shadow-md">
              <div className="text-2xl font-bold text-emerald-400">3 계층</div>
              <div className="text-[11px] text-zinc-400 mt-1">{isKo ? '하네스 실행 아키텍처' : 'Harness Layers'}</div>
            </div>
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-center shadow-md">
              <div className="text-2xl font-bold text-amber-400">OAG</div>
              <div className="text-[11px] text-zinc-400 mt-1">{isKo ? '온톨로지 증강 생성' : 'Ontology Gen'}</div>
            </div>
            <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-center shadow-md">
              <div className="text-2xl font-bold text-purple-400">MCP</div>
              <div className="text-[11px] text-zinc-400 mt-1">{isKo ? '통합 표준 프로토콜' : 'Std Protocol'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur">
        <div className="flex border-b border-zinc-800 bg-zinc-950/80 text-xs sm:text-sm font-medium overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setActiveTab('harness')}
            className={`px-5 py-3.5 border-b-2 font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'harness'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. {isKo ? '하네스 3계층 아키텍처' : '3-Layer Harness Architecture'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('failure')}
            className={`px-5 py-3.5 border-b-2 font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'failure'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>2. {isKo ? '에이전트 고장 원인 (AgentFail)' : 'Agent Failure Modes'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('protocols')}
            className={`px-5 py-3.5 border-b-2 font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'protocols'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. {isKo ? 'MCP 규약 & DSPy 컴파일러' : 'MCP & DSPy Compiler'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('oag')}
            className={`px-5 py-3.5 border-b-2 font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'oag'
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>4. {isKo ? 'RAG vs GraphRAG vs OAG' : 'RAG vs GraphRAG vs OAG'}</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Harness Architecture */}
          {activeTab === 'harness' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-4 text-xs sm:text-sm text-blue-200 leading-relaxed">
                <strong className="text-white">
                  {isKo ? '하네스 엔지니어링(Harness Engineering)이란?' : 'What is Harness Engineering?'}
                </strong>{' '}
                {isKo 
                  ? '"에이전트 = 모델 + 하네스"라는 공식에 따라, 파라미터 재훈련 없이 외부 도구, 메모리, 실행 샌드박스, 가드레일을 결합하여 모델을 고신뢰성 자율 실행 엔진으로 변환하는 런타임 인프라 공학입니다.'
                  : '"Agent = Model + Harness" — an engineering discipline that couples frozen foundation models with sandboxed runtimes, progressive memory, and deterministic guardrails.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/60 hover:border-blue-500/40 transition">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Layer 01</div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {isKo ? '정보 계층 (Information Layer)' : 'Information Layer'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isKo 
                      ? '에이전트가 관찰 가능한 데이터 및 도구 범위를 통제합니다. 점진적 공개(Progressive Disclosure) 기법을 사용해 현재 실행 중인 하위 과업에 꼭 필요한 최소한의 지식/텔레메트리만 주입하여 모델의 정보 마비를 방지합니다.'
                      : 'Controls what data and tools the agent observes. Uses Progressive Disclosure to inject strictly the minimal necessary telemetry per subtask.'}
                  </p>
                </div>

                <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/60 hover:border-emerald-500/40 transition">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Layer 02</div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {isKo ? '실행 계층 (Execution Layer)' : 'Execution Layer'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isKo 
                      ? '추론 결과를 실제 파일 및 시스템 행동으로 변환합니다. 파일시스템 추상화를 통해 세션을 초과하는 상태(State persistence)를 유지하며, 검증되지 않은 스크립트는 격리된 샌드박스 내에서 가로채 오차를 재계산시킵니다.'
                      : 'Translates inference into files and actions. Maintains persistent state across sessions via filesystem abstraction and intercepts unverified scripts in sandboxes.'}
                  </p>
                </div>

                <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950/60 hover:border-amber-500/40 transition">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Layer 03</div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {isKo ? '피드백 계층 (Feedback Layer)' : 'Feedback Layer'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {isKo 
                      ? '인간 개입(HITL) 승인 게이트에서 반려된 오류 궤적과 교정 지시어를 캡처합니다. 이를 장기 메모리 뱅크에 신규 제약 조건으로 자동 커밋함으로써 고비용 미세조정 없이 에이전트를 매일 진화시킵니다.'
                      : 'Captures rejected trajectories and human feedback at HITL gates, committing them into long-term memory banks without retraining weights.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Agent Failure Modes */}
          {activeTab === 'failure' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs sm:text-sm text-zinc-400">
                {isKo 
                  ? '최신 연구(AgentFail 데이터셋)에 따르면 다중 에이전트 워크플로우의 고장은 단순 모델 성능 부족 외에 교착 상태, 보속성 오류 등 복합적 인터페이스 결함에서 기인합니다.'
                  : 'Empirical AgentFail dataset analysis reveals that multi-agent breakdowns stem from interface deadlocks and perseveration rather than raw model accuracy.'}
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-xs text-left text-zinc-300 border-collapse">
                  <thead className="text-[11px] uppercase bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">{isKo ? '분류' : 'Category'}</th>
                      <th className="py-3 px-4">{isKo ? '고장 원인 코드' : 'Code'}</th>
                      <th className="py-3 px-4">{isKo ? '상세 현상 및 영향' : 'Symptom & Impact'}</th>
                      <th className="py-3 px-4">{isKo ? '완화 및 극복 메커니즘' : 'Mitigation Mechanism'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    <tr className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-semibold text-blue-400">에이전트 수준</td>
                      <td className="py-3 px-4 font-mono text-zinc-200">F1.4 지식/추론 한계</td>
                      <td className="py-3 px-4">부적절한 도구 선택, 하위 목표 미달성, 엉뚱한 매개변수 산출</td>
                      <td className="py-3 px-4 text-emerald-400">DSPy 기반 퓨샷 예제 자동 생성 및 시그니처 명세 도입</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-semibold text-blue-400">에이전트 수준</td>
                      <td className="py-3 px-4 font-mono text-zinc-200">F1.7 포맷팅 실패</td>
                      <td className="py-3 px-4">환각으로 잘못된 JSON 인자 생성하여 도구 실행 거부</td>
                      <td className="py-3 px-4 text-emerald-400">구조화된 출력(Structured Outputs) 컴파일러 가드레일 적용</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-semibold text-purple-400">워크플로우 수준</td>
                      <td className="py-3 px-4 font-mono text-zinc-200">F2.3 무한루프 & 교착상태</td>
                      <td className="py-3 px-4">동일 자원 동시 접근 시 대기 상태 지속, 무한 도구 재호출(보속성 오류)</td>
                      <td className="py-3 px-4 text-emerald-400">정형 검증(Formal Verification) 및 타임아웃/상태 스냅샷 복구</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-semibold text-purple-400">워크플로우 수준</td>
                      <td className="py-3 px-4 font-mono text-zinc-200">F2.7 인터페이스 불일치</td>
                      <td className="py-3 px-4">권한 없는 에이전트로 메시지 라우팅, 과거 문맥 상태 누락</td>
                      <td className="py-3 px-4 text-emerald-400">MCP 프로토콜 메시지 스키마 유효성 검사 및 정교한 오케스트레이션</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Protocols & DSPy */}
          {activeTab === 'protocols' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
              <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/60">
                <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 text-xs rounded font-mono border border-blue-700/60">MCP</span>
                  모델 컨텍스트 프로토콜 (Model Context Protocol)
                </h3>
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  앤스로픽이 발표한 JSON-RPC 2.0 기반 오픈 표준으로, Host-Client-Server 아키텍처를 가집니다.
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 list-disc pl-4">
                  <li><strong className="text-white">Resources:</strong> 읽기 전용 정적 데이터 및 파일 컨텍스트 제공</li>
                  <li><strong className="text-white">Tools:</strong> LLM이 직접 호출 가능한 외부 API/함수</li>
                  <li><strong className="text-white">Prompts:</strong> 표준화된 워크플로우 템플릿 제공</li>
                </ul>
              </div>

              <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/60">
                <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-900/60 text-indigo-300 text-xs rounded font-mono border border-indigo-700/60">DSPy</span>
                  선언적 프롬프트 컴파일러
                </h3>
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  수작업 프롬프트 엔지니어링을 버리고, 파이썬 클래스 기반 모듈로 LLM 로직을 선언하는 프레임워크.
                </p>
                <ul className="text-xs space-y-2 text-zinc-300 list-disc pl-4">
                  <li><strong className="text-white">Signatures:</strong> 입출력 타입의 명확한 명세 정의 (Input ➔ Output)</li>
                  <li><strong className="text-white">Modules:</strong> dspy.ChainOfThought, dspy.ReAct 등 추론 패턴 캡슐화</li>
                  <li><strong className="text-white">Optimizers (MIPROv2):</strong> 베이지안 탐색으로 최적의 퓨샷 예제와 프롬프트 컴파일</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Knowledge Architecture */}
          {activeTab === 'oag' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-200">
              <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/60">
                <div className="font-bold text-white text-sm mb-1">일반 RAG</div>
                <div className="text-[11px] text-zinc-500 mb-2 font-mono">Vector Similarity Search</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  질의와 비정형 텍스트 청크 간 코사인 유사도를 계산해 컨텍스트에 주입. 환각 억제가 제한적이며 트랜잭션 수행 불가능.
                </p>
              </div>

              <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/60">
                <div className="font-bold text-blue-300 text-sm mb-1">GraphRAG</div>
                <div className="text-[11px] text-blue-400/80 mb-2 font-mono">Knowledge Graph Traversal</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  엔티티 간 지식 그래프 관계를 횡단하며 맥락을 탐색. 다단계 시맨틱 검색에는 우수하나 백엔드 Write-back 제어 불가.
                </p>
              </div>

              <div className="p-5 border border-amber-500/40 rounded-xl bg-amber-950/20">
                <div className="font-bold text-amber-300 text-sm mb-1">OAG (온톨로지 증강 생성)</div>
                <div className="text-[11px] text-amber-400/80 mb-2 font-mono">Palantir AIP Enterprise Ontology</div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-amber-200">Data + Logic + Action</strong>이 응집된 비즈니스 객체 지향 그래프. 타입 검증된 함수 호출, 보안 권한 완벽 분리, Write-back Webhook 및 전역 브랜칭으로 결함 없는 제어 구현.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
