export type Paradigm = 'all' | 'llm' | 'rag' | 'agentic';
export type Language = 'ko' | 'en';
export type ActiveTab = 'canvas' | 'simulator' | 'matrix';

export interface ArchitectureNode {
  id: string;
  name: string;
  nameKo: string;
  paradigm: 'llm' | 'rag' | 'agentic' | 'shared';
  category: 'user' | 'prompt' | 'llm' | 'answer' | 'search' | 'context' | 'memory' | 'reasoning' | 'tools' | 'action';
  x: number;
  y: number;
  width?: number;
  height?: number;
  colorClass: string;
  summary: string;
  summaryKo: string;
  details: {
    description: string;
    descriptionKo: string;
    input: string;
    inputKo: string;
    output: string;
    outputKo: string;
    techStack: string[];
    challenges: string[];
    challengesKo: string[];
    codeSnippet: {
      lang: string;
      code: string;
    };
  };
}

export interface SimulationStep {
  stepNumber: number;
  activeNodes: string[];
  activeConnections: string[];
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  paradigm: 'llm' | 'rag' | 'agentic';
}

export interface SimulationResult {
  summary: string;
  llm: {
    status: string;
    answer: string;
    latencyMs: number;
    tokens: number;
    costCents: number;
    hallucinationRisk: string;
    steps: string[];
  };
  rag: {
    status: string;
    queryGenerated: string;
    retrievedChunks: Array<{ source: string; snippet: string }>;
    answer: string;
    latencyMs: number;
    tokens: number;
    costCents: number;
    hallucinationRisk: string;
    steps: string[];
  };
  agentic: {
    status: string;
    memoryRetrieved: string;
    plan: string[];
    toolExecuted: {
      name: string;
      args: Record<string, any>;
      result: string;
    };
    answer: string;
    latencyMs: number;
    tokens: number;
    costCents: number;
    hallucinationRisk: string;
    steps: string[];
  };
}

export interface PresetScenario {
  id: string;
  title: string;
  titleKo: string;
  prompt: string;
  promptKo: string;
  category: string;
}
