import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFENSE_AGENT_SECTIONS } from '../data/defenseAgentData';
import { ONTOLOGY_AGENT_SECTIONS } from '../data/ontologyAgentData';
import { KIM_DAESHIK_SECTIONS } from '../data/kimDaeShikData';

const STORAGE_KEY = 'ai_dashboard_educational_progress_v2';

export interface TabProgressStats {
  completed: number;
  total: number;
  percent: number;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMap));
    } catch {
      // ignore localStorage quota errors
    }
  }, [completedMap]);

  const isCompleted = (id: string): boolean => {
    return !!completedMap[id];
  };

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
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
