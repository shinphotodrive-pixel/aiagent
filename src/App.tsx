import React, { useState } from 'react';
import { ActiveTab, ArchitectureNode, Language, Paradigm } from './types';
import { Header } from './components/Header';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { ExecutionSimulator } from './components/ExecutionSimulator';
import { HarnessArchitectureExplorer } from './components/HarnessArchitectureExplorer';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TermsDictionary } from './components/TermsDictionary';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { DefenseAIExplorer } from './components/DefenseAIExplorer';
import { OntologyAIExplorer } from './components/OntologyAIExplorer';
import { KimDaeShikExplorer } from './components/KimDaeShikExplorer';
import { LearningRoadmap } from './components/LearningRoadmap';
import { KnowledgeGraphExplorer } from './components/KnowledgeGraphExplorer';
import { NodeDetailModal } from './components/NodeDetailModal';
import { ActivityFeed } from './components/ActivityFeed';
import { ARCHITECTURE_NODES } from './data/architectureData';
import { Check } from 'lucide-react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <MainApp />
      </ProgressProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [language, setLanguage] = useState<Language>('ko');
  const [selectedParadigm, setSelectedParadigm] = useState<Paradigm>('all');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [flowAnimating, setFlowAnimating] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'ko' ? '링크가 클립보드에 복사되었습니다.' : 'Link copied to clipboard!');
    }
  };

  const { recordActivity } = useProgress();

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    const tabNames: Record<ActiveTab, { ko: string; en: string }> = {
      canvas: { ko: '아키텍처 캔버스', en: 'Architecture Canvas' },
      simulator: { ko: '실행 시뮬레이터', en: 'Execution Simulator' },
      roadmap: { ko: '학습 로드맵', en: 'Learning Roadmap' },
      graph: { ko: '지식 그래프', en: 'Knowledge Graph' },
      defense: { ko: '국방 AI 탐색기', en: 'Defense AI Explorer' },
      ontology: { ko: '온톨로지 AI 탐색기', en: 'Ontology AI Explorer' },
      kimdaeshik: { ko: '김대식 교수 탐색기', en: 'Prof. Kim Explorer' },
      harness: { ko: '하네스 & OAG', en: 'Harness & OAG' },
      analytics: { ko: '시각화 분석', en: 'Analytics Charts' },
      dictionary: { ko: '용어 사전 (52선)', en: 'AI Dictionary (52)' },
      matrix: { ko: '비교 매트릭스', en: 'Comparison Matrix' },
    };
    recordActivity({
      type: 'navigate_tab',
      titleKo: `탭 이동: ${tabNames[tab].ko}`,
      titleEn: `Navigated to ${tabNames[tab].en}`,
      detailKo: `${tabNames[tab].ko} 뷰를 탐색 중입니다.`,
      detailEn: `Currently viewing ${tabNames[tab].en}.`,
      metadata: { tab }
    });
  };

  const handleParadigmChange = (p: Paradigm) => {
    setSelectedParadigm(p);
    const names: Record<Paradigm, { ko: string; en: string }> = {
      all: { ko: '전체 패러다임 (All)', en: 'All Paradigms' },
      llm: { ko: 'Pure LLM', en: 'Pure LLM' },
      rag: { ko: 'RAG Architecture', en: 'RAG Architecture' },
      agentic: { ko: 'Agentic AI', en: 'Agentic AI' },
    };
    recordActivity({
      type: 'change_paradigm',
      titleKo: `패러다임 필터: ${names[p].ko}`,
      titleEn: `Paradigm Filter: ${names[p].en}`,
      detailKo: `${names[p].ko} 흐름을 강조 표시합니다.`,
      detailEn: `Highlighting ${names[p].en} pipeline.`,
      metadata: { paradigm: p }
    });
  };

  const handleNodeClick = (node: ArchitectureNode) => {
    setSelectedNode(node);
    recordActivity({
      type: 'select_node',
      titleKo: `노드 상세 검사: ${node.nameKo}`,
      titleEn: `Inspected Node: ${node.name}`,
      detailKo: `${node.summaryKo.slice(0, 48)}...`,
      detailEn: `${node.summary.slice(0, 48)}...`,
      metadata: { nodeId: node.id }
    });
  };

  const handleHighlightNode = (nodeId: string | null) => {
    setHighlightedNodeId(nodeId);
  };

  const handleSearchSelectNode = (node: ArchitectureNode) => {
    setActiveTab('canvas');
    setSelectedParadigm(node.paradigm === 'shared' ? 'all' : node.paradigm);
    setHighlightedNodeId(node.id);
    setSelectedNode(node);
    recordActivity({
      type: 'select_node',
      titleKo: `검색 노드 탐색: ${node.nameKo}`,
      titleEn: `Search Node: ${node.name}`,
      detailKo: `캔버스 ${node.paradigm.toUpperCase()} 영역으로 포커스 이동`,
      detailEn: `Focused into canvas ${node.paradigm.toUpperCase()} section`,
      metadata: { nodeId: node.id }
    });
    showToast(
      language === 'ko'
        ? `"${node.nameKo}" 노드로 이동했습니다.`
        : `Navigated to "${node.name}" node.`
    );
  };

  const isKo = language === 'ko';
  const { isLight } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight
        ? 'bg-slate-100 text-slate-900 selection:bg-amber-400/40 selection:text-amber-950'
        : 'bg-black text-white selection:bg-amber-500/30 selection:text-amber-200'
    }`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        language={language}
        setLanguage={setLanguage}
        onShare={handleShare}
        onSelectNode={handleSearchSelectNode}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-start py-6 px-2 sm:px-4">
        {activeTab === 'canvas' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            <ArchitectureCanvas
              language={language}
              selectedParadigm={selectedParadigm}
              activeNodeId={highlightedNodeId}
              onSelectNode={handleNodeClick}
              onSelectParadigm={handleParadigmChange}
              flowAnimating={flowAnimating}
              setFlowAnimating={setFlowAnimating}
              onExportSuccess={() =>
                showToast(
                  language === 'ko'
                    ? '고해상도(2.5x) PNG 이미지가 저장되었습니다.'
                    : 'High-resolution (2.5x) PNG exported successfully.'
                )
              }
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="w-full animate-in fade-in duration-300">
            <ExecutionSimulator
              language={language}
              onHighlightNode={handleHighlightNode}
            />
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="w-full animate-in fade-in duration-300">
            <LearningRoadmap
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="w-full animate-in fade-in duration-300">
            <KnowledgeGraphExplorer
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'defense' && (
          <div className="w-full animate-in fade-in duration-300">
            <DefenseAIExplorer language={language} />
          </div>
        )}

        {activeTab === 'ontology' && (
          <div className="w-full animate-in fade-in duration-300">
            <OntologyAIExplorer language={language} />
          </div>
        )}

        {activeTab === 'kimdaeshik' && (
          <div className="w-full animate-in fade-in duration-300">
            <KimDaeShikExplorer language={language} />
          </div>
        )}

        {activeTab === 'harness' && (
          <div className="w-full animate-in fade-in duration-300">
            <HarnessArchitectureExplorer language={language} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="w-full animate-in fade-in duration-300">
            <AnalyticsCharts language={language} />
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="w-full animate-in fade-in duration-300">
            <TermsDictionary language={language} />
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="w-full animate-in fade-in duration-300">
            <ComparisonMatrix language={language} />
          </div>
        )}
      </main>

      {/* Node Details Inspection Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          language={language}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border animate-in slide-in-from-bottom duration-200 ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 shadow-slate-900/10'
            : 'bg-zinc-900 border-zinc-700 text-zinc-100'
        }`}>
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Canvas & Navigation Activity Feed */}
      <ActivityFeed
        language={language}
        onNavigateTab={(tab) => handleTabChange(tab)}
        onSelectNodeId={(nodeId) => {
          const target = ARCHITECTURE_NODES[nodeId];
          if (target) {
            handleSearchSelectNode(target);
          }
        }}
      />

      {/* Footer */}
      <footer className={`w-full border-t py-6 px-4 text-center text-xs mt-auto transition-colors ${
        isLight
          ? 'border-slate-300 bg-white text-slate-600'
          : 'border-zinc-900 text-zinc-500'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {isKo 
              ? '차세대 인공지능 아키텍처: 하네스 엔지니어링 · OAG · 52개 핵심 AI 용어 대시보드'
              : 'Next-Gen AI Architecture: Harness Engineering · OAG · 52 Core AI Terms Dashboard'}
          </p>
          <div className={`flex items-center gap-3 text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            <span>Harness 3-Layer</span>
            <span>·</span>
            <span>AgentFail</span>
            <span>·</span>
            <span>Context-Aware MCP</span>
            <span>·</span>
            <span>OAG & Palantir AIP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
