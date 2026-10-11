import React, { useState, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../types';
import { DEFENSE_AGENT_SECTIONS } from '../data/defenseAgentData';
import { ONTOLOGY_AGENT_SECTIONS } from '../data/ontologyAgentData';
import { KIM_DAESHIK_SECTIONS } from '../data/kimDaeShikData';
import {
  X,
  Award,
  Download,
  Printer,
  CheckCircle2,
  Shield,
  Network,
  Brain,
  Calendar,
  User,
  Sparkles,
  FileText,
  Clock,
  Compass,
  ArrowRight,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

interface CertificateExportModalProps {
  language: Language;
  onClose: () => void;
}

export const CertificateExportModal: React.FC<CertificateExportModalProps> = ({
  language,
  onClose,
}) => {
  const isKo = language === 'ko';
  const { isLight } = useTheme();
  const {
    completedMap,
    defenseStats,
    ontologyStats,
    kimdaeshikStats,
    overallStats,
  } = useProgress();

  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('ai_cert_student_name') || (isKo ? '홍길동 수강생' : 'AI Architect Candidate');
  });
  const [affiliation, setAffiliation] = useState(() => {
    return localStorage.getItem('ai_cert_student_affiliation') || (isKo ? '국방 AI 시스템 엔지니어링 랩' : 'Defense AI Systems Engineering Lab');
  });
  const [isExporting, setIsExporting] = useState(false);
  const [activeView, setActiveView] = useState<'certificate' | 'summary'>('certificate');

  const certificateRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Completed items lists
  const completedDefenseSections = DEFENSE_AGENT_SECTIONS.filter((s) => completedMap[s.id]);
  const completedOntologySections = ONTOLOGY_AGENT_SECTIONS.filter((s) => completedMap[s.id]);
  const completedKimSections = KIM_DAESHIK_SECTIONS.filter((s) => completedMap[s.id]);

  const issueDate = new Date().toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certificateId = `CERT-AI-${Math.abs(
    (studentName + affiliation).split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
  )}-${new Date().getFullYear()}`;

  const handleNameChange = (val: string) => {
    setStudentName(val);
    try {
      localStorage.setItem('ai_cert_student_name', val);
    } catch {}
  };

  const handleAffiliationChange = (val: string) => {
    setAffiliation(val);
    try {
      localStorage.setItem('ai_cert_student_affiliation', val);
    } catch {}
  };

  // Export PDF using high-resolution html-to-image and jsPDF
  const handleExportPDF = async () => {
    const targetElement = activeView === 'certificate' ? certificateRef.current : summaryRef.current;
    if (!targetElement) return;

    try {
      setIsExporting(true);

      // Render high-DPI rasterized canvas from the styled HTML
      const imgDataUrl = await toPng(targetElement, {
        quality: 0.98,
        pixelRatio: 2.0,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      // Calculate A4 dimensions in mm
      // Landscape for certificate, Portrait for learning summary
      const isLandscape = activeView === 'certificate';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = isLandscape ? 297 : 210;
      const pageHeight = isLandscape ? 210 : 297;

      // Fit image onto A4 page proportionally
      pdf.addImage(imgDataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

      const fileName =
        activeView === 'certificate'
          ? `AI_Architecture_Certificate_${studentName.trim().replace(/\s+/g, '_')}.pdf`
          : `AI_Learning_Path_Summary_${studentName.trim().replace(/\s+/g, '_')}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation error, falling back to window.print():', err);
      // Fallback
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? 'bg-slate-50 border-slate-300 text-slate-800'
            : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? '학습 수료증 & 핵심 요약 리포트 내보내기' : 'Certificate of Completion & Learning Summary'}
                </h3>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {overallStats.percent}% {isKo ? '이수' : 'Complete'}
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {isKo
                  ? '국방 AI, 온톨로지 AI, 김대식 교수 모듈 이수 내역 및 학습 테이크어웨이를 고해상도 PDF로 저장합니다.'
                  : 'Export verified module completions and strategic takeaways as a high-resolution PDF certificate.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: View Switch + Name Inputs + Export Action */}
        <div
          className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs ${
            isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
          }`}
        >
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700">
            <button
              onClick={() => setActiveView('certificate')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'certificate'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{isKo ? '수료증 뷰 (A4 가로)' : 'Certificate View (Landscape)'}</span>
            </button>
            <button
              onClick={() => setActiveView('summary')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'summary'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isKo ? '상세 요약 리포트 (A4 세로)' : 'Detailed Summary (Portrait)'}</span>
            </button>
          </div>

          {/* Student Info Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={isKo ? '성명 입력' : 'Recipient Name'}
                className="bg-transparent border-none outline-hidden text-xs font-medium w-28 sm:w-36 text-slate-800 dark:text-zinc-100 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={affiliation}
                onChange={(e) => handleAffiliationChange(e.target.value)}
                placeholder={isKo ? '소속 / 직함' : 'Affiliation / Title'}
                className="bg-transparent border-none outline-hidden text-xs font-medium w-36 sm:w-48 text-slate-800 dark:text-zinc-100 placeholder-slate-400"
              />
            </div>
          </div>

          {/* PDF & Print Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
              title={isKo ? '인쇄하기' : 'Print'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isKo ? '인쇄' : 'Print'}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? (isKo ? '생성 중...' : 'Generating...') : (isKo ? 'PDF 다운로드' : 'Download PDF')}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-200/50 dark:bg-zinc-950/80">
          {/* VIEW 1: Formal Certificate View (A4 Landscape aspect ratio: 297 x 210 mm) */}
          {activeView === 'certificate' && (
            <div
              ref={certificateRef}
              className="w-full max-w-[960px] aspect-[297/210] bg-white text-slate-900 p-8 sm:p-12 rounded-lg shadow-xl relative flex flex-col justify-between border-[12px] border-double border-amber-800/80 select-none overflow-hidden"
              style={{ minHeight: '620px' }}
            >
              {/* Certificate Guilloche & Watermark Background Accents */}
              <div className="absolute inset-0 border-[2px] border-amber-600/30 m-2 pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/50 via-indigo-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-100/50 via-purple-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Certificate Top Header */}
              <div className="relative text-center space-y-2 pt-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-600" />
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-800 font-bold">
                    Official Certificate of Mastery
                  </span>
                  <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-serif">
                  {isKo ? 'AI 아키텍처 & 에이전트 마스터 수료증' : 'Certificate of AI Architecture Mastery'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
                  {isKo
                    ? '국방 AI · 온톨로지 지식 그래프 · 피지컬 AI 오케스트레이션 전문 과정'
                    : 'Defense AI · Neuro-Symbolic Ontology · Physical AI Orchestration'}
                </p>
              </div>

              {/* Certificate Body & Recipient */}
              <div className="relative text-center my-auto py-4 space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                  {isKo ? '이 수료증은 다음 연구자에게 수여됩니다' : 'This is proudly presented to'}
                </p>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide font-serif border-b-2 border-slate-300 pb-1 inline-block min-w-[280px]">
                  {studentName || (isKo ? '수강생' : 'Candidate')}
                </div>
                {affiliation && (
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {affiliation}
                  </p>
                )}
                <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-slate-700 pt-2 font-serif">
                  {isKo
                    ? `위 사람은 3대 전문 영역(김대식 교수 인지 패러다임, 온톨로지 AI 뉴로심볼릭 지식 그래프, 국방 AI 미션 크리티컬 체계)의 전 과정을 탐구하고 종합 달성도 ${overallStats.percent}% (${overallStats.completed}/${overallStats.total} 모듈)를 달성하여 차세대 AI 시스템 아키텍트로서의 전문 소양을 성공적으로 갖추었음을 인증합니다.`
                    : `has successfully completed the comprehensive curriculum across Cognitive Physical AI, Neuro-Symbolic Ontologies, and Mission-Critical Defense Systems, achieving an overall completion rate of ${overallStats.percent}% (${overallStats.completed}/${overallStats.total} modules) and demonstrating outstanding competence as a Next-Gen AI Architect.`}
                </p>
              </div>

              {/* Module Pillars Achievement Summary Strip */}
              <div className="relative grid grid-cols-3 gap-3 py-3 border-y border-amber-900/20 bg-amber-50/50 rounded-lg px-4 my-2 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-purple-900 uppercase tracking-wider block">
                    {isKo ? 'Level 1: 김대식 교수 인지 AI' : 'Level 1: Prof. Kim AI'}
                  </span>
                  <div className="text-base font-bold font-mono text-purple-800">
                    {kimdaeshikStats.percent}%{' '}
                    <span className="text-[11px] font-normal text-slate-600">
                      ({kimdaeshikStats.completed}/{kimdaeshikStats.total})
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5 border-x border-amber-900/15 px-2">
                  <span className="text-[10px] font-semibold text-indigo-900 uppercase tracking-wider block">
                    {isKo ? 'Level 2: 온톨로지 지식 그래프' : 'Level 2: Ontology AI'}
                  </span>
                  <div className="text-base font-bold font-mono text-indigo-800">
                    {ontologyStats.percent}%{' '}
                    <span className="text-[11px] font-normal text-slate-600">
                      ({ontologyStats.completed}/{ontologyStats.total})
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-emerald-900 uppercase tracking-wider block">
                    {isKo ? 'Level 3: 국방 AI 체계' : 'Level 3: Defense AI'}
                  </span>
                  <div className="text-base font-bold font-mono text-emerald-800">
                    {defenseStats.percent}%{' '}
                    <span className="text-[11px] font-normal text-slate-600">
                      ({defenseStats.completed}/{defenseStats.total})
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Bottom Signatures & Seal */}
              <div className="relative flex items-end justify-between pt-4 pb-2 px-2">
                <div className="text-left space-y-1">
                  <div className="text-[11px] font-mono text-slate-500">
                    {isKo ? '발급 번호' : 'Certificate ID'}: <span className="font-semibold text-slate-800">{certificateId}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {isKo ? '발급 일자' : 'Issue Date'}: <span className="font-medium">{issueDate}</span>
                  </div>
                </div>

                {/* Golden Stamp / Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-700 bg-gradient-to-br from-amber-100 to-amber-200 flex flex-col items-center justify-center text-amber-900 shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-700 mb-0.5" />
                    <span className="text-[8px] font-extrabold uppercase tracking-tight text-center leading-tight">
                      VERIFIED<br />ARCHITECT
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-sm font-bold text-slate-900 font-serif">
                    AI Systems Architecture Council
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {isKo ? '차세대 AI 시스템 아키텍처 인증위원회' : 'Curriculum Certification Board'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Detailed Learning Summary & Key Takeaways Report (A4 Portrait) */}
          {activeView === 'summary' && (
            <div
              ref={summaryRef}
              className="w-full max-w-[800px] bg-white text-slate-900 p-8 sm:p-10 rounded-lg shadow-xl relative space-y-6 border border-slate-300 select-none"
              style={{ minHeight: '900px' }}
            >
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Curriculum Dossier
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Ref: {certificateId}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isKo ? 'AI 아키텍처 학습 이수 요약서' : 'AI Architecture Learning Summary'}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {isKo
                      ? '수강자 학습 달성도, 완료 모듈 목록 및 핵심 아키텍처 테이크어웨이 종합'
                      : 'Comprehensive audit of completed modules and core architectural takeaways.'}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-600">
                  <div className="font-bold text-slate-900">{studentName}</div>
                  <div>{affiliation}</div>
                  <div className="text-slate-500">{issueDate}</div>
                </div>
              </div>

              {/* Progress Metric Matrix */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-center">
                  <span className="text-[11px] text-slate-500 block">{isKo ? '종합 진행률' : 'Overall'}</span>
                  <span className="text-2xl font-black font-mono text-amber-600">{overallStats.percent}%</span>
                  <span className="text-[10px] text-slate-500 block">{overallStats.completed}/{overallStats.total} {isKo ? '모듈' : 'mods'}</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="text-[11px] text-purple-700 font-medium block">{isKo ? '김대식 인지' : 'Prof. Kim'}</span>
                  <span className="text-xl font-bold font-mono text-purple-700">{kimdaeshikStats.percent}%</span>
                  <span className="text-[10px] text-slate-500 block">{kimdaeshikStats.completed}/{kimdaeshikStats.total}</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="text-[11px] text-indigo-700 font-medium block">{isKo ? '온톨로지' : 'Ontology'}</span>
                  <span className="text-xl font-bold font-mono text-indigo-700">{ontologyStats.percent}%</span>
                  <span className="text-[10px] text-slate-500 block">{ontologyStats.completed}/{ontologyStats.total}</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="text-[11px] text-emerald-700 font-medium block">{isKo ? '국방 AI' : 'Defense'}</span>
                  <span className="text-xl font-bold font-mono text-emerald-700">{defenseStats.percent}%</span>
                  <span className="text-[10px] text-slate-500 block">{defenseStats.completed}/{defenseStats.total}</span>
                </div>
              </div>

              {/* Learning Track 1: Kim Dae-shik Module Takeaways */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Level 1. {isKo ? '김대식 교수: 인지 패러다임 & 피지컬 AI 기초' : 'Prof. Kim: Cognitive Paradigms & Physical AI'}</span>
                  </h3>
                  <span className="text-xs font-mono text-purple-700 font-bold">
                    {kimdaeshikStats.completed} / {kimdaeshikStats.total} {isKo ? '완료' : 'Completed'}
                  </span>
                </div>
                <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-xs text-slate-700 space-y-1.5">
                  <p className="font-semibold text-purple-950">
                    {isKo ? '📌 핵심 테이크어웨이 (Key Takeaway):' : '📌 Architectural Takeaways:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>{isKo ? '인간 뇌 인지 메커니즘 vs LLM 토큰 예측 확률의 본질적 한계 및 비결정성 이해' : 'Human brain cognition vs LLM probabilistic token prediction limits.'}</li>
                    <li>{isKo ? '텍스트 챗봇에서 물리적 하드웨어를 제어하는 피지컬 AI(Physical AI) 및 액션 데이터 파이프라인 수립' : 'Transition from text chatbots to physical hardware control & action data pipelines.'}</li>
                    <li>{isKo ? '1인 에이전트 보스(Agent Boss) 창업 모델과 6개월 PoC 마일스톤 설계 역량 확보' : '1-Person Agent Boss solopreneur structure & 6-month PoC roadmap execution.'}</li>
                  </ul>
                  {completedKimSections.length > 0 && (
                    <div className="pt-1.5">
                      <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wide block mb-1">
                        {isKo ? '이수한 세부 모듈:' : 'Completed Modules:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {completedKimSections.map((sec) => (
                          <span key={sec.id} className="text-[10px] bg-white border border-purple-200 text-purple-900 px-1.5 py-0.5 rounded">
                            ✓ {sec.title.slice(0, 24)}...
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Track 2: Ontology AI Takeaways */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Network className="w-4 h-4 text-indigo-600" />
                    <span>Level 2. {isKo ? '온톨로지 AI: 뉴로-심볼릭 지식 그래프 & Graph RAG' : 'Ontology AI: Neuro-Symbolic Knowledge Graphs'}</span>
                  </h3>
                  <span className="text-xs font-mono text-indigo-700 font-bold">
                    {ontologyStats.completed} / {ontologyStats.total} {isKo ? '완료' : 'Completed'}
                  </span>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1.5">
                  <p className="font-semibold text-indigo-950">
                    {isKo ? '📌 핵심 테이크어웨이 (Key Takeaway):' : '📌 Architectural Takeaways:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>{isKo ? '벡터 검색(Vector RAG)의 의미론적 단절을 극복하는 온톨로지 지식 그래프 및 RDF/OWL 스키마 DDL' : 'Overcoming vector RAG limitations with ontology knowledge graphs & RDF/OWL schemas.'}</li>
                    <li>{isKo ? '팔란티어 AIP(Palantir AIP) 스타일의 전술 온톨로지와 KNTDS/C4I 이종 데이터 융합 아키텍처' : 'Palantir AIP style tactical ontology and KNTDS/C4I multi-source data integration.'}</li>
                    <li>{isKo ? '뉴로심볼릭 상호 검증(Neuro-Symbolic Dual Verification)을 통한 환각율 0% 보장 체계' : 'Neuro-symbolic dual verification pipeline eliminating hallucination risks in decision gates.'}</li>
                  </ul>
                  {completedOntologySections.length > 0 && (
                    <div className="pt-1.5">
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide block mb-1">
                        {isKo ? '이수한 세부 모듈:' : 'Completed Modules:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {completedOntologySections.map((sec) => (
                          <span key={sec.id} className="text-[10px] bg-white border border-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded">
                            ✓ {sec.title.slice(0, 24)}...
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Track 3: Defense AI Takeaways */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Level 3. {isKo ? '국방 AI: 30년 국방 체계 통합 & 물리 에어갭 자율화' : 'Defense AI: 30-Yr Systems Integration & Air-Gap Autonomy'}</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-700 font-bold">
                    {defenseStats.completed} / {defenseStats.total} {isKo ? '완료' : 'Completed'}
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-xs text-slate-700 space-y-1.5">
                  <p className="font-semibold text-emerald-950">
                    {isKo ? '📌 핵심 테이크어웨이 (Key Takeaway):' : '📌 Architectural Takeaways:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>{isKo ? '국방 특수 장비 표준 MCP 프로토콜(RS-422/MIL-STD-1553B/Link-16) 연동 및 온디바이스 에이전트' : 'Defense equipment MCP protocols (MIL-STD-1553B/Link-16) & on-device air-gapped agents.'}</li>
                    <li>{isKo ? '휴먼인더루프(HITL) 2단계 승인 게이트 및 물리적 킬 스위치(Kill Switch) 안전 아키텍처' : 'Human-in-the-loop 2-phase approval gates and physical hardware kill-switch safeguards.'}</li>
                    <li>{isKo ? '국방 4대 창업 모델(AgentOps, 버티컬 B2B SaaS, 피지컬 AI, 기업형 에이전트 DB) 비즈니스 전략' : 'Defense AI startup strategies: vertical AgentOps, niche defense SaaS, and physical AI.'}</li>
                  </ul>
                  {completedDefenseSections.length > 0 && (
                    <div className="pt-1.5">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                        {isKo ? '이수한 세부 모듈:' : 'Completed Modules:'}
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {completedDefenseSections.map((sec) => (
                          <span key={sec.id} className="text-[10px] bg-white border border-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                            ✓ {sec.title.slice(0, 24)}...
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Audit Signature */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Curriculum Completion Record</span>
                </div>
                <div className="font-mono text-slate-400">
                  {issueDate} · AI Systems Architecture Studio
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div
          className={`flex items-center justify-between p-4 border-t shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {isKo
                ? 'Tip: 상단 성명과 소속을 수정한 후 PDF 다운로드를 누르면 맞춤형 수료증이 저장됩니다.'
                : 'Tip: Update candidate name & affiliation above before downloading PDF.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
            >
              {isKo ? '닫기' : 'Close'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? (isKo ? '생성 중...' : 'Generating...') : (isKo ? 'PDF 다운로드' : 'Download PDF')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
