import type { IUser, UserRole } from '@/models';

export type RouteAccessOptions = {
  allowedRoles?: UserRole[];
  adminOnly?: boolean;
  permission?: string;
};

export interface PermissionDefinition {
  code: string;
  title: string;
  description: string;
  category: 'teachings' | 'professors' | 'courses' | 'academic' | 'moderation' | 'ai' | 'system';
  categoryTitle: string;
}

export const SYSTEM_PERMISSIONS_LIST: PermissionDefinition[] = [
  // Teachings
  {
    code: 'teachings:read',
    title: 'View teachings',
    description: 'View list and details of teachings for professors and courses',
    category: 'teachings',
    categoryTitle: 'Teachings Management',
  },
  {
    code: 'teachings:create',
    title: 'Create teaching',
    description: 'Register a new teaching record for professor and course',
    category: 'teachings',
    categoryTitle: 'Teachings Management',
  },
  {
    code: 'teachings:update',
    title: 'Update teaching',
    description: 'Edit teaching details, degree level, or linked professor/course',
    category: 'teachings',
    categoryTitle: 'Teachings Management',
  },
  {
    code: 'teachings:delete',
    title: 'Delete teaching',
    description: 'Delete teaching record from the system',
    category: 'teachings',
    categoryTitle: 'Teachings Management',
  },
  {
    code: 'teachings:manage',
    title: 'Manage all teachings',
    description: 'Full access to view, create, edit, and delete teachings',
    category: 'teachings',
    categoryTitle: 'Teachings Management',
  },

  // Professors
  {
    code: 'professors:read',
    title: 'View professors',
    description: 'View professors catalog, records, and linked universities',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },
  {
    code: 'professors:create',
    title: 'Create professor',
    description: 'Define a new professor in the system',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },
  {
    code: 'professors:update',
    title: 'Update professor',
    description: 'Edit professor name and details',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },
  {
    code: 'professors:delete',
    title: 'Delete professor',
    description: 'Delete professor from the system',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },
  {
    code: 'professors:merge',
    title: 'Merge professors',
    description: 'Merge duplicate professors and transfer all records',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },
  {
    code: 'professors:manage',
    title: 'Manage all professors',
    description: 'Full access to view, create, edit, delete, and merge professors',
    category: 'professors',
    categoryTitle: 'Professors Management',
  },

  // Courses
  {
    code: 'courses:read',
    title: 'View courses',
    description: 'View courses list, syllabi, and linked teachings',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },
  {
    code: 'courses:create',
    title: 'Create course',
    description: 'Define a new course title in the system',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },
  {
    code: 'courses:update',
    title: 'Update course',
    description: 'Edit course title and details',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },
  {
    code: 'courses:delete',
    title: 'Delete course',
    description: 'Delete course from educational catalog',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },
  {
    code: 'courses:merge',
    title: 'Merge courses',
    description: 'Merge duplicate courses and transfer linked teachings and reviews',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },
  {
    code: 'courses:manage',
    title: 'Manage all courses',
    description: 'Full access to view, create, edit, delete, and merge courses',
    category: 'courses',
    categoryTitle: 'Courses Management',
  },

  // Universities, Campuses & Majors
  {
    code: 'universities:read',
    title: 'View universities',
    description: 'View universities list and subdivisions',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'universities:create',
    title: 'Create university',
    description: 'Add a new university to the system',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'universities:update',
    title: 'Update university',
    description: 'Edit university name and properties',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'universities:delete',
    title: 'Delete university',
    description: 'Delete university and attached branches',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'universities:manage',
    title: 'Manage all universities',
    description: 'Comprehensive management of universities and branches',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'campuses:read',
    title: 'View campuses / faculties',
    description: 'View campuses and university faculties',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'campuses:create',
    title: 'Create campus / faculty',
    description: 'Add a new campus or faculty for a university',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'campuses:update',
    title: 'Update campus / faculty',
    description: 'Edit campus or faculty information',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'campuses:delete',
    title: 'Delete campus / faculty',
    description: 'Delete campus or faculty from university',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'campuses:manage',
    title: 'Manage all campuses',
    description: 'Comprehensive management of campuses and faculties',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'majors:read',
    title: 'View academic majors',
    description: 'View university academic fields of study',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'majors:create',
    title: 'Create academic major',
    description: 'Add a new major to the catalog',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'majors:update',
    title: 'Update academic major',
    description: 'Edit major name and configuration',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'majors:delete',
    title: 'Delete academic major',
    description: 'Delete major from the system',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },
  {
    code: 'majors:manage',
    title: 'Manage all majors',
    description: 'Comprehensive management of academic majors',
    category: 'academic',
    categoryTitle: 'Academic Structure',
  },

  // Reviews Moderation
  {
    code: 'reviews:read',
    title: 'View student reviews',
    description: 'View list and details of student feedback submissions',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'reviews:create',
    title: 'Create review directly',
    description: 'Directly submit review or feedback for a teaching',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'reviews:update',
    title: 'Update student review',
    description: 'Edit review text or properties before approval',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'reviews:status',
    title: 'Approve or reject reviews',
    description: 'Change status to approved or rejected and invalidate AI cache',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'reviews:delete',
    title: 'Delete review',
    description: 'Permanently remove review from database',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'reviews:manage',
    title: 'Manage all reviews',
    description: 'Full access to view, approve, reject, edit, and delete reviews',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },

  // Resources Moderation
  {
    code: 'resources:read',
    title: 'View educational resources',
    description: 'View list and details of uploaded booklets and exams',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'resources:create',
    title: 'Create resource directly',
    description: 'Directly add an educational booklet or resource',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'resources:update',
    title: 'Update resource details',
    description: 'Edit title, degree level, or teaching link for resource',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'resources:status',
    title: 'Approve and publish resources',
    description: 'Approve, reject, or publish resource files to Telegram channel',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'resources:delete',
    title: 'Delete resource',
    description: 'Delete resource file from the system',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },
  {
    code: 'resources:manage',
    title: 'Manage all resources',
    description: 'Full access to all operations on educational files',
    category: 'moderation',
    categoryTitle: 'Content Moderation',
  },

  // Bot & AI
  {
    code: 'ai_models:read',
    title: 'View AI models',
    description: 'View provider configurations, tokens, and active models',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'ai_models:manage',
    title: 'Manage AI models',
    description: 'Configure API keys, model switching, and generation parameters',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'groups:read',
    title: 'View Telegram groups',
    description: 'View group associations to universities and scope bindings',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'groups:manage',
    title: 'Manage Telegram groups',
    description: 'Configure group links to university scopes and policies',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'telegram:read',
    title: 'View Telegram users and history',
    description: 'View bot users list, message logs, and usage statistics',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'broadcasts:read',
    title: 'View broadcast messages',
    description: 'View history of broadcast announcements sent to bot users',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'broadcasts:create',
    title: 'Send broadcast message',
    description: 'Configure target audience filters and send broadcast campaign',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'broadcasts:retry',
    title: 'Retry failed broadcast',
    description: 'Resend broadcast to recipients that previously encountered errors',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'broadcasts:manage',
    title: 'Manage all broadcasts',
    description: 'Full access to create, delete, and manage broadcast campaigns',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'cache:read',
    title: 'View AI cache',
    description: 'View cached LLM responses and token savings metrics',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'cache:manage',
    title: 'Manage and invalidate AI cache',
    description: 'Smart cache invalidation by professor or course and memory wipe',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'errors:read',
    title: 'View error logs',
    description: 'Access AI, planner, and Telegram bot exception logs',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'errors:resolve',
    title: 'Resolve errors',
    description: 'Mark system exception logs as resolved',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'errors:manage',
    title: 'Manage system errors',
    description: 'Comprehensive access to view, analyze, and resolve errors',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'inquiries:read',
    title: 'Track professor inquiries',
    description: 'View statistics of students asking about professors',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'inquiries:trigger',
    title: 'Trigger 3-month follow-up',
    description: 'Manually dispatch follow-up notifications to students',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'inquiries:manage',
    title: 'Manage professor follow-ups',
    description: 'Full management of student inquiry and follow-up pipelines',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'system_pipeline:read',
    title: 'View bot message pipeline',
    description: 'View message processing pipeline, flow stages, tools, and simulation runner',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'system_pipeline:manage',
    title: 'Manage bot message pipeline',
    description: 'Full management and configuration of bot flow stages and scenarios',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },
  {
    code: 'analytics:read',
    title: 'Analytics dashboard',
    description: 'Access summary statistics, saved tokens, and top professors',
    category: 'ai',
    categoryTitle: 'AI & Bot',
  },

  // System & Auditing
  {
    code: 'audit_logs:read',
    title: 'View audit logs',
    description: 'View and filter system event logs and admin actions',
    category: 'system',
    categoryTitle: 'System & Auditing',
  },
  {
    code: 'admins:manage',
    title: 'Manage panel admins',
    description: 'Create admins, edit permissions, and assign organizational scopes',
    category: 'system',
    categoryTitle: 'System & Auditing',
  },
  {
    code: 'roles:manage',
    title: 'Manage user roles',
    description: 'Define roles and assign default permission sets',
    category: 'system',
    categoryTitle: 'System & Auditing',
  },
];

