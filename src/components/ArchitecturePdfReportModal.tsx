import React, { useState, useRef } from 'react';
import { ArchitectureNode, Language, Paradigm } from '../types';
import { ARCHITECTURE_NODES } from '../data/architectureData';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import {
  X,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  Cpu,
  Database,
  ArrowRight,
  Info,
  Calendar,
  User,
  Sliders,
  Maximize2,
  Check,
  Shield,
  Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

interface ArchitecturePdfReportModalProps {
  language: Language;
  selectedParadigm: Paradigm;
  activeNodeId: string | null;
  flowAnimating: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const ArchitecturePdfReportModal: React.FC<ArchitecturePdfReportModalProps> = ({
  language,
  selectedParadigm,
  activeNodeId,
  flowAnimating,
  onClose,
  onShowToast,
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const { recordActivity } = useProgress();

  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('ai_arch_report_author') || (isKo ? 'AI 아키텍트 엔지니어' : 'AI Systems Architect');
  });
  const [organization, setOrganization] = useState(() => {
    return localStorage.getItem('ai_arch_report_org') || (isKo ? '미래국방 AI 연구소 / 자율지능 아키텍처팀' : 'Autonomous AI Systems Architecture Lab');
  });
  const [includeCanvasSnapshot, setIncludeCanvasSnapshot] = useState(true);
  const [includeAllNodes, setIncludeAllNodes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'cover_and_canvas' | 'spec_details'>('cover_and_canvas');

  const reportContainerRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString(isKo ? 'ko-KR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const reportId = `ARCH-REP-${selectedParadigm.toUpperCase()}-${Math.abs(
    (authorName + organization + selectedParadigm).split('').reduce((acc, c) => acc + c.charCodeAt(0), 1234)
  )}-${new Date().getFullYear()}`;

  // Paradigms description
  const paradigmMeta: Record<Paradigm, { name: string; nameKo: string; desc: string; descKo: string; badgeColor: string }> = {
    all: {
      name: 'All 3 Paradigms (LLM vs RAG vs Agentic AI)',
      nameKo: '전체 3대 아키텍처 통합 비교 (Pure LLM vs RAG vs Agentic AI)',
      desc: 'Comprehensive comparative overview across Pure Foundation LLM, Hybrid Retrieval-Augmented Generation, and Multi-cycle Autonomous Agentic AI.',
      descKo: '단일 신경망 순수 LLM, 하이브리드 검색 결합 RAG, 다중 사이클 자율 ReAct 에이전트 AI의 전체 3개 파이프라인 통합 아키텍처 분석 보고서입니다.',
      badgeColor: 'bg-indigo-600 text-white',
    },
    llm: {
      name: 'Pure Foundation LLM Paradigm',
      nameKo: '순수 파운데이션 LLM 패러다임 (ChatGPT 원형)',
      desc: 'Single-turn stateless inference relying solely on parameterized weights, transformer self-attention, and prompt engineering.',
      descKo: '외부 연동 없는 단일 턴 비상태 추론 구조로, 트랜스포머 가중치 파라미터와 프롬프트 토큰화에만 전적으로 의존하는 기준 파이프라인입니다.',
      badgeColor: 'bg-blue-600 text-white',
    },
    rag: {
      name: 'Retrieval-Augmented Generation (RAG)',
      nameKo: '검색 증강 생성 패러다임 (RAG / Perplexity 원형)',
      desc: 'Dual-stream factual grounding pipeline combining dense vector embeddings, hybrid BM25 search, context retrieval, and citation synthesis.',
      descKo: '밀집 벡터 임베딩과 희소 역색인 검색을 결합하여 사실 기반 지식을 동적으로 인출하고 환각을 억제하는 검색 증강 아키텍처입니다.',
      badgeColor: 'bg-sky-600 text-white',
    },
    agentic: {
      name: 'Autonomous Agentic AI Paradigm',
      nameKo: '자율 에이전트 AI 패러다임 (Goover / Operator 원형)',
      desc: 'Multi-cycle goal-directed DAG execution with cognitive reasoning (ReAct), persistent long-term memory, sandboxed tool dispatch, and reflective action loops.',
      descKo: '인지적 추론(ReAct), 영구 장기 기억, 샌드박스 도구 실행 및 자기 반성 평가 루프가 유기적으로 결합된 완전 자율 복합 AI 아키텍처입니다.',
      badgeColor: 'bg-purple-600 text-white',
    },
  };

  // Extract nodes
  const allNodesList = Object.values(ARCHITECTURE_NODES);
  const relevantNodes = includeAllNodes
    ? allNodesList
    : selectedParadigm === 'all'
    ? allNodesList
    : allNodesList.filter((n) => n.paradigm === selectedParadigm || n.paradigm === 'shared');

  const activeNode = activeNodeId ? ARCHITECTURE_NODES[activeNodeId] || null : null;

  const handleAuthorChange = (val: string) => {
    setAuthorName(val);
    try {
      localStorage.setItem('ai_arch_report_author', val);
    } catch {}
  };

  const handleOrgChange = (val: string) => {
    setOrganization(val);
    try {
      localStorage.setItem('ai_arch_report_org', val);
    } catch {}
  };

  // High quality PDF generation
  const handleExportPDF = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // Page 1: Overview & Architecture Canvas
      if (page1Ref.current) {
        const page1Img = await toPng(page1Ref.current, {
          quality: 0.98,
          pixelRatio: 2.0,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
        pdf.addImage(page1Img, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      // Page 2: Node Specifications & Active Node Details
      if (page2Ref.current) {
        pdf.addPage('a4', 'landscape');
        const page2Img = await toPng(page2Ref.current, {
          quality: 0.98,
          pixelRatio: 2.0,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
        pdf.addImage(page2Img, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = isKo
        ? `AI_아키텍처_종합_보고서_${selectedParadigm.toUpperCase()}_${timestamp}.pdf`
        : `AI_Architecture_Report_${selectedParadigm.toUpperCase()}_${timestamp}.pdf`;

      pdf.save(filename);

      recordActivity({
        type: 'export_pdf',
        titleKo: `아키텍처 분석 리포트 PDF 출력 (${selectedParadigm.toUpperCase()})`,
        titleEn: `Exported Architecture Report PDF (${selectedParadigm.toUpperCase()})`,
        detailKo: `현재 활성 노드(${activeNode ? activeNode.nameKo : '미지정'}) 및 파이프라인 구성이 포함된 고화질 PDF 리포트를 저장했습니다.`,
        detailEn: `Saved high-quality architecture specification report PDF with active node (${activeNode ? activeNode.name : 'None'}).`,
        metadata: {
          tab: 'canvas',
          paradigm: selectedParadigm,
          nodeId: activeNodeId || undefined,
        },
      });

      if (onShowToast) {
        onShowToast(
          isKo
            ? '아키텍처 고품질 PDF 리포트가 성공적으로 다운로드되었습니다.'
            : 'High-quality Architecture PDF Report exported successfully.'
        );
      }
    } catch (err) {
      console.error('Failed to export architecture PDF report:', err);
      // Fallback
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-[1240px] max-h-[96vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isKo ? '아키텍처 고품질 PDF 리포트 내보내기' : 'Export High-Quality Architecture PDF Report'}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  A4 Landscape • 2-Page Exec Report
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {isKo
                  ? '현재 캔버스 시각화 다이어그램, 활성 파이프라인 구성 및 선택된 노드 상세 명세를 담은 전문 PDF 보고서를 생성합니다.'
                  : 'Generates a formal PDF report including canvas visual snapshot, active configuration, and detailed node specifications.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKo ? 'PDF 렌더링 중...' : 'Generating PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isKo ? 'PDF 다운로드 (A4 가로 2쪽)' : 'Download PDF Report'}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition ${
                isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div
          className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 text-xs ${
            isLight ? 'bg-slate-100/80 border-slate-200 text-slate-700' : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">{isKo ? '작성자 / 엔지니어:' : 'Author / Engineer:'}</span>
              <input
                type="text"
                value={authorName}
                onChange={(e) => handleAuthorChange(e.target.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-amber-400'
                } outline-none w-44`}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{isKo ? '소속 조직 / 랩:' : 'Organization / Lab:'}</span>
              <input
                type="text"
                value={organization}
                onChange={(e) => handleOrgChange(e.target.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-amber-400'
                } outline-none w-56`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View tab switcher in preview */}
            <div className={`p-0.5 rounded-lg border flex items-center ${isLight ? 'bg-white border-slate-300' : 'bg-zinc-800 border-zinc-700'}`}>
              <button
                onClick={() => setPreviewTab('cover_and_canvas')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  previewTab === 'cover_and_canvas'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isKo ? '1페이지: 캔버스 및 개요' : 'Page 1: Canvas & Overview'}
              </button>
              <button
                onClick={() => setPreviewTab('spec_details')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  previewTab === 'spec_details'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isKo ? '2페이지: 노드 기술 명세서' : 'Page 2: Node Specifications'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body - Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-zinc-900/40">
          <div className="w-full max-w-[1120px] flex flex-col gap-6" ref={reportContainerRef}>
            
            {/* ============================================================== */}
            {/* PAGE 1: EXECUTIVE SUMMARY & ARCHITECTURE CANVAS SNAPSHOT (A4 Landscape) */}
            {/* ============================================================== */}
            <div
              ref={page1Ref}
              style={{ width: '1060px', minHeight: '740px' }}
              className={`p-8 rounded-xl shadow-2xl border text-slate-900 bg-white font-sans flex flex-col justify-between mx-auto ${
                previewTab === 'cover_and_canvas' ? 'ring-2 ring-indigo-500' : 'opacity-90'
              }`}
            >
              {/* Report Header Bar */}
              <div>
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider bg-slate-900 text-white uppercase font-mono">
                        CONFIDENTIAL • TECHNICAL ARCHITECTURE REPORT
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        {reportId}
                      </span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                      AI Paradigm Architecture Blueprint & Node Analysis
                    </h1>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {paradigmMeta[selectedParadigm].nameKo} ({paradigmMeta[selectedParadigm].name})
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-800">{organization}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{authorName}</div>
                    <div className="text-slate-500 text-[11px] mt-1 flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{currentDate} • {currentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Configuration Summary Strip */}
                <div className="grid grid-cols-4 gap-3 my-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Selected Paradigm</span>
                    <span className="font-bold text-slate-900 uppercase">{selectedParadigm}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Flow Simulation</span>
                    <span className={`font-bold ${flowAnimating ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {flowAnimating ? 'Active (Live Flowing)' : 'Paused (Static State)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Focus Node</span>
                    <span className="font-bold text-amber-700">
                      {activeNode ? `${activeNode.nameKo} (${activeNode.id})` : 'All System Nodes'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Analyzed Node Count</span>
                    <span className="font-bold text-indigo-700">{relevantNodes.length} Nodes Loaded</span>
                  </div>
                </div>

                {/* Architectural Canvas Snapshot Display */}
                <div className="relative rounded-xl border-2 border-slate-300 bg-slate-950 text-white overflow-hidden p-4 shadow-inner">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs text-zinc-100 uppercase tracking-wide">
                        Canvas Architecture Diagram Snapshot
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Dimensions: 1150px × 750px Model Space
                    </span>
                  </div>

                  {/* 3 Column Visual Map Representation in PDF */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Column 1: Pure LLM */}
                    <div
                      className={`rounded-lg p-3 border transition-all ${
                        selectedParadigm === 'llm' || selectedParadigm === 'all'
                          ? 'bg-blue-950/40 border-blue-500/50'
                          : 'bg-zinc-900/40 border-zinc-800 opacity-40'
                      }`}
                    >
                      <div className="text-center pb-2 border-b border-blue-500/20 mb-2">
                        <div className="text-xs font-black text-blue-400">Pure LLM (ChatGPT)</div>
                        <div className="text-[10px] text-zinc-400">Single-turn Pure Autoregressive</div>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-[10px]">
                        <div className="px-3 py-1 rounded bg-[#e9b999] text-zinc-950 font-bold">User</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Prompt Token Stream</span>
                        <div className="px-3 py-1 rounded bg-[#296a32] text-white font-semibold">Prompt</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Direct Neural Weights</span>
                        <div className="px-3 py-1 rounded bg-blue-600 text-white font-bold">LLM (Decoder-only)</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Softmax Sampling</span>
                        <div className="px-3 py-1 rounded bg-amber-600 text-white font-semibold">Answers</div>
                      </div>
                    </div>

                    {/* Column 2: RAG */}
                    <div
                      className={`rounded-lg p-3 border transition-all ${
                        selectedParadigm === 'rag' || selectedParadigm === 'all'
                          ? 'bg-sky-950/40 border-sky-500/50'
                          : 'bg-zinc-900/40 border-zinc-800 opacity-40'
                      }`}
                    >
                      <div className="text-center pb-2 border-b border-sky-500/20 mb-2">
                        <div className="text-xs font-black text-sky-400">RAG (Perplexity)</div>
                        <div className="text-[10px] text-zinc-400">Dual-stream Hybrid Retrieval</div>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-[10px]">
                        <div className="px-3 py-1 rounded bg-[#e9b999] text-zinc-950 font-bold">User</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Query Rewriter</span>
                        <div className="flex gap-2">
                          <div className="px-2 py-1 rounded bg-[#296a32] text-white font-semibold">Prompt</div>
                          <div className="px-2 py-1 rounded bg-[#1a4320] text-white font-semibold">Search / Embed</div>
                        </div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Vector DB & Top-K Chunks</span>
                        <div className="px-3 py-1 rounded bg-blue-800 text-white font-bold">Context Grounding</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Augment + Re-rank</span>
                        <div className="px-3 py-1 rounded bg-sky-600 text-white font-bold">LLM + Injected Context</div>
                        <span className="text-zinc-500 font-mono text-[9px]">↓ Citation Verified</span>
                        <div className="px-3 py-1 rounded bg-amber-600 text-white font-semibold">Grounded Answers</div>
                      </div>
                    </div>

                    {/* Column 3: Agentic AI */}
                    <div
                      className={`rounded-lg p-3 border transition-all ${
                        selectedParadigm === 'agentic' || selectedParadigm === 'all'
                          ? 'bg-purple-950/40 border-purple-500/50'
                          : 'bg-zinc-900/40 border-zinc-800 opacity-40'
                      }`}
                    >
                      <div className="text-center pb-2 border-b border-purple-500/20 mb-2">
                        <div className="text-xs font-black text-purple-400">Agentic AI (Goover / Operator)</div>
                        <div className="text-[10px] text-zinc-400">Autonomous ReAct DAG Engine</div>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-[10px]">
                        <div className="px-3 py-1 rounded bg-[#e9b999] text-zinc-950 font-bold">User Intent</div>
                        <div className="grid grid-cols-2 gap-1 w-full text-center">
                          <div className="p-1 rounded bg-amber-900/80 text-amber-200 text-[9px] font-bold">Long-term Memory</div>
                          <div className="p-1 rounded bg-sky-900/80 text-sky-200 text-[9px] font-bold">Context Store</div>
                        </div>
                        <div className="px-3 py-1 rounded bg-[#1a4320] text-white font-bold">Reasoning & Planning (ReAct)</div>
                        <div className="grid grid-cols-2 gap-1 w-full text-center">
                          <div className="p-1 rounded bg-blue-600 text-white font-bold">Core LLM / MLLM</div>
                          <div className="p-1 rounded bg-purple-700 text-white font-bold">Tools / API Agents</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 w-full text-center">
                          <div className="p-1 rounded bg-amber-600 text-white font-semibold">Multi-modal Answer</div>
                          <div className="p-1 rounded bg-pink-700 text-white font-bold">Action / Execution</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 1 Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500 mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">AI Architecture Comparison Platform</span>
                  <span>•</span>
                  <span>Defense AI & Ontology Systems Lab</span>
                </div>
                <div>Page 1 of 2 • Executive Architecture View</div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* PAGE 2: ACTIVE NODE DETAILS & TECHNICAL SPECIFICATIONS (A4 Landscape) */}
            {/* ============================================================== */}
            <div
              ref={page2Ref}
              style={{ width: '1060px', minHeight: '740px' }}
              className={`p-8 rounded-xl shadow-2xl border text-slate-900 bg-white font-sans flex flex-col justify-between mx-auto ${
                previewTab === 'spec_details' ? 'ring-2 ring-indigo-500' : 'opacity-90'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider bg-indigo-900 text-white uppercase font-mono">
                        TECHNICAL SPECIFICATIONS & ACTIVE NODE PROFILE
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Doc: {reportId}-P2</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-950">
                      Component Node Attributes, I/O Schemas & Engineering Challenges
                    </h2>
                  </div>
                  <div className="text-right text-xs text-slate-600 font-mono">
                    <div>{currentDate}</div>
                    <div className="text-[10px] text-slate-400">Target Paradigm: {selectedParadigm.toUpperCase()}</div>
                  </div>
                </div>

                {/* Section A: Active Node Spotlight (if any is focused or first node fallback) */}
                <div className="my-4 p-4 rounded-xl border-2 border-amber-300 bg-amber-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white uppercase">
                        ACTIVE NODE FOCUS
                      </span>
                      <span className="text-base font-black text-slate-950">
                        {activeNode ? activeNode.nameKo : '전체 아키텍처 노드 대표 분석'} ({activeNode ? activeNode.name : 'System Representative'})
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ID: {activeNode ? activeNode.id : 'overview-all'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-800">
                      Category: {activeNode ? activeNode.category.toUpperCase() : 'MULTI-STAGE PIPELINE'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    {activeNode
                      ? isKo
                        ? activeNode.details.descriptionKo
                        : activeNode.details.description
                      : isKo
                      ? '사용자가 현재 캔버스에서 특정 노드를 활성화하여 상세 검사하지 않은 상태이므로, 전체 파이프라인의 핵심 노드 속성 및 I/O 명세가 아래 종합 표에 배치되었습니다.'
                      : 'No single active node was highlighted; the complete node pipeline and interface specifications are detailed in the matrix below.'}
                  </p>

                  {activeNode && (
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-amber-200">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Input Schema (입력)</span>
                        <code className="text-[11px] font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded block mt-0.5">
                          {isKo ? activeNode.details.inputKo : activeNode.details.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Output Schema (출력)</span>
                        <code className="text-[11px] font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded block mt-0.5">
                          {isKo ? activeNode.details.outputKo : activeNode.details.output}
                        </code>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Tech Stack (사용 기술)</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeNode.details.techStack.map((tech) => (
                            <span key={tech} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="text-slate-400 text-[10px] font-bold block uppercase">Engineering Challenges (해결 과제)</span>
                        <ul className="list-disc list-inside text-[11px] text-slate-700 mt-1 space-y-0.5">
                          {(isKo ? activeNode.details.challengesKo : activeNode.details.challenges).slice(0, 3).map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section B: Node Registry Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Analyzed Pipeline Nodes ({relevantNodes.length} items)</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Paradigm: {selectedParadigm.toUpperCase()}
                    </span>
                  </div>

                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-1.5 px-3">Node Name</th>
                        <th className="py-1.5 px-2">Paradigm</th>
                        <th className="py-1.5 px-2">Category</th>
                        <th className="py-1.5 px-3">Core Function & Summary</th>
                        <th className="py-1.5 px-3">Primary Tech Stack</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {relevantNodes.slice(0, 7).map((n) => {
                        const isActive = activeNodeId === n.id;
                        return (
                          <tr key={n.id} className={isActive ? 'bg-amber-50 font-bold' : ''}>
                            <td className="py-1.5 px-3 font-semibold text-slate-900">
                              {n.nameKo} <span className="text-slate-400 text-[10px]">({n.name})</span>
                            </td>
                            <td className="py-1.5 px-2 font-mono uppercase text-[10px] text-slate-500">
                              {n.paradigm}
                            </td>
                            <td className="py-1.5 px-2 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                                {n.category}
                              </span>
                            </td>
                            <td className="py-1.5 px-3 text-slate-600 truncate max-w-[280px]">
                              {isKo ? n.summaryKo : n.summary}
                            </td>
                            <td className="py-1.5 px-3 text-slate-500 truncate max-w-[180px]">
                              {n.details.techStack.slice(0, 3).join(', ')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Page 2 Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500 mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Author: {authorName}</span>
                  <span>•</span>
                  <span>Org: {organization}</span>
                  <span>•</span>
                  <span>Generated with AI Architecture Studio</span>
                </div>
                <div>Page 2 of 2 • Specifications & Node Attributes</div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2 text-zinc-500">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isKo
                ? 'A4 가로(Landscape) 규격의 고해상도 벡터/래스터 하이브리드 PDF로 렌더링되며, 즉시 보관 및 오프라인 인쇄가 가능합니다.'
                : 'Rendered into high-resolution A4 landscape PDF pages, ready for offline distribution and executive review.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {isKo ? '닫기' : 'Close'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKo ? '내보내는 중...' : 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isKo ? '고품질 PDF 리포트 다운로드' : 'Download PDF Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
