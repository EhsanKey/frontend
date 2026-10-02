import { z } from 'zod';

export const createItemFormSchema = (messages?: {
  titleRequired?: string;
  categoryRequired?: string;
  statusRequired?: string;
}) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(2, messages?.titleRequired ?? 'Title must be at least 2 characters.'),
    category: z.enum(['general', 'technical', 'financial', 'administrative'], {
      message: messages?.categoryRequired ?? 'Category is required.',
    }),
    status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE'], {
      message: messages?.statusRequired ?? 'Status is required.',
    }),
    description: z.string().optional(),
  });

export const itemFormSchema = createItemFormSchema();

export type ItemFormValues = z.infer<typeof itemFormSchema>;
