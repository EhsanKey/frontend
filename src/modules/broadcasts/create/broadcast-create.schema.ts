import { z } from 'zod';

export const createInlineKeyboardButtonSchema = (messages?: {
  buttonText?: string;
  buttonUrl?: string;
}) =>
  z.object({
    id: z.string(),
    text: z.string().min(1, { message: messages?.buttonText ?? 'Button text cannot be empty' }),
    url: z.string().url({ message: messages?.buttonUrl ?? 'Button URL is invalid' }),
  });

export const inlineKeyboardButtonSchema = createInlineKeyboardButtonSchema();

export const broadcastTargetFiltersSchema = z.object({
  targetType: z.enum(['all', 'filtered']),
  universityId: z.string().nullable().optional(),
  campusId: z.string().nullable().optional(),
  majorId: z.string().nullable().optional(),
  joinedFrom: z.string().nullable().optional(),
  joinedTo: z.string().nullable().optional(),
});

export const createBroadcastCreateSchema = (messages?: {
  buttonText?: string;
  buttonUrl?: string;
  titleMin?: string;
  titleMax?: string;
  messageMin?: string;
}) =>
  z.object({
    title: z
      .string()
      .min(3, { message: messages?.titleMin ?? 'Title must be at least 3 characters' })
      .max(150, { message: messages?.titleMax ?? 'Title cannot exceed 150 characters' }),
    messageText: z
      .string()
      .min(5, { message: messages?.messageMin ?? 'Message text must be at least 5 characters' }),
    parseMode: z.string(),
    inlineButtons: z.array(z.array(createInlineKeyboardButtonSchema(messages))),
    targetFilters: broadcastTargetFiltersSchema,
  });

export const broadcastCreateSchema = createBroadcastCreateSchema();

export type BroadcastCreateFormValues = z.infer<typeof broadcastCreateSchema>;
