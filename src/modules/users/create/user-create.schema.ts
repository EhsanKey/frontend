import { z } from 'zod';

export const createUserCreateSchema = (messages?: {
  usernameMin?: string;
  usernameMax?: string;
  usernameRegex?: string;
  nameMin?: string;
  nameMax?: string;
  passwordMin?: string;
  roleRequired?: string;
}) =>
  z.object({
    username: z
      .string()
      .min(3, { message: messages?.usernameMin ?? 'Username must be at least 3 characters' })
      .max(50, { message: messages?.usernameMax ?? 'Username must be at most 50 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          messages?.usernameRegex ??
          'Username can only contain English letters, numbers, and underscores',
      }),
    name: z
      .string()
      .min(2, { message: messages?.nameMin ?? 'Name must be at least 2 characters' })
      .max(100, { message: messages?.nameMax ?? 'Name must be at most 100 characters' }),
    password: z
      .string()
      .min(8, { message: messages?.passwordMin ?? 'Password must be at least 8 characters' }),
    role: z
      .string()
      .min(1, { message: messages?.roleRequired ?? 'Role is required' }),
    isActive: z.boolean(),
    permissions: z.array(z.string()),
    scopes: z.object({
      allUniversities: z.boolean().optional(),
      universityIds: z.array(z.string()).optional(),
      allCampuses: z.boolean().optional(),
      campusIds: z.array(z.string()).optional(),
      allMajors: z.boolean().optional(),
      majorIds: z.array(z.string()).optional(),
    }),
  });

export const userCreateSchema = createUserCreateSchema();

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;
