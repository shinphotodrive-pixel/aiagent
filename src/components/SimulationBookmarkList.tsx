import React, { useState, useMemo } from 'react';
import { Language, SimulationBookmark, SimulationResult } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Edit3,
  Play,
  Clock,
  Coins,
  AlertTriangle,
  CheckCircle2,
  Database,
  Bot,
  Cpu,
  Layers,
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  X,
  FileJson,
  Tag,
  Wrench,
  Code
} from 'lucide-react';

interface Props {
  language: Language;
  bookmarks: SimulationBookmark[];
  onLoadBookmark: (bookmark: SimulationBookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onUpdateBookmark: (id: string, updates: Partial<SimulationBookmark>) => void;
  onResetDefaultBookmarks: () => void;
  onSwitchToSimulator: () => void;
  hasCurrentResult: boolean;
  onOpenSaveCurrentModal: () => void;
}

export const SimulationBookmarkList: React.FC<Props> = ({
  language,
  bookmarks,
  onLoadBookmark,
  onDeleteBookmark,
  onUpdateBookmark,
  onResetDefaultBookmarks,
  onSwitchToSimulator,
  hasCurrentResult,
  onOpenSaveCurrentModal
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [previewBookmark, setPreviewBookmark] = useState<SimulationBookmark | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => {
      b.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [bookmarks]);

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((b) => {
        const matchesQuery =
          searchQuery.trim() === '' ||
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.titleKo && b.titleKo.toLowerCase().includes(searchQuery.toLowerCase())) ||
          b.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.notes && b.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesTag = selectedTag === 'all' || (b.tags && b.tags.includes(selectedTag));

        return matchesQuery && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [bookmarks, searchQuery, selectedTag, sortBy]);

  // Overall benchmark telemetry metrics
  const telemetryStats = useMemo(() => {
    if (bookmarks.length === 0) return null;
    let totalLlmLatency = 0;
    let totalRagLatency = 0;
    let totalAgenticLatency = 0;
    let totalAgenticCost = 0;

    bookmarks.forEach((b) => {
      totalLlmLatency += b.result.llm?.latencyMs || 0;
      totalRagLatency += b.result.rag?.latencyMs || 0;
      totalAgenticLatency += b.result.agentic?.latencyMs || 0;
      totalAgenticCost += b.result.agentic?.costCents || 0;
    });

    const count = bookmarks.length;
    return {
      count,
      avgLlmLatency: Math.round(totalLlmLatency / count),
      avgRagLatency: Math.round(totalRagLatency / count),
      avgAgenticLatency: Math.round(totalAgenticLatency / count),
      avgAgenticCost: (totalAgenticCost / count).toFixed(2),
    };
  }, [bookmarks]);

  const startEdit = (b: SimulationBookmark) => {
    setEditingId(b.id);
    setEditTitle(isKo && b.titleKo ? b.titleKo : b.title);
    setEditNotes(b.notes || '');
  };

  const saveEdit = (id: string) => {
    onUpdateBookmark(id, {
      title: editTitle,
      titleKo: isKo ? editTitle : undefined,
      notes: editNotes
    });
    setEditingId(null);
    showToast(isKo ? '북마크가 수정되었습니다.' : 'Bookmark updated.');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ai_simulation_bookmarks_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(isKo ? '북마크 JSON 파일이 다운로드되었습니다.' : 'Bookmarks JSON exported.');
    } catch {
      showToast(isKo ? '내보내기 실패' : 'Export failed');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-zinc-950 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 fill-zinc-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-zinc-900/90 border-zinc-800 shadow-2xl backdrop-blur'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bookmark className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {isKo ? '저장된 시뮬레이션 북마크 목록' : 'Saved Simulation States & Bookmarks'}
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {bookmarks.length}
                  </span>
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {isKo
                    ? '저장해 둔 시뮬레이션 실행 기록과 3-Way 메트릭을 열람하고, 언제든 라이브 샌드박스로 즉시 복원할 수 있습니다.'
                    : 'Inspect saved comparative traces, analyze latency & cost metrics, and restore any state to the live sandbox.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {hasCurrentResult && (
              <button
                onClick={onOpenSaveCurrentModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{isKo ? '현재 실행결과 북마크 추가' : 'Bookmark Current State'}</span>
              </button>
            )}

            <button
              onClick={handleExportJson}
              disabled={bookmarks.length === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title={isKo ? '북마크 데이터 JSON 내보내기' : 'Export bookmarks to JSON'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isKo ? 'JSON 내보내기' : 'Export JSON'}</span>
            </button>

            <button
              onClick={onResetDefaultBookmarks}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border-zinc-700'
              }`}
              title={isKo ? '기본 추천 북마크 복원' : 'Reset to default preset bookmarks'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isKo ? '프리셋 복원' : 'Reset Demo'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry KPI Strip */}
        {telemetryStats && (
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl border mb-4 ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-black/50 border-zinc-800/80 text-zinc-200'
          }`}>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                {isKo ? '저장된 북마크 수' : 'Saved Bookmarks'}
              </span>
              <span className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {telemetryStats.count} <span className="text-xs font-normal text-zinc-500">{isKo ? '건' : 'items'}</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {isKo ? 'LLM 평균 지연시간' : 'LLM Avg Latency'}
              </span>
              <span className="text-base font-bold font-mono text-blue-400 mt-0.5">
                {telemetryStats.avgLlmLatency}ms
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Database className="w-3 h-3" />
                {isKo ? 'RAG 평균 지연시간' : 'RAG Avg Latency'}
              </span>
              <span className="text-base font-bold font-mono text-sky-400 mt-0.5">
                {telemetryStats.avgRagLatency}ms
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-purple-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Bot className="w-3 h-3" />
                {isKo ? 'Agentic 평균 지연시간' : 'Agentic Avg Latency'}
              </span>
              <span className="text-base font-bold font-mono text-purple-400 mt-0.5">
                {telemetryStats.avgAgenticLatency}ms
              </span>
            </div>
          </div>
        )}

        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKo ? '북마크 제목, 프롬프트, 메모 검색...' : 'Search bookmarks by title, prompt, note...'}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-black/60 border-zinc-800 text-zinc-100 placeholder-zinc-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTag('all')}
              className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTag === 'all'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : isLight
                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {isKo ? '전체 태그' : 'All Tags'}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : isLight
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-500">{isKo ? '정렬:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300'
              }`}
            >
              <option value="newest">{isKo ? '최신순' : 'Newest'}</option>
              <option value="oldest">{isKo ? '오래된순' : 'Oldest'}</option>
              <option value="title">{isKo ? '제목 가나다순' : 'Title A-Z'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookmarks List Cards View */}
      {filteredBookmarks.length === 0 ? (
        <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-500'
            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1">
            <Bookmark className="w-6 h-6 stroke-1" />
          </div>
          <h3 className={`text-base font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
            {isKo ? '일치하는 북마크가 없습니다' : 'No Bookmarks Found'}
          </h3>
          <p className="text-xs max-w-md">
            {searchQuery || selectedTag !== 'all'
              ? (isKo ? '검색어 또는 선택한 태그 필터를 변경해 보세요.' : 'Try adjusting your search query or tag filter.')
              : (isKo ? '시뮬레이터를 실행한 후 상단의 [북마크 저장] 버튼을 누르면 상태가 영구 보관됩니다.' : 'Run a simulation and click "Save Bookmark" to preserve interesting traces for future study.')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {onResetDefaultBookmarks && (
              <button
                onClick={onResetDefaultBookmarks}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
              >
                {isKo ? '기본 추천 북마크 다시 불러오기' : 'Load Default Bookmarks'}
              </button>
            )}
            <button
              onClick={onSwitchToSimulator}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 transition cursor-pointer hover:brightness-110"
            >
              {isKo ? '시뮬레이터로 이동하여 실행' : 'Go to Live Simulator'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookmarks.map((bookmark) => {
            const isEditing = editingId === bookmark.id;
            const displayTitle = isKo && bookmark.titleKo ? bookmark.titleKo : bookmark.title;

            return (
              <div
                key={bookmark.id}
                className={`p-5 rounded-2xl border transition-all hover:shadow-xl relative overflow-hidden group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm'
                    : 'bg-zinc-900/90 border-zinc-800/90 hover:border-amber-500/40 shadow-xl backdrop-blur'
                }`}
              >
                {/* Accent top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 opacity-80" />

                <div className="flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-sm font-bold px-2 py-1 rounded bg-black/60 border border-amber-500/60 text-white w-full max-w-md focus:outline-none"
                            placeholder="북마크 제목"
                          />
                          <button
                            onClick={() => saveEdit(bookmark.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-base font-bold flex items-center gap-2 ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                            <span>{displayTitle}</span>
                          </h3>
                          <button
                            onClick={() => startEdit(bookmark)}
                            className="p-1 text-zinc-500 hover:text-amber-400 transition cursor-pointer"
                            title={isKo ? '제목 및 메모 수정' : 'Edit bookmark'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Meta badges: Date, Preset Category, Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(bookmark.createdAt)}
                        </span>

                        {bookmark.scenarioTitle && (
                          <span className={`px-2 py-0.5 rounded-md font-medium border ${
                            isLight
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                          }`}>
                            {isKo && bookmark.scenarioTitleKo ? bookmark.scenarioTitleKo : bookmark.scenarioTitle}
                          </span>
                        )}

                        {bookmark.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md font-medium bg-amber-500/10 text-amber-400/90 border border-amber-500/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Card Top Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onLoadBookmark(bookmark)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-md shadow-amber-500/10 transition cursor-pointer active:scale-95"
                        title={isKo ? '현재 시뮬레이터에 이 상태를 즉시 복원합니다' : 'Load this state into the live simulator'}
                      >
                        <Play className="w-3.5 h-3.5 fill-zinc-950" />
                        <span>{isKo ? '시뮬레이터로 복원' : 'Load State'}</span>
                      </button>

                      <button
                        onClick={() => setPreviewBookmark(bookmark)}
                        className={`p-1.5 rounded-xl border transition cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        }`}
                        title={isKo ? '3-Way 실행 트레이스 상세 미리보기' : 'Quick Preview Traces'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(isKo ? '이 북마크를 삭제하시겠습니까?' : 'Delete this bookmark?')) {
                            onDeleteBookmark(bookmark.id);
                            showToast(isKo ? '북마크가 삭제되었습니다.' : 'Bookmark deleted.');
                          }
                        }}
                        className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 border border-transparent hover:border-rose-900/40 hover:bg-rose-950/20 transition cursor-pointer"
                        title={isKo ? '북마크 삭제' : 'Delete bookmark'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className={`p-3 rounded-xl border text-xs font-mono leading-relaxed relative ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-black/50 border-zinc-800/80 text-zinc-300'
                  }`}>
                    <span className="text-[10px] font-sans font-semibold text-zinc-500 uppercase block mb-0.5">
                      {isKo ? '입력 프롬프트 (Prompt):' : 'Input Prompt:'}
                    </span>
                    <span className="text-zinc-200 font-medium">"{bookmark.prompt}"</span>
                  </div>

                  {/* Summary Takeaway */}
                  {bookmark.result?.summary && (
                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isLight
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-amber-950/20 border-amber-800/30 text-amber-200/90'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold mr-1.5">
                          {isKo ? '아키텍처 핵심 요약:' : 'Architecture Insight:'}
                        </span>
                        {bookmark.result.summary}
                      </div>
                    </div>
                  )}

                  {/* Notes / Annotation */}
                  {isEditing ? (
                    <div className="mt-1">
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        {isKo ? '학습 메모 / 분석 관찰:' : 'Study Notes:'}
                      </label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-amber-500/60"
                        placeholder={isKo ? '이 시뮬레이션에서 주목할 점을 적어두세요...' : 'Add notes about this simulation...'}
                      />
                    </div>
                  ) : bookmark.notes ? (
                    <div className={`px-3 py-2 rounded-lg text-xs italic border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    }`}>
                      <span className="font-semibold not-italic mr-1 text-zinc-400">
                        {isKo ? '📝 메모:' : '📝 Note:'}
                      </span>
                      {bookmark.notes}
                    </div>
                  ) : null}

                  {/* 3-Way Comparative Telemetry Mini-Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/60">
                    {/* Pure LLM Mini Badge */}
                    <div className={`p-2.5 rounded-xl border text-[11px] flex flex-col justify-between ${
                      isLight
                        ? 'bg-blue-50/50 border-blue-200'
                        : 'bg-blue-950/20 border-blue-900/30'
                    }`}>
                      <div className="flex items-center justify-between font-semibold text-blue-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          Pure LLM
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {bookmark.result.llm?.tokens || 0} tok
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>{isKo ? '지연시간' : 'Latency'}: <strong className="text-emerald-400 font-mono">{bookmark.result.llm?.latencyMs}ms</strong></span>
                        <span>{isKo ? '비용' : 'Cost'}: <strong className="text-zinc-300 font-mono">${bookmark.result.llm?.costCents}¢</strong></span>
                      </div>
                      <div className="text-[10px] text-amber-400/90 mt-1 truncate">
                        ⚠ {isKo ? '환각 위험' : 'Risk'}: {bookmark.result.llm?.hallucinationRisk}
                      </div>
                    </div>

                    {/* RAG Mini Badge */}
                    <div className={`p-2.5 rounded-xl border text-[11px] flex flex-col justify-between ${
                      isLight
                        ? 'bg-sky-50/50 border-sky-200'
                        : 'bg-sky-950/20 border-sky-900/30'
                    }`}>
                      <div className="flex items-center justify-between font-semibold text-sky-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          RAG
                        </span>
                        <span className="text-[10px] text-sky-400 font-mono">
                          {bookmark.result.rag?.retrievedChunks?.length || 0} Docs
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>{isKo ? '지연시간' : 'Latency'}: <strong className="text-sky-400 font-mono">{bookmark.result.rag?.latencyMs}ms</strong></span>
                        <span>{isKo ? '비용' : 'Cost'}: <strong className="text-zinc-300 font-mono">${bookmark.result.rag?.costCents}¢</strong></span>
                      </div>
                      <div className="text-[10px] text-sky-400/90 mt-1 truncate">
                        🛡 {isKo ? '환각 위험' : 'Risk'}: {bookmark.result.rag?.hallucinationRisk}
                      </div>
                    </div>

                    {/* Agentic Mini Badge */}
                    <div className={`p-2.5 rounded-xl border text-[11px] flex flex-col justify-between ${
                      isLight
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-purple-950/20 border-purple-900/30'
                    }`}>
                      <div className="flex items-center justify-between font-semibold text-purple-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          Agentic AI
                        </span>
                        <span className="text-[10px] text-pink-400 font-mono truncate max-w-[100px]">
                          {bookmark.result.agentic?.toolExecuted?.name || 'ReAct'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>{isKo ? '지연시간' : 'Latency'}: <strong className="text-purple-400 font-mono">{bookmark.result.agentic?.latencyMs}ms</strong></span>
                        <span>{isKo ? '비용' : 'Cost'}: <strong className="text-amber-300 font-mono">${bookmark.result.agentic?.costCents}¢</strong></span>
                      </div>
                      <div className="text-[10px] text-emerald-400/90 mt-1 truncate">
                        ⚡ {bookmark.result.agentic?.toolExecuted?.result ? '액션 완수 (Mutated)' : '계획 완수'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Trace Preview Modal */}
      {previewBookmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl flex flex-col gap-5 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-lg font-bold">
                  {isKo && previewBookmark.titleKo ? previewBookmark.titleKo : previewBookmark.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewBookmark(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt preview */}
            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300">
              <span className="text-zinc-500 block mb-0.5">{isKo ? '프롬프트:' : 'Prompt:'}</span>
              {previewBookmark.prompt}
            </div>

            {/* 3-Column Detailed Traces Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LLM */}
              <div className="p-4 rounded-xl border border-blue-900/40 bg-zinc-950/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                    <Cpu className="w-4 h-4" />
                    Pure LLM
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-3 space-y-1">
                    <div>{isKo ? '지연시간' : 'Latency'}: <strong className="text-emerald-400">{previewBookmark.result.llm.latencyMs}ms</strong></div>
                    <div>{isKo ? '환각 위험' : 'Hallucination'}: <strong className="text-amber-400">{previewBookmark.result.llm.hallucinationRisk}</strong></div>
                  </div>
                  <div className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-zinc-900 leading-relaxed max-h-48 overflow-y-auto">
                    {previewBookmark.result.llm.answer}
                  </div>
                </div>
              </div>

              {/* RAG */}
              <div className="p-4 rounded-xl border border-sky-900/40 bg-zinc-950/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
                    <Database className="w-4 h-4" />
                    RAG
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-3 space-y-1">
                    <div>{isKo ? '지연시간' : 'Latency'}: <strong className="text-sky-400">{previewBookmark.result.rag.latencyMs}ms</strong></div>
                    <div>{isKo ? '인용 문서' : 'Sources'}: <strong>{previewBookmark.result.rag.retrievedChunks?.length || 0} Chunks</strong></div>
                  </div>
                  <div className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-zinc-900 leading-relaxed max-h-48 overflow-y-auto">
                    {previewBookmark.result.rag.answer}
                  </div>
                </div>
              </div>

              {/* Agentic */}
              <div className="p-4 rounded-xl border border-purple-900/40 bg-zinc-950/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
                    <Bot className="w-4 h-4" />
                    Agentic AI
                  </div>
                  <div className="text-[11px] text-zinc-400 mb-3 space-y-1">
                    <div>{isKo ? '지연시간' : 'Latency'}: <strong className="text-purple-400">{previewBookmark.result.agentic.latencyMs}ms</strong></div>
                    <div>{isKo ? '실행 도구' : 'Tool'}: <strong className="text-pink-400 font-mono">{previewBookmark.result.agentic.toolExecuted?.name}</strong></div>
                  </div>
                  <div className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-zinc-900 leading-relaxed max-h-48 overflow-y-auto">
                    {previewBookmark.result.agentic.answer}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setPreviewBookmark(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                {isKo ? '닫기' : 'Close'}
              </button>
              <button
                onClick={() => {
                  onLoadBookmark(previewBookmark);
                  setPreviewBookmark(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 transition cursor-pointer"
              >
                {isKo ? '시뮬레이터로 복원 및 상세 분석' : 'Restore into Simulator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
