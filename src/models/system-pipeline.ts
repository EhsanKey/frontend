export type PipelineStageCategory =
  | 'security'
  | 'routing'
  | 'context'
  | 'concurrency'
  | 'ux'
  | 'ai'
  | 'tool'
  | 'database'
  | 'delivery';

export interface IPipelineStage {
  id: string;
  order: number;
  title: string;
  category: PipelineStageCategory;
  component: string;
  file: string;
  functionName: string;
  description: string;
  inputs: string[];
  outputs: string[];
  guards: string[];
  dropReasons: string[];
  isGroundedAiProtected?: boolean;
}

export type SimulationStepStatus = 'passed' | 'branch_taken' | 'dropped';

export interface ISimulationStep {
  stageId: string;
  status: SimulationStepStatus;
  annotation: string;
  payloadPreview?: Record<string, unknown>;
}

export type ScenarioCategory =
  | 'ai_review'
  | 'comparison'
  | 'resources'
  | 'group'
  | 'fsm'
  | 'rate_limit';

export interface ISimulationScenario {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  sampleInput: string;
  chatType: 'private' | 'group';
  steps: ISimulationStep[];
  expectedOutput: string;
}

export interface ISystemPipelineSpec {
  version: string;
  synced: boolean;
  updatedAt: string;
  stats: {
    totalStages: number;
    totalIntents: number;
    totalTools: number;
    totalFsmFlows: number;
    totalScenarios: number;
  };
  intents: string[];
  tools: string[];
  clarificationReasons: string[];
  fsmFlows: {
    profile: string[];
    review: string[];
    resource: string[];
  };
  rateLimiter: {
    maxMessages: number;
    windowMs: number;
    cooldownStepMs: number;
    cooldownMaxMs: number;
  };
  stages: IPipelineStage[];
  scenarios: ISimulationScenario[];
}
