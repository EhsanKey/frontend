import 'server-only';

import { Suspense } from 'react';
import { connection } from 'next/server';
import { serverSystemPipelineServices } from '@/apis/services/system-pipeline/server';
import { BotFlowClient } from './bot-flow-client';
import { BotFlowFallback } from './bot-flow-fallback';
import type { BotFlowModuleProps } from './types';

export const BotFlowModule = async (props?: BotFlowModuleProps) => {
  await connection();

  let initialSpec = props?.initialSpec;
  if (!initialSpec) {
    try {
      initialSpec = await serverSystemPipelineServices.getMessagePipeline();
    } catch {
      // Client-side fallback via useGetRequest
    }
  }

  return (
    <Suspense fallback={<BotFlowFallback />}>
      <BotFlowClient initialSpec={initialSpec} />
    </Suspense>
  );
};

export default BotFlowModule;
