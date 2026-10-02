import { z } from 'zod';

export const createResourceEditSchema = (messages?: {
  titleRequired?: string;
  newProfessorRequired?: string;
  newCourseRequired?: string;
}) =>
  z
    .object({
      title: z
        .string()
        .min(1, { message: messages?.titleRequired ?? 'عنوان منبع الزامی است' }),
      resourceKind: z.enum(['lecture_note', 'exam_sample']),
      universityId: z.string().optional(),
      campusId: z.string().optional(),
      majorId: z.string().optional(),
      courseCategory: z.enum(['general', 'specialized']),
      degreeLevel: z.enum(['bachelor', 'master', 'phd']),
      professorId: z.string().optional(),
      professorName: z.string().optional(),
      professorIsNew: z.boolean(),
      courseId: z.string().optional(),
      courseName: z.string().optional(),
      courseIsNew: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.professorIsNew) {
        if (!data.professorId && (!data.professorName || !data.professorName.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['professorName'],
            message: messages?.newProfessorRequired ?? 'نام استاد جدید الزامی است',
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
            message: messages?.newCourseRequired ?? 'عنوان درس جدید الزامی است',
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

export const resourceEditSchema = createResourceEditSchema();

export type ResourceEditFormValues = z.infer<typeof resourceEditSchema>;
