import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { Chart, registerables } from 'chart.js';
import { ShieldAlert, Zap, TrendingUp, Info } from 'lucide-react';

Chart.register(...registerables);

interface Props {
  language: Language;
}

export const AnalyticsCharts: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const failureChartRef = useRef<HTMLCanvasElement | null>(null);
  const mcpChartRef = useRef<HTMLCanvasElement | null>(null);
  const failureChartInstance = useRef<Chart | null>(null);
  const mcpChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // 1. Failure modes chart
    if (failureChartRef.current) {
      if (failureChartInstance.current) {
        failureChartInstance.current.destroy();
      }

      const ctx = failureChartRef.current.getContext('2d');
      if (ctx) {
        failureChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              '지식/추론 한계 (F1.4)',
              '부적절 작업분해 (F2.5)',
              '무한루프/교착 (F2.3)',
              '인터페이스 불일치 (F2.7)',
              '포맷팅/JSON 오류 (F1.7)'
            ],
            datasets: [{
              label: isKo ? '발생 비중 (%)' : 'Occurrence Share (%)',
              data: [34.2, 26.5, 18.1, 12.8, 8.4],
              backgroundColor: [
                'rgba(59, 130, 246, 0.85)',
                'rgba(99, 102, 241, 0.85)',
                'rgba(168, 85, 247, 0.85)',
                'rgba(245, 158, 11, 0.85)',
                'rgba(239, 68, 68, 0.85)'
              ],
              borderColor: [
                '#3b82f6',
                '#6366f1',
                '#a855f7',
                '#f59e0b',
                '#ef4444'
              ],
              borderWidth: 1,
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#e4e4e7',
                borderColor: '#3f3f46',
                borderWidth: 1,
                callbacks: {
                  label: (context) => ` ${context.raw}%`
                }
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255, 255, 255, 0.06)' },
                ticks: { 
                  color: '#a1a1aa',
                  callback: (value) => `${value}%` 
                }
              },
              y: {
                grid: { display: false },
                ticks: { 
                  color: '#e4e4e7',
                  font: { size: 11, family: 'sans-serif' } 
                }
              }
            }
          }
        });
      }
    }

    // 2. MCP execution speedup chart
    if (mcpChartRef.current) {
      if (mcpChartInstance.current) {
        mcpChartInstance.current.destroy();
      }

      const ctx = mcpChartRef.current.getContext('2d');
      if (ctx) {
        mcpChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              isKo ? '단일 파일 조회' : 'Single Resource',
              isKo ? '복합 도구 호출' : 'Compound Tools',
              isKo ? '다중 서버 연동' : 'Multi-Server Sync',
              isKo ? '종합 워크플로우' : 'Full Workflow'
            ],
            datasets: [
              {
                label: isKo ? '기존 표준 MCP (ms)' : 'Standard MCP (ms)',
                data: [420, 1150, 2100, 3400],
                backgroundColor: 'rgba(113, 113, 122, 0.7)',
                borderColor: '#71717a',
                borderWidth: 1,
                borderRadius: 6
              },
              {
                label: isKo ? 'Context-Aware MCP (ms)' : 'Context-Aware MCP (ms)',
                data: [180, 410, 720, 1090],
                backgroundColor: 'rgba(16, 185, 129, 0.85)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { 
                  color: '#e4e4e7',
                  font: { size: 11 },
                  boxWidth: 12
                }
              },
              tooltip: {
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#e4e4e7',
                borderColor: '#3f3f46',
                borderWidth: 1,
                callbacks: {
                  label: (context) => ` ${context.dataset.label}: ${context.raw} ms`
                }
              }
            },
            scales: {
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.06)' },
                title: { 
                  display: true, 
                  text: isKo ? '실행 시간 (ms)' : 'Execution Latency (ms)', 
                  color: '#a1a1aa',
                  font: { size: 11 } 
                },
                ticks: { color: '#a1a1aa' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#e4e4e7' }
              }
            }
          }
        });
      }
    }

    return () => {
      failureChartInstance.current?.destroy();
      mcpChartInstance.current?.destroy();
    };
  }, [language, isKo]);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          {isKo ? '데이터 시각화 & 벤치마크 분석' : 'Analytics & Benchmark Insights'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          {isKo 
            ? '보고서 내 연구 결과 및 벤치마크 데이터를 가공하여 에이전트 실패 비율 분포, 컨텍스트 인식 MCP의 처리 시간 단축 효과, 대표 인공지능 모델 및 플랫폼의 역량을 비교 시각화합니다.'
            : 'Empirical failure rate distributions from AgentFail and performance latency comparisons of Context-Aware MCP vs Standard implementations.'}
        </p>
      </div>

      {/* Grid of 2 charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Failure causes */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">
              {isKo ? 'AgentFail 원인별 발생 비율 분포' : 'AgentFail Root Cause Distribution'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {isKo ? '에이전트 워크플로우 붕괴를 유발하는 주요 루트 원인 분석 (%)' : 'Root causes triggering multi-agent workflow failure (%)'}
            </p>
          </div>

          <div className="relative w-full h-[320px] my-2">
            <canvas ref={failureChartRef} />
          </div>

          <div className="mt-3 p-3 bg-zinc-950/80 rounded-xl text-xs text-zinc-300 border border-zinc-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">{isKo ? '핵심 인사이트:' : 'Core Insight:'}</strong>{' '}
              {isKo 
                ? '지식/추론 한계(F1.4)와 작업 분해 오류(F2.5)가 전체 고장의 60% 이상을 차지하며, 이를 예방하기 위한 하네스 가드레일 구축이 필수적입니다.'
                : 'Reasoning limits (F1.4) and task decomposition errors (F2.5) account for >60% of all failures, proving the critical need for harness guardrails.'}
            </div>
          </div>
        </div>

        {/* Chart 2: MCP Speedup */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">
              {isKo ? 'MCP 실행 시간 비교 (단위: ms)' : 'MCP Execution Latency Comparison (ms)'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {isKo ? '기존 표준 MCP vs 상태 공유형 컨텍스트 인식 MCP 아키텍처' : 'Standard MCP vs State-Sharing Context-Aware MCP'}
            </p>
          </div>

          <div className="relative w-full h-[320px] my-2">
            <canvas ref={mcpChartRef} />
          </div>

          <div className="mt-3 p-3 bg-zinc-950/80 rounded-xl text-xs text-zinc-300 border border-zinc-800 flex items-start gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">{isKo ? '핵심 인사이트:' : 'Core Insight:'}</strong>{' '}
              {isKo 
                ? '서버 간 상태 공유 메커니즘을 도입한 Context-Aware MCP는 멀티 도구 오케스트레이션 시 실행 시간을 최대 67.8% 단축시킵니다.'
                : 'Context-Aware state sharing slashes multi-tool orchestration latency by up to 67.8% across distributed servers.'}
            </div>
          </div>
        </div>
      </div>

      {/* AttestMCP Security & Defense Matrix */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span>{isKo ? 'MCP 프로토콜 보안 취약점 & 대응 모드 (AttestMCP)' : 'MCP Protocol Security & Defense Matrix (AttestMCP)'}</span>
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          {isKo 
            ? '통제권이 코드가 아닌 시맨틱 컨텍스트로 이동함에 따라 발생하는 위협과 방어 체계입니다.'
            : 'Threat vectors and defense modes as control authority shifts from static code to semantic runtime context.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-red-900/50 bg-red-950/20 rounded-xl">
            <div className="font-bold text-red-300 text-xs mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {isKo ? '컨텍스트 오염 (Poisoning)' : 'Context Poisoning'}
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {isKo 
                ? '읽기 전용 리소스 내 악성 지침 은닉 ➔ 프롬프트 인젝션으로 무단 Write 도구 호출 유도'
                : 'Malicious instructions hidden in read-only resources hijack prompts to trigger unauthorized write tools.'}
            </div>
          </div>

          <div className="p-4 border border-red-900/50 bg-red-950/20 rounded-xl">
            <div className="font-bold text-red-300 text-xs mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {isKo ? '암묵적 신뢰 전파' : 'Implicit Trust Propagation'}
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {isKo 
                ? '서버 간 격리 부재로 악성 A 서버 응답이 정상 B 서버의 민감 데이터 유출 유도'
                : 'Lack of inter-server isolation allows compromised Server A to exfiltrate secrets via trusted Server B.'}
            </div>
          </div>

          <div className="p-4 border border-amber-900/50 bg-amber-950/20 rounded-xl">
            <div className="font-bold text-amber-300 text-xs mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {isKo ? '공급망 오염 (Typosquatting)' : 'Supply Chain Poisoning'}
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {isKo 
                ? '오픈소스 패키지 레지스트리(npm 등)에 유사 이름 악성 MCP 서버 게시'
                : 'Typosquatted MCP server packages deployed to public registries stealing auth credentials.'}
            </div>
          </div>

          <div className="p-4 border border-blue-900/50 bg-blue-950/20 rounded-xl">
            <div className="font-bold text-blue-300 text-xs mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {isKo ? 'AttestMCP 권한 증명' : 'AttestMCP Attestation'}
            </div>
            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {isKo 
                ? 'Permissive / Prompt / Strict 모드 제공, Strict 모드 시 암호화 서명 검증 강제'
                : 'Provides Permissive, Prompt, and Strict enforcement modes with cryptographic signature verification.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
