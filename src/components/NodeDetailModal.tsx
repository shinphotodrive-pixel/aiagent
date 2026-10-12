import React, { useState, useEffect, useMemo } from 'react';
import { ArchitectureNode, Language } from '../types';
import { ARCHITECTURE_NODES } from '../data/architectureData';
import {
  X,
  Code,
  Layers,
  AlertCircle,
  ArrowRightCircle,
  Sparkles,
  Terminal,
  FileDown,
  Columns2,
  Minimize2,
  ArrowLeftRight,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Coins,
  ShieldAlert,
  Search,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  node: ArchitectureNode | null;
  language: Language;
  onClose: () => void;
  onOpenPdfReport?: (node: ArchitectureNode) => void;
}

// Capability & Performance Metrics per category/paradigm
interface NodeCapabilityMetrics {
  latencyEstimate: string;
  latencyRating: 'fast' | 'moderate' | 'high'; // fast, moderate, high
  costScore: number; // 1 to 5
  costLabel: string;
  hallucinationVulnerability: 'None' | 'Low' | 'Moderate' | 'High';
  hallucinationKo: string;
  externalAccess: 'Full Action' | 'Read Only' | 'None';
  externalAccessKo: string;
  stateRetention: 'Long-term' | 'Session/Buffer' | 'Stateless';
  stateRetentionKo: string;
  complexityScore: number; // 0 - 100
  keyCapability: { en: string; ko: string };
}

