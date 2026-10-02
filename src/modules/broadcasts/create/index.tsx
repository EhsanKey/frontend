import { Suspense } from 'react';
import { connection } from 'next/server';
import { BroadcastCreateClient } from './broadcast-create-client';
import { BroadcastCreateFallback } from './skeleton/broadcast-create-fallback';

export const BroadcastCreateModule = async () => {
  await connection();

  return (
    <Suspense fallback={<BroadcastCreateFallback />}>
      <BroadcastCreateClient />
    </Suspense>
  );
};

export default BroadcastCreateModule;
