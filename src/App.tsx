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
import { NodeDetailModal } from './components/NodeDetailModal';
import { Check } from 'lucide-react';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  return (
    <ProgressProvider>
      <MainApp />
    </ProgressProvider>
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

  const handleNodeClick = (node: ArchitectureNode) => {
    setSelectedNode(node);
  };

  const handleHighlightNode = (nodeId: string | null) => {
    setHighlightedNodeId(nodeId);
  };

  const handleSearchSelectNode = (node: ArchitectureNode) => {
    setActiveTab('canvas');
    setSelectedParadigm(node.paradigm === 'shared' ? 'all' : node.paradigm);
    setHighlightedNodeId(node.id);
    setSelectedNode(node);
    showToast(
      language === 'ko'
        ? `"${node.nameKo}" 노드로 이동했습니다.`
        : `Navigated to "${node.name}" node.`
    );
  };

  const isKo = language === 'ko';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
              onSelectParadigm={setSelectedParadigm}
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
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 py-6 px-4 text-center text-xs text-zinc-500 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {isKo 
              ? '차세대 인공지능 아키텍처: 하네스 엔지니어링 · OAG · 52개 핵심 AI 용어 대시보드'
              : 'Next-Gen AI Architecture: Harness Engineering · OAG · 52 Core AI Terms Dashboard'}
          </p>
          <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
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
