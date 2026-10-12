import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFENSE_AGENT_SECTIONS } from '../data/defenseAgentData';
import { ONTOLOGY_AGENT_SECTIONS } from '../data/ontologyAgentData';
import { KIM_DAESHIK_SECTIONS } from '../data/kimDaeShikData';

const STORAGE_KEY = 'ai_dashboard_educational_progress_v2';
const ACTIVITY_STORAGE_KEY = 'ai_dashboard_activity_feed_v1';

export interface TabProgressStats {
  completed: number;
  total: number;
  percent: number;
}

export type ActivityActionType = 'navigate_tab' | 'select_node' | 'complete_module' | 'uncomplete_module' | 'simulate' | 'change_paradigm' | 'export_pdf' | 'bookmark_simulation' | 'diff_view';

export interface ActivityLogItem {
  id: string;
  type: ActivityActionType;
  titleKo: string;
  titleEn: string;
  detailKo?: string;
  detailEn?: string;
  timestamp: number;
  metadata?: {
    tab?: string;
    nodeId?: string;
    paradigm?: string;
    moduleId?: string;
    bookmarkId?: string;
  };
}

export interface ProgressContextType {
  completedMap: Record<string, boolean>;
  isCompleted: (id: string) => boolean;
  toggleComplete: (id: string) => void;
  markCompleted: (id: string, completed: boolean) => void;
  markAllInTab: (tab: 'defense' | 'ontology' | 'kimdaeshik', completed: boolean) => void;
  resetAll: () => void;
  defenseStats: TabProgressStats;
  ontologyStats: TabProgressStats;
  kimdaeshikStats: TabProgressStats;
  overallStats: TabProgressStats;
  activities: ActivityLogItem[];
  recordActivity: (activity: Omit<ActivityLogItem, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default initial seed: mark the first foundational section of each tab as completed for instant visual delight
    return {
      'defense-sec-1': true,
      'ontology-sec-1': true,
      'kim-sec-1': true,
    };
  });

  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    // Initial activity log entries
    return [
      {
        id: 'init-1',
        type: 'navigate_tab',
        titleKo: 'AI 아키텍처 대시보드 시작',
        titleEn: 'Started AI Architecture Session',
        detailKo: '아키텍처 캔버스 및 3대 학습 모듈 로드됨',
        detailEn: 'Architecture canvas & 3-stage modules loaded',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'init-2',
        type: 'complete_module',
        titleKo: '기초 모듈 이수 기록 확인',
        titleEn: 'Verified Baseline Module Progress',
        detailKo: '김대식·온톨로지·국방 기본 모듈 연동 완료',
        detailEn: 'Kim, Ontology & Defense initial modules linked',
        timestamp: Date.now() - 1800000,
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMap));
    } catch {}
  }, [completedMap]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities.slice(0, 50)));
    } catch {}
  }, [activities]);

  const recordActivity = (activity: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityLogItem = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setActivities((prev) => [newItem, ...prev.slice(0, 49)]);
  };

  const clearActivities = () => {
    setActivities([]);
    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch {}
  };

  const isCompleted = (id: string): boolean => {
    return !!completedMap[id];
  };

  // Helper to find module section title
  const findModuleTitle = (id: string): { ko: string; en: string } => {
    const def = DEFENSE_AGENT_SECTIONS.find((s) => s.id === id);
    if (def) return { ko: `국방: ${def.title}`, en: `Defense: ${def.title}` };
    const ont = ONTOLOGY_AGENT_SECTIONS.find((s) => s.id === id);
    if (ont) return { ko: `온톨로지: ${ont.title}`, en: `Ontology: ${ont.title}` };
    const kim = KIM_DAESHIK_SECTIONS.find((s) => s.id === id);
    if (kim) return { ko: `김대식: ${kim.title}`, en: `Kim: ${kim.title}` };
    return { ko: id, en: id };
  };

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      const nowCompleted = !next[id];
      if (nowCompleted) {
        next[id] = true;
      } else {
        delete next[id];
      }

      // Record activity in feed
      const mod = findModuleTitle(id);
      recordActivity({
        type: nowCompleted ? 'complete_module' : 'uncomplete_module',
        titleKo: nowCompleted ? `모듈 이수 완료: ${mod.ko}` : `모듈 이수 취소: ${mod.ko}`,
        titleEn: nowCompleted ? `Completed Module: ${mod.en}` : `Unchecked Module: ${mod.en}`,
        detailKo: nowCompleted ? '학습 진도율이 업데이트되었습니다.' : '진도 체크가 해제되었습니다.',
        detailEn: nowCompleted ? 'Educational progress updated.' : 'Module checkbox unchecked.',
        metadata: { moduleId: id }
      });

      return next;
    });
  };

  const markCompleted = (id: string, completed: boolean) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      if (completed) {
        next[id] = true;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const markAllInTab = (tab: 'defense' | 'ontology' | 'kimdaeshik', completed: boolean) => {
    let ids: string[] = [];
    if (tab === 'defense') {
      ids = DEFENSE_AGENT_SECTIONS.map((s) => s.id);
    } else if (tab === 'ontology') {
      ids = ONTOLOGY_AGENT_SECTIONS.map((s) => s.id);
    } else if (tab === 'kimdaeshik') {
      ids = KIM_DAESHIK_SECTIONS.map((s) => s.id);
    }

    setCompletedMap((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        if (completed) {
          next[id] = true;
        } else {
          delete next[id];
        }
      });
      return next;
    });
  };

  const resetAll = () => {
    setCompletedMap({});
  };

  // Compute Statistics
  const defenseTotal = DEFENSE_AGENT_SECTIONS.length;
  const defenseCompleted = DEFENSE_AGENT_SECTIONS.filter((s) => completedMap[s.id]).length;
  const defenseStats: TabProgressStats = {
    total: defenseTotal,
    completed: defenseCompleted,
    percent: defenseTotal > 0 ? Math.round((defenseCompleted / defenseTotal) * 100) : 0,
  };

  const ontologyTotal = ONTOLOGY_AGENT_SECTIONS.length;
  const ontologyCompleted = ONTOLOGY_AGENT_SECTIONS.filter((s) => completedMap[s.id]).length;
  const ontologyStats: TabProgressStats = {
    total: ontologyTotal,
    completed: ontologyCompleted,
    percent: ontologyTotal > 0 ? Math.round((ontologyCompleted / ontologyTotal) * 100) : 0,
  };

  const kimdaeshikTotal = KIM_DAESHIK_SECTIONS.length;
  const kimdaeshikCompleted = KIM_DAESHIK_SECTIONS.filter((s) => completedMap[s.id]).length;
  const kimdaeshikStats: TabProgressStats = {
    total: kimdaeshikTotal,
    completed: kimdaeshikCompleted,
    percent: kimdaeshikTotal > 0 ? Math.round((kimdaeshikCompleted / kimdaeshikTotal) * 100) : 0,
  };

  const totalAll = defenseTotal + ontologyTotal + kimdaeshikTotal;
  const completedAll = defenseCompleted + ontologyCompleted + kimdaeshikCompleted;
  const overallStats: TabProgressStats = {
    total: totalAll,
    completed: completedAll,
    percent: totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0,
  };

  return (
    <ProgressContext.Provider
      value={{
        completedMap,
        isCompleted,
        toggleComplete,
        markCompleted,
        markAllInTab,
        resetAll,
        defenseStats,
        ontologyStats,
        kimdaeshikStats,
        overallStats,
        activities,
        recordActivity,
        clearActivities,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
