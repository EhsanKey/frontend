import { z } from 'zod';

export interface AddChannelValidationMessages {
  titleRequired?: string;
  usernameRequired?: string;
  folderChannelRequired?: string;
  universityRequired?: string;
  campusRequired?: string;
}

export const createAddChannelSchema = (messages?: AddChannelValidationMessages) =>
  z
    .object({
      mode: z.enum(['public', 'folder']),
      usernameOrLink: z.string().optional(),
      title: z.string().min(1, { message: messages?.titleRequired ?? 'Title required' }),
      telegramChannelId: z.string().optional(),
      accessHash: z.string().nullable().optional(),
      isPrivate: z.boolean().default(false),
      universityId: z
        .string()
        .min(1, { message: messages?.universityRequired ?? 'University required' }),
      campusId: z
        .string()
        .min(1, { message: messages?.campusRequired ?? 'Campus required' }),
      majorId: z.string().nullable().optional(),
      syncHistorical: z.boolean().default(true),
    })
    .superRefine((data, ctx) => {
      if (data.mode === 'public') {
        if (!data.usernameOrLink?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages?.usernameRequired ?? 'Channel username or link required',
            path: ['usernameOrLink'],
          });
        }
      } else {
        if (!data.telegramChannelId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages?.folderChannelRequired ?? 'Folder channel required',
            path: ['telegramChannelId'],
          });
        }
      }
    });

export const addChannelSchema = createAddChannelSchema();
export type AddChannelFormValues = z.infer<typeof addChannelSchema>;
