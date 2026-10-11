import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchitectureNode, Language } from '../types';
import { ArrowRight, MousePointerClick, Sparkles, Layers, Cpu } from 'lucide-react';

export interface TooltipProps {
  node: ArchitectureNode;
  language?: Language;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  position?: 'top' | 'bottom' | 'auto';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  node,
  language = 'ko',
  children,
  position = 'auto',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isKo = language === 'ko';

  // Determine vertical placement: if node is near top of canvas (<= 180), place below; otherwise above
  const isNearTop = position === 'bottom' || (position === 'auto' && node.y <= 180);

  // Offset calculations based on node height/shape
  let yOffset = isNearTop ? 45 : -40;
  if (node.category === 'reasoning') {
    // reasoning node is vertical (height 160px)
    yOffset = isNearTop ? 95 : -95;
  } else if (node.category === 'user') {
    yOffset = isNearTop ? 45 : -45;
  }

  // Horizontal clamping to keep tooltip neatly inside canvas bounds (1150px)
  let horizontalAlignment = '-50%';
  let leftPos = node.x;

  if (node.x <= 200) {
    horizontalAlignment = '-20%';
  } else if (node.x >= 950) {
    horizontalAlignment = '-82%';
  }

  const paradigmBadge = {
    llm: { label: 'L.L.M', color: 'bg-blue-900/70 text-blue-300 border-blue-500/50' },
    rag: { label: 'R.A.G', color: 'bg-sky-900/70 text-sky-300 border-sky-500/50' },
    agentic: { label: 'Agentic AI', color: 'bg-purple-900/70 text-purple-300 border-purple-500/50' },
    shared: { label: 'Shared', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
  }[node.paradigm];

  const categoryLabels: Record<string, { en: string; ko: string }> = {
    user: { en: 'User Interface', ko: '사용자 인터페이스' },
    prompt: { en: 'Input & Prompt', ko: '입력 및 프롬프트' },
    llm: { en: 'Inference Engine', ko: '추론 엔진' },
    answer: { en: 'Final Output', ko: '최종 응답' },
    search: { en: 'Retriever', ko: '검색 및 리트리버' },
    context: { en: 'Knowledge Store', ko: '컨텍스트 저장소' },
    memory: { en: 'State & Memory', ko: '세션 및 메모리' },
    reasoning: { en: 'Planning & CoT', ko: '계획 및 연쇄 추론' },
    tools: { en: 'Tool Calling / APIs', ko: '도구 및 외부 API' },
    action: { en: 'Environment Act', ko: '환경 조작 및 액션' },
  };

  const categoryInfo = categoryLabels[node.category] || { en: 'Component', ko: '컴포넌트' };

  // Clone child to transparently attach hover handlers without extra wrapper DOM
  const trigger = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled) setIsHovered(true);
      if (children.props && typeof children.props.onMouseEnter === 'function') {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (!disabled) setIsHovered(false);
      if (children.props && typeof children.props.onMouseLeave === 'function') {
        children.props.onMouseLeave(e);
      }
    },
  });

  return (
    <>
      {trigger}

      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            key={`tooltip-${node.id}`}
            initial={{ opacity: 0, scale: 0.93, y: isNearTop ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 440, damping: 28 }}
            className="absolute pointer-events-none z-50 no-export"
            style={{
              left: `${leftPos}px`,
              top: `${node.y + yOffset}px`,
              transform: isNearTop
                ? `translate(${horizontalAlignment}, 10px)`
                : `translate(${horizontalAlignment}, -105%)`,
            }}
          >
            <div className="w-[290px] sm:w-[320px] bg-zinc-950/95 border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md text-zinc-200 ring-1 ring-white/10">
              {/* Header: Node Title, Category, and Paradigm Badge */}
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                  <div className="truncate">
                    <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                      {isKo ? node.nameKo : node.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {isKo ? categoryInfo.ko : categoryInfo.en}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${paradigmBadge.color}`}
                >
                  {paradigmBadge.label}
                </span>
              </div>

              {/* Function Definition / Summary based on system metadata */}
              <div className="mb-2.5">
                <p className="text-[11.5px] leading-relaxed text-zinc-300 font-medium">
                  {isKo ? node.summaryKo : node.summary}
                </p>
              </div>

              {/* Tech Stack Preview if available */}
              {node.details?.techStack && node.details.techStack.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {node.details.techStack.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                  {node.details.techStack.length > 3 && (
                    <span className="text-[9px] text-zinc-500">
                      +{node.details.techStack.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Input & Output contract */}
              {node.details && (
                <div className="bg-black/60 rounded-lg p-2 border border-zinc-800/70 mb-2.5 text-[10px] text-zinc-400 font-mono flex items-center justify-between gap-1.5">
                  <div className="truncate max-w-[46%]">
                    <span className="text-zinc-500 block text-[9px] font-sans">
                      {isKo ? '입력 (Input)' : 'Input'}
                    </span>
                    <span className="text-zinc-300 truncate block">
                      {isKo ? node.details.inputKo : node.details.input}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <div className="truncate max-w-[46%] text-right">
                    <span className="text-amber-500/80 block text-[9px] font-sans">
                      {isKo ? '출력 (Output)' : 'Output'}
                    </span>
                    <span className="text-amber-300 truncate block">
                      {isKo ? node.details.outputKo : node.details.output}
                    </span>
                  </div>
                </div>
              )}

              {/* Click hint footer */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-900/90">
                <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                  <MousePointerClick className="w-3 h-3" />
                  {isKo ? '클릭 시 상세 코드 & 아키텍처 보기' : 'Click to inspect code & architecture'}
                </span>
                <span className="text-[9px] text-zinc-500">ESC / Tab</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
