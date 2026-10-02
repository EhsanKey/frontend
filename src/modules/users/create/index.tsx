import { Suspense } from 'react';
import { connection } from 'next/server';
import { UserCreateClient } from './user-create-client';
import { UserCreateFallback } from './skeleton/user-create-fallback';

export const UserCreateModule = async () => {
  await connection();

  return (
    <Suspense fallback={<UserCreateFallback />}>
      <UserCreateClient />
    </Suspense>
  );
};

export default UserCreateModule;
