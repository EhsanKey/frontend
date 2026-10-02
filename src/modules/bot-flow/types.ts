import type {
  IPipelineStage,
  ISystemPipelineSpec,
} from '@/models';

export interface BotFlowModuleProps {
  initialSpec?: ISystemPipelineSpec;
}

export interface BotFlowClientProps {
  initialSpec?: ISystemPipelineSpec;
}

export type BotFlowViewMode = 'canvas' | 'pipeline' | 'matrix';

export interface CanvasNodeLayout {
  id: string;
  stage: IPipelineStage;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  row: number;
}

export interface CanvasParticle {
  id: number;
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0.0 to 1.0
  speed: number;
  color: string;
  size: number;
  isSpecial?: boolean;
}
