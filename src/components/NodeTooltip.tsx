import React from 'react';
import { ArchitectureNode, Language } from '../types';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  node: ArchitectureNode | null;
  language: Language;
}

export const NodeTooltip: React.FC<Props> = ({ node, language }) => {
  if (!node) return null;

  const isKo = language === 'ko';
  const isNearTop = node.y <= 180;

  let yOffset = isNearTop ? 45 : -40;
  if (node.category === 'reasoning') {
    yOffset = isNearTop ? 95 : -95;
  } else if (node.category === 'user') {
    yOffset = isNearTop ? 45 : -45;
  }

  let horizontalAlignment = '-50%';
  let leftPos = node.x;

  if (node.x <= 200) {
    horizontalAlignment = '-20%';
  } else if (node.x >= 950) {
    horizontalAlignment = '-82%';
  }

  const paradigmBadge = {
    llm: { label: 'L.L.M', color: 'bg-blue-900/60 text-blue-300 border-blue-500/40' },
    rag: { label: 'R.A.G', color: 'bg-sky-900/60 text-sky-300 border-sky-500/40' },
    agentic: { label: 'Agentic AI', color: 'bg-purple-900/60 text-purple-300 border-purple-500/40' },
    shared: { label: 'Shared', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' }
  }[node.paradigm];

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, scale: 0.94, y: isNearTop ? -6 : 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="absolute pointer-events-none z-50 no-export"
        style={{
          left: `${leftPos}px`,
          top: `${node.y + yOffset}px`,
          transform: isNearTop 
            ? `translate(${horizontalAlignment}, 10px)` 
            : `translate(${horizontalAlignment}, -105%)`,
        }}
      >
        <div className="w-[280px] sm:w-[310px] bg-zinc-950/95 border border-zinc-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-zinc-200">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-zinc-800/80">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <h4 className="font-bold text-white text-xs truncate">
                {isKo ? node.nameKo : node.name}
              </h4>
            </div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${paradigmBadge.color}`}>
              {paradigmBadge.label}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-300 mb-2">
            {isKo ? node.summaryKo : node.summary}
          </p>

          <div className="bg-black/50 rounded-lg p-1.5 border border-zinc-800/60 mb-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
            <span className="text-zinc-500 truncate max-w-[45%]">
              {isKo ? '입력: ' : 'In: '}{isKo ? node.details.inputKo.slice(0, 18) : node.details.input.slice(0, 18)}...
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0 mx-1" />
            <span className="text-amber-400/90 truncate max-w-[45%] text-right">
              {isKo ? '출력: ' : 'Out: '}{isKo ? node.details.outputKo.slice(0, 18) : node.details.output.slice(0, 18)}...
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
            <span className="flex items-center gap-1 text-amber-400/80">
              <MousePointerClick className="w-3 h-3" />
              {isKo ? '클릭 시 상세 코드 & 아키텍처 보기' : 'Click to inspect code & architecture'}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