const getNodeMetrics = (node: ArchitectureNode): NodeCapabilityMetrics => {
  // Deterministic metrics computed from node characteristics
  if (node.category === 'user') {
    return {
      latencyEstimate: '< 5ms',
      latencyRating: 'fast',
      costScore: 1,
      costLabel: '$0.00',
      hallucinationVulnerability: 'None',
      hallucinationKo: '없음 (원시 입력)',
      externalAccess: 'None',
      externalAccessKo: '해당 없음 (사용자)',
      stateRetention: 'Stateless',
      stateRetentionKo: '무상태 입력',
      complexityScore: 15,
      keyCapability: {
        en: 'Dispatches natural language intention directly to processing pipeline.',
        ko: '사용자의 자연어 질의 및 지시 의도를 시스템 파이프라인에 주입.'
      }
    };
  }

  if (node.category === 'prompt') {
    if (node.paradigm === 'llm') {
      return {
        latencyEstimate: '10 ~ 30ms',
        latencyRating: 'fast',
        costScore: 1,
        costLabel: '$ (Token Pack)',
        hallucinationVulnerability: 'None',
        hallucinationKo: '없음 (토크나이징)',
        externalAccess: 'None',
        externalAccessKo: '외부 접근 불가',
        stateRetention: 'Stateless',
        stateRetentionKo: '단일 프롬프트 한정',
        complexityScore: 25,
        keyCapability: {
          en: 'BPE / SentencePiece tokenization directly feeding model layers without retrieval injection.',
          ko: '외부 지식 주입 없이 시스템/사용자 텍스트를 즉시 토큰 텐서로 변환.'
        }
      };
    } else {
      // rag
      return {
        latencyEstimate: '50 ~ 120ms',
        latencyRating: 'fast',
        costScore: 2,
        costLabel: '$$ (HyDE / Rerank)',
        hallucinationVulnerability: 'Low',
        hallucinationKo: '낮음 (증강 템플릿)',
        externalAccess: 'Read Only',
        externalAccessKo: '검색 쿼리 변환/주입',
        stateRetention: 'Session/Buffer',
        stateRetentionKo: '검색 세션 컨텍스트 주입',
        complexityScore: 65,
        keyCapability: {
          en: 'Generates retrieval queries and constructs context-augmented prompts using retrieved passages.',
          ko: '검색용 쿼리 확장 및 검색된 문서를 결합한 컨텍스트 증강 프롬프트 조립.'
        }
      };
    }
  }

  if (node.category === 'search') {
    return {
      latencyEstimate: '150 ~ 450ms',
      latencyRating: 'moderate',
      costScore: 2,
      costLabel: '$$ (Vector DB / Web API)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '매우 낮음 (실제 근거 수집)',
      externalAccess: 'Read Only',
      externalAccessKo: '읽기 전용 외부 지식 검색',
      stateRetention: 'Stateless',
      stateRetentionKo: '인덱스 쿼리 상태',
      complexityScore: 78,
      keyCapability: {
        en: 'Hybrid vector similarity (HNSW) + sparse BM25 retrieval across enterprise & web corpora.',
        ko: '고차원 임베딩 벡터 유사도 검색 및 BM25 키워드 하이브리드 검색 수행.'
      }
    };
  }

  if (node.category === 'context') {
    return {
      latencyEstimate: '40 ~ 100ms',
      latencyRating: 'fast',
      costScore: 2,
      costLabel: '$$ (Storage & Ingestion)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '낮음 (정제된 지식 소스)',
      externalAccess: 'Read Only',
      externalAccessKo: '사내 DB / 문서 저장소',
      stateRetention: 'Long-term',
      stateRetentionKo: '영구 인덱싱 저장소',
      complexityScore: 72,
      keyCapability: {
        en: 'Persistent chunk storage with metadata filtering, ACL permissions, and chunk dedup.',
        ko: '메타데이터 필터링 및 권한 제어가 결합된 고속 임베딩 청크 저장소.'
      }
    };
  }

  if (node.category === 'memory') {
    return {
      latencyEstimate: '80 ~ 250ms',
      latencyRating: 'fast',
      costScore: 3,
      costLabel: '$$$ (Semantic + Graph DB)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '낮음 (회상 기반 검증)',
      externalAccess: 'Read Only',
      externalAccessKo: '장기 기억 및 상태 조회',
      stateRetention: 'Long-term',
      stateRetentionKo: '영구 사용자 히스토리 및 에피소딕 메모리',
      complexityScore: 92,
      keyCapability: {
        en: 'Dual-track memory: Short-term scratchpad working buffer + Long-term episodic vector & graph storage.',
        ko: '단기 스크래치패드와 장기 에피소딕/시맨틱 메모리를 결합한 다층 기억 시스템.'
      }
    };
  }

  if (node.category === 'reasoning') {
    return {
      latencyEstimate: '800 ~ 3,500ms',
      latencyRating: 'high',
      costScore: 4,
      costLabel: '$$$$ (Multi-step Reasoning)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '낮음 (자기 성찰 및 계획 검증)',
      externalAccess: 'None',
      externalAccessKo: '내부 인지 계획 수립',
      stateRetention: 'Session/Buffer',
      stateRetentionKo: 'ReAct 인지 루프 상태',
      complexityScore: 96,
      keyCapability: {
        en: 'Deconstructs ambiguous goals into DAG sub-tasks, performs self-reflection, and selects optimal tools.',
        ko: '복합 목표를 단계별 서브 태스크로 분해하고 자기 성찰(Reflect)을 거쳐 최적 도구 선정.'
      }
    };
  }

  if (node.category === 'tools') {
    return {
      latencyEstimate: '400 ~ 2,500ms',
      latencyRating: 'moderate',
      costScore: 4,
      costLabel: '$$$$ (External API Fees)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '매우 낮음 (결과값 기반 피드백)',
      externalAccess: 'Full Action',
      externalAccessKo: '도구 호출 및 외부 시스템 연동',
      stateRetention: 'Session/Buffer',
      stateRetentionKo: '도구 실행 결과 관찰(Observation)',
      complexityScore: 94,
      keyCapability: {
        en: 'Strict JSON-schema tool invocation: Web browsing, bash execution, SQL queries, and API clients.',
        ko: '엄격한 스키마 기반 도구 호출: 웹 브라우징, 셸 명령, SQL 쿼리, REST API 실행.'
      }
    };
  }

  if (node.category === 'action') {
    return {
      latencyEstimate: '500 ~ 4,000ms',
      latencyRating: 'high',
      costScore: 4,
      costLabel: '$$$$ (Transaction Overhead)',
      hallucinationVulnerability: 'Low',
      hallucinationKo: '최저 (실제 시스템 상태 변경)',
      externalAccess: 'Full Action',
      externalAccessKo: '실제 외부 쓰기 / 트랜잭션 완수',
      stateRetention: 'Long-term',
      stateRetentionKo: '외부 DB 및 실세계 상태 변경',
      complexityScore: 98,
      keyCapability: {
        en: 'Autonomous real-world state mutation: Calendar booking, DB write, payment, and PR submission.',
        ko: '실제 상태 영구 변경: 캘린더 등록, DB 레코드 생성, 결제 처리, 깃허브 PR 제출.'
      }
    };
  }

  if (node.category === 'llm') {
    if (node.paradigm === 'llm') {
      return {
        latencyEstimate: '250 ~ 700ms',
        latencyRating: 'fast',
        costScore: 2,
        costLabel: '$ (Single pass tokens)',
        hallucinationVulnerability: 'High',
        hallucinationKo: '높음 (동결 가중치 암기 의존)',
        externalAccess: 'None',
        externalAccessKo: '완전 차단 (오프라인 추론)',
        stateRetention: 'Stateless',
        stateRetentionKo: '무상태 (세션 기억 불가)',
        complexityScore: 40,
        keyCapability: {
          en: 'Autoregressive token generation based purely on pre-trained parametric neural weights.',
          ko: '사전 학습된 정적 신경망 가중치만으로 다음 토큰을 자가회귀 예측 생성.'
        }
      };
    } else if (node.paradigm === 'rag') {
      return {
        latencyEstimate: '400 ~ 1,200ms',
        latencyRating: 'moderate',
        costScore: 3,
        costLabel: '$$ (Context-heavy tokens)',
        hallucinationVulnerability: 'Low',
        hallucinationKo: '낮음 (제공된 원문 근거 인용)',
        externalAccess: 'Read Only',
        externalAccessKo: '주입된 문서 기반 읽기',
        stateRetention: 'Stateless',
        stateRetentionKo: '요청별 주입된 컨텍스트',
        complexityScore: 68,
        keyCapability: {
          en: 'Grounded generation constrained to synthesize and cite facts strictly from injected documents.',
          ko: '주입된 외부 문맥에 닻을 내리고(Grounded) 인용 번호를 부여하여 답변 합성.'
        }
      };
    } else {
      // agentic
      return {
        latencyEstimate: '1,500 ~ 8,000ms',
        latencyRating: 'high',
        costScore: 5,
        costLabel: '$$$$$ (Multi-step agent loop)',
        hallucinationVulnerability: 'Low',
        hallucinationKo: '매우 낮음 (관찰 피드백 루프)',
        externalAccess: 'Full Action',
        externalAccessKo: '도구 오케스트레이션 총괄',
        stateRetention: 'Session/Buffer',
        stateRetentionKo: 'ReAct 추론-행동-관찰 사이클',
        complexityScore: 98,
        keyCapability: {
          en: 'Agentic reasoning engine driving iterative Thought-Action-Observation loops and autonomous recovery.',
          ko: 'Thought-Action-Observation 자율 루프 및 오류 복구를 지휘하는 에이전트 인지 엔진.'
        }
      };
    }
  }

  if (node.category === 'answer') {
    if (node.paradigm === 'llm') {
      return {
        latencyEstimate: 'Direct Stream',
        latencyRating: 'fast',
        costScore: 1,
        costLabel: '$',
        hallucinationVulnerability: 'High',
        hallucinationKo: '높음 (검증 출처 없음)',
        externalAccess: 'None',
        externalAccessKo: '텍스트 출력 전용',
        stateRetention: 'Stateless',
        stateRetentionKo: '소멸성 출력',
        complexityScore: 20,
        keyCapability: {
          en: 'Raw unverified text response delivered directly to user.',
          ko: '외부 검증이나 출처 링크 없이 즉시 반환되는 텍스트 답변.'
        }
      };
    } else if (node.paradigm === 'rag') {
      return {
        latencyEstimate: 'Stream + Citations',
        latencyRating: 'moderate',
        costScore: 2,
        costLabel: '$$',
        hallucinationVulnerability: 'Low',
        hallucinationKo: '낮음 (클릭 가능한 출처 포함)',
        externalAccess: 'Read Only',
        externalAccessKo: '원문 링크 인용 첨부',
        stateRetention: 'Stateless',
        stateRetentionKo: '검증 가능한 인용 결과물',
        complexityScore: 62,
        keyCapability: {
          en: 'Verifiable answer stream with hyperlinked passage citations and similarity ranks.',
          ko: '하이퍼링크 출처와 유사도 근거가 명시된 검증 가능한 답변 렌더링.'
        }
      };
    } else {
      // agentic
      return {
        latencyEstimate: 'Multi-modal + Artifacts',
        latencyRating: 'high',
        costScore: 4,
        costLabel: '$$$$',
        hallucinationVulnerability: 'Low',
        hallucinationKo: '매우 낮음 (실행 증적 포함)',
        externalAccess: 'Full Action',
        externalAccessKo: '실행 보고서, 코드, 트랜잭션 완수',
        stateRetention: 'Long-term',
        stateRetentionKo: '결과 아티팩트 및 상태 반영',
        complexityScore: 90,
        keyCapability: {
          en: 'Multi-modal artifacts: Generated files, calendar confirmation, API response data, and diffs.',
          ko: '멀티모달 산출물: 생성 파일, 캘린더 등록 확인, API 응답 데이터, 시각화 차트 제공.'
        }
      };
    }
  }

  // fallback
  return {
    latencyEstimate: '100 ~ 500ms',
    latencyRating: 'moderate',
    costScore: 2,
    costLabel: '$$',
    hallucinationVulnerability: 'Moderate',
    hallucinationKo: '보통',
    externalAccess: 'Read Only',
    externalAccessKo: '제한적',
    stateRetention: 'Session/Buffer',
    stateRetentionKo: '세션 범위',
    complexityScore: 50,
    keyCapability: {
      en: node.summary,
      ko: node.summaryKo
    }
  };
};

