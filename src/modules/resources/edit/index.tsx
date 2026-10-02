import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { serverResourceServices } from '@/apis/services/resources/server';
import { ResourceEditClient } from './resource-edit-client';
import { ResourceEditFallback } from './skeleton/resource-edit-fallback';

interface ResourceEditModuleProps {
  id: string;
}

export const ResourceEditModule = async ({ id }: ResourceEditModuleProps) => {
  await connection();

  let resource = null;
  try {
    resource = await serverResourceServices.getResourceById(id);
  } catch {
    notFound();
  }

  if (!resource) {
    notFound();
  }

  return (
    <Suspense fallback={<ResourceEditFallback />}>
      <ResourceEditClient resource={resource} />
    </Suspense>
  );
};

export default ResourceEditModule;
