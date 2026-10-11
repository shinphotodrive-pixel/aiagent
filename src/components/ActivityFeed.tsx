import React, { useState } from 'react';
import { Language, ActiveTab, Paradigm } from '../types';
import { useProgress, ActivityLogItem } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import {
  History,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Clock,
  Compass,
  ArrowRight,
  ExternalLink,
  Trash2,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigateTab?: (tab: ActiveTab) => void;
  onSelectNodeId?: (nodeId: string) => void;
}

export const ActivityFeed: React.FC<Props> = ({
  language,
  onNavigateTab,
  onSelectNodeId,
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const { activities, clearActivities, overallStats } = useProgress();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'modules' | 'navigation'>('all');

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'modules') {
      return act.type === 'complete_module' || act.type === 'uncomplete_module';
    }
    if (filterType === 'navigation') {
      return act.type === 'navigate_tab' || act.type === 'select_node' || act.type === 'change_paradigm';
    }
    return true;
  });

  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 45) return isKo ? '방금 전' : 'just now';
    if (diffMin < 60) return isKo ? `${diffMin}분 전` : `${diffMin}m ago`;
    if (diffHour < 24) return isKo ? `${diffHour}시간 전` : `${diffHour}h ago`;
    return new Date(timestamp).toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'complete_module':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'uncomplete_module':
        return <RotateCcw className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'navigate_tab':
        return <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'select_node':
        return <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'change_paradigm':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'simulate':
        return <Play className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-30 font-sans select-none">
      {/* Minimized Pill Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-md transition-all cursor-pointer border hover:scale-105 active:scale-95 ${
            isLight
              ? 'bg-white/95 text-slate-800 border-slate-300 shadow-slate-900/10 hover:border-slate-400'
              : 'bg-zinc-900/95 text-zinc-200 border-zinc-700/80 shadow-black/40 hover:border-zinc-500'
          }`}
          title={isKo ? '활동 피드 열기 (네비게이션 & 학습 기록)' : 'Open Activity Feed (Navigation & Progress)'}
          aria-label="Open Activity Feed"
        >
          <div className="relative">
            <History className="w-4 h-4 text-amber-500" />
            {activities.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <span className="font-medium">{isKo ? '활동 기록' : 'Activity'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
            {activities.length}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      )}

      {/* Expanded Floating Activity Feed Drawer */}
      {isOpen && (
        <div
          className={`w-[320px] sm:w-[360px] max-h-[460px] flex flex-col rounded-2xl border shadow-2xl backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-3 duration-200 ${
            isLight
              ? 'bg-white/95 border-slate-300 text-slate-800 shadow-slate-900/15'
              : 'bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-black/60'
          }`}
        >
          {/* Header Bar */}
          <div
            className={`flex items-center justify-between px-3.5 py-2.5 border-b shrink-0 ${
              isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold tracking-tight">
                {isKo ? '실시간 탐색 활동 피드' : 'Live Activity Feed'}
              </h4>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {overallStats.percent}% {isKo ? '달성' : 'done'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-200 text-slate-500'
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title={isKo ? '접기' : 'Collapse'}
                aria-label="Close"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-toolbar: Filters + Clear action */}
          <div
            className={`px-3 py-1.5 border-b flex items-center justify-between gap-2 text-[11px] shrink-0 ${
              isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  filterType === 'all'
                    ? isLight
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'bg-zinc-800 text-white font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKo ? '전체' : 'All'}
              </button>
              <button
                onClick={() => setFilterType('modules')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  filterType === 'modules'
                    ? isLight
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'bg-zinc-800 text-white font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKo ? '모듈' : 'Modules'}
              </button>
              <button
                onClick={() => setFilterType('navigation')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  filterType === 'navigation'
                    ? isLight
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'bg-zinc-800 text-white font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isKo ? '네비' : 'Nav'}
              </button>
            </div>

            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className={`flex items-center gap-1 text-[10px] hover:text-rose-500 transition cursor-pointer p-0.5 ${
                  isLight ? 'text-slate-400' : 'text-zinc-500'
                }`}
                title={isKo ? '피드 비우기' : 'Clear feed'}
              >
                <Trash2 className="w-3 h-3" />
                <span>{isKo ? '비우기' : 'Clear'}</span>
              </button>
            )}
          </div>

          {/* Activity Scroll List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs scrollbar-thin">
            {filteredActivities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs space-y-1">
                <Clock className="w-6 h-6 mx-auto opacity-40 mb-1" />
                <p>{isKo ? '기록된 활동 내역이 없습니다.' : 'No recorded activity yet.'}</p>
                <p className="text-[10px] text-slate-400">
                  {isKo ? '탭을 이동하거나 모듈 체크박스를 클릭해 보세요.' : 'Navigate tabs or complete module checkboxes.'}
                </p>
              </div>
            ) : (
              filteredActivities.map((act) => {
                const isNav = act.type === 'navigate_tab';
                const isNode = act.type === 'select_node';
                const isMod = act.type === 'complete_module' || act.type === 'uncomplete_module';

                return (
                  <div
                    key={act.id}
                    className={`p-2.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 group ${
                      isLight
                        ? 'bg-slate-50/80 border-slate-200/90 hover:bg-slate-100/80'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="mt-0.5">{getActionIcon(act.type)}</div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-semibold truncate text-[11px] ${
                          isLight ? 'text-slate-900' : 'text-zinc-200'
                        }`}>
                          {isKo ? act.titleKo : act.titleEn}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {formatTimeAgo(act.timestamp)}
                        </span>
                      </div>

                      {(act.detailKo || act.detailEn) && (
                        <p className={`text-[10px] line-clamp-2 leading-tight ${
                          isLight ? 'text-slate-500' : 'text-zinc-400'
                        }`}>
                          {isKo ? act.detailKo : act.detailEn}
                        </p>
                      )}

                      {/* Interactive Navigation Jump Shortcuts */}
                      {act.metadata?.tab && onNavigateTab && (
                        <div className="pt-1">
                          <button
                            onClick={() => onNavigateTab(act.metadata!.tab as ActiveTab)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <span>{isKo ? '해당 탭으로 이동' : 'Go to tab'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}

                      {act.metadata?.nodeId && onSelectNodeId && (
                        <div className="pt-1">
                          <button
                            onClick={() => onSelectNodeId(act.metadata!.nodeId!)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            <span>{isKo ? '노드 상세 보기' : 'Inspect node'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Status Bar */}
          <div
            className={`px-3 py-2 border-t flex items-center justify-between text-[10px] shrink-0 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400'
            }`}
          >
            <span>
              {isKo ? '진도:' : 'Progress:'} <strong className={isLight ? 'text-slate-800' : 'text-white'}>{overallStats.completed}/{overallStats.total}</strong> {isKo ? '개 완료' : 'mods'}
            </span>
            <span className="font-mono text-amber-500 font-bold">
              {overallStats.percent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
