import { z } from 'zod';

export const createReviewEditSchema = (messages?: {
  contentRequired?: string;
  newProfessorRequired?: string;
  newCourseRequired?: string;
}) =>
  z
    .object({
      universityId: z.string().optional(),
      campusId: z.string().optional(),
      majorId: z.string().optional(),
      courseCategory: z.enum(['general', 'specialized']),
      degreeLevel: z.enum(['bachelor', 'master', 'phd']),
      semester: z.string().optional(),
      professorId: z.string().optional(),
      professorName: z.string().optional(),
      professorIsNew: z.boolean(),
      courseId: z.string().optional(),
      courseName: z.string().optional(),
      courseIsNew: z.boolean(),
      content: z
        .string()
        .min(1, { message: messages?.contentRequired ?? 'Review content cannot be empty' }),
    })
    .superRefine((data, ctx) => {
      if (data.professorIsNew) {
        if (!data.professorId && (!data.professorName || !data.professorName.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['professorName'],
            message: messages?.newProfessorRequired ?? 'New professor name is required',
          });
        }
      } else {
        if (!data.professorId || !data.professorId.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['professorId'],
            message: 'انتخاب استاد الزامی است',
          });
        }
      }

      if (data.courseIsNew) {
        if (!data.courseId && (!data.courseName || !data.courseName.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['courseName'],
            message: messages?.newCourseRequired ?? 'New course name is required',
          });
        }
      } else {
        if (!data.courseId || !data.courseId.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['courseId'],
            message: 'انتخاب درس الزامی است',
          });
        }
      }
    });

export const reviewEditSchema = createReviewEditSchema();

export type ReviewEditFormValues = z.infer<typeof reviewEditSchema>;
