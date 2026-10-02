import { z } from 'zod';

export interface CrawlerModerationValidationMessages {
  contentRequired?: string;
  universityRequired?: string;
  campusRequired?: string;
  professorRequired?: string;
  professorNameRequired?: string;
  courseRequired?: string;
  courseNameRequired?: string;
}

export const createCrawlerModerationSchema = (
  messages?: CrawlerModerationValidationMessages,
) =>
  z
    .object({
      content: z
        .string()
        .min(1, { message: messages?.contentRequired ?? 'Content required' }),
      universityId: z
        .string()
        .min(1, { message: messages?.universityRequired ?? 'University required' }),
      campusId: z
        .string()
        .min(1, { message: messages?.campusRequired ?? 'Campus required' }),
      majorId: z.string().nullable().optional(),

      isProfessorNew: z.boolean().default(false),
      professorId: z.string().nullable().optional(),
      professorName: z
        .string()
        .min(1, { message: messages?.professorNameRequired ?? 'Professor name required' }),

      isCourseNew: z.boolean().default(false),
      courseId: z.string().nullable().optional(),
      courseName: z
        .string()
        .min(1, { message: messages?.courseNameRequired ?? 'Course name required' }),
      courseCategory: z.enum(['general', 'specialized']).default('specialized'),

      degreeLevel: z
        .enum(['associate', 'bachelor', 'master', 'doctorate', 'unknown'])
        .default('bachelor'),
      semester: z.string().nullable().optional(),

      additionalCourses: z
        .array(
          z.object({
            courseId: z.string().nullable().optional(),
            courseName: z.string().min(1),
            isNew: z.boolean().default(false),
          }),
        )
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isProfessorNew && !data.professorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.professorRequired ?? 'Professor selection required',
          path: ['professorId'],
        });
      }
      if (!data.isCourseNew && !data.courseId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.courseRequired ?? 'Course selection required',
          path: ['courseId'],
        });
      }
    });

export const crawlerModerationSchema = createCrawlerModerationSchema();
export type CrawlerModerationFormValues = z.infer<typeof crawlerModerationSchema>;
