import type {
  IPipelineStage,
  ISimulationScenario,
  ISimulationStep,
  ISystemPipelineSpec,
} from '@/models';
import type {
  PipelineStageDto,
  SimulationScenarioDto,
  SimulationStepDto,
  SystemPipelineDto,
} from './_dto';

export function toPipelineStageModel(dto: PipelineStageDto): IPipelineStage {
  return {
    id: dto.id,
    order: dto.order,
    title: dto.title,
    category: dto.category,
    component: dto.component,
    file: dto.file,
    functionName: dto.functionName,
    description: dto.description,
    inputs: dto.inputs || [],
    outputs: dto.outputs || [],
    guards: dto.guards || [],
    dropReasons: dto.dropReasons || [],
    isGroundedAiProtected: Boolean(dto.isGroundedAiProtected),
  };
}

export function toSimulationStepModel(dto: SimulationStepDto): ISimulationStep {
  return {
    stageId: dto.stageId,
    status: dto.status,
    annotation: dto.annotation,
    payloadPreview: dto.payloadPreview,
  };
}

export function toSimulationScenarioModel(dto: SimulationScenarioDto): ISimulationScenario {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    sampleInput: dto.sampleInput,
    chatType: dto.chatType,
    steps: (dto.steps || []).map(toSimulationStepModel),
    expectedOutput: dto.expectedOutput,
  };
}

export function toSystemPipelineModel(dto: SystemPipelineDto): ISystemPipelineSpec {
  return {
    version: dto.version,
    synced: dto.synced,
    updatedAt: dto.updatedAt,
    stats: dto.stats,
    intents: dto.intents || [],
    tools: dto.tools || [],
    clarificationReasons: dto.clarificationReasons || [],
    fsmFlows: dto.fsmFlows,
    rateLimiter: dto.rateLimiter,
    stages: (dto.stages || []).map(toPipelineStageModel),
    scenarios: (dto.scenarios || []).map(toSimulationScenarioModel),
  };
}
