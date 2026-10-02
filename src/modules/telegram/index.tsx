import { Suspense } from 'react';
import { PAGE_SIZE } from '@/constants';
import { serverTelegramServices } from '@/apis/services/telegram/server';
import { TelegramClient } from './telegram-client';

export const TelegramModule = async () => {
  let initialGroups = undefined;
  let initialUsers = undefined;
  let initialConversations = undefined;

  try {
    const [groups, users, convs] = await Promise.allSettled([
      serverTelegramServices.getTelegramGroups({ page: 1, pageSize: PAGE_SIZE }),
      serverTelegramServices.getTelegramUsers({ page: 1, pageSize: PAGE_SIZE }),
      serverTelegramServices.getTelegramConversations({ page: 1, pageSize: PAGE_SIZE }),
    ]);

    if (groups.status === 'fulfilled') initialGroups = groups.value;
    if (users.status === 'fulfilled') initialUsers = users.value;
    if (convs.status === 'fulfilled') initialConversations = convs.value;
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <TelegramClient
        initialGroups={initialGroups}
        initialUsers={initialUsers}
        initialConversations={initialConversations}
      />
    </Suspense>
  );
};

export default TelegramModule;
