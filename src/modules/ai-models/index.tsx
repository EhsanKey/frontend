import { Suspense } from 'react';
import { serverAiModelServices } from '@/apis/services/ai-models/server';
import { AiModelsClient } from './ai-models-client';

export const AiModelsModule = async () => {
  let initialData = undefined;

  try {
    initialData = await serverAiModelServices.getAiModels();
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <AiModelsClient initialData={initialData} />
    </Suspense>
  );
};

export default AiModelsModule;
