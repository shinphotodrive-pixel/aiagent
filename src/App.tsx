import React, { useState } from 'react';
import { ActiveTab, ArchitectureNode, Language, Paradigm } from './types';
import { Header } from './components/Header';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { ExecutionSimulator } from './components/ExecutionSimulator';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { NodeDetailModal } from './components/NodeDetailModal';
import { ARCHITECTURE_NODES } from './data/architectureData';
import { Check, Info, Sparkles } from 'lucide-react';

export default function App() {
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
    if (nodeId && ARCHITECTURE_NODES[nodeId]) {
      // also keep in context
    }
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
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {isKo 
              ? 'AI 시스템 아키텍처 비교: LLM · RAG · Agentic AI'
              : 'AI System Architecture Comparison: LLM · RAG · Agentic AI'}
          </p>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span>ChatGPT (Base)</span>
            <span>·</span>
            <span>Perplexity</span>
            <span>·</span>
            <span>Goover / Operator</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
