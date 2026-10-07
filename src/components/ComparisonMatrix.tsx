import React, { useState } from 'react';
import { Language } from '../types';
import { COMPARISON_DIMENSIONS } from '../data/architectureData';
import { Cpu, Database, Bot, Search, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  language: Language;
}

export const ComparisonMatrix: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const [filterQuery, setFilterQuery] = useState('');

  const filteredDimensions = COMPARISON_DIMENSIONS.filter(d => {
    const text = (d.dimension + d.dimensionKo + d.llm + d.llmKo + d.rag + d.ragKo + d.agentic + d.agenticKo).toLowerCase();
    return text.includes(filterQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            {isKo ? '아키텍처 비교 분석 매트릭스' : 'Comprehensive Architecture Comparison Matrix'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isKo 
              ? '동작 원리, 지연 시간, 비용, 환각 제어, 외부 액션 실행 가능 여부 등 8대 핵심 기술 차원을 비교합니다.'
              : 'Detailed breakdown across 8 technical dimensions comparing Pure LLM, RAG, and Agentic AI systems.'}
          </p>
        </div>

        {/* Search filter */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={isKo ? '항목 필터링...' : 'Filter dimensions...'}
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 shadow-2xl bg-zinc-950/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-300">
              <th className="py-4 px-5 font-semibold w-1/5 text-zinc-400 uppercase tracking-wider text-[11px]">
                {isKo ? '비교 차원 (Dimension)' : 'Dimension'}
              </th>
              <th className="py-4 px-5 font-bold w-1/4 text-blue-400 border-l border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>L.L.M (ChatGPT)</span>
                </div>
              </th>
              <th className="py-4 px-5 font-bold w-1/4 text-sky-400 border-l border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>R.A.G (Perplexity)</span>
                </div>
              </th>
              <th className="py-4 px-5 font-bold w-1/4 text-purple-400 border-l border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>Agentic AI (Goover / Operator)</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredDimensions.map((row, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-zinc-900/50 transition-colors group"
              >
                {/* Dimension title */}
                <td className="py-4 px-5 font-medium text-zinc-200 bg-zinc-950/40">
                  <div className="font-semibold text-zinc-100">
                    {isKo ? row.dimensionKo : row.dimension}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {isKo ? row.dimension : row.dimensionKo}
                  </div>
                </td>

                {/* LLM */}
                <td className="py-4 px-5 text-zinc-300 leading-relaxed border-l border-zinc-800/60">
                  {isKo ? row.llmKo : row.llm}
                </td>

                {/* RAG */}
                <td className="py-4 px-5 text-zinc-300 leading-relaxed border-l border-zinc-800/60">
                  {isKo ? row.ragKo : row.rag}
                </td>

                {/* Agentic */}
                <td className="py-4 px-5 text-zinc-200 leading-relaxed border-l border-zinc-800/60 bg-purple-950/10">
                  {isKo ? row.agenticKo : row.agentic}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decision Guide Card */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          {isKo ? '언제 어떤 아키텍처를 선택해야 하는가? (Architecture Decision Matrix)' : 'When to choose which architecture?'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40">
            <h4 className="font-bold text-blue-300 mb-1.5 flex items-center gap-1.5">
              <span>Pure LLM 권장 시나리오</span>
            </h4>
            <ul className="text-zinc-400 space-y-1 list-disc list-inside">
              <li>{isKo ? '단순 문장 교정, 번역, 문체 변환' : 'Simple grammar, translation, tone change'}</li>
              <li>{isKo ? '초저지연(<400ms)이 필요한 즉각적인 텍스트 보완' : 'Ultra low latency autocomplete (<400ms)'}</li>
              <li>{isKo ? '창의적 글쓰기, 브레인스토밍 아이디어 생성' : 'Creative writing, brainstorming'}</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40">
            <h4 className="font-bold text-sky-300 mb-1.5 flex items-center gap-1.5">
              <span>R.A.G 권장 시나리오</span>
            </h4>
            <ul className="text-zinc-400 space-y-1 list-disc list-inside">
              <li>{isKo ? '사내 사규, 제품 매뉴얼, PDF 지식 검색 Q&A' : 'Enterprise knowledge base, policy manuals, PDF QA'}</li>
              <li>{isKo ? '최신 뉴스 및 출처 검증(Citations)이 필수인 경우' : 'Current news with verifiable citations'}</li>
              <li>{isKo ? '환각(Hallucination)을 엄격히 방지해야 하는 리서치' : 'Zero-hallucination critical research'}</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40">
            <h4 className="font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
              <span>Agentic AI 권장 시나리오</span>
            </h4>
            <ul className="text-zinc-400 space-y-1 list-disc list-inside">
              <li>{isKo ? '실제 시스템 조작 (예약, 결제, 캘린더 등록, 이메일)' : 'Real system mutations (booking, payments, emails)'}</li>
              <li>{isKo ? '코드 디버깅 후 빌드/테스트/Git PR 자율 제출' : 'Self-debugging code, tests & Git PR submissions'}</li>
              <li>{isKo ? '복잡한 다단계 의사결정 및 동적 에러 복구 필요 시' : 'Multi-step autonomous workflow & self-recovery'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
