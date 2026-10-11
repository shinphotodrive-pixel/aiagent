import React, { useState, useRef } from 'react';
import { ArchitectureNode, Language, Paradigm } from '../types';
import { ARCHITECTURE_NODES } from '../data/architectureData';
import { Tooltip } from './Tooltip';
import { toPng } from 'html-to-image';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, Layers, Sparkles, Download, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  language: Language;
  selectedParadigm: Paradigm;
  activeNodeId: string | null;
  onSelectNode: (node: ArchitectureNode) => void;
  onSelectParadigm: (paradigm: Paradigm) => void;
  flowAnimating: boolean;
  setFlowAnimating: (val: boolean) => void;
  onExportSuccess?: () => void;
}

export const ArchitectureCanvas: React.FC<Props> = ({
  language,
  selectedParadigm,
  activeNodeId,
  onSelectNode,
  onSelectParadigm,
  flowAnimating,
  setFlowAnimating,
  onExportSuccess
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const [zoom, setZoom] = useState(1);
  const [hoveredParadigm, setHoveredParadigm] = useState<Paradigm | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasExportRef = useRef<HTMLDivElement>(null);

  // High-contrast SVG line & marker colors
  const svgStroke = isLight ? '#334155' : '#b2b2b2';
  const peachStroke = isLight ? '#c2410c' : '#e9b999';
  const pinkStroke = isLight ? '#be185d' : '#b33a78';
  const goldStroke = isLight ? '#d97706' : '#fbbf24';

  const effectiveParadigm = hoveredParadigm || selectedParadigm;

  const isDimmed = (paradigmOfItem: 'llm' | 'rag' | 'agentic' | 'shared') => {
    if (effectiveParadigm === 'all') return false;
    return effectiveParadigm !== paradigmOfItem;
  };

  const handleResetZoom = () => setZoom(1);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6));

  const handleExportPNG = async () => {
    if (!canvasExportRef.current) return;
    setIsExporting(true);
    try {
      const prevTransform = canvasExportRef.current.style.transform;
      canvasExportRef.current.style.transform = 'scale(1)';

      await new Promise((resolve) => setTimeout(resolve, 60));

      const dataUrl = await toPng(canvasExportRef.current, {
        pixelRatio: 2.5,
        backgroundColor: isLight ? '#ffffff' : '#000000',
        quality: 1,
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('no-export')) {
            return false;
          }
          return true;
        },
      });

      canvasExportRef.current.style.transform = prevTransform;

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `AI-Architecture-${selectedParadigm}-${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      onExportSuccess?.();
    } catch (err) {
      console.error('Failed to export high-res PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Top Controls Bar */}
      <div className={`w-full max-w-[1150px] mb-4 flex flex-wrap items-center justify-between gap-3 px-3 py-2 ${
        isLight
          ? 'bg-white/95 border-slate-300 text-slate-800 shadow-md ring-1 ring-slate-900/5'
          : 'bg-zinc-900/80 backdrop-blur border-zinc-800 text-zinc-300 shadow-xl'
      } border rounded-xl text-xs`}>
        {/* Paradigm Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <span className={`${isLight ? 'text-slate-600' : 'text-zinc-500'} font-medium px-1 flex items-center gap-1`}>
            <Layers className="w-3.5 h-3.5" />
            {isKo ? '아키텍처 필터:' : 'Filter Paradigm:'}
          </span>
          <button
            onClick={() => onSelectParadigm('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedParadigm === 'all'
                ? isLight
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {isKo ? '전체 비교 (3-Way)' : 'All 3 Paradigms'}
          </button>
          <button
            onClick={() => onSelectParadigm('llm')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedParadigm === 'llm'
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            L.L.M (ChatGPT)
          </button>
          <button
            onClick={() => onSelectParadigm('rag')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedParadigm === 'rag'
                ? 'bg-sky-600 text-white font-semibold shadow-sm shadow-sky-500/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            R.A.G (Perplexity)
          </button>
          <button
            onClick={() => onSelectParadigm('agentic')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              selectedParadigm === 'agentic'
                ? 'bg-purple-600 text-white font-semibold shadow-sm shadow-purple-500/30'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Agentic AI (Goover / Operator)
          </button>
        </div>

        {/* Animation & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlowAnimating(!flowAnimating)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium border ${
              flowAnimating
                ? isLight
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : isLight
                ? 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
            title={isKo ? '데이터 패킷 애니메이션 토글' : 'Toggle live flow packets'}
          >
            {flowAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{isKo ? '흐름 정지' : 'Pause Flow'}</span>
              </>
            ) : (
              <>
                <Play className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>{isKo ? '데이터 흐름 재생' : 'Play Flow'}</span>
              </>
            )}
          </button>

          <div className={`h-4 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-800'} mx-1`} />

          {/* Zoom controls */}
          <div className={`flex items-center ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-800/80 border-zinc-700/60'} rounded-md border p-0.5`}>
            <button
              onClick={handleZoomOut}
              className={`p-1 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'} transition`}
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[11px] font-mono px-1.5 ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className={`p-1 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'} transition`}
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className={`p-1 ${isLight ? 'text-slate-600 hover:text-slate-900 border-slate-300' : 'text-zinc-400 hover:text-white border-zinc-700/60'} transition ml-0.5 border-l pl-1`}
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className={`h-4 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-800'} mx-1`} />

          {/* Export High-Res PNG Button */}
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium border ${
              isLight
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                : 'bg-zinc-800/90 text-zinc-200 border-zinc-700 hover:text-white hover:bg-zinc-700 hover:border-zinc-600'
            } disabled:opacity-50 cursor-pointer shadow-sm active:scale-95`}
            title={isKo ? '캔버스를 고해상도(2.5x) PNG 이미지로 캡처하여 저장' : 'Capture and download canvas as high-resolution (2.5x) PNG'}
          >
            {isExporting ? (
              <>
                <Loader2 className={`w-3.5 h-3.5 animate-spin ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>{isKo ? 'PNG 캡처 중...' : 'Capturing...'}</span>
              </>
            ) : (
              <>
                <Download className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>{isKo ? '고해상도 PNG 저장' : 'Export PNG'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div 
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden flex justify-center py-2 relative scrollbar-thin"
        style={{ minHeight: '780px' }}
      >
        <div 
          ref={canvasExportRef}
          className="canvas-container relative transition-transform duration-200 ease-out origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Subtle Column Grid Highlight Backgrounds */}
          <div 
            className={`absolute top-0 left-[20px] w-[260px] h-[720px] rounded-2xl border transition-all duration-300 pointer-events-none ${
              effectiveParadigm === 'llm' 
                ? isLight
                  ? 'bg-blue-100/70 border-blue-500 ring-2 ring-blue-400/40 shadow-sm'
                  : 'bg-blue-950/15 border-blue-500/30 ring-1 ring-blue-500/20' 
                : isLight
                ? 'border-slate-200 bg-slate-50/50'
                : 'border-zinc-900/60'
            }`} 
          />
          <div 
            className={`absolute top-0 left-[310px] w-[370px] h-[720px] rounded-2xl border transition-all duration-300 pointer-events-none ${
              effectiveParadigm === 'rag' 
                ? isLight
                  ? 'bg-sky-100/70 border-sky-500 ring-2 ring-sky-400/40 shadow-sm'
                  : 'bg-sky-950/15 border-sky-500/30 ring-1 ring-sky-500/20' 
                : isLight
                ? 'border-slate-200 bg-slate-50/50'
                : 'border-zinc-900/60'
            }`} 
          />
          <div 
            className={`absolute top-0 left-[710px] w-[420px] h-[720px] rounded-2xl border transition-all duration-300 pointer-events-none ${
              effectiveParadigm === 'agentic' 
                ? isLight
                  ? 'bg-purple-100/70 border-purple-500 ring-2 ring-purple-400/40 shadow-sm'
                  : 'bg-purple-950/15 border-purple-500/30 ring-1 ring-purple-500/20' 
                : isLight
                ? 'border-slate-200 bg-slate-50/50'
                : 'border-zinc-900/60'
            }`} 
          />

          {/* SVG Canvas for all connecting lines & animated flow particles */}
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
            stroke={svgStroke} 
            strokeWidth={isLight ? 2 : 1.5} 
            fill="none"
          >
            <defs>
              {/* Arrow Markers */}
              <marker id="arr-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={svgStroke} />
              </marker>
              <marker id="arr-peach" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={peachStroke} />
              </marker>
              <marker id="arr-pink" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={pinkStroke} />
              </marker>
              <marker id="arr-active-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={goldStroke} />
              </marker>

              {/* Glowing Filters */}
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ================= COLUMN 1: L.L.M ================= */}
            <g className={`transition-opacity duration-300 ${isDimmed('llm') ? 'opacity-20' : 'opacity-100'}`}>
              <line x1="150" y1="135" x2="150" y2="185" markerEnd="url(#arr-gray)" />
              <line x1="150" y1="245" x2="150" y2="365" markerEnd="url(#arr-gray)" />
              <line x1="150" y1="425" x2="150" y2="515" markerEnd="url(#arr-gray)" />
              {/* L.L.M Feedback Loop */}
              <path 
                id="llm-feedback"
                d="M 80 550 L 50 550 L 50 100 L 100 100" 
                stroke={peachStroke} 
                strokeDasharray="6,5" 
                markerEnd="url(#arr-peach)" 
              />

              {flowAnimating && (
                <>
                  <circle r="3.5" fill="#e9b999" filter="url(#glow-gold)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 150 135 L 150 185" />
                  </circle>
                  <circle r="3.5" fill="#60a5fa" filter="url(#glow-gold)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 150 245 L 150 365" begin="0.8s" />
                  </circle>
                  <circle r="3.5" fill="#fb923c" filter="url(#glow-gold)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 150 425 L 150 515" begin="1.6s" />
                  </circle>
                  <circle r="3.5" fill="#e9b999">
                    <animateMotion dur="3.2s" repeatCount="indefinite" path="M 80 550 L 50 550 L 50 100 L 100 100" begin="2.2s" />
                  </circle>
                </>
              )}
            </g>

            {/* ================= COLUMN 2: R.A.G ================= */}
            <g className={`transition-opacity duration-300 ${isDimmed('rag') ? 'opacity-20' : 'opacity-100'}`}>
              <line x1="450" y1="135" x2="450" y2="185" markerEnd="url(#arr-gray)" />
              <line x1="450" y1="245" x2="450" y2="365" markerEnd="url(#arr-gray)" />
              <line x1="520" y1="220" x2="580" y2="220" markerEnd="url(#arr-gray)" />
              <line x1="650" y1="245" x2="650" y2="290" markerEnd="url(#arr-gray)" />
              {/* Context to LLM */}
              <path d="M 650 360 L 650 400 L 530 400" markerEnd="url(#arr-gray)" />
              <line x1="450" y1="425" x2="450" y2="515" markerEnd="url(#arr-gray)" />
              {/* R.A.G Feedback Loop */}
              <path 
                id="rag-feedback"
                d="M 380 550 L 330 550 L 330 100 L 400 100" 
                stroke={peachStroke} 
                strokeDasharray="6,5" 
                markerEnd="url(#arr-peach)" 
              />

              {flowAnimating && (
                <>
                  <circle r="3.5" fill={peachStroke}>
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 450 135 L 450 185" />
                  </circle>
                  <circle r="3.5" fill="#4ade80">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 520 220 L 580 220" begin="0.5s" />
                  </circle>
                  <circle r="3.5" fill="#38bdf8">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 650 245 L 650 290" begin="0.9s" />
                  </circle>
                  <circle r="3.5" fill="#38bdf8">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 650 360 L 650 400 L 530 400" begin="1.4s" />
                  </circle>
                  <circle r="3.5" fill="#fb923c">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 450 425 L 450 515" begin="2.0s" />
                  </circle>
                  <circle r="3.5" fill={peachStroke}>
                    <animateMotion dur="3.5s" repeatCount="indefinite" path="M 380 550 L 330 550 L 330 100 L 400 100" begin="2.6s" />
                  </circle>
                </>
              )}
            </g>

            {/* ================= COLUMN 3: Agentic AI ================= */}
            <g className={`transition-opacity duration-300 ${isDimmed('agentic') ? 'opacity-20' : 'opacity-100'}`}>
              <line x1="820" y1="135" x2="820" y2="185" markerEnd="url(#arr-gray)" />
              <line x1="820" y1="245" x2="820" y2="405" markerEnd="url(#arr-gray)" />
              <line x1="890" y1="220" x2="950" y2="220" markerEnd="url(#arr-gray)" />
              <line x1="1020" y1="245" x2="1020" y2="270" markerEnd="url(#arr-gray)" />
              {/* Context to LLMs */}
              <path d="M 1020 340 L 1020 425 L 900 425" markerEnd="url(#arr-gray)" />
              {/* Memory to LLMs */}
              <path d="M 620 340 L 620 425 L 740 425" markerEnd="url(#arr-gray)" />

              {/* Reasoning & Planning <-> LLMs (Double Arrow) */}
              <line x1="660" y1="455" x2="740" y2="455" markerEnd="url(#arr-gray)" />
              <line x1="740" y1="475" x2="660" y2="475" markerEnd="url(#arr-gray)" />

              {/* LLMs <-> Tools / Agents (Double Arrow) */}
              <line x1="900" y1="445" x2="935" y2="445" markerEnd="url(#arr-gray)" />
              <line x1="935" y1="460" x2="900" y2="460" markerEnd="url(#arr-gray)" />

              {/* LLMs to Answers */}
              <line x1="820" y1="465" x2="820" y2="545" markerEnd="url(#arr-gray)" />

              {/* Tools to Action */}
              <line x1="1020" y1="465" x2="1020" y2="545" stroke={pinkStroke} strokeDasharray="5,4" markerEnd="url(#arr-pink)" />

              {/* Answers to Reasoning */}
              <line x1="740" y1="560" x2="660" y2="560" markerEnd="url(#arr-gray)" />

              {/* Answers to Action */}
              <line x1="900" y1="580" x2="950" y2="580" markerEnd="url(#arr-gray)" />

              {/* Agentic AI Feedback Loops */}
              {/* Main Answers to User */}
              <path 
                id="agent-feedback-main"
                d="M 820 605 L 820 640 L 550 640 L 550 100 L 770 100" 
                stroke={peachStroke} 
                strokeDasharray="6,5" 
                markerEnd="url(#arr-peach)" 
              />
              {/* Action joining main feedback */}
              <path 
                id="agent-feedback-action"
                d="M 1020 605 L 1020 640 L 820 640" 
                stroke={peachStroke} 
                strokeDasharray="6,5" 
              />

              {flowAnimating && (
                <>
                  <circle r="3.5" fill="#e9b999">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 820 135 L 820 185" />
                  </circle>
                  <circle r="3.5" fill="#fbbf24">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 620 340 L 620 425 L 740 425" begin="0.6s" />
                  </circle>
                  <circle r="3.5" fill="#4ade80">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 660 455 L 740 455" begin="1.2s" />
                  </circle>
                  <circle r="3.5" fill="#c084fc">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 900 445 L 935 445" begin="1.7s" />
                  </circle>
                  <circle r="3.5" fill="#f43f5e">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 1020 465 L 1020 545" begin="2.2s" />
                  </circle>
                  <circle r="3.5" fill="#fb923c">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 820 465 L 820 545" begin="2.5s" />
                  </circle>
                  <circle r="3.5" fill="#e9b999">
                    <animateMotion dur="3.8s" repeatCount="indefinite" path="M 820 605 L 820 640 L 550 640 L 550 100 L 770 100" begin="3.0s" />
                  </circle>
                </>
              )}
            </g>
          </svg>

          {/* ================= HTML NODES ================= */}

          {/* COLUMN 1: L.L.M (ChatGPT) */}
          <div 
            className={`transition-opacity duration-300 ${isDimmed('llm') ? 'opacity-25' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredParadigm('llm')}
            onMouseLeave={() => setHoveredParadigm(null)}
          >
            {/* User */}
            <Tooltip node={ARCHITECTURE_NODES['user-1']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['user-1'])}
                className={`node node-user ${activeNodeId === 'user-1' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '150px', top: '100px' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 pointer-events-none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </Tooltip>

            {/* Prompt */}
            <Tooltip node={ARCHITECTURE_NODES['prompt-1']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['prompt-1'])}
                className={`node node-rect bg-green-light ${activeNodeId === 'prompt-1' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '150px', top: '220px' }}
              >
                Prompt
              </div>
            </Tooltip>

            {/* LLM */}
            <Tooltip node={ARCHITECTURE_NODES['llm-1']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['llm-1'])}
                className={`node node-rect bg-blue ${activeNodeId === 'llm-1' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '150px', top: '400px' }}
              >
                LLM
              </div>
            </Tooltip>

            {/* Answer */}
            <Tooltip node={ARCHITECTURE_NODES['answer-1']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['answer-1'])}
                className={`node node-rect bg-orange ${activeNodeId === 'answer-1' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '150px', top: '550px' }}
              >
                Answer
              </div>
            </Tooltip>

            {/* Label Column 1 */}
            <div 
              onClick={() => onSelectParadigm('llm')}
              className="absolute text-center cursor-pointer group" 
              style={{ left: '150px', top: '680px', transform: 'translateX(-50%)' }}
            >
              <div className={`label-title ${isLight ? 'text-slate-900 font-bold' : 'text-zinc-100'} group-hover:text-blue-500 transition-colors flex items-center justify-center gap-1`}>
                L.L.M
                <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
              </div>
              <div className={`label-subtitle ${isLight ? 'text-slate-600 font-semibold' : 'text-zinc-400'} group-hover:text-zinc-900`}>ChatGPT</div>
            </div>
          </div>

          {/* COLUMN 2: R.A.G (Perplexity) */}
          <div 
            className={`transition-opacity duration-300 ${isDimmed('rag') ? 'opacity-25' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredParadigm('rag')}
            onMouseLeave={() => setHoveredParadigm(null)}
          >
            {/* User */}
            <Tooltip node={ARCHITECTURE_NODES['user-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['user-2'])}
                className={`node node-user ${activeNodeId === 'user-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '450px', top: '100px' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 pointer-events-none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </Tooltip>

            {/* Prompt */}
            <Tooltip node={ARCHITECTURE_NODES['prompt-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['prompt-2'])}
                className={`node node-rect bg-green-light ${activeNodeId === 'prompt-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '450px', top: '220px' }}
              >
                Prompt
              </div>
            </Tooltip>

            {/* Search */}
            <Tooltip node={ARCHITECTURE_NODES['search-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['search-2'])}
                className={`node node-rect-sm bg-green-dark ${activeNodeId === 'search-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '650px', top: '220px' }}
              >
                Search
              </div>
            </Tooltip>

            {/* Context (DB Cylinder) */}
            <Tooltip node={ARCHITECTURE_NODES['context-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['context-2'])}
                className={`node node-db bg-db-blue ${activeNodeId === 'context-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '650px', top: '330px' }}
              >
                Context
              </div>
            </Tooltip>

            {/* LLM */}
            <Tooltip node={ARCHITECTURE_NODES['llm-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['llm-2'])}
                className={`node node-rect bg-blue ${activeNodeId === 'llm-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '450px', top: '400px' }}
              >
                LLM
              </div>
            </Tooltip>

            {/* Answer */}
            <Tooltip node={ARCHITECTURE_NODES['answer-2']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['answer-2'])}
                className={`node node-rect bg-orange ${activeNodeId === 'answer-2' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '450px', top: '550px' }}
              >
                Answer
              </div>
            </Tooltip>

            {/* Label Column 2 */}
            <div 
              onClick={() => onSelectParadigm('rag')}
              className="absolute text-center cursor-pointer group" 
              style={{ left: '450px', top: '680px', transform: 'translateX(-50%)' }}
            >
              <div className={`label-title ${isLight ? 'text-slate-900 font-bold' : 'text-zinc-100'} group-hover:text-sky-500 transition-colors flex items-center justify-center gap-1`}>
                R.A.G
                <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" />
              </div>
              <div className={`label-subtitle ${isLight ? 'text-slate-600 font-semibold' : 'text-zinc-400'} group-hover:text-zinc-900`}>Perplexity</div>
            </div>
          </div>

          {/* COLUMN 3: Agentic AI (Goover / Operator) */}
          <div 
            className={`transition-opacity duration-300 ${isDimmed('agentic') ? 'opacity-25' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredParadigm('agentic')}
            onMouseLeave={() => setHoveredParadigm(null)}
          >
            {/* User */}
            <Tooltip node={ARCHITECTURE_NODES['user-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['user-3'])}
                className={`node node-user ${activeNodeId === 'user-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '820px', top: '100px' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-zinc-900 pointer-events-none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </Tooltip>

            {/* Prompt */}
            <Tooltip node={ARCHITECTURE_NODES['prompt-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['prompt-3'])}
                className={`node node-rect bg-green-light ${activeNodeId === 'prompt-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '820px', top: '220px' }}
              >
                Prompt
              </div>
            </Tooltip>

            {/* Search */}
            <Tooltip node={ARCHITECTURE_NODES['search-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['search-3'])}
                className={`node node-rect-sm bg-green-dark ${activeNodeId === 'search-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '1020px', top: '220px' }}
              >
                Search
              </div>
            </Tooltip>

            {/* Context (DB Cylinder) */}
            <Tooltip node={ARCHITECTURE_NODES['context-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['context-3'])}
                className={`node node-db bg-db-blue ${activeNodeId === 'context-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '1020px', top: '310px' }}
              >
                Context
              </div>
            </Tooltip>

            {/* Memory (DB Cylinder Gold) */}
            <Tooltip node={ARCHITECTURE_NODES['memory-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['memory-3'])}
                className={`node node-db bg-db-gold ${activeNodeId === 'memory-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '620px', top: '310px', color: '#000' }}
              >
                Memory
              </div>
            </Tooltip>

            {/* Reasoning & Planning (Vertical Node) */}
            <Tooltip node={ARCHITECTURE_NODES['reasoning-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['reasoning-3'])}
                className={`node node-vertical bg-green-dark ${activeNodeId === 'reasoning-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '620px', top: '490px' }}
              >
                Reasoning<br />& Planning
              </div>
            </Tooltip>

            {/* LLMs */}
            <Tooltip node={ARCHITECTURE_NODES['llms-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['llms-3'])}
                className={`node node-rect bg-blue text-lg ${activeNodeId === 'llms-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '820px', top: '440px' }}
              >
                LLMs
              </div>
            </Tooltip>

            {/* Tools / Agents (Pill Node) */}
            <Tooltip node={ARCHITECTURE_NODES['tools-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['tools-3'])}
                className={`node node-pill bg-purple ${activeNodeId === 'tools-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '1020px', top: '440px' }}
              >
                Tools / Agents
              </div>
            </Tooltip>

            {/* Multi-modal Answers */}
            <Tooltip node={ARCHITECTURE_NODES['answer-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['answer-3'])}
                className={`node node-rect bg-orange text-sm ${activeNodeId === 'answer-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '820px', top: '580px' }}
              >
                Multi-modal<br />Answers
              </div>
            </Tooltip>

            {/* Action (Act) */}
            <Tooltip node={ARCHITECTURE_NODES['action-3']} language={language}>
              <div 
                onClick={() => onSelectNode(ARCHITECTURE_NODES['action-3'])}
                className={`node node-rect-sm bg-pink font-semibold ${activeNodeId === 'action-3' ? 'is-active-pulse ring-4 ring-amber-400' : ''}`} 
                style={{ left: '1020px', top: '580px' }}
              >
                Action<br />(Act)
              </div>
            </Tooltip>

            {/* Label Column 3 */}
            <div 
              onClick={() => onSelectParadigm('agentic')}
              className="absolute text-center cursor-pointer group" 
              style={{ left: '820px', top: '680px', transform: 'translateX(-50%)' }}
            >
              <div className={`label-title ${isLight ? 'text-slate-900 font-bold' : 'text-zinc-100'} group-hover:text-purple-500 transition-colors flex items-center justify-center gap-1`}>
                Agentic AI
                <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-500 transition-opacity" />
              </div>
              <div className={`label-subtitle ${isLight ? 'text-slate-600 font-semibold' : 'text-zinc-400'} group-hover:text-zinc-900`}>Goover / Operator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
        {isKo 
          ? '노드를 클릭하면 내부 동작 원리, API 입출력 구조 및 예제 코드를 확인할 수 있습니다.' 
          : 'Click any node to inspect technical internals, API schemas, and sample code.'}
      </div>
    </div>
  );
};