export const NodeDetailModal: React.FC<Props> = ({ node, language, onClose, onOpenPdfReport }) => {
  if (!node) return null;
  const isKo = language === 'ko';
  const { isLight } = useTheme();

  // Split-screen comparison state
  const [isSplitView, setIsSplitView] = useState(false);
  const [compareNodeId, setCompareNodeId] = useState<string>('');

  // All available architecture nodes as an array for comparison selection
  const allNodesList = useMemo(() => {
    return Object.values(ARCHITECTURE_NODES);
  }, []);

  // Compute recommended compare node initially
  useEffect(() => {
    if (!node) return;
    // Suggest a counterpart node from a different paradigm or related category
    const otherNodes = allNodesList.filter((n) => n.id !== node.id);
    // Prefer node with same category from different paradigm
    const sameCategoryDiffParadigm = otherNodes.find(
      (n) => n.category === node.category && n.paradigm !== node.paradigm
    );
    if (sameCategoryDiffParadigm) {
      setCompareNodeId(sameCategoryDiffParadigm.id);
      return;
    }
    // Else prefer any agentic node if current is llm/rag, or rag node if current is agentic
    const fallbackNode =
      otherNodes.find((n) => (node.paradigm === 'agentic' ? n.paradigm === 'rag' : n.paradigm === 'agentic')) ||
      otherNodes[0];
    if (fallbackNode) {
      setCompareNodeId(fallbackNode.id);
    }
  }, [node, allNodesList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const compareNode = useMemo(() => {
    if (!compareNodeId) return null;
    return ARCHITECTURE_NODES[compareNodeId] || null;
  }, [compareNodeId]);

  const getParadigmBadge = (paradigm: 'llm' | 'rag' | 'agentic' | 'shared') => {
    return {
      llm: {
        label: 'L.L.M (ChatGPT)',
        short: 'LLM',
        color: isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-900/40 text-blue-300 border-blue-500/40',
        bgPill: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      },
      rag: {
        label: 'R.A.G (Perplexity)',
        short: 'RAG',
        color: isLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-900/40 text-sky-300 border-sky-500/40',
        bgPill: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      },
      agentic: {
        label: 'Agentic AI (Goover / Operator)',
        short: 'Agentic',
        color: isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-900/40 text-purple-300 border-purple-500/40',
        bgPill: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      },
      shared: {
        label: 'Shared Component',
        short: 'Shared',
        color: isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700',
        bgPill: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
      },
    }[paradigm];
  };

  const primaryBadge = getParadigmBadge(node.paradigm);
  const secondaryBadge = compareNode ? getParadigmBadge(compareNode.paradigm) : null;

  const nodeAMetrics = useMemo(() => getNodeMetrics(node), [node]);
  const nodeBMetrics = useMemo(() => (compareNode ? getNodeMetrics(compareNode) : null), [compareNode]);

  // Compute difference highlights between Node A and Node B
  const comparisonDiffs = useMemo(() => {
    if (!compareNode || !nodeBMetrics) return null;

    const diffs: Array<{
      label: string;
      labelKo: string;
      valA: string;
      valB: string;
      status: 'higher' | 'lower' | 'equal' | 'diff';
      highlightWinner?: 'A' | 'B' | 'neutral';
      commentEn: string;
      commentKo: string;
    }> = [];

    // 1. Paradigm
    diffs.push({
      label: 'Paradigm Architecture',
      labelKo: '소속 패러다임',
      valA: node.paradigm.toUpperCase(),
      valB: compareNode.paradigm.toUpperCase(),
      status: node.paradigm === compareNode.paradigm ? 'equal' : 'diff',
      highlightWinner: 'neutral',
      commentEn: `${node.paradigm.toUpperCase()} vs ${compareNode.paradigm.toUpperCase()}`,
      commentKo: `${node.paradigm.toUpperCase()}와 ${compareNode.paradigm.toUpperCase()} 아키텍처 비교`
    });

    // 2. Complexity Score
    const compDelta = nodeAMetrics.complexityScore - nodeBMetrics.complexityScore;
    diffs.push({
      label: 'Structural Complexity',
      labelKo: '구조적 복잡도 점수',
      valA: `${nodeAMetrics.complexityScore}/100`,
      valB: `${nodeBMetrics.complexityScore}/100`,
      status: compDelta > 0 ? 'higher' : compDelta < 0 ? 'lower' : 'equal',
      highlightWinner: compDelta > 0 ? 'A' : compDelta < 0 ? 'B' : 'neutral',
      commentEn: compDelta > 0 ? `${node.name} is +${compDelta} more complex` : compDelta < 0 ? `${compareNode.name} is +${Math.abs(compDelta)} more complex` : 'Identical complexity',
      commentKo: compDelta > 0 ? `${node.nameKo}가 +${compDelta}점 더 높은 엔지니어링 복잡도` : compDelta < 0 ? `${compareNode.nameKo}가 +${Math.abs(compDelta)}점 더 높은 복잡도` : '동일한 복잡도'
    });

    // 3. External System Execution (Act)
    diffs.push({
      label: 'External System Action',
      labelKo: '외부 시스템 실행 능력',
      valA: isKo ? nodeAMetrics.externalAccessKo : nodeAMetrics.externalAccess,
      valB: isKo ? nodeBMetrics.externalAccessKo : nodeBMetrics.externalAccess,
      status: nodeAMetrics.externalAccess === nodeBMetrics.externalAccess ? 'equal' : 'diff',
      highlightWinner: nodeAMetrics.externalAccess === 'Full Action' ? 'A' : nodeBMetrics.externalAccess === 'Full Action' ? 'B' : 'neutral',
      commentEn: nodeAMetrics.externalAccess === 'Full Action' ? `${node.name} can mutate external systems directly` : nodeBMetrics.externalAccess === 'Full Action' ? `${compareNode.name} has external write capability` : 'Read-only / isolated',
      commentKo: nodeAMetrics.externalAccess === 'Full Action' ? `${node.nameKo}는 실제 외부 시스템 변경 가능` : nodeBMetrics.externalAccess === 'Full Action' ? `${compareNode.nameKo}가 외부 상태 변경 가능` : '읽기 전용 또는 격리 환경'
    });

    // 4. Hallucination Risk
    diffs.push({
      label: 'Hallucination Vulnerability',
      labelKo: '환각(Hallucination) 위험도',
      valA: isKo ? nodeAMetrics.hallucinationKo : nodeAMetrics.hallucinationVulnerability,
      valB: isKo ? nodeBMetrics.hallucinationKo : nodeBMetrics.hallucinationVulnerability,
      status: nodeAMetrics.hallucinationVulnerability === nodeBMetrics.hallucinationVulnerability ? 'equal' : 'diff',
      highlightWinner: nodeAMetrics.hallucinationVulnerability === 'High' ? 'B' : nodeBMetrics.hallucinationVulnerability === 'High' ? 'A' : 'neutral',
      commentEn: nodeAMetrics.hallucinationVulnerability === 'High' ? `${node.name} relies on frozen weights without validation` : nodeBMetrics.hallucinationVulnerability === 'High' ? `${compareNode.name} lacks verification grounding` : 'Grounded or verifiable',
      commentKo: nodeAMetrics.hallucinationVulnerability === 'High' ? `${node.nameKo}는 동결 가중치 암기에만 의존하여 위험` : nodeBMetrics.hallucinationVulnerability === 'High' ? `${compareNode.nameKo}가 검증 근거 부족` : '근거 기반 또는 검증 가능'
    });

    // 5. Latency Profile
    diffs.push({
      label: 'Latency Profile',
      labelKo: '응답 지연 시간 (Latency)',
      valA: nodeAMetrics.latencyEstimate,
      valB: nodeBMetrics.latencyEstimate,
      status: nodeAMetrics.latencyRating === nodeBMetrics.latencyRating ? 'equal' : 'diff',
      highlightWinner: nodeAMetrics.latencyRating === 'fast' ? 'A' : nodeBMetrics.latencyRating === 'fast' ? 'B' : 'neutral',
      commentEn: nodeAMetrics.latencyRating === 'fast' ? `${node.name} has near-instant response time` : `${compareNode.name} is faster or comparable`,
      commentKo: nodeAMetrics.latencyRating === 'fast' ? `${node.nameKo}가 즉각적인 응답 속도 제공` : `${compareNode.nameKo}가 더 빠르거나 유사함`
    });

    // 6. State & Memory Retention
    diffs.push({
      label: 'State Retention',
      labelKo: '기억 및 상태 지속성',
      valA: isKo ? nodeAMetrics.stateRetentionKo : nodeAMetrics.stateRetention,
      valB: isKo ? nodeBMetrics.stateRetentionKo : nodeBMetrics.stateRetention,
      status: nodeAMetrics.stateRetention === nodeBMetrics.stateRetention ? 'equal' : 'diff',
      highlightWinner: nodeAMetrics.stateRetention === 'Long-term' ? 'A' : nodeBMetrics.stateRetention === 'Long-term' ? 'B' : 'neutral',
      commentEn: nodeAMetrics.stateRetention === 'Long-term' ? `${node.name} maintains persistent cross-session state` : nodeBMetrics.stateRetention === 'Long-term' ? `${compareNode.name} retains long-term memory` : 'Transient execution',
      commentKo: nodeAMetrics.stateRetention === 'Long-term' ? `${node.nameKo}는 세션 간 영구 기억 보존` : nodeBMetrics.stateRetention === 'Long-term' ? `${compareNode.nameKo}가 장기 기억 보유` : '휘발성 실행'
    });

    return diffs;
  }, [node, compareNode, nodeAMetrics, nodeBMetrics, isKo]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border transition-all duration-300 ${
          isSplitView ? 'max-w-6xl' : 'max-w-2xl'
        } ${
          isLight ? 'bg-white border-slate-300 text-slate-800 ring-1 ring-slate-900/5' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-3.5 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/90' : 'border-zinc-800 bg-zinc-900/70'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm border shadow-sm ${
              isLight ? 'bg-slate-100 border-slate-300 text-amber-700' : 'bg-zinc-800 border-zinc-700 text-amber-400'
            }`}>
              {node.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-base sm:text-lg font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isKo ? node.nameKo : node.name}
                </h3>
                <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${primaryBadge.color}`}>
                  {primaryBadge.label}
                </span>

                {isSplitView && compareNode && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>{isKo ? '스플릿 비교 모드' : 'Split-Screen Diff Mode'}</span>
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {isKo ? node.summaryKo : node.summary}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Split Screen Toggle Button */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isSplitView
                  ? 'bg-amber-500 text-black border-amber-400 shadow-sm shadow-amber-500/20'
                  : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
              title={isSplitView ? (isKo ? '단일 상세 뷰로 축소' : 'Collapse to Single View') : (isKo ? '두 노드 나란히 스플릿 비교' : 'Compare with another node side-by-side')}
            >
              {isSplitView ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isKo ? '단일 뷰로 전환' : 'Single View'}</span>
                </>
              ) : (
                <>
                  <Columns2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isKo ? '스플릿 비교' : 'Compare Split'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Selector Toolbar (when split view is active) */}
        {isSplitView && (
          <div className={`px-5 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-amber-50/70 border-amber-200/80 text-amber-950' : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Columns2 className="w-3.5 h-3.5" />
                {isKo ? '비교 대상 아키텍처 노드 선택:' : 'Compare against Architecture Node:'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Preset Buttons for rapid comparison */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] opacity-75 hidden md:inline">{isKo ? '추천 비교:' : 'Quick Select:'}</span>
                {allNodesList
                  .filter((n) => n.id !== node.id && (n.paradigm !== node.paradigm || n.category === node.category))
                  .slice(0, 3)
                  .map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCompareNodeId(opt.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer border ${
                        compareNodeId === opt.id
                          ? 'bg-amber-500 text-black font-bold border-amber-400'
                          : isLight
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {isKo ? opt.nameKo : opt.name} ({opt.paradigm.toUpperCase()})
                    </button>
                  ))}
              </div>

              {/* Node Dropdown */}
              <div className="relative">
                <select
                  value={compareNodeId}
                  onChange={(e) => setCompareNodeId(e.target.value)}
                  className={`pl-2.5 pr-7 py-1 rounded-lg text-xs font-semibold appearance-none border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-800'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                >
                  <optgroup label={isKo ? '동일/유사 카테고리 노드' : 'Same/Similar Category Nodes'}>
                    {allNodesList
                      .filter((n) => n.id !== node.id && n.category === node.category)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {isKo ? n.nameKo : n.name} ({n.paradigm.toUpperCase()})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label={isKo ? '전체 아키텍처 노드 목록' : 'All Architecture Nodes'}>
                    {allNodesList
                      .filter((n) => n.id !== node.id && n.category !== node.category)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {isKo ? n.nameKo : n.name} — [{n.paradigm.toUpperCase()}] ({n.category})
                        </option>
                      ))}
                  </optgroup>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 pointer-events-none opacity-60" />
              </div>
            </div>
          </div>
        )}

        {/* Content Body: Standard View or Split-Screen View */}
        {!isSplitView ? (
          /* ================= SINGLE NODE VIEW ================= */
          <div className={`overflow-y-auto p-6 space-y-5 text-xs ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            {/* Quick Metrics Bar */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/50 border-zinc-800/80'
            }`}>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  {isKo ? '지연 시간' : 'Latency'}
                </span>
                <span className="font-bold text-xs mt-0.5">{nodeAMetrics.latencyEstimate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  {isKo ? '비용 프로필' : 'Cost Profile'}
                </span>
                <span className="font-bold text-xs mt-0.5">{nodeAMetrics.costLabel}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  {isKo ? '환각 취약도' : 'Hallucination'}
                </span>
                <span className={`font-bold text-xs mt-0.5 ${
                  nodeAMetrics.hallucinationVulnerability === 'High' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {isKo ? nodeAMetrics.hallucinationKo : nodeAMetrics.hallucinationVulnerability}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  {isKo ? '엔지니어링 복잡도' : 'Complexity'}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-xs">{nodeAMetrics.complexityScore} / 100</span>
                  <div className="w-12 h-1.5 bg-zinc-700/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500" 
                      style={{ width: `${nodeAMetrics.complexityScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isKo ? '상세 기술 동작 원리' : 'Detailed Mechanism'}
              </h4>
              <p className={`leading-relaxed p-3.5 rounded-xl border ${
                isLight ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-zinc-900/40 text-zinc-300 border-zinc-800/80'
              }`}>
                {isKo ? node.details.descriptionKo : node.details.description}
              </p>
            </div>

            {/* I/O Contracts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1 ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  <ArrowRightCircle className="w-3 h-3" />
                  {isKo ? '입력 (Input)' : 'Input Payload'}
                </span>
                <p className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                  {isKo ? node.details.inputKo : node.details.input}
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1 ${
                  isLight ? 'text-sky-700' : 'text-sky-400'
                }`}>
                  <ArrowRightCircle className="w-3 h-3 rotate-90" />
                  {isKo ? '출력 (Output)' : 'Output Payload'}
                </span>
                <p className={`font-mono text-[11px] ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                  {isKo ? node.details.outputKo : node.details.output}
                </p>
              </div>
            </div>

            {/* Tech Stack Ecosystem */}
            <div>
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}>
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                {isKo ? '주요 기술 스택 및 생태계' : 'Tech Stack & Frameworks'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {node.details.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                      isLight 
                        ? 'bg-slate-100 border-slate-300 text-slate-800' 
                        : 'bg-zinc-900 border-zinc-700/80 text-zinc-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Snippet */}
            <div>
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}>
                <Terminal className="w-3.5 h-3.5 text-pink-500" />
                {isKo ? '실제 구현 코드 예제' : 'Production Code Implementation'}
              </h4>
              <div className={`rounded-xl p-3 border font-mono text-[11px] overflow-x-auto leading-relaxed ${
                isLight 
                  ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-inner' 
                  : 'bg-black/90 text-zinc-300 border-zinc-800'
              }`}>
                <pre>{node.details.codeSnippet.code}</pre>
              </div>
            </div>

            {/* Key Engineering Challenges */}
            <div>
              <h4 className={`text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isLight ? 'text-slate-600' : 'text-zinc-400'
              }`}>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                {isKo ? '엔지니어링 과제 및 해결 과제' : 'Engineering Challenges & Pitfalls'}
              </h4>
              <ul className={`space-y-1.5 list-disc list-inside ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {(isKo ? node.details.challengesKo : node.details.challenges).map((ch, i) => (
                  <li key={i} className={`leading-normal ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                    {ch}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* ================= SPLIT-SCREEN COMPARISON VIEW ================= */
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 text-xs">
            {/* Top Difference Highlights Table */}
            {comparisonDiffs && compareNode && (
              <div className={`rounded-xl border overflow-hidden ${
                isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
                  isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-zinc-850 border-zinc-800'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <ArrowLeftRight className="w-4 h-4 text-amber-500" />
                    <span>{isKo ? '핵심 성능 및 기능 차이 요약 (Capability & Performance Matrix)' : 'Side-by-Side Capability & Performance Comparison'}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {node.name} vs {compareNode.name}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className={`border-b text-[11px] uppercase tracking-wider ${
                        isLight ? 'bg-slate-200/50 text-slate-600 border-slate-200' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        <th className="py-2.5 px-3.5 w-1/4 font-semibold">{isKo ? '비교 차원' : 'Dimension'}</th>
                        <th className="py-2.5 px-3.5 w-3/8 font-semibold">
                          <span className="inline-flex items-center gap-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {isKo ? node.nameKo : node.name} ({node.paradigm.toUpperCase()})
                          </span>
                        </th>
                        <th className="py-2.5 px-3.5 w-3/8 font-semibold">
                          <span className="inline-flex items-center gap-1.5 font-bold">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            {isKo ? compareNode.nameKo : compareNode.name} ({compareNode.paradigm.toUpperCase()})
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                      {comparisonDiffs.map((diff, idx) => (
                        <tr 
                          key={idx} 
                          className={`transition ${
                            diff.status !== 'equal' 
                              ? isLight ? 'bg-amber-50/40 hover:bg-amber-100/40' : 'bg-amber-950/10 hover:bg-amber-900/20' 
                              : isLight ? 'hover:bg-slate-100/50' : 'hover:bg-zinc-800/30'
                          }`}
                        >
                          <td className="py-2.5 px-3.5 font-semibold text-zinc-600 dark:text-zinc-300">
                            {isKo ? diff.labelKo : diff.label}
                          </td>
                          <td className={`py-2.5 px-3.5 ${
                            diff.highlightWinner === 'A' 
                              ? 'font-bold text-amber-600 dark:text-amber-400' 
                              : ''
                          }`}>
                            <div className="flex items-center gap-1.5">
                              {diff.highlightWinner === 'A' && <Zap className="w-3 h-3 text-amber-500 shrink-0" />}
                              <span>{diff.valA}</span>
                            </div>
                          </td>
                          <td className={`py-2.5 px-3.5 ${
                            diff.highlightWinner === 'B' 
                              ? 'font-bold text-purple-600 dark:text-purple-400' 
                              : ''
                          }`}>
                            <div className="flex items-center gap-1.5">
                              {diff.highlightWinner === 'B' && <Zap className="w-3 h-3 text-purple-500 shrink-0" />}
                              <span>{diff.valB}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Dual Column Side-by-Side Detailed Breakdown */}
            {compareNode && nodeBMetrics && secondaryBadge && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* ================= LEFT COLUMN: NODE A ================= */}
                <div className={`p-4 rounded-xl border flex flex-col space-y-4 ${
                  isLight ? 'bg-slate-50/60 border-blue-200 ring-1 ring-blue-500/10' : 'bg-zinc-900/40 border-blue-900/40 ring-1 ring-blue-500/10'
                }`}>
                  {/* Node A Title Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                        isLight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-blue-900/50 text-blue-300 border-blue-700'
                      }`}>
                        {node.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">
                            {isKo ? node.nameKo : node.name}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${primaryBadge.color}`}>
                            {primaryBadge.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">Category: {node.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Node A Key Mechanism */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-zinc-500">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      {isKo ? '메커니즘 동작' : 'Operational Mechanism'}
                    </h5>
                    <p className={`p-3 rounded-lg border leading-relaxed text-[11px] ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-950/80 border-zinc-800 text-zinc-300'
                    }`}>
                      {isKo ? node.details.descriptionKo : node.details.description}
                    </p>
                  </div>

                  {/* Node A Inputs & Outputs */}
                  <div className="space-y-2">
                    <div className={`p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase text-emerald-500 flex items-center gap-1 mb-0.5">
                        <ArrowRightCircle className="w-3 h-3" />
                        {isKo ? '입력 (Input)' : 'Input'}
                      </span>
                      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                        {isKo ? node.details.inputKo : node.details.input}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase text-sky-500 flex items-center gap-1 mb-0.5">
                        <ArrowRightCircle className="w-3 h-3 rotate-90" />
                        {isKo ? '출력 (Output)' : 'Output'}
                      </span>
                      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                        {isKo ? node.details.outputKo : node.details.output}
                      </p>
                    </div>
                  </div>

                  {/* Node A Tech Stack */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      {isKo ? '기술 스택' : 'Tech Stack'}
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {node.details.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Node A Code Snippet */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <Terminal className="w-3.5 h-3.5 text-pink-400" />
                      {isKo ? '구현 코드' : 'Code'}
                    </h5>
                    <div className={`rounded-lg p-2.5 border font-mono text-[10px] overflow-x-auto leading-relaxed max-h-40 ${
                      isLight ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-black text-zinc-300 border-zinc-800'
                    }`}>
                      <pre>{node.details.codeSnippet.code}</pre>
                    </div>
                  </div>

                  {/* Node A Challenges */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      {isKo ? '핵심 과제 및 취약점' : 'Challenges & Bottlenecks'}
                    </h5>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-zinc-600 dark:text-zinc-400">
                      {(isKo ? node.details.challengesKo : node.details.challenges).map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= RIGHT COLUMN: NODE B (COMPARE) ================= */}
                <div className={`p-4 rounded-xl border flex flex-col space-y-4 ${
                  isLight ? 'bg-slate-50/60 border-purple-200 ring-1 ring-purple-500/10' : 'bg-zinc-900/40 border-purple-900/40 ring-1 ring-purple-500/10'
                }`}>
                  {/* Node B Title Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                        isLight ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-purple-900/50 text-purple-300 border-purple-700'
                      }`}>
                        {compareNode.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400">
                            {isKo ? compareNode.nameKo : compareNode.name}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${secondaryBadge.color}`}>
                            {secondaryBadge.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">Category: {compareNode.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Node B Key Mechanism */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5 text-zinc-500">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      {isKo ? '메커니즘 동작' : 'Operational Mechanism'}
                    </h5>
                    <p className={`p-3 rounded-lg border leading-relaxed text-[11px] ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-950/80 border-zinc-800 text-zinc-300'
                    }`}>
                      {isKo ? compareNode.details.descriptionKo : compareNode.details.description}
                    </p>
                  </div>

                  {/* Node B Inputs & Outputs */}
                  <div className="space-y-2">
                    <div className={`p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase text-emerald-500 flex items-center gap-1 mb-0.5">
                        <ArrowRightCircle className="w-3 h-3" />
                        {isKo ? '입력 (Input)' : 'Input'}
                      </span>
                      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                        {isKo ? compareNode.details.inputKo : compareNode.details.input}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase text-sky-500 flex items-center gap-1 mb-0.5">
                        <ArrowRightCircle className="w-3 h-3 rotate-90" />
                        {isKo ? '출력 (Output)' : 'Output'}
                      </span>
                      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                        {isKo ? compareNode.details.outputKo : compareNode.details.output}
                      </p>
                    </div>
                  </div>

                  {/* Node B Tech Stack */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      {isKo ? '기술 스택' : 'Tech Stack'}
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {compareNode.details.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                            isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Node B Code Snippet */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <Terminal className="w-3.5 h-3.5 text-pink-400" />
                      {isKo ? '구현 코드' : 'Code'}
                    </h5>
                    <div className={`rounded-lg p-2.5 border font-mono text-[10px] overflow-x-auto leading-relaxed max-h-40 ${
                      isLight ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-black text-zinc-300 border-zinc-800'
                    }`}>
                      <pre>{compareNode.details.codeSnippet.code}</pre>
                    </div>
                  </div>

                  {/* Node B Challenges */}
                  <div>
                    <h5 className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-zinc-500">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      {isKo ? '핵심 과제 및 취약점' : 'Challenges & Bottlenecks'}
                    </h5>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-zinc-600 dark:text-zinc-400">
                      {(isKo ? compareNode.details.challengesKo : compareNode.details.challenges).map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={`px-5 sm:px-6 py-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
          isLight ? 'border-slate-200 bg-slate-50/80 text-slate-500' : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-500'
        }`}>
          <div className="flex items-center gap-2">
            <span>{isKo ? 'ESC 키 또는 닫기를 누르세요' : 'Press ESC or Click outside to close'}</span>
            {!isSplitView && (
              <span className="hidden sm:inline text-zinc-400">
                • {isKo ? '상단 [스플릿 비교] 버튼으로 다른 노드와 성능을 대조하세요' : 'Click [Compare Split] above to compare performance with other nodes'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenPdfReport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPdfReport(node);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition active:scale-95 cursor-pointer text-xs"
                title={isKo ? '이 노드 상세가 포함된 아키텍처 PDF 보고서 내보내기' : 'Export Architecture PDF report with this active node'}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{isKo ? '노드 포함 PDF 리포트' : 'Export in PDF Report'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded-lg font-medium transition cursor-pointer border text-xs ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
            >
              {isKo ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
