import { connection } from 'next/server';
import { Suspense } from 'react';
import UsersClient from './users-client';
import { getUsersInitialData } from './users.server';

type UsersModuleProps = {
  searchParams: Promise<PageSearchParams>;
};

const UsersModule = async ({ searchParams }: UsersModuleProps) => {
  await connection();
  const initialData = await getUsersInitialData(await searchParams);

  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />}>
      <UsersClient initialData={initialData} />
    </Suspense>
  );
};

export default UsersModule;
