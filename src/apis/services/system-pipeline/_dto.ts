export interface PipelineStageDto {
  id: string;
  order: number;
  title: string;
  category: 'security' | 'routing' | 'context' | 'concurrency' | 'ux' | 'ai' | 'tool' | 'database' | 'delivery';
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

export interface SimulationStepDto {
  stageId: string;
  status: 'passed' | 'branch_taken' | 'dropped';
  annotation: string;
  payloadPreview?: Record<string, unknown>;
}

export interface SimulationScenarioDto {
  id: string;
  title: string;
  description: string;
  category: 'ai_review' | 'comparison' | 'resources' | 'group' | 'fsm' | 'rate_limit';
  sampleInput: string;
  chatType: 'private' | 'group';
  steps: SimulationStepDto[];
  expectedOutput: string;
}

export interface SystemPipelineDto {
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
  stages: PipelineStageDto[];
  scenarios: SimulationScenarioDto[];
}
