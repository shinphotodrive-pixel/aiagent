import React, { useState, useRef, useMemo } from 'react';
import { Language, ActiveTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  CONCEPT_NODES,
  CONCEPT_EDGES,
  DOMAIN_CLUSTER_META,
  DomainCluster,
  ConceptNode,
  ConceptEdge
} from '../data/crossDomainKnowledgeGraphData';
import {
  Network,
  Brain,
  Shield,
  Crosshair,
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  Zap,
  Target,
  Compass,
  Download
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  language: Language;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const KnowledgeGraphExplorer: React.FC<Props> = ({ language, onNavigateTab }) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();

  // State
  const [selectedCluster, setSelectedCluster] = useState<DomainCluster | 'all'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ont-neuro-symbolic');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  const graphExportRef = useRef<HTMLDivElement>(null);

  // Active inspected node
  const activeNode = useMemo(() => {
    return CONCEPT_NODES.find((n) => n.id === selectedNodeId) || CONCEPT_NODES[0];
  }, [selectedNodeId]);

  // Connected edges for the active or hovered node
  const focusNodeId = hoveredNodeId || selectedNodeId;
  const connectedEdgeIds = useMemo(() => {
    const set = new Set<string>();
    CONCEPT_EDGES.forEach((e) => {
      if (e.source === focusNodeId || e.target === focusNodeId) {
        set.add(e.id);
      }
    });
    return set;
  }, [focusNodeId]);

  const connectedNeighborNodeIds = useMemo(() => {
    const set = new Set<string>();
    set.add(focusNodeId);
    CONCEPT_EDGES.forEach((e) => {
      if (e.source === focusNodeId) set.add(e.target);
      if (e.target === focusNodeId) set.add(e.source);
    });
    return set;
  }, [focusNodeId]);

  // Edges linked to activeNode specifically
  const activeNodeIncoming = useMemo(() => {
    return CONCEPT_EDGES.filter((e) => e.target === activeNode.id);
  }, [activeNode]);

  const activeNodeOutgoing = useMemo(() => {
    return CONCEPT_EDGES.filter((e) => e.source === activeNode.id);
  }, [activeNode]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.6));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.65));
  const handleResetZoom = () => setZoom(1);

  // Export PNG snapshot
  const handleExportPNG = async () => {
    if (!graphExportRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(graphExportRef.current, {
        pixelRatio: 2,
        backgroundColor: isLight ? '#f8fafc' : '#09090b',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `AI_Knowledge_Graph_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  // Node navigation helper to open parent explorer tab
  const handleJumpToSourceModule = (cluster: DomainCluster) => {
    if (cluster === 'kim') onNavigateTab('kimdaeshik');
    else if (cluster === 'ontology') onNavigateTab('ontology');
    else if (cluster === 'defense') onNavigateTab('defense');
    else onNavigateTab('roadmap');
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-white border-slate-200 shadow-md'
            : 'bg-zinc-900/90 border-zinc-800 shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-emerald-500/10 border-indigo-500/30 text-indigo-500">
              <Network className="w-3.5 h-3.5" />
              <span>{isKo ? '3대 도메인 상호연계 지식 그래프' : 'Tri-Domain Cross-Concept Knowledge Graph'}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                Kim × Ontology × Defense
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? 'AI 개념 융합 지식 그래프 (Knowledge Graph)' : 'AI Cross-Domain Knowledge Graph'}
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {isKo
                ? '김대식 교수(인지 패러다임·피지컬 AI), 온톨로지 AI(뉴로심볼릭·지식그래프), 국방 AI(MCP 규격·안전 게이트) 3개 도메인의 14개 핵심 개념과 유기적 상호 작용 관계(Grounding, Synergy, Control, Evolution)를 인터랙티브하게 탐색합니다.'
                : 'Interactive topological mapping revealing how cognitive limits, formal semantic ontologies, and mission-critical defense MCP protocols synthesize into a unified sovereign AI architecture.'}
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-center">
            {/* Cluster Filters */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 text-xs">
              <button
                onClick={() => setSelectedCluster('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  selectedCluster === 'all'
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'bg-zinc-800 text-white shadow font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKo ? '전체 (14)' : 'All (14)'}
              </button>
              <button
                onClick={() => setSelectedCluster('kim')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCluster === 'kim'
                    ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-purple-600'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">{isKo ? '김대식' : 'Kim'}</span>
              </button>
              <button
                onClick={() => setSelectedCluster('ontology')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCluster === 'ontology'
                    ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-indigo-600'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">{isKo ? '온톨로지' : 'Ontology'}</span>
              </button>
              <button
                onClick={() => setSelectedCluster('defense')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCluster === 'defense'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-emerald-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">{isKo ? '국방 AI' : 'Defense'}</span>
              </button>
              <button
                onClick={() => setSelectedCluster('cross-synthesis')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCluster === 'cross-synthesis'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-amber-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{isKo ? '융합' : 'Tri-Hub'}</span>
              </button>
            </div>

            {/* Export PNG button */}
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title={isKo ? '그래프 PNG 다운로드' : 'Export PNG Snapshot'}
            >
              <Download className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Grid: 2-Zone Layout (Left: Interactive SVG Canvas 68%, Right: Deep Inspection Deck 32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Zone: Interactive SVG Canvas Container (lg:col-span-8) */}
        <div
          ref={graphExportRef}
          className={`lg:col-span-8 rounded-2xl border p-4 sm:p-5 flex flex-col relative overflow-hidden min-h-[580px] lg:min-h-[660px] select-none ${
            isLight
              ? 'bg-slate-50/90 border-slate-200 shadow-sm'
              : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          {/* Canvas Floating Top Overlay Controls */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
            }`}>
              <Info className="w-3 h-3 text-indigo-500" />
              <span>{isKo ? '노드 클릭: 상세 분석 | 호버: 연결망 강조' : 'Click node to inspect · Hover to focus'}</span>
            </div>

            {/* Pulse animation toggle */}
            <button
              onClick={() => setPulseActive(!pulseActive)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border backdrop-blur-md transition cursor-pointer flex items-center gap-1 shadow-sm ${
                pulseActive
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                  : isLight
                  ? 'bg-white/80 text-slate-500 border-slate-200'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800'
              }`}
              title={isKo ? '엣지 애니메이션 토글' : 'Toggle edge flow pulse'}
            >
              <Zap className={`w-3 h-3 ${pulseActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>{pulseActive ? (isKo ? '펄스 켬' : 'Pulse ON') : (isKo ? '펄스 끔' : 'Pulse OFF')}</span>
            </button>
          </div>

          {/* Floating Zoom Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 p-1 rounded-xl shadow-md backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition cursor-pointer"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] px-1 text-slate-500 dark:text-zinc-400 font-bold">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Background Blueprint Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={isLight ? 'text-slate-300' : 'text-zinc-700'} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* SVG Canvas Stage */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto p-4 relative z-10">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
                width: '1060px',
                height: '620px',
              }}
              className="relative shrink-0"
            >
              <svg
                width="1060"
                height="620"
                viewBox="0 0 1060 620"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Arrowhead markers */}
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill={isLight ? '#94a3b8' : '#52525b'} />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="24"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="arrow-grounding"
                    viewBox="0 0 10 10"
                    refX="24"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                  </marker>
                  <marker
                    id="arrow-protocol"
                    viewBox="0 0 10 10"
                    refX="24"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
                  </marker>

                  {/* Node drop shadows */}
                  <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" floodColor="#000" />
                  </filter>
                  <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f59e0b" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* 1. Cluster Regional Hull Backdrops */}
                <g className="cluster-regions opacity-40 dark:opacity-30">
                  {/* Kim Cluster Oval */}
                  <ellipse
                    cx="260"
                    cy="270"
                    rx="190"
                    ry="170"
                    fill={isLight ? '#f3e8ff' : '#581c87'}
                    fillOpacity={isLight ? 0.35 : 0.18}
                    stroke={DOMAIN_CLUSTER_META.kim.borderColor}
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <text
                    x="120"
                    y="100"
                    className="text-[11px] font-bold font-mono tracking-wider"
                    fill={isLight ? DOMAIN_CLUSTER_META.kim.lightColor : DOMAIN_CLUSTER_META.kim.color}
                  >
                    [ CLUSTER 1: KIM DAE-SHIK ]
                  </text>

                  {/* Ontology Cluster Oval */}
                  <ellipse
                    cx="580"
                    cy="340"
                    rx="170"
                    ry="190"
                    fill={isLight ? '#e0e7ff' : '#312e81'}
                    fillOpacity={isLight ? 0.35 : 0.18}
                    stroke={DOMAIN_CLUSTER_META.ontology.borderColor}
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <text
                    x="510"
                    y="120"
                    className="text-[11px] font-bold font-mono tracking-wider"
                    fill={isLight ? DOMAIN_CLUSTER_META.ontology.lightColor : DOMAIN_CLUSTER_META.ontology.color}
                  >
                    [ CLUSTER 2: ONTOLOGY AI ]
                  </text>

                  {/* Defense Cluster Oval */}
                  <ellipse
                    cx="840"
                    cy="350"
                    rx="180"
                    ry="180"
                    fill={isLight ? '#d1fae5' : '#064e3b'}
                    fillOpacity={isLight ? 0.35 : 0.18}
                    stroke={DOMAIN_CLUSTER_META.defense.borderColor}
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <text
                    x="810"
                    y="130"
                    className="text-[11px] font-bold font-mono tracking-wider"
                    fill={isLight ? DOMAIN_CLUSTER_META.defense.lightColor : DOMAIN_CLUSTER_META.defense.color}
                  >
                    [ CLUSTER 3: DEFENSE AI ]
                  </text>
                </g>

                {/* 2. Concept Edges (Curved Paths with dynamic markers and text) */}
                <g className="edges">
                  {CONCEPT_EDGES.map((edge) => {
                    const src = CONCEPT_NODES.find((n) => n.id === edge.source);
                    const tgt = CONCEPT_NODES.find((n) => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const isConnected = connectedEdgeIds.has(edge.id);
                    const isHovered = hoveredEdgeId === edge.id;
                    const isDimmed =
                      selectedCluster !== 'all' &&
                      src.cluster !== selectedCluster &&
                      tgt.cluster !== selectedCluster;

                    // Calculate curved control point
                    const dx = tgt.x - src.x;
                    const dy = tgt.y - src.y;
                    const cx = (src.x + tgt.x) / 2 - dy * 0.12;
                    const cy = (src.y + tgt.y) / 2 + dx * 0.12;

                    const pathD = `M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}`;

                    let strokeColor = isLight ? '#cbd5e1' : '#3f3f46';
                    let strokeWidth = 1.8;
                    let markerEnd = 'url(#arrow-default)';

                    if (isConnected || isHovered) {
                      strokeColor = '#f59e0b';
                      strokeWidth = 3;
                      markerEnd = 'url(#arrow-active)';
                    } else if (edge.type === 'grounding') {
                      strokeColor = isLight ? '#818cf8' : '#6366f1';
                      markerEnd = 'url(#arrow-grounding)';
                    } else if (edge.type === 'protocol') {
                      strokeColor = isLight ? '#10b981' : '#059669';
                      markerEnd = 'url(#arrow-protocol)';
                    }

                    return (
                      <g
                        key={edge.id}
                        onMouseEnter={() => setHoveredEdgeId(edge.id)}
                        onMouseLeave={() => setHoveredEdgeId(null)}
                        className={`transition-opacity duration-200 cursor-pointer ${
                          isDimmed ? 'opacity-20' : 'opacity-100'
                        }`}
                      >
                        {/* Transparent thick hit area for easy hover */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="14"
                          className="cursor-pointer"
                        />

                        {/* Visual Path Line */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={isConnected && pulseActive ? '8 4' : undefined}
                          className={isConnected && pulseActive ? 'animate-pulse' : ''}
                          markerEnd={markerEnd}
                        />

                        {/* Edge Label Pill at midpoint */}
                        {(isConnected || isHovered) && (
                          <g transform={`translate(${cx}, ${cy})`}>
                            <rect
                              x="-65"
                              y="-11"
                              width="130"
                              height="22"
                              rx="6"
                              className={isLight ? 'fill-white stroke-slate-300' : 'fill-zinc-900 stroke-zinc-700'}
                              strokeWidth="1"
                              filter="url(#node-glow)"
                            />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              className="text-[9px] font-bold font-sans"
                              fill={isLight ? '#1e293b' : '#fbbf24'}
                            >
                              {isKo ? edge.relationKo : edge.relationEn}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 3. Concept Nodes */}
                <g className="nodes">
                  {CONCEPT_NODES.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isFocusedNeighbor = connectedNeighborNodeIds.has(node.id);
                    const meta = DOMAIN_CLUSTER_META[node.cluster];

                    const isDimmed =
                      selectedCluster !== 'all'
                        ? node.cluster !== selectedCluster
                        : !isFocusedNeighbor && (selectedNodeId !== null || hoveredNodeId !== null);

                    const nodeRadius = node.size;
                    const borderColor = isSelected
                      ? '#f59e0b'
                      : isLight
                      ? meta.lightColor
                      : meta.color;
                    const fillColor = isSelected
                      ? isLight
                        ? '#fef3c7'
                        : '#78350f'
                      : isLight
                      ? meta.lightBgColor
                      : meta.bgColor;

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => setSelectedNodeId(node.id)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className={`cursor-pointer transition-all duration-200 ${
                          isDimmed ? 'opacity-30' : 'opacity-100'
                        }`}
                      >
                        {/* Outer Glow / Halo for active node */}
                        {isSelected && (
                          <circle
                            r={nodeRadius + 10}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            strokeDasharray="4 3"
                            className="animate-spin"
                            style={{ animationDuration: '8s' }}
                          />
                        )}

                        {/* Node Main Circle */}
                        <circle
                          r={nodeRadius}
                          fill={fillColor}
                          stroke={borderColor}
                          strokeWidth={isSelected ? 3.5 : 2}
                          filter={isSelected ? 'url(#active-glow)' : 'url(#node-glow)'}
                          className="transition-all"
                        />

                        {/* Center Icon/Symbol */}
                        <g transform={`translate(-8, -8)`} className="pointer-events-none">
                          {node.cluster === 'kim' && <Brain className="w-4 h-4" color={isLight ? meta.lightColor : meta.color} />}
                          {node.cluster === 'ontology' && <Network className="w-4 h-4" color={isLight ? meta.lightColor : meta.color} />}
                          {node.cluster === 'defense' && <Shield className="w-4 h-4" color={isLight ? meta.lightColor : meta.color} />}
                          {node.cluster === 'cross-synthesis' && <Sparkles className="w-4 h-4" color="#f59e0b" />}
                        </g>

                        {/* Node Label Text */}
                        <text
                          y={nodeRadius + 14}
                          textAnchor="middle"
                          className={`text-[11px] font-bold font-sans pointer-events-none select-none tracking-tight ${
                            isSelected
                              ? 'font-black'
                              : isLight
                              ? 'fill-slate-800'
                              : 'fill-zinc-100'
                          }`}
                          fill={isSelected ? '#f59e0b' : undefined}
                        >
                          {isKo ? node.labelKo : node.labelEn}
                        </text>

                        {/* Module Sub-Badge */}
                        <text
                          y={nodeRadius + 26}
                          textAnchor="middle"
                          className="text-[9px] font-mono pointer-events-none select-none opacity-80"
                          fill={isLight ? meta.lightColor : meta.color}
                        >
                          {isKo ? node.badgeKo : node.badgeEn}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom Canvas Legend Strip */}
          <div className={`mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-zinc-800 text-zinc-400'
          }`}>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                <span>{isKo ? '김대식: 인지 & 물리 AI' : 'Kim: Cognitive & Physical AI'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                <span>{isKo ? '온톨로지: 뉴로심볼릭 & 지식그래프' : 'Ontology: Neuro-Symbolic & Graph'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>{isKo ? '국방: MCP 표준 & 에어갭 안전' : 'Defense: MCP Spec & Air-gap'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>{isKo ? '융합 허브: 결심 우위 & PoC' : 'Tri-Hub: Dominance & PoC'}</span>
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              14 Nodes · 14 Relational Edges
            </div>
          </div>
        </div>

        {/* Right Zone: Deep Inspection Deck (lg:col-span-4) */}
        <div
          className={`lg:col-span-4 rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${
            isLight
              ? 'bg-white border-slate-200 shadow-md text-slate-800'
              : 'bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl'
          }`}
        >
          {/* Active Node Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border"
                  style={{
                    backgroundColor: DOMAIN_CLUSTER_META[activeNode.cluster].bgColor,
                    borderColor: DOMAIN_CLUSTER_META[activeNode.cluster].borderColor,
                    color: isLight
                      ? DOMAIN_CLUSTER_META[activeNode.cluster].lightColor
                      : DOMAIN_CLUSTER_META[activeNode.cluster].color,
                  }}
                >
                  {isKo ? activeNode.badgeKo : activeNode.badgeEn}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  {activeNode.id}
                </span>
              </div>

              {/* Jump to Parent Tab Button */}
              <button
                onClick={() => handleJumpToSourceModule(activeNode.cluster)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
                title={isKo ? '원문 탐색기 탭으로 이동' : 'Open Explorer Tab'}
              >
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px]">{isKo ? '원문 보기' : 'Explorer'}</span>
              </button>
            </div>

            <h3 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isKo ? activeNode.labelKo : activeNode.labelEn}
            </h3>

            <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>{isKo ? '출처' : 'Source'}:</span>
              <strong className={isLight ? 'text-slate-700' : 'text-zinc-200'}>
                {isKo ? activeNode.sourceModuleKo : activeNode.sourceModuleEn}
              </strong>
            </div>

            {/* Summary Box */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-300'
              }`}
            >
              {isKo ? activeNode.summaryKo : activeNode.summaryEn}
            </div>
          </div>

          {/* Key Principles Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isKo ? '핵심 공학 원리 & 아키텍처 역할' : 'Key Engineering Principles'}</span>
            </h4>
            <div className="space-y-1.5">
              {(isKo ? activeNode.keyPrinciplesKo : activeNode.keyPrinciplesEn).map((principle, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs leading-snug flex items-start gap-2 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Relational Bridges (Incoming & Outgoing Edges) */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-amber-500" />
              <span>{isKo ? '상호작용 연계 엣지 (Relational Bridges)' : 'Interconnected Edges'}</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeNodeOutgoing.map((edge) => {
                const targetNode = CONCEPT_NODES.find((n) => n.id === edge.target);
                return (
                  <div
                    key={edge.id}
                    onClick={() => setSelectedNodeId(edge.target)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                      isLight
                        ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/70'
                        : 'bg-zinc-950 border-zinc-800 hover:border-amber-600/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <span>→ {isKo ? edge.relationKo : edge.relationEn}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">{edge.type}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1">
                      <span>{isKo ? '대상' : 'Target'}:</span>
                      <span className="underline decoration-amber-500">
                        {isKo ? targetNode?.labelKo : targetNode?.labelEn}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 leading-tight">
                      {isKo ? edge.descriptionKo : edge.descriptionEn}
                    </p>
                  </div>
                );
              })}

              {activeNodeIncoming.map((edge) => {
                const srcNode = CONCEPT_NODES.find((n) => n.id === edge.source);
                return (
                  <div
                    key={edge.id}
                    onClick={() => setSelectedNodeId(edge.source)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                      isLight
                        ? 'bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100/70'
                        : 'bg-zinc-950 border-zinc-800 hover:border-indigo-600/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                      <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>← {isKo ? edge.relationKo : edge.relationEn}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">{edge.type}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1">
                      <span>{isKo ? '유입처' : 'Source'}:</span>
                      <span className="underline decoration-indigo-500">
                        {isKo ? srcNode?.labelKo : srcNode?.labelEn}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 leading-tight">
                      {isKo ? edge.descriptionKo : edge.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags Footer */}
          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap gap-1">
            {activeNode.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