export const hasRole = (
  user: IUser | null,
  allowedRoles?: UserRole[],
): boolean => {
  if (!user) {
    return false;
  }
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  if (user.isSuperAdmin || user.role === 'super_admin' || user.roles?.includes('super_admin')) {
    return true;
  }
  if (allowedRoles.includes(user.role)) {
    return true;
  }
  if (user.roles && user.roles.some((r) => allowedRoles.includes(r))) {
    return true;
  }
  return false;
};

export const hasPermission = (
  user: IUser | null,
  permission?: string,
): boolean => {
  if (!user) {
    return false;
  }
  if (!permission) {
    return true;
  }

  const permissions = Array.isArray(user.permissions) ? user.permissions : [];

  if (
    user.isSuperAdmin ||
    user.role === 'super_admin' ||
    user.roles?.includes('super_admin') ||
    permissions.includes('*') ||
    permissions.includes('*:manage')
  ) {
    return true;
  }

  // Exact match
  if (permissions.includes(permission)) {
    return true;
  }

  // Domain wildcard (e.g. teachings:manage grants teachings:create, teachings:read, etc.)
  const [domain] = permission.split(':');
  if (domain && (permissions.includes(`${domain}:manage`) || permissions.includes(`${domain}:*`))) {
    return true;
  }

  // Domain-specific aliases and backward compatibility (aligned with backend access-control.ts)
  if (domain === 'teachings' && (permissions.includes('professors:manage') || permissions.includes('courses:manage'))) {
    return true;
  }
  if (domain === 'campuses' && permissions.includes('universities:manage')) {
    return true;
  }
  if (domain === 'majors' && permissions.includes('universities:manage')) {
    return true;
  }
  if (permission === 'reviews:status' && permissions.includes('reviews:approve')) {
    return true;
  }
  if (permission === 'reviews:approve' && permissions.includes('reviews:status')) {
    return true;
  }
  if (permission === 'resources:status' && permissions.includes('resources:approve')) {
    return true;
  }
  if (permission === 'resources:approve' && permissions.includes('resources:status')) {
    return true;
  }
  if (permission === 'errors:resolve' && permissions.includes('errors:manage')) {
    return true;
  }
  if (permission === 'inquiries:trigger' && permissions.includes('inquiries:manage')) {
    return true;
  }
  if (permission === 'audit_logs:read' && permissions.includes('admins:manage')) {
    return true;
  }
  if (permission === 'groups:read' && permissions.includes('groups:manage')) {
    return true;
  }
  if (permission === 'ai_models:read' && (permissions.includes('ai_models:manage') || permissions.includes('admins:manage'))) {
    return true;
  }
  if (permission === 'system_pipeline:read' && (permissions.includes('system_pipeline:manage') || permissions.includes('admins:manage'))) {
    return true;
  }

  return false;
};

export const canAccessRoute = (
  user: IUser | null,
  options?: RouteAccessOptions,
): boolean => {
  if (!user) {
    return false;
  }

  const permissions = Array.isArray(user.permissions) ? user.permissions : [];

  if (
    user.isSuperAdmin ||
    user.role === 'super_admin' ||
    user.roles?.includes('super_admin') ||
    permissions.includes('*') ||
    permissions.includes('*:manage')
  ) {
    return true;
  }

  if (options?.adminOnly && !user.isSuperAdmin && user.role !== 'super_admin' && !user.roles?.includes('super_admin')) {
    return false;
  }

  if (options?.allowedRoles && !hasRole(user, options.allowedRoles)) {
    return false;
  }

  if (options?.permission && !hasPermission(user, options.permission)) {
    return false;
  }

  return true;
};

