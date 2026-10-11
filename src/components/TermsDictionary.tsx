import React, { useState } from 'react';
import { Language, AITerm, TermCategory } from '../types';
import { TERMS_DATA } from '../data/termsData';
import { Search, BookOpen, X, ArrowRight, Play, ExternalLink } from 'lucide-react';

interface Props {
  language: Language;
}

export const TermsDictionary: React.FC<Props> = ({ language }) => {
  const isKo = language === 'ko';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | TermCategory>('ALL');
  const [activeModalTerm, setActiveModalTerm] = useState<AITerm | null>(null);

  const categories: Array<{ id: 'ALL' | TermCategory; labelKo: string; labelEn: string }> = [
    { id: 'ALL', labelKo: '전체보기', labelEn: 'All Terms' },
    { id: 'Architecture', labelKo: '아키텍처 & 워크플로우', labelEn: 'Architecture & Workflow' },
    { id: 'Framework', labelKo: '프레임워크 & 도구', labelEn: 'Framework & Tools' },
    { id: 'LLM', labelKo: '기초 모델 & 제공자', labelEn: 'Foundation Models' },
    { id: 'Security', labelKo: '보안 & 거버넌스', labelEn: 'Security & Governance' },
    { id: 'Knowledge', labelKo: '지식 관리 & RAG', labelEn: 'Knowledge & RAG' },
  ];

  const filteredTerms = TERMS_DATA.filter((term) => {
    const matchesCat = selectedCategory === 'ALL' || term.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      term.name.toLowerCase().includes(q) ||
      term.eng.toLowerCase().includes(q) ||
      term.desc.toLowerCase().includes(q) ||
      term.youtubeTitle.toLowerCase().includes(q) ||
      term.youtubeSummary.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat: TermCategory) => {
    switch (cat) {
      case 'Architecture':
        return 'bg-blue-900/50 text-blue-300 border-blue-700/60';
      case 'Framework':
        return 'bg-indigo-900/50 text-indigo-300 border-indigo-700/60';
      case 'LLM':
        return 'bg-purple-900/50 text-purple-300 border-purple-700/60';
      case 'Security':
        return 'bg-red-900/50 text-red-300 border-red-700/60';
      case 'Knowledge':
        return 'bg-amber-900/50 text-amber-300 border-amber-700/60';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getCategoryKorean = (cat: TermCategory) => {
    switch (cat) {
      case 'Architecture':
        return '아키텍처';
      case 'Framework':
        return '프레임워크';
      case 'LLM':
        return '기초 모델';
      case 'Security':
        return '보안/가드레일';
      case 'Knowledge':
        return '지식/RAG';
      default:
        return cat;
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>{isKo ? '인공지능 핵심 용어 & 약어 사전 (52선)' : '52 Core AI Terms & Acronyms Dictionary'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isKo
              ? '보고서 본문 및 최신 에이전틱 AI 생태계를 이해하기 위한 52가지 필수 용어 종합 정리입니다. 각 항목별 관련 유튜브 강의 링크 및 핵심 요약이 포함되어 있습니다.'
              : 'Essential reference guide for 52 foundational AI terms with curated authoritative YouTube video lectures and key takeaways.'}
          </p>
        </div>

        <div className="mt-3 sm:mt-0 px-3.5 py-1.5 bg-blue-950/80 text-blue-300 border border-blue-800/80 rounded-full text-xs font-semibold text-center shrink-0">
          {isKo ? `총 ${filteredTerms.length}개 항목` : `${filteredTerms.length} Terms`}
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isKo
                ? '용어명(한글/영문), 설명 또는 유튜브 학습 키워드로 검색하세요 (예: MCP, 헤르메스, OAG, DSPy, LoRA)...'
                : 'Search term, acronym, or video topic (e.g., MCP, Hermes, OAG, DSPy, LoRA)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {isKo ? c.labelKo : c.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 52 Cards */}
      {filteredTerms.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-sm bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
          {isKo
            ? '검색 조건에 일치하는 AI 용어가 없습니다. 다른 키워드로 검색해보세요.'
            : 'No AI terms match your search query.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              onClick={() => setActiveModalTerm(term)}
              className="bg-zinc-900/80 border border-zinc-800/80 hover:border-blue-500/60 p-4 rounded-xl shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadge(
                      term.category
                    )}`}
                  >
                    {isKo ? getCategoryKorean(term.category) : term.category}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">#{term.id}</span>
                </div>
                <h4 className="font-bold text-white group-hover:text-blue-400 transition text-sm sm:text-base">
                  {term.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono mb-2 truncate">{term.eng}</p>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">{term.desc}</p>

                {/* YouTube Video Teaser Badge */}
                <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-950/30 px-2 py-1 rounded-lg border border-red-900/40 truncate">
                  <Play className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />
                  <span className="truncate text-zinc-300 font-medium">{term.youtubeTitle}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-blue-400 font-medium group-hover:text-blue-300">
                <span>{isKo ? '상세 설명 & 영상 요약 보기' : 'View Details & Video'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeModalTerm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalTerm(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(
                    activeModalTerm.category
                  )}`}
                >
                  {isKo ? getCategoryKorean(activeModalTerm.category) : activeModalTerm.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{activeModalTerm.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{activeModalTerm.eng}</p>
              </div>
              <button
                onClick={() => setActiveModalTerm(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Term Core Description */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                {isKo ? '핵심 개념 정의' : 'Definition'}
              </h4>
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                <p>{activeModalTerm.desc}</p>
              </div>
            </div>

            {/* Curated YouTube Learning Section */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/25 via-zinc-900/60 to-zinc-950 border border-red-900/40 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold shadow-sm">
                  <Play className="w-3 h-3 fill-white" />
                  {isKo ? '추천 유튜브 학습 영상' : 'Recommended YouTube Lecture'}
                </span>

                <a
                  href={activeModalTerm.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/40 transition cursor-pointer"
                >
                  <span>{isKo ? 'YouTube에서 시청하기' : 'Watch on YouTube'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <h5 className="font-bold text-white text-xs sm:text-sm mb-1 text-red-200">
                  {activeModalTerm.youtubeTitle}
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-red-950/60">
                  <strong className="text-red-300 mr-1.5">💡 {isKo ? '영상 요약 & 핵심 체크포인트:' : 'Video Summary:'}</strong>
                  {activeModalTerm.youtubeSummary}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900">
              <span className="font-mono">Term ID: #{activeModalTerm.id}</span>
              <button
                onClick={() => setActiveModalTerm(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition cursor-pointer"
              >
                {isKo ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
