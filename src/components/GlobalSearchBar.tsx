import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArchitectureNode, Language } from '../types';
import { ARCHITECTURE_NODES } from '../data/architectureData';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Layers } from 'lucide-react';

interface Props {
  language: Language;
  onSelectNode: (node: ArchitectureNode) => void;
}

export const GlobalSearchBar: React.FC<Props> = ({ language, onSelectNode }) => {
  const isKo = language === 'ko';
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allNodes = useMemo(() => Object.values(ARCHITECTURE_NODES), []);

  // Filtered nodes
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Recommend key architectural nodes when search is empty
      return [
        ARCHITECTURE_NODES['reasoning-3'],
        ARCHITECTURE_NODES['memory-3'],
        ARCHITECTURE_NODES['tools-3'],
        ARCHITECTURE_NODES['action-3'],
        ARCHITECTURE_NODES['context-2'],
        ARCHITECTURE_NODES['llm-1'],
      ].filter(Boolean);
    }

    return allNodes.filter((node) => {
      const matchName = node.name.toLowerCase().includes(q) || node.nameKo.toLowerCase().includes(q);
      const matchSummary = node.summary.toLowerCase().includes(q) || node.summaryKo.toLowerCase().includes(q);
      const matchDesc = node.details.description.toLowerCase().includes(q) || node.details.descriptionKo.toLowerCase().includes(q);
      const matchTech = node.details.techStack.some(t => t.toLowerCase().includes(q));
      const matchParadigm = node.paradigm.toLowerCase().includes(q);

      return matchName || matchSummary || matchDesc || matchTech || matchParadigm;
    });
  }, [query, allNodes]);

  // Handle global shortcut (Cmd+K or Ctrl+K or /)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // If typing inside an input or textarea not this one, don't hijack unless Cmd+K
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        selectNode(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectNode = (node: ArchitectureNode) => {
    onSelectNode(node);
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const getParadigmBadge = (paradigm: 'llm' | 'rag' | 'agentic' | 'shared') => {
    switch (paradigm) {
      case 'llm':
        return { label: 'L.L.M (ChatGPT)', color: 'bg-blue-950 text-blue-300 border-blue-800' };
      case 'rag':
        return { label: 'R.A.G (Perplexity)', color: 'bg-sky-950 text-sky-300 border-sky-800' };
      case 'agentic':
        return { label: 'Agentic AI (Operator)', color: 'bg-purple-950 text-purple-300 border-purple-800' };
      default:
        return { label: 'Shared', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isKo
              ? '아키텍처 노드 검색 (예: Prompt, Memory, Tool, Action...)'
              : 'Search canvas nodes (Prompt, Memory, Tools...)'
          }
          className="w-full pl-8 pr-14 py-1.5 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition shadow-inner font-sans"
        />

        {/* Clear or Keyboard Shortcut badge */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded cursor-pointer"
              title="Clear"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Floating Results Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-auto sm:w-[390px] top-full mt-2 bg-zinc-950/98 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Indicator */}
          <div className="px-3.5 py-2 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {query ? (
                <span>
                  {isKo ? '검색 결과' : 'Search Results'} ({results.length})
                </span>
              ) : (
                <span>{isKo ? '주요 아키텍처 노드 바로가기' : 'Featured Architecture Nodes'}</span>
              )}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <span>↑↓ {isKo ? '이동' : 'Navigate'}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <CornerDownLeft className="w-2.5 h-2.5" /> {isKo ? '선택' : 'Select'}
              </span>
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[340px] overflow-y-auto p-1.5 divide-y divide-zinc-900 scrollbar-thin">
            {results.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-zinc-500">
                {isKo ? (
                  <>
                    <p className="text-zinc-400 font-medium mb-1">일치하는 노드가 없습니다</p>
                    <p className="text-[11px]">Prompt, LLM, Memory, Search, Tools 등으로 검색해보세요.</p>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-400 font-medium mb-1">No matching architecture nodes</p>
                    <p className="text-[11px]">Try searching Prompt, LLM, Memory, Tools, or Action.</p>
                  </>
                )}
              </div>
            ) : (
              results.map((node, index) => {
                const isSelected = index === selectedIndex;
                const badge = getParadigmBadge(node.paradigm);

                return (
                  <div
                    key={node.id}
                    onClick={() => selectNode(node)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                        : 'hover:bg-zinc-900/80 text-zinc-300'
                    }`}
                  >
                    {/* Node Dot / Category Indicator */}
                    <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-amber-400">
                      {node.name.slice(0, 1)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-semibold text-xs text-zinc-100 truncate">
                            {isKo ? node.nameKo : node.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {isKo ? node.name : node.nameKo}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-medium shrink-0 uppercase ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-1 leading-normal">
                        {isKo ? node.summaryKo : node.summary}
                      </p>

                      {/* Tech stack tags */}
                      {node.details.techStack.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-zinc-500 overflow-hidden">
                          <Layers className="w-2.5 h-2.5 shrink-0 text-zinc-600" />
                          <span className="truncate">
                            {node.details.techStack.slice(0, 3).join(' · ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                        isSelected ? 'text-blue-400 translate-x-0.5' : 'text-zinc-600'
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-1.5 bg-zinc-900/70 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>{isKo ? '선택 시 캔버스로 이동하여 하이라이트됩니다' : 'Jumps to and highlights node on canvas'}</span>
            <kbd className="font-mono text-[9px] bg-zinc-800 px-1 py-0.5 rounded">ESC to close</kbd>
          </div>
        </div>
      )}
    </div>
  );
};
