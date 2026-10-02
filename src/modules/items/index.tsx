import { connection } from 'next/server';
import { Suspense } from 'react';
import ItemsClient from './items-client';
import { getItemsInitialData } from './items.server';
import ItemsClientFallback from './skeleton/items-client-fallback';

type ItemsModuleProps = {
  searchParams: Promise<PageSearchParams>;
};

const ItemsModule = async ({ searchParams }: ItemsModuleProps) => {
  await connection();
  const initialData = await getItemsInitialData(await searchParams);

  return (
    <Suspense fallback={<ItemsClientFallback />}>
      <ItemsClient initialData={initialData} />
    </Suspense>
  );
};

export default ItemsModule;
