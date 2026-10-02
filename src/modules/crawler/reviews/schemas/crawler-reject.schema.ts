import { z } from 'zod';

export interface CrawlerRejectValidationMessages {
  reasonMaxLength?: string;
}

export const createCrawlerRejectSchema = (
  messages?: CrawlerRejectValidationMessages,
) =>
  z.object({
    reason: z
      .string()
      .max(500, { message: messages?.reasonMaxLength ?? 'Reason max length exceeded' })
      .optional()
      .default(''),
  });

export const crawlerRejectSchema = createCrawlerRejectSchema();
export type CrawlerRejectFormValues = z.infer<typeof crawlerRejectSchema>;
