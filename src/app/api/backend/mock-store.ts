import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  IAnalyticsOverview,
  IAuditLog,
  ICourse,
  IErrorLog,
  IInquiryFollowUpItem,
  IItem,
  IPermission,
  IProfessor,
  IProfessorAnalytics,
  IResourceSubmission,
  IReviewSubmission,
  IRole,
  ITelegramConversation,
  ITelegramGroup,
  ITelegramMessage,
  ITelegramUser,
  IAiModelConfig,
  IUser,
  IUniversity,

  ICampus,
  IMajor,
  ITeaching,
  IRegisteredReview,
  IBroadcastCampaign,
  IBroadcastRecipient,
  ISystemPipelineSpec,
} from '@/models';
import { SYSTEM_PERMISSIONS_LIST } from '@/utils/permissions';

// -------------------------------------------------------------
// 1. Current User & Admins Store
// -------------------------------------------------------------
const SYSTEM_PERMISSIONS: IPermission[] = SYSTEM_PERMISSIONS_LIST.map((p, i) => ({
  id: `p-${i + 1}`,
  code: p.code,
  description: p.description,
}));

let mockRoles: IRole[] = [
  {
    id: 'role-super-admin',
    name: 'super_admin',
    description: 'دسترسی کامل و بدون محدودیت به تمامی بخش‌های سامانه',
    permissions: SYSTEM_PERMISSIONS.map((p) => p.code),
  },
  {
    id: 'role-content-manager',
    name: 'content_manager',
    description: 'مدیریت و تایید بازخوردها، منابع، ویرایش اساتید، دروس و کش AI',
    permissions: [
      'reviews:read',
      'reviews:approve',
      'reviews:status',
      'reviews:update',
      'resources:read',
      'resources:approve',
      'resources:status',
      'resources:update',
      'professors:manage',
      'courses:manage',
      'teachings:manage',
      'analytics:read',
      'cache:read',
      'cache:manage',
    ],
  },
  {
    id: 'role-support-agent',
    name: 'support_agent',
    description: 'ره‌گیری پیام‌های پیگیری دانشجویان و مانیتورینگ خطاهای سیستم',
    permissions: [
      'inquiries:read',
      'inquiries:trigger',
      'errors:read',
      'errors:resolve',
      'reviews:read',
      'analytics:read',
    ],
  },
];

let mockUsers: IUser[] = [
  {
    id: 'c1f7b8e2-001',
    name: 'مدیر ارشد سیستم',
    displayName: 'مدیر ارشد سامانه چت‌بات',
    username: 'admin',
    role: 'super_admin',
    roles: ['super_admin'],
    roleIds: ['role-super-admin'],
    isSuperAdmin: true,
    isActive: true,
    profileImageUrl: null,
    permissions: SYSTEM_PERMISSIONS.map((p) => p.code),
    scopes: {
      allUniversities: true,
      universityIds: [],
      allCampuses: true,
      campusIds: [],
      allMajors: true,
      majorIds: [],
    },
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-09-24T05:00:00.000Z',
  },
  {
    id: 'c1f7b8e2-002',
    name: 'علی محمدی (ناظر محتوا)',
    displayName: 'ادمین دانشگاه آزاد و مهندسی',
    username: 'ali_mod',
    role: 'moderator',
    roles: ['content_manager'],
    roleIds: ['role-content-manager'],
    isSuperAdmin: false,
    isActive: true,
    profileImageUrl: null,
    permissions: [
      'reviews:read',
      'reviews:approve',
      'reviews:status',
      'reviews:update',
      'reviews:delete',
      'resources:read',
      'resources:approve',
      'resources:status',
      'resources:update',
      'resources:delete',
      'professors:manage',
      'courses:manage',
      'teachings:manage',
      'cache:read',
      'cache:manage',
    ],
    scopes: {
      allUniversities: false,
      universityIds: ['63af8cb7-cb79-4b69-8fd2-5383e491df0e'],
      allCampuses: true,
      campusIds: [],
      allMajors: false,
      majorIds: ['e98c56fa-b1e6-42d4-bb3f-a38f3ccad71a'],
    },
    createdAt: '2026-04-10T12:00:00Z',
    lastLoginAt: '2026-09-23T18:30:00Z',
  },
  {
    id: 'c1f7b8e2-003',
    name: 'زهرا موسوی (پشتیبانی)',
    displayName: 'پشتیبان فنی و پایش خطا',
    username: 'zahra_support',
    role: 'moderator',
    roles: ['support_agent'],
    roleIds: ['role-support-agent'],
    isSuperAdmin: false,
    isActive: true,
    profileImageUrl: null,
    permissions: [
      'inquiries:read',
      'inquiries:trigger',
      'errors:read',
      'errors:resolve',
      'reviews:read',
      'analytics:read',
    ],
    scopes: {
      allUniversities: true,
      universityIds: [],
      allCampuses: true,
      campusIds: [],
      allMajors: true,
      majorIds: [],
    },
    createdAt: '2026-05-15T09:00:00Z',
    lastLoginAt: '2026-09-22T10:15:00Z',
  },
];

const mockAuditLogs: IAuditLog[] = [
  {
    id: 'audit-001',
    adminUserId: 'c1f7b8e2-001',
    adminUsername: 'admin',
    action: 'TEACHING_CREATE',
    entityType: 'teaching',
    entityId: 't-1',
    details: {
      professorName: 'دکتر حسن حسنی',
      courseName: 'ریاضی عمومی ۱',
      campusName: 'دانشکده فنی',
      degreeLevel: 'bachelor',
    },
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2026-09-25T01:30:00.000Z',
  },
  {
    id: 'audit-002',
    adminUserId: 'c1f7b8e2-002',
    adminUsername: 'ali_mod',
    action: 'REVIEW_APPROVE',
    entityType: 'review_submission',
    entityId: 'rev-1',
    details: {
      professorId: 'p-1',
      professorName: 'دکتر حسنی',
      status: 'approved',
      aiCacheInvalidated: true,
    },
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-09-24T18:45:00.000Z',
  },
  {
    id: 'audit-003',
    adminUserId: 'c1f7b8e2-001',
    adminUsername: 'admin',
    action: 'PROFESSOR_UPDATE',
    entityType: 'professor',
    entityId: 'p-2',
    details: {
      name: 'دکتر محمد علوی',
      previousName: 'دکتر علوی',
    },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2026-09-24T16:15:00.000Z',
  },
  {
    id: 'audit-004',
    adminUserId: 'c1f7b8e2-001',
    adminUsername: 'admin',
    action: 'USER_CREATE',
    entityType: 'user',
    entityId: 'c1f7b8e2-002',
    details: {
      username: 'ali_mod',
      role: 'content_manager',
      permissionsCount: 14,
      scopes: {
        allUniversities: false,
        universityIds: ['63af8cb7-cb79-4b69-8fd2-5383e491df0e'],
      },
    },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2026-09-24T14:00:00.000Z',
  },
  {
    id: 'audit-005',
    adminUserId: 'c1f7b8e2-003',
    adminUsername: 'zahra_support',
    action: 'ERROR_RESOLVE',
    entityType: 'error_log',
    entityId: 'err-101',
    details: {
      source: 'ai_answer',
      resolvedMessage: 'AI generation timeout after 12000ms',
    },
    ipAddress: '192.168.1.88',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2026-09-24T11:20:00.000Z',
  },
  {
    id: 'audit-006',
    adminUserId: 'c1f7b8e2-002',
    adminUsername: 'ali_mod',
    action: 'RESOURCE_APPROVE',
    entityType: 'resource_submission',
    entityId: 'res-1',
    details: {
      resourceKind: 'lecture_note',
      courseName: 'ساختمان داده‌ها',
      publishedToTelegram: true,
    },
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-09-24T09:10:00.000Z',
  },
  {
    id: 'audit-007',
    adminUserId: 'c1f7b8e2-001',
    adminUsername: 'admin',
    action: 'CACHE_FLUSH',
    entityType: 'ai_cache',
    entityId: 'all',
    details: {
      deletedCount: 45,
      reason: 'Manual system cache flush',
    },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2026-09-23T20:00:00.000Z',
  },
];

export function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown>,
  adminUsername = 'admin',
) {
  mockAuditLogs.unshift({
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminUserId: 'c1f7b8e2-001',
    adminUsername,
    action,
    entityType,
    entityId,
    details,
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date().toISOString(),
  });
}


export function getMockCurrentUser(): IUser {
  return mockUsers[0];
}

// -------------------------------------------------------------
// 2. Analytics Mock Data
// -------------------------------------------------------------
export function getMockAnalyticsOverview(): IAnalyticsOverview {
  return {
    caching: {
      totalEntries: 64,
      totalHits: 512,
      estimatedTokensSaved: 614400,
      hitRatePercentage: 78.4,
    },
    errors: {
      total: mockErrorLogs.length,
      unresolved: mockErrorLogs.filter((e) => !e.isResolved).length,
      resolved: mockErrorLogs.filter((e) => e.isResolved).length,
      today: 1,
      bySource: {
        ai_planner: 1,
        ai_answer: 1,
        system: 2,
      },
      todayBySource: {
        ai_planner: 1,
        ai_answer: 0,
        system: 0,
      },
    },
    submissions: {
      reviews: {
        total: mockReviewSubmissions.length,
        pending: mockReviewSubmissions.filter((r) => r.status === 'pending').length,
        approved: mockReviewSubmissions.filter((r) => r.status === 'approved').length,
        rejected: mockReviewSubmissions.filter((r) => r.status === 'rejected').length,
        approvalRate: 85.2,
      },
      resources: {
        total: mockResourceSubmissions.length,
        pending: mockResourceSubmissions.filter((r) => r.status === 'pending').length,
        approved: mockResourceSubmissions.filter((r) => r.status === 'approved').length,
        rejected: mockResourceSubmissions.filter((r) => r.status === 'rejected').length,
        deliveredTokens: 142,
      },
    },
    inquiries: {
      total: 580,
      pendingFollowUps: mockInquiries.filter(
        (i) => i.inquiry.notificationStatus === 'pending',
      ).length,
      notifiedFollowUps: 198,
      byChannel: {
        private: 380,
        group: 200,
      },
      byType: {
        review: 410,
        resource: 170,
      },
    },
    telegram: {
      totalUsers: 1420,
      profileCompletedUsers: 980,
      totalConversations: 2650,
      totalMessages: 12480,
      configuredGroups: 32,
      activeGroups: 28,
    },
    academic: {
      totalUniversities: 4,
      totalCampuses: 12,
      totalMajors: 26,
      totalProfessors: 184,
      totalCourses: 240,
      totalTeachings: 320,
      professorsWithReviewsCount: 128,
    },
    aiModels: {
      totalModels: 4,
      activeModels: 3,
      totalRequests: 2840,
      totalErrors: 18,
      overallSuccessRate: 99.4,
      todayErrors: 1,
      models: [
        {
          id: 'model-1',
          name: 'Gemini 2.5 Flash Primary',
          providerName: 'Google Gemini',
          model: 'gemini-2.5-flash',
          scope: 'shared',
          status: 'active',
          isEnabled: true,
          requestCount: 1920,
          errorCount: 6,
          successRate: 99.7,
          workloadPercentage: 67.6,
          lastUsedAt: '2026-10-01T23:55:00Z',
        },
        {
          id: 'model-2',
          name: 'OpenAI GPT-4o-mini Answer',
          providerName: 'OpenAI Compatible',
          model: 'gpt-4o-mini',
          scope: 'answer',
          status: 'active',
          isEnabled: true,
          requestCount: 640,
          errorCount: 4,
          successRate: 99.4,
          workloadPercentage: 22.5,
          lastUsedAt: '2026-10-01T23:40:00Z',
        },
        {
          id: 'model-3',
          name: 'Claude 3.5 Haiku Fallback',
          providerName: 'Anthropic Compatible',
          model: 'claude-3-5-haiku',
          scope: 'planner',
          status: 'active',
          isEnabled: true,
          requestCount: 280,
          errorCount: 8,
          successRate: 97.1,
          workloadPercentage: 9.9,
          lastUsedAt: '2026-10-01T22:15:00Z',
        },
      ],
    },
    channelUsage: {
      conversations: {
        private: 1840,
        group: 810,
      },
      messages: {
        private: 7920,
        group: 4560,
      },
      inquiries: {
        private: 380,
        group: 200,
      },
      groupTrafficPercentage: 37,
      privateTrafficPercentage: 63,
      primaryChannel: 'private',
    },
    activityTrends: [
      { date: '2026-09-25', messages: 180, inquiries: 42, submissions: 12 },
      { date: '2026-09-26', messages: 210, inquiries: 55, submissions: 18 },
      { date: '2026-09-27', messages: 320, inquiries: 68, submissions: 24 },
      { date: '2026-09-28', messages: 290, inquiries: 62, submissions: 19 },
      { date: '2026-09-29', messages: 340, inquiries: 74, submissions: 28 },
      { date: '2026-09-30', messages: 410, inquiries: 88, submissions: 35 },
      { date: '2026-10-01', messages: 460, inquiries: 95, submissions: 40 },
    ],
  };
}

export function getMockProfessorAnalytics(limit = 10): IProfessorAnalytics {
  return {
    topInquired: [
      { professorId: 'prof-1', professorName: 'دکتر حسن حسنی', inquiryCount: 142 },
      { professorId: 'prof-2', professorName: 'دکتر سارا احمدی', inquiryCount: 98 },
      { professorId: 'prof-3', professorName: 'دکتر علیرضا محمدی', inquiryCount: 87 },
      { professorId: 'prof-4', professorName: 'دکتر مریم رضایی', inquiryCount: 65 },
    ].slice(0, limit),
    missingCoverage: [
      { professorId: 'prof-5', professorName: 'دکتر کامران شمس', inquiryCount: 54, reviewCount: 0 },
      { professorId: 'prof-6', professorName: 'دکتر فرناز بهرامی', inquiryCount: 38, reviewCount: 0 },
      { professorId: 'prof-7', professorName: 'دکتر بهزاد ناصری', inquiryCount: 29, reviewCount: 0 },
    ].slice(0, limit),
  };
}

// -------------------------------------------------------------
// 3. Review Submissions Store
// -------------------------------------------------------------
let mockReviewSubmissions: IReviewSubmission[] = [
  {
    id: 'rev-1',
    professorId: 'prof-1',
    professorName: 'دکتر حسن حسنی',
    courseId: 'course-1',
    courseName: 'ریاضی عمومی ۱',
    studentName: 'دانشجوی ورودی ۱۴۰۲',
    degreeLevels: 'کارشناسی',
    semester: '4041',
    content:
      'استاد بسیار با سواد و مسلط به مباحث آنالیز ریاضی هستند. اما آزمون‌های میان‌ترم و پایان‌ترم بسیار سنگین طراحی می‌شود و ارفاق نمره در پایان ترم تقریباً صفر است. اگر پایه ریاضی قوی دارید پیشنهاد می‌شود.',
    status: 'pending',
    createdAt: '2026-09-24T06:30:00Z',
  },
  {
    id: 'rev-2',
    professorId: 'prof-2',
    professorName: 'دکتر سارا احمدی',
    courseId: 'course-2',
    courseName: 'برنامه‌نویسی پیشرفته',
    studentName: 'محمد رضایی',
    degreeLevels: 'کارشناسی',
    semester: '4042',
    content:
      'یکی از بااخلاق‌ترین و مسلط‌ترین اساتید دانشکده کامپیوتر هستند. پروژه‌های عملی بر اساس مفاهیم واقعی شی‌گرایی و معماری نرم‌افزار ارائه شد که بسیار آموزنده بود.',
    status: 'pending',
    createdAt: '2026-09-24T07:10:00Z',
  },
  {
    id: 'rev-3',
    professorId: 'prof-3',
    professorName: 'دکتر علیرضا محمدی',
    courseId: 'course-3',
    courseName: 'مدارهای منطقی',
    studentName: 'امیرحسین',
    degreeLevels: 'کارشناسی',
    semester: '4032',
    content:
      'کلاس‌ها فوق‌العاده منظم تشکیل می‌شود ولی اسلایدهای درسی کمی قدیمی هستند. حضور و غیاب برای ایشان خیلی حیاتی است و کوئیزهای کلاسی تاثیر زیادی روی نمره پایانی دارد.',
    status: 'approved',
    createdAt: '2026-09-22T14:20:00Z',
  },
  {
    id: 'rev-4',
    professorId: 'prof-4',
    professorName: 'دکتر مریم رضایی',
    courseId: 'course-4',
    courseName: 'ساختمان داده‌ها و الگوریتم‌ها',
    studentName: 'زهرا کاظمی',
    degreeLevels: 'کارشناسی ارشد',
    semester: '4041',
    content:
      'حل تمرین‌های هفتگی بسیار استاندارد و پیگیرانه بود. امتحانات دقیقاً از مثال‌ها و مفاهیم سر کلاس بود و هیچ نکته مبهمی باقی نمی‌ماند.',
    status: 'approved',
    createdAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'rev-5',
    professorId: 'prof-1',
    professorName: 'دکتر حسن حسنی',
    courseId: 'course-1',
    courseName: 'ریاضی عمومی ۱',
    studentName: 'کاربر ناشناس',
    degreeLevels: 'کارشناسی',
    content: 'استاد اصلا خوب درس نمیده و به شدت بی انگیزه بود.',
    status: 'rejected',
    rejectionReason: 'بازخورد کلی، توهین‌آمیز و فاقد جزئیات علمی و آموزشی مشخص.',
    createdAt: '2026-09-19T09:15:00Z',
  },
];

// -------------------------------------------------------------
// 4. Resource Submissions Store
// -------------------------------------------------------------
let mockResourceSubmissions: IResourceSubmission[] = [
  {
    id: 'res-1',
    professorId: 'prof-1',
    professorName: 'دکتر حسن حسنی',
    courseId: 'course-1',
    courseName: 'ریاضی عمومی ۱',
    title: 'جزوه دست‌نویس کامل ریاضی ۱ - به همراه حل مسائل توابع و مشتق',
    resourceKind: 'lecture_note',
    status: 'pending',
    files: [
      {
        fileId: 'f-101',
        fileName: 'math1_lecture_notes_hasani.pdf',
        mimeType: 'application/pdf',
        fileSize: 14857600,
        fileUrl: '#',
      },
    ],
    createdAt: '2026-09-24T05:45:00Z',
  },
  {
    id: 'res-2',
    professorId: 'prof-4',
    professorName: 'دکتر مریم رضایی',
    courseId: 'course-4',
    courseName: 'ساختمان داده‌ها و الگوریتم‌ها',
    title: 'نمونه سوالات میان‌ترم و پایان‌ترم ساختمان داده سال‌های ۱۴۰۲ و ۱۴۰۳ با پاسخ تشریحی',
    resourceKind: 'exam_sample',
    status: 'pending',
    files: [
      {
        fileId: 'f-102',
        fileName: 'data_structures_exams_1402_1403.pdf',
        mimeType: 'application/pdf',
        fileSize: 6240000,
        fileUrl: '#',
      },
    ],
    createdAt: '2026-09-24T06:15:00Z',
  },
  {
    id: 'res-3',
    professorId: 'prof-2',
    professorName: 'دکتر سارا احمدی',
    courseId: 'course-2',
    courseName: 'برنامه‌نویسی پیشرفته',
    title: 'اسلایدها و پروژه‌های مرجع دوره شی‌گرایی جاوا',
    resourceKind: 'lecture_note',
    status: 'approved',
    publishedAt: '2026-09-23T12:00:00Z',
    files: [
      {
        fileId: 'f-103',
        fileName: 'java_oop_advanced_slides.zip',
        mimeType: 'application/zip',
        fileSize: 31200000,
        fileUrl: '#',
      },
    ],
    createdAt: '2026-09-23T08:00:00Z',
  },
  {
    id: 'res-4',
    professorId: 'prof-3',
    professorName: 'دکتر علیرضا محمدی',
    courseId: 'course-3',
    courseName: 'مدارهای منطقی',
    title: 'برگه خلاصه فرمول‌ها و دیاگرام‌های منطقی کارنوف',
    resourceKind: 'lecture_note',
    status: 'approved',
    publishedAt: '2026-09-21T16:00:00Z',
    files: [
      {
        fileId: 'f-104',
        fileName: 'karnaugh_cheatsheet.pdf',
        mimeType: 'application/pdf',
        fileSize: 1840000,
        fileUrl: '#',
      },
    ],
    createdAt: '2026-09-21T10:00:00Z',
  },
];

// -------------------------------------------------------------
// 5. Professors Store (with Merge & Relation Counts)
// -------------------------------------------------------------
let mockProfessors: IProfessor[] = [
  {
    id: 'prof-1',
    name: 'دکتر حسن حسنی',
    title: 'استاد تمام',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    campusId: 'camp-1',
    campusName: 'دانشکده علوم ریاضی',
    department: 'ریاضی محض و کاربردی',
    email: 'hasani@sharif.edu',
    bio: 'دکتری ریاضی از دانشگاه کمبریج، با بیش از ۲۰ سال سابقه تدریس ریاضی عمومی و آنالیز عددی.',
    relationCounts: { teachings: 8, reviews: 45, resources: 12, inquiries: 142 },
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'prof-2',
    name: 'دکتر سارا احمدی',
    title: 'دانشیار',
    universityId: 'uni-2',
    universityName: 'دانشگاه تهران',
    campusId: 'camp-2',
    campusName: 'دانشکده فنی',
    department: 'مهندسی کامپیوتر',
    email: 's.ahmadi@ut.ac.ir',
    bio: 'متخصص معماری نرم‌افزار و سیستم‌های توزیع‌شده.',
    relationCounts: { teachings: 6, reviews: 38, resources: 9, inquiries: 98 },
    createdAt: '2025-09-10T00:00:00Z',
  },
  {
    id: 'prof-3',
    name: 'دکتر علیرضا محمدی',
    title: 'استادیار',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    campusId: 'camp-3',
    campusName: 'دانشکده مهندسی برق',
    department: 'سیستم‌های دیجیتال',
    email: 'mohammadi@sharif.edu',
    bio: 'پژوهشگر سامانه‌های نهفته و مدارات مجتمع با کارایی بالا.',
    relationCounts: { teachings: 5, reviews: 26, resources: 8, inquiries: 87 },
    createdAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'prof-4',
    name: 'دکتر مریم رضایی',
    title: 'دانشیار',
    universityId: 'uni-3',
    universityName: 'دانشگاه صنعتی امیرکبیر',
    campusId: 'camp-4',
    campusName: 'دانشکده کامپیوتر',
    department: 'هوش مصنوعی و الگوریتم',
    email: 'rezaei@aut.ac.ir',
    bio: 'تدریس ساختمان داده‌ها، طراحی الگوریتم و یادگیری عمیق.',
    relationCounts: { teachings: 7, reviews: 52, resources: 15, inquiries: 65 },
    createdAt: '2025-10-15T00:00:00Z',
  },
  {
    id: 'prof-5',
    name: 'دکتر کامران شمس',
    title: 'استادیار',
    universityId: 'uni-2',
    universityName: 'دانشگاه تهران',
    campusId: 'camp-2',
    campusName: 'دانشکده فنی',
    department: 'مهندسی کامپیوتر',
    email: 'shams@ut.ac.ir',
    bio: 'تدریس دروس سیستم‌عامل و شبکه‌های رایانه‌ای.',
    relationCounts: { teachings: 4, reviews: 0, resources: 2, inquiries: 54 },
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'prof-6',
    name: 'دکتر فرناز بهرامی',
    title: 'استادیار',
    universityId: 'uni-3',
    universityName: 'دانشگاه صنعتی امیرکبیر',
    campusId: 'camp-4',
    campusName: 'دانشکده کامپیوتر',
    department: 'فناوری اطلاعات',
    email: 'bahrami@aut.ac.ir',
    bio: 'طراحی پایگاه داده‌ها و پردازش کلان‌داده.',
    relationCounts: { teachings: 3, reviews: 0, resources: 1, inquiries: 38 },
    createdAt: '2026-03-01T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6. Courses Store (with Merge & Relation Counts)
// -------------------------------------------------------------
let mockCourses: ICourse[] = [
  {
    id: 'course-1',
    name: 'ریاضی عمومی ۱',
    code: 'MATH101',
    units: 3,
    department: 'ریاضیات',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    relationCounts: { teachings: 12, reviews: 78, resources: 24 },
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'course-2',
    name: 'برنامه‌نویسی پیشرفته',
    code: 'CE102',
    units: 3,
    department: 'مهندسی کامپیوتر',
    universityId: 'uni-2',
    universityName: 'دانشگاه تهران',
    relationCounts: { teachings: 8, reviews: 64, resources: 18 },
    createdAt: '2025-08-10T00:00:00Z',
  },
  {
    id: 'course-3',
    name: 'مدارهای منطقی',
    code: 'EE201',
    units: 3,
    department: 'مهندسی برق',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    relationCounts: { teachings: 6, reviews: 42, resources: 14 },
    createdAt: '2025-08-15T00:00:00Z',
  },
  {
    id: 'course-4',
    name: 'ساختمان داده‌ها و الگوریتم‌ها',
    code: 'CE203',
    units: 3,
    department: 'مهندسی کامپیوتر',
    universityId: 'uni-3',
    universityName: 'دانشگاه صنعتی امیرکبیر',
    relationCounts: { teachings: 10, reviews: 92, resources: 31 },
    createdAt: '2025-08-20T00:00:00Z',
  },
  {
    id: 'course-5',
    name: 'سیستم‌های عامل',
    code: 'CE301',
    units: 3,
    department: 'مهندسی کامپیوتر',
    universityId: 'uni-2',
    universityName: 'دانشگاه تهران',
    relationCounts: { teachings: 5, reviews: 35, resources: 9 },
    createdAt: '2025-08-25T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6.1 Universities Store
// -------------------------------------------------------------
let mockUniversities: IUniversity[] = [
  {
    id: 'uni-1',
    name: 'دانشگاه صنعتی شریف',
    slug: 'sharif',
    city: 'تهران',
    description: 'دانشگاه صنعتی شریف، دانشگاه پیشرو در علوم مهندسی و پایه‌ای در کشور.',
    campusCount: 2,
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'uni-2',
    name: 'دانشگاه تهران',
    slug: 'ut',
    city: 'تهران',
    description: 'نماد آموزش عالی ایران و کهن‌ترین دانشگاه مدرن کشور.',
    campusCount: 2,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'uni-3',
    name: 'دانشگاه صنعتی امیرکبیر',
    slug: 'aut',
    city: 'تهران',
    description: 'پلی‌تکنیک تهران، دانشگاه نام‌آور مهندسی و فناوری.',
    campusCount: 1,
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'uni-4',
    name: 'دانشگاه شهید بهشتی',
    slug: 'sbu',
    city: 'تهران',
    description: 'دانشگاه جامع آموزشی و پژوهشی در شمال تهران.',
    campusCount: 1,
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'uni-5',
    name: 'دانشگاه علم و صنعت ایران',
    slug: 'iust',
    city: 'تهران',
    description: 'دانشگاه پیشگام صنعتی و مهندسی در شرق تهران.',
    campusCount: 1,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'uni-6',
    name: 'دانشگاه شیراز',
    slug: 'shirazu',
    city: 'شیراز',
    description: 'قطب علمی و دانشگاه مادر در جنوب کشور.',
    campusCount: 1,
    createdAt: '2025-03-10T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6.2 Campuses Store
// -------------------------------------------------------------
let mockCampuses: ICampus[] = [
  {
    id: 'camp-1',
    name: 'دانشکده مهندسی کامپیوتر',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    description: 'دانشکده کامپیوتر شریف، برترین مرکز آموزش علوم و مهندسی کامپیوتر کشور.',
    majorCount: 3,
    createdAt: '2025-01-12T00:00:00Z',
  },
  {
    id: 'camp-2',
    name: 'دانشکده فنی',
    universityId: 'uni-2',
    universityName: 'دانشگاه تهران',
    description: 'پردیس دانشکده‌های فنی دانشگاه تهران، مهد مهندسی کشور.',
    majorCount: 4,
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'camp-3',
    name: 'دانشکده علوم ریاضی',
    universityId: 'uni-1',
    universityName: 'دانشگاه صنعتی شریف',
    description: 'مرکز آموزش عالی ریاضیات محض، کاربردی و علوم کامپیوتر شریف.',
    majorCount: 2,
    createdAt: '2025-01-25T00:00:00Z',
  },
  {
    id: 'camp-4',
    name: 'دانشکده مهندسی کامپیوتر و IT',
    universityId: 'uni-3',
    universityName: 'دانشگاه صنعتی امیرکبیر',
    description: 'دانشکده مهندسی کامپیوتر پلی‌تکنیک تهران.',
    majorCount: 3,
    createdAt: '2025-02-05T00:00:00Z',
  },
  {
    id: 'camp-5',
    name: 'دانشکده مهندسی برق',
    universityId: 'uni-5',
    universityName: 'دانشگاه علم و صنعت ایران',
    description: 'دانشکده مهندسی برق علم و صنعت.',
    majorCount: 2,
    createdAt: '2025-03-05T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6.3 Majors Store
// -------------------------------------------------------------
let mockMajors: IMajor[] = [
  {
    id: 'major-1',
    name: 'مهندسی نرم‌افزار',
    code: '41201',
    department: 'مهندسی کامپیوتر',
    degreeLevels: ['bachelor', 'master', 'doctorate'],
    description: 'طراحی، توسعه و نگهداری سامانه‌های نرم‌افزاری مقیاس‌پذیر.',
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'major-2',
    name: 'هوش مصنوعی و رباتیکز',
    code: '41202',
    department: 'مهندسی کامپیوتر',
    degreeLevels: ['master', 'doctorate'],
    description: 'یادگیری ماشین، بینایی ماشین، پردازش زبان طبیعی و رباتیک.',
    createdAt: '2025-01-12T00:00:00Z',
  },
  {
    id: 'major-3',
    name: 'علوم کامپیوتر',
    code: '31101',
    department: 'علوم ریاضی',
    degreeLevels: ['bachelor', 'master', 'doctorate'],
    description: 'نظریه محاسبات، الگوریتم‌ها و ساختارهای داده.',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'major-4',
    name: 'مهندسی فناوری اطلاعات (IT)',
    code: '41204',
    department: 'فناوری اطلاعات',
    degreeLevels: ['bachelor', 'master'],
    description: 'مدیریت و مهندسی داده‌ها، شبکه‌ها و تجارت الکترونیک.',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'major-5',
    name: 'ریاضیات و کاربردها',
    code: '31201',
    department: 'علوم ریاضی',
    degreeLevels: ['bachelor', 'master', 'doctorate'],
    description: 'آنالیز، جبر، محاسبات عددی و بهینه‌سازی.',
    createdAt: '2025-02-10T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6.4 Teachings Store
// -------------------------------------------------------------
let mockTeachings: ITeaching[] = [
  {
    id: 'teach-1',
    degreeLevel: 'bachelor',
    professorId: 'prof-1',
    professor: { id: 'prof-1', name: 'دکتر علیرضا رضوی' },
    courseId: 'course-1',
    course: { id: 'course-1', name: 'ریاضی عمومی ۱' },
    campusId: 'camp-1',
    campus: {
      id: 'camp-1',
      name: 'دانشکده مهندسی کامپیوتر',
      university: { id: 'uni-1', name: 'دانشگاه صنعتی شریف' },
    },
    majorId: 'major-1',
    major: { id: 'major-1', name: 'مهندسی نرم‌افزار' },
    semester: 'نیم‌سال اول ۱۴۰۴-۱۴۰۵',
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'teach-2',
    degreeLevel: 'bachelor',
    professorId: 'prof-2',
    professor: { id: 'prof-2', name: 'دکتر سارا حسینی' },
    courseId: 'course-2',
    course: { id: 'course-2', name: 'برنامه‌نویسی پیشرفته' },
    campusId: 'camp-2',
    campus: {
      id: 'camp-2',
      name: 'دانشکده فنی',
      university: { id: 'uni-2', name: 'دانشگاه تهران' },
    },
    majorId: 'major-1',
    major: { id: 'major-1', name: 'مهندسی نرم‌افزار' },
    semester: 'نیم‌سال دوم ۱۴۰۳-۱۴۰۴',
    createdAt: '2025-09-10T00:00:00Z',
  },
  {
    id: 'teach-3',
    degreeLevel: 'master',
    professorId: 'prof-4',
    professor: { id: 'prof-4', name: 'دکتر مریم رضایی' },
    courseId: 'course-3',
    course: { id: 'course-3', name: 'ساختمان داده‌ها' },
    campusId: 'camp-4',
    campus: {
      id: 'camp-4',
      name: 'دانشکده مهندسی کامپیوتر و IT',
      university: { id: 'uni-3', name: 'دانشگاه صنعتی امیرکبیر' },
    },
    majorId: 'major-2',
    major: { id: 'major-2', name: 'هوش مصنوعی و رباتیکز' },
    semester: 'نیم‌سال اول ۱۴۰۴-۱۴۰۵',
    createdAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'teach-4',
    degreeLevel: 'bachelor',
    professorId: 'prof-5',
    professor: { id: 'prof-5', name: 'دکتر کامران شمس' },
    courseId: 'course-4',
    course: { id: 'course-4', name: 'سیستم‌های عامل' },
    campusId: 'camp-2',
    campus: {
      id: 'camp-2',
      name: 'دانشکده فنی',
      university: { id: 'uni-2', name: 'دانشگاه تهران' },
    },
    majorId: 'major-1',
    major: { id: 'major-1', name: 'مهندسی نرم‌افزار' },
    semester: 'نیم‌سال اول ۱۴۰۴-۱۴۰۵',
    createdAt: '2025-09-20T00:00:00Z',
  },
];

// -------------------------------------------------------------
// 6.5 Registered Reviews Store
// -------------------------------------------------------------
let mockRegisteredReviews: IRegisteredReview[] = [
  {
    id: 'rev-reg-1',
    content: 'استاد بسیار با حوصله هستند و مفاهیم ریاضی را با مثال‌های کاربردی توضیح می‌دهند.',
    teachingId: 'teach-1',
    source: 'student',
    submissionId: 'rev-sub-1',
    semester: '4041',
    student: {
      id: 'tg-101',
      firstName: 'علی',
      lastName: 'رضایی',
      username: 'alireza_stu',
    },
    teaching: mockTeachings[0],
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'rev-reg-2',
    content: 'پروژه‌های عملی بسیار مفید است اما تحویل تمارین کمی فشرده است.',
    teachingId: 'teach-2',
    source: 'system',
    student: null,
    semester: '4042',
    teaching: mockTeachings[1],
    createdAt: '2026-09-18T14:30:00Z',
    updatedAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'rev-reg-3',
    content: 'یکی از بهترین اساتید درس ساختمان داده، امتحان استاندارد و کلاس‌ها کاملاً تعاملی است.',
    teachingId: 'teach-3',
    source: 'student',
    submissionId: 'rev-sub-2',
    semester: '4032',
    student: {
      id: 'tg-102',
      firstName: 'سارا',
      lastName: 'احمدی',
      username: 'sara_stu',
    },
    teaching: mockTeachings[2],
    createdAt: '2026-09-15T09:15:00Z',
    updatedAt: '2026-09-15T09:15:00Z',
  },
  {
    id: 'rev-reg-4',
    content: 'نظم در برگزاری جلسات کلاس و حضور به موقع از ویژگی‌های بارز ایشان است.',
    teachingId: 'teach-1',
    source: 'admin',
    student: null,
    semester: '4041',
    teaching: mockTeachings[0],
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-09-22T11:00:00Z',
  },
];

// -------------------------------------------------------------
// 7. Student Inquiries Store (3-Month Follow-Up Campaign)
// -------------------------------------------------------------
const mockInquiries: IInquiryFollowUpItem[] = [
  {
    id: 'inq-12',
    inquiry: {
      id: 'inq-12',
      telegramUserId: '10928374',
      professorId: 'prof-1',
      professorName: 'دکتر حسن حسنی',
      courseName: 'ریاضی ۱',
      channel: 'group',
      telegramChatId: '-1002345678',
      inquiredAt: '2026-06-20T10:00:00.000Z',
      followUpEligibleAt: '2026-09-18T10:00:00.000Z',
      notificationStatus: 'pending',
      notificationSentAt: null,
    },
    user: {
      id: '10928374',
      username: 'reza_ahmadi_std',
      firstName: 'رضا',
      lastName: 'احمدی',
    },
    professor: {
      id: 'prof-1',
      name: 'دکتر حسن حسنی',
    },
    course: {
      id: 'course-1',
      name: 'ریاضی عمومی ۱',
    },
  },
  {
    id: 'inq-13',
    inquiry: {
      id: 'inq-13',
      telegramUserId: '20495837',
      professorId: 'prof-2',
      professorName: 'دکتر سارا احمدی',
      courseName: 'برنامه‌نویسی پیشرفته',
      channel: 'direct',
      telegramChatId: '20495837',
      inquiredAt: '2026-06-22T14:30:00.000Z',
      followUpEligibleAt: '2026-09-20T14:30:00.000Z',
      notificationStatus: 'pending',
      notificationSentAt: null,
    },
    user: {
      id: '20495837',
      username: 'sara_kiani',
      firstName: 'سارا',
      lastName: 'کیانی',
    },
    professor: {
      id: 'prof-2',
      name: 'دکتر سارا احمدی',
    },
    course: {
      id: 'course-2',
      name: 'برنامه‌نویسی پیشرفته',
    },
  },
  {
    id: 'inq-14',
    inquiry: {
      id: 'inq-14',
      telegramUserId: '38472910',
      professorId: 'prof-4',
      professorName: 'دکتر مریم رضایی',
      courseName: 'ساختمان داده‌ها',
      channel: 'group',
      telegramChatId: '-1003847291',
      inquiredAt: '2026-06-15T09:15:00.000Z',
      followUpEligibleAt: '2026-09-13T09:15:00.000Z',
      notificationStatus: 'sent',
      notificationSentAt: '2026-09-22T18:00:00.000Z',
    },
    user: {
      id: '38472910',
      username: 'sina_farhadi',
      firstName: 'سینا',
      lastName: 'فرهادی',
    },
    professor: {
      id: 'prof-4',
      name: 'دکتر مریم رضایی',
    },
    course: {
      id: 'course-4',
      name: 'ساختمان داده‌ها و الگوریتم‌ها',
    },
  },
];

// -------------------------------------------------------------
// 7.5. Inquiry Topics Store (Clustering & Campaigns)
// -------------------------------------------------------------
const mockInquiryTopics: any[] = [
  {
    id: 'topic-1',
    canonicalName: 'دکتر حسن حسنی',
    normalizedCanonicalName: 'دکتر حسن حسنی',
    topicType: 'professor',
    status: 'active',
    totalQueries: 14,
    professor: { id: 'prof-1', name: 'دکتر حسن حسنی' },
    course: null,
    uniqueStudentsCount: 11,
    pendingInquiriesCount: 8,
    sentInquiriesCount: 2,
    convertedInquiriesCount: 1,
    conversionRate: 33,
    aliases: [
      { id: 'alias-1', rawAlias: 'استاد حسنی', normalizedAlias: 'استاد حسنی', queryCount: 8 },
      { id: 'alias-2', rawAlias: 'حسن حسنی', normalizedAlias: 'حسن حسنی', queryCount: 4 },
      { id: 'alias-3', rawAlias: 'دکتر حسنی', normalizedAlias: 'دکتر حسنی', queryCount: 2 },
    ],
    createdAt: '2026-06-20T10:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'topic-2',
    canonicalName: 'استاد مسعود حسنی',
    normalizedCanonicalName: 'استاد مسعود حسنی',
    topicType: 'professor',
    status: 'active',
    totalQueries: 6,
    professor: null,
    course: null,
    uniqueStudentsCount: 5,
    pendingInquiriesCount: 4,
    sentInquiriesCount: 1,
    convertedInquiriesCount: 0,
    conversionRate: 0,
    aliases: [
      { id: 'alias-4', rawAlias: 'مسعود حسنی', normalizedAlias: 'مسعود حسنی', queryCount: 4 },
      { id: 'alias-5', rawAlias: 'استاد مسعود حسنی', normalizedAlias: 'استاد مسعود حسنی', queryCount: 2 },
    ],
    createdAt: '2026-07-15T12:00:00.000Z',
    updatedAt: '2026-09-22T14:00:00.000Z',
  },
  {
    id: 'topic-3',
    canonicalName: 'ریاضی عمومی ۱',
    normalizedCanonicalName: 'ریاضی عمومی ۱',
    topicType: 'course',
    status: 'active',
    totalQueries: 9,
    professor: null,
    course: { id: 'course-1', name: 'ریاضی عمومی ۱' },
    uniqueStudentsCount: 7,
    pendingInquiriesCount: 5,
    sentInquiriesCount: 2,
    convertedInquiriesCount: 0,
    conversionRate: 0,
    aliases: [
      { id: 'alias-6', rawAlias: 'جزوه ریاضی ۱', normalizedAlias: 'جزوه ریاضی ۱', queryCount: 5 },
      { id: 'alias-7', rawAlias: 'نمونه سوال ریاضی عمومی یک', normalizedAlias: 'نمونه سوال ریاضی عمومی یک', queryCount: 4 },
    ],
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-09-24T11:00:00.000Z',
  },
];

// -------------------------------------------------------------
// 8. Error Logs Store (System & AI Errors)
// -------------------------------------------------------------
const mockErrorLogs: IErrorLog[] = [
  {
    id: 'err-101',
    source: 'ai_answer',
    level: 'error',
    message: 'AI generation timeout after 12000ms during professor comparative analysis',
    stack: `Error: AI generation timeout\n    at AnswerGenerator.generateComparativeAnswer (src/ai/generators/answer.ts:84:15)\n    at Orchestrator.handleInquiry (src/ai/orchestrator.ts:142:27)`,
    context: {
      userId: '109283',
      chatId: '-1001928374',
      intent: 'compare_professors_for_course',
      professors: ['دکتر حسن حسنی', 'دکتر علی محمدی'],
    },
    isResolved: false,
    resolvedAt: null,
    resolvedBy: null,
    createdAt: '2026-09-24T07:15:30.000Z',
  },
  {
    id: 'err-102',
    source: 'ai_planner',
    level: 'error',
    message: 'Intent parsing failed: JSON schema violation in AI planner output',
    stack: `SyntaxError: Unexpected token in JSON at position 148\n    at JSON.parse (<anonymous>)\n    at PlannerEngine.parseDecision (src/ai/planner.ts:63:12)`,
    context: {
      rawQuery: 'استاد حسنی چطوریه نمره میده یا بندازه؟',
      modelUsed: 'gemini-1.5-flash',
    },
    isResolved: false,
    resolvedAt: null,
    resolvedBy: null,
    createdAt: '2026-09-24T06:40:12.000Z',
  },
  {
    id: 'err-103',
    source: 'telegram',
    level: 'warning',
    message: 'Telegram API 429 Too Many Requests: Flood control exceeded, retry after 4 seconds',
    stack: `TelegramError: 429: Too Many Requests: retry after 4\n    at TelegramBot.sendMessage (node_modules/telegraf/core/network/client.js:280:17)`,
    context: {
      targetChatId: '-1002345678',
      action: 'broadcast_follow_up_notification',
    },
    isResolved: true,
    resolvedAt: '2026-09-24T07:00:00.000Z',
    resolvedBy: 'admin',
    createdAt: '2026-09-24T05:20:00.000Z',
  },
  {
    id: 'err-104',
    source: 'database',
    level: 'warning',
    message: 'Database query slow execution: 1420ms on professor relation counts aggregate',
    stack: `SlowQueryWarning: Execution time exceeded 1000ms threshold\n    at QueryRunner.execute (src/database/runner.ts:95:9)`,
    context: {
      entity: 'Professor',
      targetId: 'prof-1',
    },
    isResolved: false,
    resolvedAt: null,
    resolvedBy: null,
    createdAt: '2026-09-23T22:15:00.000Z',
  },
];

// -------------------------------------------------------------
// 9. Telegram Management Store
// -------------------------------------------------------------
const mockTelegramUsers: ITelegramUser[] = [
  {
    id: '1034201463',
    displayName: 'احسان محمدی',
    username: 'ehsan_key',
    firstName: 'احسان',
    lastName: 'محمدی',
    isBot: false,
    interactionCount: 42,
    spamViolationCount: 0,
    spamBlockedUntil: null,
    universityName: 'دانشگاه آزاد اسلامی',
    campusName: 'تهران مرکز',
    majorName: 'مهندسی کامپیوتر',
    degreeLevel: 'کارشناسی',
    lastActiveAt: '2026-09-24T14:30:00.000Z',
    createdAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-09-24T14:30:00.000Z',
  },
  {
    id: '422428330',
    displayName: 'محمد علیزاده',
    username: 'mohammad_alizadeh',
    firstName: 'محمد',
    lastName: 'علیزاده',
    isBot: false,
    interactionCount: 15,
    spamViolationCount: 0,
    spamBlockedUntil: null,
    universityName: 'دانشگاه تهران',
    campusName: 'پردیس مرکزی',
    majorName: 'مهندسی برق',
    degreeLevel: 'کارشناسی ارشد',
    lastActiveAt: '2026-09-24T10:15:00.000Z',
    createdAt: '2026-08-12T15:20:00.000Z',
    updatedAt: '2026-09-24T10:15:00.000Z',
  },
  {
    id: '8574283507',
    displayName: 'زهرا کاظمی',
    username: 'zahra_k',
    firstName: 'زهرا',
    lastName: 'کاظمی',
    isBot: false,
    interactionCount: 7,
    spamViolationCount: 1,
    spamBlockedUntil: null,
    universityName: 'دانشگاه صنعتی شریف',
    campusName: 'دانشکده کامپیوتر',
    majorName: 'هوش مصنوعی',
    degreeLevel: 'کارشناسی ارشد',
    lastActiveAt: '2026-09-23T11:45:00.000Z',
    createdAt: '2026-08-15T09:00:00.000Z',
    updatedAt: '2026-09-23T11:45:00.000Z',
  },
];

const mockTelegramGroups: ITelegramGroup[] = [
  {
    id: 'grp-001',
    telegramChatId: '-1001234567890',
    chatTitle: 'دانشجویان کامپیوتر تهران مرکز',
    degreeLevel: 'کارشناسی',
    isEnabled: true,
    messageCount: 124,
    lastActiveAt: '2026-09-24T12:30:00.000Z',
    configuredByDisplayName: 'مدیر ارشد سیستم',
    universityName: 'دانشگاه آزاد',
    campusName: 'تهران مرکز',
    majorName: 'مهندسی کامپیوتر',
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-09-24T12:30:00.000Z',
  },
  {
    id: 'grp-002',
    telegramChatId: '-1009876543210',
    chatTitle: 'دانشجویان الکترونیکی آزاد',
    degreeLevel: 'کارشناسی',
    isEnabled: true,
    messageCount: 68,
    lastActiveAt: '2026-09-24T13:00:00.000Z',
    configuredByDisplayName: 'احسان محمدی',
    universityName: 'دانشگاه آزاد',
    campusName: 'واحد الکترونیکی',
    majorName: 'مشترک بین رشته‌ها',
    createdAt: '2026-08-25T14:00:00.000Z',
    updatedAt: '2026-09-24T13:00:00.000Z',
  },
  {
    id: 'grp-003',
    telegramChatId: '-1004561237890',
    chatTitle: 'ارشد هوش مصنوعی شریف',
    degreeLevel: 'کارشناسی ارشد',
    isEnabled: false,
    messageCount: 12,
    lastActiveAt: '2026-09-20T16:45:00.000Z',
    configuredByDisplayName: 'علی محمدی',
    universityName: 'دانشگاه صنعتی شریف',
    campusName: 'دانشکده کامپیوتر',
    majorName: 'هوش مصنوعی',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-20T16:45:00.000Z',
  },
];

const mockTelegramConversations: ITelegramConversation[] = [
  {
    id: 'conv-001',
    telegramChatId: '1034201463',
    telegramUserId: '1034201463',
    userDisplayName: 'احسان محمدی',
    chatTitle: 'گفتگوی خصوصی',
    isGroup: false,
    lastMessage: 'استاد مسعود حسنی برای درس نظریه زبان‌ها چطوره؟',
    lastMessageAt: '2026-09-24T08:15:00.000Z',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-001',
        role: 'user',
        content: 'سلام، استاد مسعود حسنی برای درس نظریه زبان‌ها چطوره؟',
        createdAt: '2026-09-24T08:15:00.000Z',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-001',
        role: 'assistant',
        content: 'سلام احسان عزیز! بر اساس بازخوردهای دانشجویان، دکتر مسعود حسنی روی حضور و غیاب حساس هستند، امتحان‌ها تحلیلی است و نمره پروژه کلاسی تاثیر زیادی دارد.',
        createdAt: '2026-09-24T08:15:03.000Z',
      },
    ],
  },
  {
    id: 'conv-002',
    telegramChatId: '-10012345678',
    telegramUserId: '422428330',
    userDisplayName: 'محمد علیزاده',
    chatTitle: 'دانشجویان کامپیوتر تهران مرکز',
    groupTitle: 'دانشجویان کامپیوتر تهران مرکز',
    isGroup: true,
    lastMessage: 'جزوه ریاضی عمومی ۲ کی داره؟',
    lastMessageAt: '2026-09-24T11:20:00.000Z',
    messages: [
      {
        id: 'msg-3',
        conversationId: 'conv-002',
        role: 'user',
        content: 'جزوه ریاضی عمومی ۲ کی داره؟',
        createdAt: '2026-09-24T11:20:00.000Z',
      },
      {
        id: 'msg-4',
        conversationId: 'conv-002',
        role: 'assistant',
        content: 'در بانک منابع دستیار دانشگاهی ۳ نمونه جزوه برای ریاضی عمومی ۲ دکتر سیامک انصاری موجود است. برای دانلود از دستور /resources استفاده کنید.',
        createdAt: '2026-09-24T11:20:02.000Z',
      },
    ],
  },
];

// -------------------------------------------------------------
// 10. AI Model Configurations Store
// -------------------------------------------------------------
let mockAiModels: IAiModelConfig[] = [
  {
    id: 'ai-001',
    name: 'OpenAI GPT-4o-mini (پاسخ‌دهی اصلی)',
    scope: 'answer',
    providerName: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyMasked: 'sk-proj-...kL9A',
    model: 'gpt-4o-mini',
    structuredOutputMode: 'json_schema',
    maxTokensParameter: 'max_tokens',
    requireParameters: false,
    includeTemperature: true,
    isEnabled: true,
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'ai-002',
    name: 'OpenAI GPT-4o (نقشه‌برداری و Intent)',
    scope: 'plan',
    providerName: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyMasked: 'sk-proj-...zX2B',
    model: 'gpt-4o',
    structuredOutputMode: 'json_object',
    maxTokensParameter: 'max_tokens',
    requireParameters: false,
    includeTemperature: false,
    isEnabled: true,
    createdAt: '2026-08-05T12:30:00.000Z',
  },
  {
    id: 'ai-003',
    name: 'DeepSeek V3 (مدل پشتیبان پاسخ)',
    scope: 'answer',
    providerName: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyMasked: 'sk-ds-...qW8R',
    model: 'deepseek-chat',
    structuredOutputMode: 'json_object',
    maxTokensParameter: 'max_tokens',
    requireParameters: false,
    includeTemperature: true,
    isEnabled: false,
    createdAt: '2026-09-01T15:00:00.000Z',
  },
];

// -------------------------------------------------------------
// 11. Broadcast Messaging Store
// -------------------------------------------------------------
let mockBroadcastCampaigns: IBroadcastCampaign[] = [
  {
    id: 'bc-001',
    title: 'اطلاعیه مهم شروع مهلت حذف و اضافه ترم پاییز',
    messageText: '<b>دانشجویان گرامی سلام!</b>\n\nبه اطلاع می‌رساند زمان حذف و اضافه نیمسال اول از تاریخ ۲۵ شهریور آغاز شده و تا ۳۰ شهریور ادامه خواهد داشت.\n\nلطفاً جهت بررسی ظرفیت دروس به پرتال آموزشی مراجعه فرمایید.',
    parseMode: 'HTML',
    inlineButtons: [
      [
        { id: 'btn-1', text: 'سامانه آموزشیار', url: 'https://edu.iau.ac.ir' },
        { id: 'btn-2', text: 'کانال اطلاع‌رسانی', url: 'https://t.me/uni_assistant_news' },
      ],
      [
        { id: 'btn-3', text: 'ارتباط با پشتیبانی', url: 'https://t.me/uni_support_bot' },
      ],
    ],
    targetFilters: {
      targetType: 'all',
      universityId: null,
      campusId: null,
      majorId: null,
      joinedFrom: null,
      joinedTo: null,
    },
    status: 'completed',
    totalTargets: 154,
    successfulCount: 151,
    failedCount: 3,
    createdByAdminId: 'admin-super',
    createdByAdminUsername: 'superadmin',
    startedAt: '2026-09-20T10:00:00.000Z',
    completedAt: '2026-09-20T10:05:00.000Z',
    createdAt: '2026-09-20T09:55:00.000Z',
    updatedAt: '2026-09-20T10:05:00.000Z',
  },
  {
    id: 'bc-002',
    title: 'نظرسنجی کیفیت تدریس اساتید دانشکده فنی',
    messageText: '<b>دانشجویان گرامی دانشکده فنی و مهندسی</b>\n\nفرم ارزیابی کیفیت تدریس اساتید فعال شد. با مشارکت در نظرسنجی، به بهبود فرآیند آموزش کمک نمایید.',
    parseMode: 'HTML',
    inlineButtons: [
      [
        { id: 'btn-4', text: 'ثبت نظر در ربات', url: 'https://t.me/uni_assistant_bot?start=review' },
      ],
    ],
    targetFilters: {
      targetType: 'filtered',
      universityId: 'u-1',
      campusId: 'c-1',
      majorId: null,
      joinedFrom: null,
      joinedTo: null,
    },
    status: 'partially_failed',
    totalTargets: 85,
    successfulCount: 81,
    failedCount: 4,
    createdByAdminId: 'admin-super',
    createdByAdminUsername: 'superadmin',
    startedAt: '2026-09-23T14:30:00.000Z',
    completedAt: '2026-09-23T14:33:00.000Z',
    createdAt: '2026-09-23T14:28:00.000Z',
    updatedAt: '2026-09-23T14:33:00.000Z',
  },
];

let mockBroadcastRecipients: IBroadcastRecipient[] = [
  {
    id: 'rec-001',
    telegramUserId: '422428330',
    status: 'sent',
    errorMessage: null,
    sentAt: '2026-09-20T10:01:00.000Z',
    retryCount: 0,
    createdAt: '2026-09-20T09:55:00.000Z',
    userFirstName: 'محمد',
    userLastName: 'علیزاده',
    userUsername: 'mohammad_alizadeh',
  },
  {
    id: 'rec-002',
    telegramUserId: '8574283507',
    status: 'failed',
    errorMessage: 'کاربر ربات را بلاک کرده یا اکانت غیرفعال است',
    sentAt: null,
    retryCount: 0,
    createdAt: '2026-09-20T09:55:00.000Z',
    userFirstName: 'زهرا',
    userLastName: 'کاظمی',
    userUsername: 'zahra_k',
  },
  {
    id: 'rec-003',
    telegramUserId: '8574283507',
    status: 'failed',
    errorMessage: 'خطای شبکه در ارسال پیام',
    sentAt: null,
    retryCount: 0,
    createdAt: '2026-09-23T14:28:00.000Z',
    userFirstName: 'زهرا',
    userLastName: 'کاظمی',
    userUsername: 'zahra_k',
  },
];

// -------------------------------------------------------------
// Legacy items for backward compatibility
// -------------------------------------------------------------
let mockItems: IItem[] = [
  {
    id: 1,
    title: 'گزارش عملکرد ماهانه سامانه دستیار',
    category: 'administrative',
    status: 'ACTIVE',
    description: 'بررسی شاخص‌های کلیدی، نرخ پایداری سرور و گزارش ترافیک ورودی کاربران در ماه گذشته.',
    createdAt: '2026-09-01T08:30:00Z',
    updatedAt: '2026-09-10T14:15:00Z',
    authorName: 'مدیر سیستم',
  },
];

export function getMockUsers(params?: {
  page?: number;
  perPage?: number;
  pageSize?: number;
  search?: string;
  q?: string;
}): PaginatedResult<IUser> {
  const page = Number(params?.page) || 1;
  const perPage = Number(params?.pageSize || params?.perPage) || 50;
  let list = [...mockUsers];
  const query = (params?.search || params?.q || '').trim().toLowerCase();
  if (query) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query),
    );
  }
  const total = list.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const items = list.slice((page - 1) * perPage, page * perPage);
  return {
    items,
    meta: {
      page,
      perPage,
      pageSize: perPage,
      total,
      totalPages,
    },
  };
}

// -------------------------------------------------------------
// AI Cache Mock Store
// -------------------------------------------------------------
import type { IAiCacheEntry, IAiCacheStats } from '@/models';

let mockAiCacheEntries: IAiCacheEntry[] = [
  {
    id: 'cache-1',
    cacheKey: 'prof:p-1|course:c-2|scope:unscoped|intent:teaching_details',
    intent: 'teaching_details',
    scopeKey: 'unscoped',
    hitCount: 85,
    lastHitAt: '2026-09-24T16:20:00.000Z',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-24T16:20:00.000Z',
    answerPreview: 'دکتر علیرضا حسنی استاد بسیار منظم، مسلط و باحوصله در درس ریاضی ۱ هستند...',
    answerText: 'دکتر علیرضا حسنی استاد بسیار منظم، مسلط و باحوصله در درس ریاضی ۱ هستند. شیوه تدریس ایشان کاملاً مفهومی بوده و تمرکز ویژه‌ای روی حل مسائل و تمارین تحویلی دارند. بارم‌بندی امتحانات ایشان شفاف و استاندارد است.',
    resources: [
      { id: 'res-1', label: 'جزوه کامل ریاضی عمومی ۱', link: 'https://t.me/c/123/45' },
      { id: 'res-2', label: 'نمونه سوالات پایان‌ترم با پاسخ', link: 'https://t.me/c/123/46' },
    ],
    resourceCount: 2,
    professor: { id: 'p-1', name: 'دکتر علیرضا حسنی' },
    course: { id: 'c-2', name: 'ریاضی عمومی ۱' },
  },
  {
    id: 'cache-2',
    cacheKey: 'prof:p-2|course:c-1|scope:unscoped|intent:teaching_details',
    intent: 'teaching_details',
    scopeKey: 'unscoped',
    hitCount: 64,
    lastHitAt: '2026-09-24T15:10:00.000Z',
    createdAt: '2026-09-21T08:30:00.000Z',
    updatedAt: '2026-09-24T15:10:00.000Z',
    answerPreview: 'دکتر سارا علوی در درس برنامه‌نویسی پیشرفته مباحث شی‌گرایی را عمیق آموزش می‌دهند...',
    answerText: 'دکتر سارا علوی در درس برنامه‌نویسی پیشرفته مباحث شی‌گرایی و الگوهای طراحی را بسیار عمیق و کاربردی آموزش می‌دهند. پروژه‌های عملی هفتگی بخش اصلی نمره را تشکیل می‌دهند.',
    resources: [
      { id: 'res-3', label: 'اسلایدهای آموزش زبان C++ و الگوهای طراحی', link: 'https://t.me/c/123/47' },
    ],
    resourceCount: 1,
    professor: { id: 'p-2', name: 'دکتر سارا علوی' },
    course: { id: 'c-1', name: 'برنامه‌نویسی پیشرفته' },
  },
  {
    id: 'cache-3',
    cacheKey: 'prof:p-3|course:c-3|scope:unscoped|intent:teaching_details',
    intent: 'teaching_details',
    scopeKey: 'unscoped',
    hitCount: 52,
    lastHitAt: '2026-09-24T14:40:00.000Z',
    createdAt: '2026-09-21T12:00:00.000Z',
    updatedAt: '2026-09-24T14:40:00.000Z',
    answerPreview: 'دکتر محمد رضایی در درس ساختمان داده‌ها تسلط فوق‌العاده‌ای روی الگوریتم‌ها دارند...',
    answerText: 'دکتر محمد رضایی در درس ساختمان داده‌ها تسلط فوق‌العاده‌ای روی تحلیل زمانی و الگوریتم‌ها دارند. کوییزهای کلاسی نمره کمکی موثری دارند و امتحان تستی و تشریحی است.',
    resources: [],
    resourceCount: 0,
    professor: { id: 'p-3', name: 'دکتر محمد رضایی' },
    course: { id: 'c-3', name: 'ساختمان داده‌ها' },
  },
  {
    id: 'cache-4',
    cacheKey: 'prof:p-4|course:c-4|scope:unscoped|intent:teaching_details',
    intent: 'teaching_details',
    scopeKey: 'unscoped',
    hitCount: 41,
    lastHitAt: '2026-09-24T11:25:00.000Z',
    createdAt: '2026-09-22T09:15:00.000Z',
    updatedAt: '2026-09-24T11:25:00.000Z',
    answerPreview: 'مهندس مریم کاظمی پروژه‌محور و تعاملی تدریس می‌کنند و نمره‌دهی منصفانه‌ای دارند...',
    answerText: 'مهندس مریم کاظمی در درس مبانی هوش مصنوعی پروژه‌محور و تعاملی تدریس می‌کنند. روی انجام تکالیف پایتونی حساسیت دارند و نمره‌دهی کاملاً منطبق با عملکرد کلاسی است.',
    resources: [
      { id: 'res-4', label: 'نوتبوک‌های عملی کدهای هوش مصنوعی', link: 'https://t.me/c/123/48' },
    ],
    resourceCount: 1,
    professor: { id: 'p-4', name: 'مهندس مریم کاظمی' },
    course: { id: 'c-4', name: 'مبانی هوش مصنوعی' },
  },
  {
    id: 'cache-5',
    cacheKey: 'course:c-2|intent:compare_professors_for_course',
    intent: 'compare_professors_for_course',
    scopeKey: 'unscoped',
    hitCount: 38,
    lastHitAt: '2026-09-24T10:05:00.000Z',
    createdAt: '2026-09-22T14:30:00.000Z',
    updatedAt: '2026-09-24T10:05:00.000Z',
    answerPreview: 'مقایسه اساتید درس ریاضی ۱: دکتر حسنی از نظر شیوه حل تمرین و بارم‌بندی بالاترین رضایت را دارند...',
    answerText: 'مقایسه اساتید درس ریاضی عمومی ۱:\n۱. دکتر علیرضا حسنی: ۸۹٪ رضایت، امتحانات هماهنگ و منظم، تمرکز بر تمرین.\n۲. دکتر احمد نادری: ۷۸٪ رضایت، سرعت تدریس بالا، امتحانات سخت‌تر.',
    resources: [],
    resourceCount: 0,
    course: { id: 'c-2', name: 'ریاضی عمومی ۱' },
  },
  {
    id: 'cache-6',
    cacheKey: 'prof:p-5|intent:search_professors',
    intent: 'search_professors',
    scopeKey: 'unscoped',
    hitCount: 29,
    lastHitAt: '2026-09-23T18:20:00.000Z',
    createdAt: '2026-09-23T10:00:00.000Z',
    updatedAt: '2026-09-23T18:20:00.000Z',
    answerPreview: 'اطلاعات کامل و دروس ارائه شده توسط دکتر حمید تقوی در دانشکده مهندسی کامپیوتر...',
    answerText: 'دکتر حمید تقوی دانشیار گروه نرم‌افزار، دروس سیستم‌های عامل و شبکه‌های کامپیوتری را ارائه می‌دهند. سطح علمی کلاس بسیار بالا و نیازمند مطالعه مستمر منابع لاتین است.',
    resources: [],
    resourceCount: 0,
    professor: { id: 'p-5', name: 'دکتر حمید تقوی' },
  },
];

function getMockAiCacheStats(): IAiCacheStats {
  const totalCachedEntries = mockAiCacheEntries.length;
  const totalHits = mockAiCacheEntries.reduce((acc, c) => acc + (c.hitCount || 0), 0);
  const estimatedTokensSaved = totalHits * 1200;

  const profMap = new Map<string, { professorId: string; professorName: string; hitCount: number }>();
  for (const entry of mockAiCacheEntries) {
    if (entry.professor) {
      const existing = profMap.get(entry.professor.id);
      if (existing) {
        existing.hitCount += entry.hitCount;
      } else {
        profMap.set(entry.professor.id, {
          professorId: entry.professor.id,
          professorName: entry.professor.name,
          hitCount: entry.hitCount,
        });
      }
    }
  }

  const topProfessors = Array.from(profMap.values())
    .sort((a, b) => b.hitCount - a.hitCount)
    .slice(0, 5);

  return {
    totalCachedEntries,
    totalHits,
    estimatedTokensSaved,
    topProfessors,
  };
}

export function getMockItems(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  category?: string;
}): PaginatedResult<IItem> {
  const page = Number(params?.page) || 1;
  const perPage = Number(params?.perPage) || 10;
  return {
    items: mockItems,
    meta: {
      page,
      perPage,
      total: mockItems.length,
      totalPages: 1,
    },
  };
}

export function getMockItemById(id: number): IItem | undefined {
  return mockItems.find((item) => item.id === id);
}

export function createMockItem(data: Omit<IItem, 'id' | 'createdAt'>): IItem {
  const newItem: IItem = {
    ...data,
    id: mockItems.length > 0 ? Math.max(...mockItems.map((i) => i.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  mockItems = [newItem, ...mockItems];
  return newItem;
}

export function updateMockItem(
  id: number,
  data: Partial<Omit<IItem, 'id' | 'createdAt'>>,
): IItem | undefined {
  const index = mockItems.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  const updated = {
    ...mockItems[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  mockItems[index] = updated;
  return updated;
}

export function deleteMockItem(id: number): boolean {
  const initialLen = mockItems.length;
  mockItems = mockItems.filter((item) => item.id !== id);
  return mockItems.length < initialLen;
}

export function getMockSystemPipelineSpec(): ISystemPipelineSpec {
  return {
    version: '1.2.0',
    synced: true,
    updatedAt: new Date().toISOString(),
    stats: {
      totalStages: 12,
      totalIntents: 9,
      totalTools: 7,
      totalFsmFlows: 3,
      totalScenarios: 6,
    },
    intents: [
      'professor_lookup',
      'professor_courses',
      'course_professors',
      'professor_course_review',
      'compare_professors_for_course',
      'get_resources',
      'general_conversation',
      'out_of_scope',
      'unknown',
    ],
    tools: [
      'search_professors',
      'search_courses',
      'get_professor_teachings',
      'get_course_professors',
      'get_teaching_details',
      'compare_professors_for_course',
      'get_teaching_resources',
    ],
    clarificationReasons: [
      'comparison_criteria_missing',
      'professor_missing',
      'course_missing',
      'ambiguous_reference',
      'unclear_request',
    ],
    fsmFlows: {
      profile: ['university', 'campus', 'major'],
      review: [
        'university',
        'campus',
        'major',
        'course_category',
        'professor_name',
        'professor_choice',
        'professor_create_confirm',
        'course_name',
        'course_choice',
        'course_create_confirm',
        'degree_level',
        'content',
        'confirm',
      ],
      resource: [
        'university',
        'campus',
        'major',
        'course_category',
        'professor_name',
        'professor_choice',
        'professor_create_confirm',
        'course_name',
        'course_choice',
        'course_create_confirm',
        'degree_level',
        'resource_kind',
        'files',
        'confirm',
      ],
    },
    rateLimiter: {
      maxMessages: 12,
      windowMs: 60000,
      cooldownStepMs: 30000,
      cooldownMaxMs: 300000,
    },
    stages: [
      {
        id: 'transport_guard',
        order: 1,
        title: 'ورود آپدیت و گیت‌های امنیتی',
        category: 'security',
        component: 'createTelegramBot',
        file: 'backend/src/telegram/create-telegram-bot.ts',
        functionName: 'bot.use / bot.on("message:text")',
        description: 'دریافت آپدیت تلگرام از طریق grammY، ارزیابی سوییچ فعال بودن سراسری ربات، اعتبارسنجی عضویت اجباری در کانال دانشگاهی و بای‌پس اختصاصی ادمین.',
        inputs: ['Telegram Update', 'Chat ID', 'User ID', 'Message Text'],
        outputs: ['Sanitized Context', 'Message Routing Metadata'],
        guards: ['botEnabled !== false', 'channelMembershipVerified === true || isAdmin(userId)'],
        dropReasons: ['ربات موقتاً خاموش است', 'کاربر عضو کانال اجباری تلگرام نیست'],
      },
      {
        id: 'routing_fsm',
        order: 2,
        title: 'مسیریابی دستورات و ماشین وضعیت FSM',
        category: 'routing',
        component: 'createTelegramBot',
        file: 'backend/src/telegram/create-telegram-bot.ts',
        functionName: 'handleCommands, handleReviewFlow, handleResourceFlow, handleProfileFlow',
        description: 'تفکیک دستورات اسلش‌دار (/start, /reset, /help)، دکمه‌های ریپلای کیبورد، پیوست‌های چندرسانه‌ای و ماشین‌های وضعیت چندمرحله‌ای قبل از ورود به هوش مصنوعی.',
        inputs: ['Sanitized Message Text', 'FSM State Maps'],
        outputs: ['FSM Advance Step OR Handover to Chat Orchestrator'],
        guards: ['!isSlashCommand', '!reviewFlows.has(userId)', '!resourceFlows.has(userId)', '!profileFlows.has(userId)'],
        dropReasons: ['اجرای مستقیم دستور سیستمی', 'پیشروی در یکی از مراحل فرم چندمرحله‌ای FSM'],
      },
      {
        id: 'scope_context',
        order: 3,
        title: 'تشخیص نوع چت و تعیین دامنه آموزشی',
        category: 'context',
        component: 'GroupConfigService / ConversationContextService',
        file: 'backend/src/groups/group-config.service.ts',
        functionName: 'resolveMentionRouting, getByChatId, getProfile',
        description: 'در چت‌های گروهی بررسی منشن مستقیم یا ریپلای به پیام ربات و استخراج دامنه تدریس دانشگاهی (واحد/دانشکده). در چت‌های خصوصی، استخراج پروفایل تحصیلی کاربر.',
        inputs: ['chat.type', 'message.entities', 'reply_to_message'],
        outputs: ['teachingScope (universityId, campusId, majorId)', 'effectiveText'],
        guards: ['if group: (mentioned || repliedToBot) && groupConfig.isEnabled'],
        dropReasons: ['پیام گروهی بدون منشن یا ریپلای ربات', 'گروه در سیستم پیکربندی یا فعال نشده است'],
      },
      {
        id: 'concurrency_ratelimit',
        order: 4,
        title: 'کنترل همزمانی و محدودکننده تصاعدی نرخ',
        category: 'concurrency',
        component: 'KeyedSerialExecutor / EscalatingRateLimiter',
        file: 'backend/src/telegram/keyed-serial-executor.ts',
        functionName: 'serialExecutor.execute(userKey), rateLimiter.recordAndCheck(userId)',
        description: 'اجرای ترتیبی و FIFO پیام‌های هر کاربر برای جلوگیری از race condition و اعمال محدودیت نرخ درخواست با جریمه تصاعدی زمان انتظار.',
        inputs: ['userId', 'chatId', 'executionTask'],
        outputs: ['Serialized Execution Slot'],
        guards: ['rateLimitResult.limited === false'],
        dropReasons: ['تجاوز از حد مجاز ارسال پیام و فعال شدن جریمه پلکانی (Cooldown Lock)'],
      },
      {
        id: 'ux_pending',
        order: 5,
        title: 'بازخورد بلادرنگ کاربر (Typing & Pending Status)',
        category: 'ux',
        component: 'TelegramOperation',
        file: 'backend/src/telegram/telegram-operation.ts',
        functionName: 'sendChatAction("typing"), ctx.reply(PENDING_EMOJI)',
        description: 'ارسال وضعیت در حال نوشتن به تلگرام و ارسال فوری پیام موقت استیکر ساعت شنی برای جلوگیری از سردرگمی کاربر حین پردازش.',
        inputs: ['chatId', 'replyTargetMessageId'],
        outputs: ['pendingMessageId'],
        guards: ['Telegram Network Connectivity (Safe Best-Effort retry)'],
        dropReasons: ['عدم دسترسی به تلگرام (به صورت امن مدیریت و لاگ می‌شود)'],
      },
      {
        id: 'turn_triage',
        order: 6,
        title: 'آغاز نوبت مکالمه و تریاژ اولیه',
        category: 'context',
        component: 'ChatOrchestrator',
        file: 'backend/src/chat/chat-orchestrator.ts',
        functionName: 'beginTurn, checkGreeting, checkMetaRequest',
        description: 'ثبت شناسه نوبت در دیتابیس، بررسی احوال‌پرسی‌های رایج (سلام، خداقوت) با پاسخ فوری ثابت و فیلتر کردن سوالات نامرتبط و خارج از حیطه دانشگاهی.',
        inputs: ['userMessage', 'conversationContext'],
        outputs: ['Triage Decision: Instant Static Reply OR AI Planner Call'],
        guards: ['!isDuplicateTurn(turnId)'],
        dropReasons: ['پاسخ قطعی به احوالپرسی بدون مصرف منابع هوش مصنوعی', 'پاسخ استاتیک به سوالات عمومی'],
      },
      {
        id: 'ai_planner',
        order: 7,
        title: 'پلنر هوشمند نیت و استخراج موجودیت‌ها',
        category: 'ai',
        component: 'QueryPlanner',
        file: 'backend/src/ai/planner/query-planner.ts',
        functionName: 'planQuery, enrichQueryPlanFromContext, applyQueryPlanGuards, resumePendingPlan',
        description: 'فراخوانی مدل زبان با پرامپت سخت‌گیرانه، استخراج نیت اصلی کاربر، تفکیک نام اساتید و درس‌ها، بازیابی نیت معلق مکالمه قبلی و انطباق با Zod QueryPlanSchema.',
        inputs: ['userMessage', 'recentAIMessages', 'PlannerConversationState'],
        outputs: ['Validated QueryPlan (intent, professorNames, courseName, criteria)'],
        guards: ['QueryPlanSchema.strictObject validation', 'applyQueryPlanGuards()'],
        dropReasons: ['نیاز به شفاف‌سازی (needsClarification: استاد یا درس نامشخص است)'],
        isGroundedAiProtected: true,
      },
      {
        id: 'deterministic_tool',
        order: 8,
        title: 'نگاشت و فراخوانی ابزار قطعی دیتابیس',
        category: 'tool',
        component: 'mapQueryPlanToToolCall / InternalToolsRegistry',
        file: 'backend/src/ai/planner/planned-tool-call.ts',
        functionName: 'mapQueryPlanToToolCall, executeInternalTool',
        description: 'نگاشت نیت کاربر به یکی از 7 ابزار ثبت‌شده در سیستم و واکشی داده‌های قطعی از دیتابیس PostgreSQL بدون حدس یا توهم توسط هوش مصنوعی.',
        inputs: ['QueryPlan', 'teachingScope'],
        outputs: ['InternalToolResult (raw database records)'],
        guards: ['toolName in INTERNAL_TOOL_NAMES', 'Zod ToolInputSchema validation'],
        dropReasons: ['نیت‌های بدون ابزار (general_conversation / out_of_scope)'],
        isGroundedAiProtected: true,
      },
      {
        id: 'db_query_normalization',
        order: 9,
        title: 'نرمال‌سازی فارسی و کوئری PostgreSQL',
        category: 'database',
        component: 'Drizzle ORM / PersianNormalizer / Repositories',
        file: 'backend/src/search/persian-normalizer.ts',
        functionName: 'normalizePersianText, searchTeachings, getReviewsByProfessor',
        description: 'نرمال‌سازی حروفی و فاصله‌ای کلمات فارسی (ک، ی، نیم‌فاصله‌ها)، اعمال فیلتر اسکوپ تدریس، اجرای کوئری‌های SQL بهینه و ذخیره سوابق جستجو برای تحلیل ادمین.',
        inputs: ['Normalized Search Term', 'Teaching Scope (Campus/Major)'],
        outputs: ['Database Rows (Professors, Courses, Ratings, Materials)'],
        guards: ['PostgreSQL Pool Availability', 'SQL Parameterized Sanitation'],
        dropReasons: ['عدم یافتن نتیجه مطابق در دیتابیس'],
      },
      {
        id: 'grounded_answer',
        order: 10,
        title: 'بررسی کش و تولید پاسخ مستند Grounded',
        category: 'ai',
        component: 'AnswerGenerator / AIAnswerCacheService / FallbackAnswerRenderer',
        file: 'backend/src/ai/answer/answer-generator.ts',
        functionName: 'getCachedAnswer, generateAnswer, sanitizeToolResult',
        description: 'بررسی کش معنایی برای پاسخ بلادرنگ؛ در صورت miss شدن، تدوین پاسخ محاوره‌ای دانشجویی صرفاً بر مبنای دیتای بازگشتی از ابزار با پرامپت ضد توهم، همراه با فال‌بک قطعی در شرایط قطعی مدل.',
        inputs: ['userMessage', 'plan', 'toolResult', 'recentAIMessages'],
        outputs: ['AnswerGeneratorResult (text, resources, provider, model)'],
        guards: ['sanitizeToolResult(maxChars)', 'Zero-Hallucination Grounded Prompt'],
        dropReasons: ['سوئیچ به فال‌بک رندرر قطعی در زمان خرابی ارائه‌دهنده AI'],
        isGroundedAiProtected: true,
      },
      {
        id: 'resource_cta',
        order: 11,
        title: 'تولید توکن‌های امن منابع و دکمه‌های شیشه‌ای',
        category: 'delivery',
        component: 'ResourceDeliveryService / ReviewCtaBuilder',
        file: 'backend/src/telegram/resource-delivery.service.ts',
        functionName: 'createDeliveryTokens, buildReviewCtaButton, extractAnswerResources',
        description: 'ایجاد توکن‌های رمزنگاری‌شده کوتاه‌مدت برای دریافت مستقیم جزوات و نمونه‌سوالات بدون لو رفتن لینک مستقیم، و ایجاد دکمه شیشه‌ای «ثبت نظر درباره استاد» با دیپ‌لینک اختصاصی.',
        inputs: ['AnswerResource[]', 'professorId', 'courseId'],
        outputs: ['InlineKeyboardMarkup (Download Buttons & Review Links)'],
        guards: ['Cryptographic token signature', 'Resource approved status'],
        dropReasons: ['عدم وجود منابع پیوست یا نیاز به دکمه اضافه'],
      },
      {
        id: 'telegram_delivery',
        order: 12,
        title: 'ارسال نهایی به تلگرام و اتمام نوبت',
        category: 'delivery',
        component: 'createTelegramBot / ConversationContextService',
        file: 'backend/src/telegram/create-telegram-bot.ts',
        functionName: 'splitTelegramText, editMessageText, setMessageReaction("👍"), completeTurn',
        description: 'تقسیم متن‌های بالاتر از ۴۰۹۶ کاراکتر به چند پیام، ویرایش پیام موقت با پاسخ آماده و کیبورد شیشه‌ای، ثبت ری‌اکشن لایک روی پیام کاربر و بایگانی در جدول مکالمات.',
        inputs: ['pendingMessageId', 'replyText', 'inlineKeyboard', 'turnId'],
        outputs: ['Delivered Telegram Message', 'Updated Conversation Turn in DB'],
        guards: ['Telegram 4096 character boundary', 'Retry on transport throttle'],
        dropReasons: ['تایم‌اوت تلگرام (توسط ماژول تاب‌آوری retry می‌شود)'],
      },
    ],
    scenarios: [
      {
        id: 'scenario-professor-review',
        title: 'پرسش و ارزیابی استاد در یک درس مشخص',
        description: 'فلوی جامع جستجوی نظر دانشجویان درباره نحوه تدریس و نمره‌دهی یک استاد خاص در درس مشخص همراه با استخراج توکن منابع و دکمه ثبت نظر.',
        category: 'ai_review',
        chatType: 'private',
        sampleInput: 'استاد مریم احمدی برای درس هوش مصنوعی چطوره؟ سخت‌گیره یا خوب نمره میده؟',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'آپدیت دریافت شد؛ ربات فعال و کاربر در چت خصوصی است.' },
          { stageId: 'routing_fsm', status: 'passed', annotation: 'پیام دستور یا کلید کیبورد نیست.' },
          { stageId: 'scope_context', status: 'passed', annotation: 'پروفایل تحصیلی کاربر لود شد (دانشگاه تهران، کامپیوتر).' },
          { stageId: 'concurrency_ratelimit', status: 'passed', annotation: 'قفل اختصاصی کاربر دریافت شد؛ پیام‌ها زیر لیمیت است.' },
          { stageId: 'ux_pending', status: 'passed', annotation: 'اکشن تایپینگ فعال و پیام موقت ساعت شنی ارسال شد.' },
          { stageId: 'turn_triage', status: 'passed', annotation: 'نوبت جدید ثبت شد؛ پیام احوالپرسی ساده نیست.' },
          {
            stageId: 'ai_planner',
            status: 'passed',
            annotation: 'نیت professor_course_review برای استاد مریم احمدی و درس هوش مصنوعی تشخیص داده شد.',
          },
          { stageId: 'deterministic_tool', status: 'passed', annotation: 'ابزار get_teaching_details با پارامترهای مشخص فراخوانی شد.' },
          { stageId: 'db_query_normalization', status: 'passed', annotation: '۴ نظر تاییدشده و میانگین نمره ۴.۲ واکشی شد.' },
          { stageId: 'grounded_answer', status: 'passed', annotation: 'پاسخ صرفاً بر مبنای نظرات دیتابیس تدوین شد.' },
          { stageId: 'resource_cta', status: 'passed', annotation: 'دکمه شیشه‌ای دریافت جزوه اسلایدها و لینک ثبت نظر الصاق شد.' },
          { stageId: 'telegram_delivery', status: 'passed', annotation: 'پیام موقت ویرایش شد و ری‌اکشن لایک ثبت گردید.' },
        ],
        expectedOutput: 'ارزیابی استاد مریم احمدی در درس هوش مصنوعی همراه با خلاصه نظرات دانشجویان و دکمه شیشه‌ای دریافت جزوه.',
      },
      {
        id: 'scenario-compare-professors',
        title: 'مقایسه دو استاد برای یک درس',
        description: 'کاربر بین دو استاد برای یک درس مردد است و سیستم با ابزار مقایسه، معیارهای نمره‌دهی و شیوه تدریس را روبروی هم قرار می‌دهد.',
        category: 'comparison',
        chatType: 'private',
        sampleInput: 'برای درس مدارهای منطقی، دکتر حسنی بهتره یا مهندس رضایی؟',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'احراز هویت و دسترسی کاربر معتبر است.' },
          { stageId: 'routing_fsm', status: 'passed', annotation: 'مسیر چت عادی هوش مصنوعی است.' },
          { stageId: 'scope_context', status: 'passed', annotation: 'دامنه آموزشی از روی پروفایل کاربر دریافت شد.' },
          { stageId: 'concurrency_ratelimit', status: 'passed', annotation: 'سرعت ارسال مجاز است.' },
          { stageId: 'ux_pending', status: 'passed', annotation: 'پیام موقت ارسال شد.' },
          { stageId: 'turn_triage', status: 'passed', annotation: 'ورود به پردازش نوبت مقایسه.' },
          { stageId: 'ai_planner', status: 'passed', annotation: 'نیت compare_professors_for_course با دو استاد و درس مدارهای منطقی تایید شد.' },
          { stageId: 'deterministic_tool', status: 'passed', annotation: 'ابزار compare_professors_for_course با اسامی دو استاد اجرا شد.' },
          { stageId: 'db_query_normalization', status: 'passed', annotation: 'آمار نمرات و تدریس هر دو استاد واکشی گردید.' },
          { stageId: 'grounded_answer', status: 'passed', annotation: 'پاسخ مقایسه‌ای بی‌طرفانه بر اساس داده‌های تجمیعی تولید شد.' },
          { stageId: 'resource_cta', status: 'passed', annotation: 'دکمه‌های ثبت نظر برای هر دو استاد ضمیمه شد.' },
          { stageId: 'telegram_delivery', status: 'passed', annotation: 'تحویل پیام نهایی در تلگرام با موفقیت انجام شد.' },
        ],
        expectedOutput: 'جدول تحلیلی مقایسه دکتر حسنی و مهندس رضایی با معیارهای نمره‌دهی و سطح تدریس.',
      },
      {
        id: 'scenario-group-mention',
        title: 'منشن در سوپرگروه دانشجویی با تطبیق دامنه',
        description: 'پیام در یک گروه کلاسی ارسال شده و ربات فقط در صورت منشن شدن پاسخ می‌دهد و نتایج را به همان دانشکده محدود می‌کند.',
        category: 'group',
        chatType: 'group',
        sampleInput: '@chico_bot این ترم چه استادهایی هوش مصنوعی ارائه میدن؟',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'دریافت آپدیت از سوپرگروه تلگرام.' },
          { stageId: 'routing_fsm', status: 'passed', annotation: 'پیام فاقد کامند سیستمی ادمین است.' },
          { stageId: 'scope_context', status: 'passed', annotation: 'منشن تشخیص داده شد؛ teachingScope دانشکده مهندسی اعمال شد.' },
          { stageId: 'concurrency_ratelimit', status: 'passed', annotation: 'نرخ پیام‌های گروهی مجاز است.' },
          { stageId: 'ux_pending', status: 'passed', annotation: 'وضعیت تایپینگ به تاپیک مربوطه مخابره شد.' },
          { stageId: 'turn_triage', status: 'passed', annotation: 'شروع پردازش نوبت مکالمه گروهی.' },
          { stageId: 'ai_planner', status: 'passed', annotation: 'تشخیص نیت course_professors برای درس هوش مصنوعی.' },
          { stageId: 'deterministic_tool', status: 'passed', annotation: 'فراخوانی ابزار get_course_professors با فیلتر گروه.' },
          { stageId: 'db_query_normalization', status: 'passed', annotation: 'یافتن ۳ استاد ارائه‌دهنده در همان واحد دانشگاهی.' },
          { stageId: 'grounded_answer', status: 'passed', annotation: 'تدوین لیست اساتید با ذکر مشخصات تدریس.' },
          { stageId: 'resource_cta', status: 'passed', annotation: 'دکمه‌های انتخاب استاد برای مشاهده نظر اضافه شد.' },
          { stageId: 'telegram_delivery', status: 'passed', annotation: 'ارسال ریپلای به پیام کاربر در ترد گروه.' },
        ],
        expectedOutput: 'پاسخ به منشن گروه با فهرست اساتید ارائه دهنده در همان دانشکده.',
      },
      {
        id: 'scenario-fsm-review',
        title: 'جریان ثبت نظر چندمرحله‌ای (FSM Review Flow)',
        description: 'کاربر دکمه ثبت نظر را فشرده و وارد ماشین وضعیت تعاملی می‌شود؛ پروسه کاملاً هوش مصنوعی را دور می‌زند.',
        category: 'fsm',
        chatType: 'private',
        sampleInput: '📝 ثبت نظر درباره استاد',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'دریافت متن دکمه ثبت نظر در چت خصوصی.' },
          {
            stageId: 'routing_fsm',
            status: 'branch_taken',
            annotation: 'کلید ثبت نظر شناسایی شد! جریان reviewFlows برای کاربر آغاز گردید و هوش مصنوعی بای‌پس شد.',
          },
          { stageId: 'telegram_delivery', status: 'passed', annotation: 'کیبورد انتخاب دسته‌بندی درس برای کاربر ارسال شد.' },
        ],
        expectedOutput: 'نمایش کیبورد مراحل ثبت نظر بدون مصرف توکن هوش مصنوعی.',
      },
      {
        id: 'scenario-rate-limit',
        title: 'اسپم پیام و فعال‌سازی جریمه تصاعدی Rate Limiter',
        description: 'کاربر اقدام به ارسال رگباری پیام می‌کند و سیستم با لایه EscalatingRateLimiter جلوی بار اضافی را می‌گیرد.',
        category: 'rate_limit',
        chatType: 'private',
        sampleInput: 'پیام دوازدهم در کمتر از ۵ ثانیه...',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'پیام دریافت شد.' },
          { stageId: 'routing_fsm', status: 'passed', annotation: 'چک اولیه انجام شد.' },
          { stageId: 'scope_context', status: 'passed', annotation: 'اطلاعات چت خوانده شد.' },
          {
            stageId: 'concurrency_ratelimit',
            status: 'dropped',
            annotation: 'محدودکننده نرخ فعال شد! کاربر جریمه تصاعدی ۶۰ ثانیه‌ای دریافت کرد و پیام متوقف گردید.',
          },
        ],
        expectedOutput: 'هشدار به کاربر درباره سرعت ارسال پیام و اعمال کول‌داون موقت.',
      },
      {
        id: 'scenario-resource-download',
        title: 'درخواست جزوه و نمونه‌سؤال با تولید توکن امن',
        description: 'دانشجو تقاضای فایل درسی می‌کند؛ توکن امضاشده تولید شده و به صورت دکمه اینلاین به پیام وصل می‌شود.',
        category: 'resources',
        chatType: 'private',
        sampleInput: 'نمونه سوالات پایان‌ترم درس ریاضی ۱ رو داری؟',
        steps: [
          { stageId: 'transport_guard', status: 'passed', annotation: 'پیام ورودی دریافت شد.' },
          { stageId: 'routing_fsm', status: 'passed', annotation: 'پیام عادی درخواست منابع.' },
          { stageId: 'scope_context', status: 'passed', annotation: 'دامنه تحصیلی دریافت شد.' },
          { stageId: 'concurrency_ratelimit', status: 'passed', annotation: 'قفل کاربر بدون اشکال دریافت شد.' },
          { stageId: 'ux_pending', status: 'passed', annotation: 'پیام در حال پردازش ارسال شد.' },
          { stageId: 'turn_triage', status: 'passed', annotation: 'ثبت نوبت درخواست منبع.' },
          { stageId: 'ai_planner', status: 'passed', annotation: 'نیت get_resources با courseName="ریاضی ۱" تشخیص داده شد.' },
          { stageId: 'deterministic_tool', status: 'passed', annotation: 'اجرای ابزار get_teaching_resources برای واکشی جزوات.' },
          { stageId: 'db_query_normalization', status: 'passed', annotation: 'یافتن ۵ فایل تایید شده در جدول resources.' },
          { stageId: 'grounded_answer', status: 'passed', annotation: 'تولید متن راهنما با توضیح فایل‌های موجود.' },
          { stageId: 'resource_cta', status: 'passed', annotation: 'تولید توکن‌های امن و اتصال دکمه‌های شیشه‌ای دانلود.' },
          { stageId: 'telegram_delivery', status: 'passed', annotation: 'ویرایش پیام نهایی تلگرام با دکمه‌های اینلاین دانلود فایل.' },
        ],
        expectedOutput: 'پیام حاوی دکمه‌های شیشه‌ای امن برای دانلود مستقیم فایل‌های درسی.',
      },
    ],
  };
}

// -------------------------------------------------------------
// Centralized Mock API Dispatcher
// -------------------------------------------------------------
export async function handleMockApi(
  method: string,
  rawPath: string,
  params?: Record<string, unknown>,
  body?: unknown,
): Promise<{
  success: boolean;
  data?: unknown;
  meta?: unknown;
  error?: unknown;
  [key: string]: unknown;
}> {
  // Normalize path by stripping leading/trailing slashes and prefix
  let cleanPath = rawPath
    .replace(/^\/+/, '')
    .replace(/^api\/backend\//, '')
    .replace(/^api\/v1\//, '');

  if (cleanPath.startsWith('moderation/reviews')) {
    cleanPath = cleanPath.replace(/^moderation\/reviews/, 'admin-data/review-submissions');
  }
  if (cleanPath.startsWith('moderation/resources')) {
    cleanPath = cleanPath.replace(/^moderation\/resources/, 'admin-data/resource-submissions');
  }
  if (cleanPath.startsWith('academic/professors')) {
    cleanPath = cleanPath.replace(/^academic\/professors/, 'professors');
  }
  if (cleanPath.startsWith('academic/courses')) {
    cleanPath = cleanPath.replace(/^academic\/courses/, 'courses');
  }
  if (cleanPath.startsWith('academic/universities')) {
    cleanPath = cleanPath.replace(/^academic\/universities/, 'universities');
  }
  if (cleanPath.startsWith('academic/campuses')) {
    cleanPath = cleanPath.replace(/^academic\/campuses/, 'campuses');
  }
  if (cleanPath.startsWith('academic/majors')) {
    cleanPath = cleanPath.replace(/^academic\/majors/, 'majors');
  }
  if (cleanPath.startsWith('academic/teachings')) {
    cleanPath = cleanPath.replace(/^academic\/teachings/, 'teachings');
  }
  if (cleanPath.startsWith('academic/resources')) {
    cleanPath = cleanPath.replace(/^academic\/resources/, 'admin-data/resource-submissions');
  }

  const m = method.toUpperCase();

  // 0. System Message Pipeline Architecture Spec
  if (cleanPath.startsWith('system/message-pipeline')) {
    return { success: true, data: getMockSystemPipelineSpec() };
  }

  // 1. Analytics
  if (cleanPath.startsWith('admin/analytics/overview')) {
    return { success: true, data: getMockAnalyticsOverview() };
  }
  if (cleanPath.startsWith('admin/analytics/professors')) {
    const limit = Number(params?.limit) || 10;
    return { success: true, data: getMockProfessorAnalytics(limit) };
  }

  // 2. Reviews (Review Submissions)
  if (cleanPath.startsWith('admin-data/review-submissions')) {
    const matchAction = cleanPath.match(/^admin-data\/review-submissions\/([^/]+)\/(approve|reject)$/);
    if (matchAction) {
      const [, id, action] = matchAction;
      const index = mockReviewSubmissions.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'بازخورد مورد نظر یافت نشد' } };
      }
      if (action === 'approve') {
        mockReviewSubmissions[index].status = 'approved';
        // Auto-invalidate AI cache for this professor as per section 4.9
        const profName = mockReviewSubmissions[index].professorName;
        if (profName) {
          mockAiCacheEntries = mockAiCacheEntries.filter(
            (c) => !c.professor || c.professor.name !== profName,
          );
        }
        return { success: true, data: mockReviewSubmissions[index] };
      }
      if (action === 'reject') {
        const payload = body as { reason?: string };
        mockReviewSubmissions[index].status = 'rejected';
        mockReviewSubmissions[index].rejectionReason = payload?.reason || 'رد شده توسط ادمین';
        return { success: true, data: mockReviewSubmissions[index] };
      }
    }

    const matchDetail = cleanPath.match(/^admin-data\/review-submissions\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockReviewSubmissions.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'بازخورد مورد نظر یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockReviewSubmissions[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockReviewSubmissions[index] = {
          ...mockReviewSubmissions[index],
          ...(body as Partial<IReviewSubmission>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockReviewSubmissions[index] };
      }
      if (m === 'DELETE') {
        mockReviewSubmissions = mockReviewSubmissions.filter((r) => r.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockReviewSubmissions];
      if (params?.status && params.status !== 'all') {
        list = list.filter((r) => r.status === params.status);
      }
      if (params?.semester) {
        list = list.filter((r) => r.semester === params.semester);
      }
      if (params?.q) {
        const q = String(params.q).toLowerCase();
        list = list.filter(
          (r) =>
            r.professorName.toLowerCase().includes(q) ||
            r.courseName.toLowerCase().includes(q) ||
            r.content.toLowerCase().includes(q),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }
  }

  // 3. Resources (Resource Submissions)
  if (cleanPath.startsWith('admin-data/resource-submissions')) {
    const matchAction = cleanPath.match(/^admin-data\/resource-submissions\/([^/]+)\/(approve|reject)$/);
    if (matchAction) {
      const [, id, action] = matchAction;
      const index = mockResourceSubmissions.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'منبع مورد نظر یافت نشد' } };
      }
      if (action === 'approve') {
        mockResourceSubmissions[index].status = 'approved';
        mockResourceSubmissions[index].publishedAt = new Date().toISOString();
        return { success: true, data: mockResourceSubmissions[index] };
      }
      if (action === 'reject') {
        const payload = body as { reason?: string };
        mockResourceSubmissions[index].status = 'rejected';
        mockResourceSubmissions[index].rejectionReason = payload?.reason || 'رد شده توسط ادمین';
        return { success: true, data: mockResourceSubmissions[index] };
      }
    }

    const matchDetail = cleanPath.match(/^admin-data\/resource-submissions\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockResourceSubmissions.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'منبع مورد نظر یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockResourceSubmissions[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockResourceSubmissions[index] = {
          ...mockResourceSubmissions[index],
          ...(body as Partial<IResourceSubmission>),
        };
        return { success: true, data: mockResourceSubmissions[index] };
      }
      if (m === 'DELETE') {
        mockResourceSubmissions = mockResourceSubmissions.filter((r) => r.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockResourceSubmissions];
      if (params?.status && params.status !== 'all') {
        list = list.filter((r) => r.status === params.status);
      }
      if (params?.resourceKind && params.resourceKind !== 'all') {
        list = list.filter((r) => r.resourceKind === params.resourceKind);
      }
      if (params?.q) {
        const q = String(params.q).toLowerCase();
        list = list.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            (r.professorName && r.professorName.toLowerCase().includes(q)) ||
            (r.courseName && r.courseName.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }
  }

  // 4. Professors CRUD & Merge
  if (cleanPath.startsWith('professors')) {
    const matchMerge = cleanPath.match(/^professors\/([^/]+)\/merge$/);
    if (matchMerge && m === 'POST') {
      const sourceId = matchMerge[1];
      const { targetId } = body as { targetId: string };
      const sourceIndex = mockProfessors.findIndex((p) => p.id === sourceId);
      const targetIndex = mockProfessors.findIndex((p) => p.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'استاد مبدا یا مقصد یافت نشد' } };
      }

      // Transfer relations to target
      const target = mockProfessors[targetIndex];
      const source = mockProfessors[sourceIndex];
      if (target.relationCounts && source.relationCounts) {
        target.relationCounts.teachings += source.relationCounts.teachings;
        target.relationCounts.reviews += source.relationCounts.reviews;
        target.relationCounts.resources += source.relationCounts.resources;
        target.relationCounts.inquiries += source.relationCounts.inquiries;
      }
      mockProfessors = mockProfessors.filter((p) => p.id !== sourceId);
      return { success: true, data: { merged: true, targetId, sourceId } };
    }

    const matchCounts = cleanPath.match(/^professors\/([^/]+)\/relation-counts$/);
    if (matchCounts && m === 'GET') {
      const id = matchCounts[1];
      const prof = mockProfessors.find((p) => p.id === id);
      return {
        success: true,
        data: prof?.relationCounts || { teachings: 0, reviews: 0, resources: 0, inquiries: 0 },
      };
    }

    const matchDetail = cleanPath.match(/^professors\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockProfessors.findIndex((p) => p.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'استاد یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockProfessors[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockProfessors[index] = {
          ...mockProfessors[index],
          ...(body as Partial<IProfessor>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockProfessors[index] };
      }
      if (m === 'DELETE') {
        mockProfessors = mockProfessors.filter((p) => p.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockProfessors];
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.department && p.department.toLowerCase().includes(q)) ||
            (p.universityName && p.universityName.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<IProfessor>;
      const newProf: IProfessor = {
        id: `prof-${Date.now()}`,
        name: payload.name || 'استاد جدید',
        title: payload.title || 'استادیار',
        department: payload.department || 'دانشکده مهندسی',
        universityName: payload.universityName || 'دانشگاه صنعتی شریف',
        email: payload.email,
        bio: payload.bio,
        relationCounts: { teachings: 0, reviews: 0, resources: 0, inquiries: 0 },
        createdAt: new Date().toISOString(),
      };
      mockProfessors = [newProf, ...mockProfessors];
      return { success: true, data: newProf };
    }
  }

  // 5. Courses CRUD & Merge
  if (cleanPath.startsWith('courses')) {
    const matchMerge = cleanPath.match(/^courses\/([^/]+)\/merge$/);
    if (matchMerge && m === 'POST') {
      const sourceId = matchMerge[1];
      const { targetId } = body as { targetId: string };
      const sourceIndex = mockCourses.findIndex((c) => c.id === sourceId);
      const targetIndex = mockCourses.findIndex((c) => c.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'درس مبدا یا مقصد یافت نشد' } };
      }

      const target = mockCourses[targetIndex];
      const source = mockCourses[sourceIndex];
      if (target.relationCounts && source.relationCounts) {
        target.relationCounts.teachings += source.relationCounts.teachings;
        target.relationCounts.reviews += source.relationCounts.reviews;
        target.relationCounts.resources += source.relationCounts.resources;
      }
      mockCourses = mockCourses.filter((c) => c.id !== sourceId);
      return { success: true, data: { merged: true, targetId, sourceId } };
    }

    const matchCounts = cleanPath.match(/^courses\/([^/]+)\/relation-counts$/);
    if (matchCounts && m === 'GET') {
      const id = matchCounts[1];
      const course = mockCourses.find((c) => c.id === id);
      return {
        success: true,
        data: course?.relationCounts || { teachings: 0, reviews: 0, resources: 0 },
      };
    }

    const matchDetail = cleanPath.match(/^courses\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockCourses.findIndex((c) => c.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'درس یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockCourses[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockCourses[index] = {
          ...mockCourses[index],
          ...(body as Partial<ICourse>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockCourses[index] };
      }
      if (m === 'DELETE') {
        mockCourses = mockCourses.filter((c) => c.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockCourses];
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.code && c.code.toLowerCase().includes(q)) ||
            (c.department && c.department.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<ICourse>;
      const newCourse: ICourse = {
        id: `course-${Date.now()}`,
        name: payload.name || 'درس جدید',
        code: payload.code || `CR-${Math.floor(Math.random() * 900 + 100)}`,
        units: payload.units || 3,
        department: payload.department || 'دانشکده مهندسی',
        universityName: payload.universityName || 'دانشگاه صنعتی شریف',
        relationCounts: { teachings: 0, reviews: 0, resources: 0 },
        createdAt: new Date().toISOString(),
      };
      mockCourses = [newCourse, ...mockCourses];
      return { success: true, data: newCourse };
    }
  }

  // 5.1 Universities CRUD
  if (cleanPath.startsWith('universities')) {
    const matchDetail = cleanPath.match(/^universities\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockUniversities.findIndex((u) => u.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'دانشگاه یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockUniversities[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockUniversities[index] = {
          ...mockUniversities[index],
          ...(body as Partial<IUniversity>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockUniversities[index] };
      }
      if (m === 'DELETE') {
        mockUniversities = mockUniversities.filter((u) => u.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockUniversities];
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            (u.city && u.city.toLowerCase().includes(q)) ||
            (u.slug && u.slug.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<IUniversity>;
      const newUni: IUniversity = {
        id: `uni-${Date.now()}`,
        name: payload.name || 'دانشگاه جدید',
        slug: payload.slug || `uni-${Date.now()}`,
        city: payload.city || 'تهران',
        description: payload.description,
        campusCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockUniversities = [newUni, ...mockUniversities];
      return { success: true, data: newUni };
    }
  }

  // 5.2 Campuses CRUD
  if (cleanPath.startsWith('campuses')) {
    const matchDetail = cleanPath.match(/^campuses\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockCampuses.findIndex((c) => c.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'واحد یا دانشکده یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockCampuses[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        const payload = body as Partial<ICampus>;
        const uni = payload.universityId ? mockUniversities.find((u) => u.id === payload.universityId) : undefined;
        mockCampuses[index] = {
          ...mockCampuses[index],
          ...payload,
          universityName: uni?.name || mockCampuses[index].universityName,
          university: uni ? { id: uni.id, name: uni.name } : mockCampuses[index].university,
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockCampuses[index] };
      }
      if (m === 'DELETE') {
        mockCampuses = mockCampuses.filter((c) => c.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockCampuses];
      if (params?.universityId) {
        list = list.filter((c) => c.universityId === params.universityId);
      }
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.universityName && c.universityName.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<ICampus>;
      const uni = mockUniversities.find((u) => u.id === payload.universityId);
      const newCampus: ICampus = {
        id: `camp-${Date.now()}`,
        name: payload.name || 'واحد جدید',
        universityId: payload.universityId || mockUniversities[0]?.id || 'uni-1',
        universityName: uni?.name || 'دانشگاه صنعتی شریف',
        university: uni ? { id: uni.id, name: uni.name } : undefined,
        description: payload.description,
        majorCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockCampuses = [newCampus, ...mockCampuses];
      return { success: true, data: newCampus };
    }
  }

  // 5.3 Majors CRUD
  if (cleanPath.startsWith('majors')) {
    const matchDetail = cleanPath.match(/^majors\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockMajors.findIndex((mj) => mj.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'رشته تحصیلی یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockMajors[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockMajors[index] = {
          ...mockMajors[index],
          ...(body as Partial<IMajor>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockMajors[index] };
      }
      if (m === 'DELETE') {
        mockMajors = mockMajors.filter((mj) => mj.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockMajors];
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (mj) =>
            mj.name.toLowerCase().includes(q) ||
            (mj.code && mj.code.toLowerCase().includes(q)) ||
            (mj.department && mj.department.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<IMajor>;
      const newMajor: IMajor = {
        id: `major-${Date.now()}`,
        name: payload.name || 'رشته جدید',
        code: payload.code || `${Math.floor(Math.random() * 90000 + 10000)}`,
        department: payload.department || 'دانشکده مهندسی',
        degreeLevels: payload.degreeLevels || ['bachelor'],
        description: payload.description,
        createdAt: new Date().toISOString(),
      };
      mockMajors = [newMajor, ...mockMajors];
      return { success: true, data: newMajor };
    }
  }

  // 5.4 Teachings CRUD
  if (cleanPath.startsWith('teachings')) {
    const matchDetail = cleanPath.match(/^teachings\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockTeachings.findIndex((t) => t.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'تدریس یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockTeachings[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        const payload = body as Partial<ITeaching> & { professorId?: string; courseId?: string; campusId?: string; majorId?: string };
        const prof = payload.professorId ? mockProfessors.find((p) => p.id === payload.professorId) : undefined;
        const course = payload.courseId ? mockCourses.find((c) => c.id === payload.courseId) : undefined;
        const campus = payload.campusId ? mockCampuses.find((c) => c.id === payload.campusId) : undefined;
        const major = payload.majorId ? mockMajors.find((m) => m.id === payload.majorId) : undefined;

        mockTeachings[index] = {
          ...mockTeachings[index],
          ...payload,
          professor: prof ? { id: prof.id, name: prof.name } : mockTeachings[index].professor,
          course: course ? { id: course.id, name: course.name } : mockTeachings[index].course,
          campus: campus
            ? {
                id: campus.id,
                name: campus.name,
                university: campus.university,
              }
            : mockTeachings[index].campus,
          major: major ? { id: major.id, name: major.name } : mockTeachings[index].major,
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockTeachings[index] };
      }
      if (m === 'DELETE') {
        mockTeachings = mockTeachings.filter((t) => t.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockTeachings];
      if (params?.professorId) {
        list = list.filter((t) => t.professorId === params.professorId || t.professor?.id === params.professorId);
      }
      if (params?.courseId) {
        list = list.filter((t) => t.courseId === params.courseId || t.course?.id === params.courseId);
      }
      if (params?.campusId) {
        list = list.filter((t) => t.campusId === params.campusId || t.campus?.id === params.campusId);
      }
      if (params?.degreeLevel) {
        list = list.filter((t) => t.degreeLevel === params.degreeLevel);
      }
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (t) =>
            t.professor?.name.toLowerCase().includes(q) ||
            t.course?.name.toLowerCase().includes(q) ||
            t.campus?.name.toLowerCase().includes(q) ||
            t.major?.name.toLowerCase().includes(q),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<ITeaching> & { professorId?: string; courseId?: string; campusId?: string; majorId?: string };
      const prof = mockProfessors.find((p) => p.id === payload.professorId) || mockProfessors[0];
      const course = mockCourses.find((c) => c.id === payload.courseId) || mockCourses[0];
      const campus = mockCampuses.find((c) => c.id === payload.campusId) || mockCampuses[0];
      const major = mockMajors.find((m) => m.id === payload.majorId) || mockMajors[0];

      const newTeaching: ITeaching = {
        id: `teach-${Date.now()}`,
        degreeLevel: payload.degreeLevel || 'bachelor',
        professorId: prof?.id,
        professor: { id: prof?.id || 'prof-1', name: prof?.name || 'دکتر علیرضا رضوی' },
        courseId: course?.id,
        course: { id: course?.id || 'course-1', name: course?.name || 'ریاضی ۱' },
        campusId: campus?.id,
        campus: {
          id: campus?.id || 'camp-1',
          name: campus?.name || 'دانشکده کامپیوتر',
          university: campus?.university || { id: 'uni-1', name: 'دانشگاه صنعتی شریف' },
        },
        majorId: major?.id,
        major: { id: major?.id || 'major-1', name: major?.name || 'مهندسی نرم‌افزار' },
        semester: payload.semester || 'نیم‌سال اول ۱۴۰۴-۱۴۰۵',
        createdAt: new Date().toISOString(),
      };
      mockTeachings = [newTeaching, ...mockTeachings];
      return { success: true, data: newTeaching };
    }
  }

  // 5.5 Registered Academic Reviews
  if (cleanPath.startsWith('academic/reviews')) {
    const matchDetail = cleanPath.match(/^academic\/reviews\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockRegisteredReviews.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'نظر ثبت‌شده یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockRegisteredReviews[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        const payload = body as Partial<IRegisteredReview>;
        const teaching = payload.teachingId
          ? mockTeachings.find((t) => t.id === payload.teachingId)
          : mockRegisteredReviews[index].teaching;

        mockRegisteredReviews[index] = {
          ...mockRegisteredReviews[index],
          ...payload,
          teaching,
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockRegisteredReviews[index] };
      }
      if (m === 'DELETE') {
        mockRegisteredReviews = mockRegisteredReviews.filter((r) => r.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockRegisteredReviews];
      if (params?.universityId) {
        list = list.filter((r) => r.teaching?.campus?.university?.id === params.universityId);
      }
      if (params?.campusId) {
        list = list.filter((r) => r.teaching?.campus?.id === params.campusId);
      }
      if (params?.majorId) {
        list = list.filter((r) => r.teaching?.major?.id === params.majorId);
      }
      if (params?.professorId) {
        list = list.filter((r) => r.teaching?.professor?.id === params.professorId);
      }
      if (params?.courseId) {
        list = list.filter((r) => r.teaching?.course?.id === params.courseId);
      }
      if (params?.degreeLevel) {
        list = list.filter((r) => r.teaching?.degreeLevel === params.degreeLevel);
      }
      if (params?.source && params.source !== 'all') {
        list = list.filter((r) => r.source === params.source);
      }
      if (params?.semester) {
        list = list.filter((r) => r.semester === params.semester);
      }
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (r) =>
            r.content.toLowerCase().includes(q) ||
            (r.teaching?.professor?.name && r.teaching.professor.name.toLowerCase().includes(q)) ||
            (r.teaching?.course?.name && r.teaching.course.name.toLowerCase().includes(q)) ||
            (r.teaching?.campus?.name && r.teaching.campus.name.toLowerCase().includes(q)) ||
            (r.teaching?.campus?.university?.name && r.teaching.campus.university.name.toLowerCase().includes(q)) ||
            (r.teaching?.major?.name && r.teaching.major.name.toLowerCase().includes(q)) ||
            (r.student?.username && r.student.username.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    if (m === 'POST') {
      const payload = body as Partial<IRegisteredReview>;
      const teaching = mockTeachings.find((t) => t.id === payload.teachingId) || mockTeachings[0];
      const newReview: IRegisteredReview = {
        id: `rev-reg-${Date.now()}`,
        content: payload.content || '',
        teachingId: payload.teachingId || teaching.id,
        source: 'admin',
        student: null,
        teaching,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockRegisteredReviews = [newReview, ...mockRegisteredReviews];
      return { success: true, data: newReview };
    }
  }

  // 6. Inquiries Follow-Up Campaign
  if (cleanPath.startsWith('admin/inquiries')) {
    if (cleanPath.includes('trigger-notifications') && m === 'POST') {
      const payload = body as { inquiryIds?: string[]; customMessage?: string };
      const ids = payload?.inquiryIds && payload.inquiryIds.length > 0
        ? payload.inquiryIds
        : mockInquiries.filter((i) => i.inquiry.notificationStatus === 'pending').map((i) => i.id);

      ids.forEach((id) => {
        const item = mockInquiries.find((i) => i.id === id);
        if (item) {
          item.inquiry.notificationStatus = 'sent';
          item.inquiry.notificationSentAt = new Date().toISOString();
        }
      });

      return {
        success: true,
        data: {
          triggeredCount: ids.length,
          sentInquiryIds: ids,
          failedCount: 0,
        },
      };
    }

    if (cleanPath.includes('eligible') && m === 'GET') {
      let list = [...mockInquiries];
      if (params?.onlyEligible === 'true' || params?.onlyEligible === true) {
        list = list.filter((i) => i.inquiry.notificationStatus === 'pending');
      }
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (i) =>
            i.professor.name.toLowerCase().includes(q) ||
            (i.course?.name && i.course.name.toLowerCase().includes(q)) ||
            (i.user.username && i.user.username.toLowerCase().includes(q)) ||
            (i.user.firstName && i.user.firstName.toLowerCase().includes(q)) ||
            (i.user.lastName && i.user.lastName.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 50;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }

    // Topics campaign
    if (cleanPath.includes('topics/campaign') && m === 'POST') {
      const payload = body as { topicIds?: string[]; recipientLimitPerTopic?: number; messageText: string };
      return {
        success: true,
        data: {
          totalTarget: (payload.topicIds?.length || 1) * (payload.recipientLimitPerTopic || 5),
          sentCount: (payload.topicIds?.length || 1) * (payload.recipientLimitPerTopic || 5),
          failedCount: 0,
        },
      };
    }

    // Topics merge
    if (cleanPath.includes('topics/merge') && m === 'POST') {
      return {
        success: true,
        data: { merged: true },
      };
    }

    // Topic split alias
    const splitMatch = cleanPath.match(/^admin\/inquiries\/topics\/([^/]+)\/aliases\/([^/]+)\/split$/);
    if (splitMatch && m === 'POST') {
      const topicId = splitMatch[1];
      const aliasId = splitMatch[2];
      const topic = mockInquiryTopics.find((t) => t.id === topicId);
      if (topic) {
        topic.aliases = (topic.aliases || []).filter((a: any) => a.id !== aliasId);
      }
      return {
        success: true,
        data: {
          id: 'topic-split-new',
          canonicalName: (body as any)?.newCanonicalName || 'استاد تفکیک‌شده جدید',
          normalizedCanonicalName: (body as any)?.newCanonicalName || 'استاد تفکیک‌شده جدید',
          topicType: topic?.topicType || 'professor',
          status: 'active',
          totalQueries: 1,
          aliases: [],
          uniqueStudentsCount: 1,
          pendingInquiriesCount: 1,
          sentInquiriesCount: 0,
          convertedInquiriesCount: 0,
          conversionRate: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // Topic delete alias
    const deleteAliasMatch = cleanPath.match(/^admin\/inquiries\/topics\/([^/]+)\/aliases\/([^/]+)$/);
    if (deleteAliasMatch && m === 'DELETE') {
      const topicId = deleteAliasMatch[1];
      const aliasId = deleteAliasMatch[2];
      const topic = mockInquiryTopics.find((t) => t.id === topicId);
      if (topic) {
        topic.aliases = (topic.aliases || []).filter((a: any) => a.id !== aliasId);
      }
      return {
        success: true,
        data: { deleted: true },
      };
    }

    // Topic details
    const topicDetailsMatch = cleanPath.match(/^admin\/inquiries\/topics\/([^/]+)$/);
    if (topicDetailsMatch && m === 'GET') {
      const id = topicDetailsMatch[1];
      const topic = mockInquiryTopics.find((t) => t.id === id);
      if (!topic) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'موضوع یافت نشد' } };
      }
      return {
        success: true,
        data: {
          ...topic,
          inquiries: mockInquiries.slice(0, 4).map((i) => ({
            id: i.id,
            rawQuery: topic.aliases?.[0]?.rawAlias || topic.canonicalName,
            inquiryType: 'review',
            channel: 'group',
            inquiredAt: i.inquiry.inquiredAt,
            followUpEligibleAt: i.inquiry.followUpEligibleAt,
            notificationStatus: i.inquiry.notificationStatus,
            notificationSentAt: i.inquiry.notificationSentAt,
            convertedAt: null,
            conversionNote: null,
            user: i.user,
          })),
        },
      };
    }

    // Topic update
    if (topicDetailsMatch && (m === 'PATCH' || m === 'PUT')) {
      const id = topicDetailsMatch[1];
      const topic = mockInquiryTopics.find((t) => t.id === id);
      if (!topic) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'موضوع یافت نشد' } };
      }
      const b = body as any;
      if (b.canonicalName) topic.canonicalName = b.canonicalName;
      if (b.status) topic.status = b.status;
      if (b.professorId !== undefined) {
        const prof = mockProfessors.find((p) => p.id === b.professorId);
        topic.professor = prof ? { id: prof.id, name: prof.name } : null;
      }
      return {
        success: true,
        data: topic,
      };
    }

    // Topic list
    if (cleanPath.includes('topics') && m === 'GET') {
      let list = [...mockInquiryTopics];
      if (params?.type) {
        list = list.filter((t) => t.topicType === params.type);
      }
      if (params?.status) {
        list = list.filter((t) => t.status === params.status);
      }
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter(
          (t) =>
            t.canonicalName.toLowerCase().includes(q) ||
            t.aliases?.some((a: any) => a.rawAlias.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 20;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }
  }

  // 7. System & AI Errors
  if (cleanPath.startsWith('admin/errors')) {
    const matchResolve = cleanPath.match(/^admin\/errors\/([^/]+)\/resolve$/);
    if (matchResolve && (m === 'PATCH' || m === 'POST')) {
      const id = matchResolve[1];
      const index = mockErrorLogs.findIndex((e) => e.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'خطای مورد نظر یافت نشد' } };
      }
      mockErrorLogs[index].isResolved = true;
      mockErrorLogs[index].resolvedAt = new Date().toISOString();
      mockErrorLogs[index].resolvedBy = 'admin';
      return { success: true, data: mockErrorLogs[index] };
    }

    if (m === 'GET') {
      let list = [...mockErrorLogs];
      if (params?.source && params.source !== 'all') {
        list = list.filter((e) => e.source === params.source);
      }
      if (params?.level && params.level !== 'all') {
        list = list.filter((e) => e.level === params.level);
      }
      if (params?.isResolved !== undefined && params?.isResolved !== 'all') {
        const isRes = params.isResolved === 'true' || params.isResolved === true;
        list = list.filter((e) => e.isResolved === isRes);
      }
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (e) =>
            e.message.toLowerCase().includes(q) ||
            (e.stack && e.stack.toLowerCase().includes(q)),
        );
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 25;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = params?.offset !== undefined ? Number(params.offset) : (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, total, totalPages, limit: perPage, offset: start },
      };
    }
  }

  // 8. Auth, Admins, Roles & Permissions
  if (cleanPath.startsWith('auth/permissions') || cleanPath.startsWith('api/v1/auth/permissions')) {
    return { success: true, data: SYSTEM_PERMISSIONS };
  }

  if (cleanPath.startsWith('auth/roles') || cleanPath.startsWith('api/v1/auth/roles')) {
    if (m === 'GET') {
      return { success: true, data: mockRoles };
    }
    if (m === 'POST') {
      const payload = body as { name: string; description: string; permissionCodes: string[] };
      const newRole: IRole = {
        id: `role-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        permissions: payload.permissionCodes || [],
      };
      mockRoles = [...mockRoles, newRole];
      return { success: true, data: newRole };
    }
  }

  // 11. Telegram Management Endpoints
  if (cleanPath.startsWith('telegram/users') || cleanPath.startsWith('admin-data/telegram-users')) {
    const matchDetail = cleanPath.match(/(?:telegram\/users|admin-data\/telegram-users)\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const user = mockTelegramUsers.find((u) => u.id === id);
      if (!user) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'کاربر تلگرام یافت نشد' } };
      }
      return { success: true, data: user };
    }

    let list = [...mockTelegramUsers];
    if (params?.search) {
      const q = String(params.search).toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          u.id.includes(q),
      );
    }
    const page = Number(params?.page) || 1;
    const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 20;
    const total = list.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    return {
      success: true,
      data: list.slice(start, start + perPage),
      meta: { page, perPage, pageSize: perPage, limit: perPage, offset: start, total, totalPages },
    };
  }

  if (cleanPath.startsWith('telegram/groups') || cleanPath.startsWith('admin-data/group-configs')) {
    const matchDetail = cleanPath.match(/(?:telegram\/groups|admin-data\/group-configs)\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockTelegramGroups.findIndex((g) => g.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'گروه تلگرام یافت نشد' } };
      }
      if (m === 'PATCH' || m === 'PUT') {
        mockTelegramGroups[index] = {
          ...mockTelegramGroups[index],
          ...(body as Partial<ITelegramGroup>),
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockTelegramGroups[index] };
      }
      return { success: true, data: mockTelegramGroups[index] };
    }

    let list = [...mockTelegramGroups];
    if (params?.search) {
      const q = String(params.search).toLowerCase();
      list = list.filter(
        (g) =>
          g.chatTitle.toLowerCase().includes(q) ||
          g.telegramChatId.includes(q) ||
          (g.universityName && g.universityName.toLowerCase().includes(q)),
      );
    }
    const page = Number(params?.page) || 1;
    const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 20;
    const total = list.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    return {
      success: true,
      data: list.slice(start, start + perPage),
      meta: { page, perPage, pageSize: perPage, limit: perPage, offset: start, total, totalPages },
    };
  }

  if (cleanPath.startsWith('telegram/conversations') || cleanPath.startsWith('admin-data/conversations')) {
    const matchMessages = cleanPath.match(/(?:telegram\/conversations|admin-data\/conversations)\/([^/]+)\/messages$/);
    if (matchMessages) {
      const convId = matchMessages[1];
      const conv = mockTelegramConversations.find((c) => c.id === convId);
      return {
        success: true,
        data: conv?.messages || [],
      };
    }

    const matchDetail = cleanPath.match(/(?:telegram\/conversations|admin-data\/conversations)\/([^/]+)$/);
    if (matchDetail) {
      const convId = matchDetail[1];
      const conv = mockTelegramConversations.find((c) => c.id === convId);
      if (!conv) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'مکالمه یافت نشد' } };
      }
      return { success: true, data: conv };
    }

    let list = [...mockTelegramConversations];
    if (params?.search) {
      const q = String(params.search).toLowerCase();
      list = list.filter(
        (c) =>
          c.userDisplayName.toLowerCase().includes(q) ||
          (c.lastMessage && c.lastMessage.toLowerCase().includes(q)),
      );
    }
    const page = Number(params?.page) || 1;
    const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 20;
    const total = list.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    return {
      success: true,
      data: list.slice(start, start + perPage),
      meta: { page, perPage, pageSize: perPage, limit: perPage, offset: start, total, totalPages },
    };
  }

  // 12. AI Models Endpoints
  if (cleanPath.startsWith('ai-models') || cleanPath.startsWith('ai-model-configs')) {
    const matchDetail = cleanPath.match(/(?:ai-models|ai-model-configs)\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const index = mockAiModels.findIndex((m) => m.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'مدل هوش مصنوعی یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: mockAiModels[index] };
      }
      if (m === 'PATCH' || m === 'PUT') {
        const payload = body as Partial<IAiModelConfig> & { apiKey?: string };
        mockAiModels[index] = {
          ...mockAiModels[index],
          ...payload,
          apiKeyMasked: payload.apiKey ? `${payload.apiKey.slice(0, 4)}...${payload.apiKey.slice(-4)}` : mockAiModels[index].apiKeyMasked,
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockAiModels[index] };
      }
      if (m === 'DELETE') {
        mockAiModels = mockAiModels.filter((m) => m.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
    }

    if (m === 'GET') {
      let list = [...mockAiModels];
      if (params?.scope) {
        list = list.filter((m) => m.scope === params.scope);
      }
      return { success: true, data: list };
    }

    if (m === 'POST') {
      const payload = body as Partial<IAiModelConfig> & { apiKey?: string };
      const newModel: IAiModelConfig = {
        id: `ai-${Date.now()}`,
        name: payload.name || 'مدل هوش مصنوعی جدید',
        scope: payload.scope || 'answer',
        providerName: payload.providerName || 'openai',
        baseUrl: payload.baseUrl || 'https://api.openai.com/v1',
        apiKeyMasked: payload.apiKey ? `${payload.apiKey.slice(0, 4)}...${payload.apiKey.slice(-4)}` : 'sk-...xxxx',
        model: payload.model || 'gpt-4o-mini',
        structuredOutputMode: payload.structuredOutputMode || 'json_schema',
        maxTokensParameter: payload.maxTokensParameter || 'max_tokens',
        requireParameters: Boolean(payload.requireParameters),
        includeTemperature: Boolean(payload.includeTemperature),
        isEnabled: payload.isEnabled !== false,
        createdAt: new Date().toISOString(),
      };
      mockAiModels = [newModel, ...mockAiModels];
      return { success: true, data: newModel };
    }
  }

  // 13. AI Cache Endpoints
  if (cleanPath.startsWith('ai-cache')) {
    if (cleanPath === 'ai-cache/stats') {
      return { success: true, data: getMockAiCacheStats() };
    }

    if (cleanPath === 'ai-cache/invalidate' && m === 'POST') {
      const payload = body as { professorId?: string; courseId?: string; all?: boolean };
      const initialCount = mockAiCacheEntries.length;
      let scope = 'all';
      let targetId: string | undefined = undefined;
      if (payload?.all) {
        mockAiCacheEntries = [];
        scope = 'all';
      } else if (payload?.professorId) {
        mockAiCacheEntries = mockAiCacheEntries.filter((c) => c.professor?.id !== payload.professorId);
        scope = 'professor';
        targetId = payload.professorId;
      } else if (payload?.courseId) {
        mockAiCacheEntries = mockAiCacheEntries.filter((c) => c.course?.id !== payload.courseId);
        scope = 'course';
        targetId = payload.courseId;
      }
      const deletedCount = initialCount - mockAiCacheEntries.length;
      return { success: true, data: { deletedCount, scope, targetId } };
    }

    if (cleanPath === 'ai-cache' && m === 'DELETE') {
      const deletedCount = mockAiCacheEntries.length;
      mockAiCacheEntries = [];
      return { success: true, data: { deletedCount, scope: 'all' } };
    }

    const matchDetail = cleanPath.match(/^ai-cache\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const entry = mockAiCacheEntries.find((c) => c.id === id);
      if (m === 'DELETE') {
        if (!entry) {
          return { success: false, error: { code: 'NOT_FOUND', message: 'مورد کش یافت نشد' } };
        }
        mockAiCacheEntries = mockAiCacheEntries.filter((c) => c.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
      if (m === 'GET') {
        if (!entry) {
          return { success: false, error: { code: 'NOT_FOUND', message: 'مورد کش یافت نشد' } };
        }
        return { success: true, data: entry };
      }
    }

    if (m === 'GET') {
      let list = [...mockAiCacheEntries];
      if (params?.search || params?.q) {
        const q = String(params.search || params.q).toLowerCase();
        list = list.filter(
          (c) =>
            c.answerPreview.toLowerCase().includes(q) ||
            c.cacheKey.toLowerCase().includes(q) ||
            (c.professor && c.professor.name.toLowerCase().includes(q)) ||
            (c.course && c.course.name.toLowerCase().includes(q)),
        );
      }
      if (params?.intent && params.intent !== 'all') {
        list = list.filter((c) => c.intent === params.intent);
      }
      if (params?.professorId) {
        list = list.filter((c) => c.professor?.id === params.professorId);
      }
      if (params?.courseId) {
        list = list.filter((c) => c.course?.id === params.courseId);
      }

      // Sorting
      const sortBy = (params?.sortBy as string) || 'lastHitAt';
      const sortOrder = (params?.sortOrder as string) || 'desc';
      list.sort((a, b) => {
        const valA = a[sortBy as keyof typeof a];
        const valB = b[sortBy as keyof typeof b];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      });

      const page = Number(params?.page) || 1;
      const perPage = Math.min(Number(params?.pageSize || params?.perPage) || 25, 100);
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = (page - 1) * perPage;
      const items = list.slice(start, start + perPage);

      return {
        success: true,
        data: items,
        meta: { page, perPage, pageSize: perPage, total, totalPages },
        total,
        page,
        pageSize: perPage,
        totalPages,
      };
    }
  }

  // 14. Users, Roles & Permissions Endpoints
  if (cleanPath.startsWith('auth/users') || cleanPath.startsWith('users')) {
    const matchUserDetail = cleanPath.match(/^(?:auth\/users|users)\/([^/]+)$/);
    if (matchUserDetail) {
      const userId = matchUserDetail[1];
      const user = mockUsers.find((u) => String(u.id) === userId);
      if (!user) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'کاربر مورد نظر یافت نشد' } };
      }
      if (m === 'GET') {
        return { success: true, data: user };
      }
      if (m === 'PUT' || m === 'PATCH') {
        const payload = body as Partial<IUser> & { password?: string };
        if (payload.name !== undefined) user.name = payload.name;
        if (payload.displayName !== undefined) user.displayName = payload.displayName;
        if (payload.role !== undefined) user.role = payload.role;
        if (payload.roles !== undefined) user.roles = payload.roles;
        if (payload.roleIds !== undefined) user.roleIds = payload.roleIds;
        if (payload.permissions !== undefined) user.permissions = payload.permissions;
        if (payload.scopes !== undefined) user.scopes = payload.scopes;
        if (payload.isActive !== undefined) user.isActive = payload.isActive;
        logAuditEvent('USER_UPDATE', 'user', String(user.id), {
          username: user.username,
          updatedFields: Object.keys(payload),
        });
        return { success: true, data: user };
      }
    }

    if (m === 'GET') {
      const result = getMockUsers(
        params as {
          page?: number;
          perPage?: number;
          pageSize?: number;
          search?: string;
          q?: string;
        },
      );
      return {
        success: true,
        data: result.items,
        meta: result.meta,
        total: result.meta.total,
        page: result.meta.page,
        pageSize: result.meta.pageSize,
        totalPages: result.meta.totalPages,
      };
    }
    if (m === 'POST') {
      const payload = body as Partial<IUser>;
      const newUser: IUser = {
        id: `u-${Date.now()}`,
        name: payload.name || 'کاربر جدید',
        displayName: payload.displayName || payload.name,
        username: payload.username || `user_${Date.now()}`,
        role: payload.role || 'content_manager',
        roles: payload.roles || (payload.roleIds ?? [payload.role || 'content_manager']),
        roleIds: payload.roleIds || (payload.roles ?? [payload.role || 'content_manager']),
        isSuperAdmin: payload.role === 'super_admin' || payload.roles?.includes('super_admin'),
        isActive: payload.isActive !== false,
        profileImageUrl: null,
        permissions: payload.permissions || ['reviews:read', 'resources:read'],
        scopes: payload.scopes || {
          allUniversities: true,
          universityIds: [],
          allCampuses: true,
          campusIds: [],
          allMajors: true,
          majorIds: [],
        },
        createdAt: new Date().toISOString(),
      };
      mockUsers = [newUser, ...mockUsers];
      logAuditEvent('USER_CREATE', 'user', String(newUser.id), {
        username: newUser.username,
        role: newUser.role,
        permissionsCount: newUser.permissions.length,
        scopes: newUser.scopes,
      });
      return { success: true, data: newUser };
    }
  }

  // 15. Lookups Endpoints
  if (cleanPath.startsWith('lookups/')) {
    const q = String(params?.q || params?.search || '').trim().toLowerCase();

    if (cleanPath === 'lookups/universities') {
      let list = mockUniversities;
      if (q) {
        list = list.filter((u) => u.name.toLowerCase().includes(q));
      }
      return {
        success: true,
        data: list.slice(0, 10).map((u) => ({ id: u.id, name: u.name })),
      };
    }

    if (cleanPath === 'lookups/campuses') {
      let list = mockCampuses;
      if (params?.universityId) {
        list = list.filter((c) => c.universityId === params.universityId);
      }
      if (q) {
        list = list.filter((c) => c.name.toLowerCase().includes(q));
      }
      return {
        success: true,
        data: list.slice(0, 10).map((c) => {
          const u = mockUniversities.find((uni) => uni.id === c.universityId);
          return {
            id: c.id,
            name: c.name,
            universityId: c.universityId,
            universityName: u?.name || '',
          };
        }),
      };
    }

    if (cleanPath === 'lookups/majors') {
      let list = mockMajors;
      if (q) {
        list = list.filter((m) => m.name.toLowerCase().includes(q));
      }
      return {
        success: true,
        data: list.slice(0, 10).map((m) => ({ id: m.id, name: m.name })),
      };
    }

    if (cleanPath === 'lookups/professors') {
      let list = mockProfessors;
      if (q) {
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }
      return {
        success: true,
        data: list.slice(0, 10).map((p) => ({ id: p.id, name: p.name })),
      };
    }

    if (cleanPath === 'lookups/courses') {
      let list = mockCourses;
      if (q) {
        list = list.filter((c) => c.name.toLowerCase().includes(q));
      }
      return {
        success: true,
        data: list.slice(0, 10).map((c) => ({ id: c.id, name: c.name })),
      };
    }

    if (cleanPath === 'lookups/teachings') {
      const degreePersian: Record<string, string> = {
        bachelor: 'کارشناسی',
        master: 'کارشناسی ارشد',
        doctorate: 'دکتری',
        associate: 'کاردانی',
      };
      let list = mockTeachings;
      if (q) {
        list = list.filter((t) => {
          const pName = t.professor?.name?.toLowerCase() || '';
          const cName = t.course?.name?.toLowerCase() || '';
          const campName = t.campus?.name?.toLowerCase() || '';
          const mName = t.major?.name?.toLowerCase() || '';
          const uName = t.campus?.university?.name?.toLowerCase() || '';
          return (
            pName.includes(q) ||
            cName.includes(q) ||
            campName.includes(q) ||
            mName.includes(q) ||
            uName.includes(q)
          );
        });
      }
      return {
        success: true,
        data: list.slice(0, 10).map((t) => {
          const uName = t.campus?.university?.name || 'دانشگاه';
          const campName = t.campus?.name || 'دانشکده';
          const mName = t.major?.name || 'رشته';
          const cName = t.course?.name || 'درس';
          const pName = t.professor?.name || 'استاد';
          const degStr = degreePersian[t.degreeLevel] || t.degreeLevel || 'کارشناسی';
          const title = `${uName} - ${campName} - ${mName} - ${cName} - ${pName} (${degStr})`;
          return {
            id: t.id,
            title,
            professorId: t.professor?.id,
            professorName: pName,
            courseId: t.course?.id,
            courseName: cName,
            campusId: t.campus?.id,
            campusName: campName,
            universityId: t.campus?.university?.id,
            universityName: uName,
            majorId: t.major?.id,
            majorName: mName,
            degreeLevel: t.degreeLevel,
          };
        }),
      };
    }
  }

  // 16. Audit Logs Endpoints
  if (
    cleanPath.startsWith('admin/audit-logs') ||
    cleanPath.startsWith('admin-data/audit-logs') ||
    cleanPath === 'audit-logs' ||
    cleanPath.startsWith('audit-logs') ||
    cleanPath.startsWith('audit_logs')
  ) {
    let list = [...mockAuditLogs];
    if (params?.action && params.action !== 'all') {
      const act = String(params.action).toUpperCase();
      list = list.filter(
        (a) =>
          a.action.toUpperCase() === act ||
          a.action.toUpperCase().endsWith(`_${act}`) ||
          a.action.toUpperCase().startsWith(`${act}_`) ||
          a.action.toUpperCase().includes(act),
      );
    }
    if (params?.entityType && params.entityType !== 'all') {
      const rawEnt = String(params.entityType).toLowerCase().replace(/s$/, '');
      list = list.filter((a) => {
        const aEnt = a.entityType.toLowerCase().replace(/s$/, '');
        return (
          aEnt === rawEnt ||
          aEnt.includes(rawEnt) ||
          rawEnt.includes(aEnt) ||
          (rawEnt === 'review' && aEnt.includes('review')) ||
          (rawEnt === 'resource' && aEnt.includes('resource')) ||
          (rawEnt === 'campus' && aEnt.includes('campus')) ||
          (rawEnt === 'major' && aEnt.includes('major')) ||
          (rawEnt === 'error' && aEnt.includes('error')) ||
          (rawEnt === 'cache' && aEnt.includes('cache')) ||
          (rawEnt === 'user' && aEnt.includes('user'))
        );
      });
    }
    if (params?.adminUsername) {
      list = list.filter((a) => a.adminUsername === params.adminUsername);
    }
    if (params?.adminUserId) {
      list = list.filter((a) => a.adminUserId === params.adminUserId);
    }
    if (params?.entityId) {
      list = list.filter((a) => a.entityId === params.entityId);
    }
    if (params?.from) {
      list = list.filter((a) => a.createdAt >= String(params.from));
    }
    if (params?.to) {
      list = list.filter((a) => a.createdAt <= String(params.to));
    }
    const q = String(params?.search || params?.q || '').trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          a.entityType.toLowerCase().includes(q) ||
          a.adminUsername.toLowerCase().includes(q) ||
          JSON.stringify(a.details).toLowerCase().includes(q),
      );
    }

    const page = Number(params?.page) || 1;
    const perPage = Math.min(Number(params?.pageSize || params?.perPage) || 50, 100);
    const total = list.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const items = list.slice(start, start + perPage);

    return {
      success: true,
      data: items,
      meta: { page, perPage, pageSize: perPage, total, totalPages },
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  }


  if (cleanPath === 'auth/roles' || cleanPath === 'roles') {
    if (m === 'GET') {
      return { success: true, data: mockRoles };
    }
    if (m === 'POST') {
      const payload = body as Partial<IRole>;
      const newRole: IRole = {
        id: `role-${Date.now()}`,
        name: payload.name || 'custom_role',
        description: payload.description || '',
        permissions: payload.permissions || [],
      };
      mockRoles = [...mockRoles, newRole];
      return { success: true, data: newRole };
    }
  }

  if (cleanPath === 'auth/permissions' || cleanPath === 'permissions') {
    return { success: true, data: SYSTEM_PERMISSIONS };
  }

  if (cleanPath === 'auth/me' || cleanPath === 'api/v1/auth/me') {
    return { success: true, data: getMockCurrentUser() };
  }

  // Telegram endpoints
  if (cleanPath === 'telegram/users') {
    return {
      success: true,
      data: mockTelegramUsers,
      meta: {
        total: mockTelegramUsers.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      },
    };
  }

  if (cleanPath === 'telegram/groups') {
    return {
      success: true,
      data: mockTelegramGroups,
      meta: {
        total: mockTelegramGroups.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      },
    };
  }

  if (cleanPath === 'telegram/conversations') {
    return {
      success: true,
      data: mockTelegramConversations,
      meta: {
        total: mockTelegramConversations.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      },
    };
  }

  if (
    cleanPath.startsWith('telegram/conversations/') &&
    cleanPath.endsWith('/messages')
  ) {
    const parts = cleanPath.split('/');
    const convId = parts[2];
    const conv = mockTelegramConversations.find((c) => c.id === convId);
    const msgs: ITelegramMessage[] = conv?.messages || [];
    const fallbackMsgs: ITelegramMessage[] = [
      {
        id: `msg-${convId}-1`,
        conversationId: convId,
        role: 'user',
        content: 'سلام، سوالی در مورد انتخاب واحد و نظرات اساتید داشتم.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: `msg-${convId}-2`,
        conversationId: convId,
        role: 'assistant',
        content:
          'سلام و درود! در خدمت شما هستم. نام درس یا استاد مورد نظرتان را بفرمایید تا راهنماییتان کنم.',
        createdAt: new Date().toISOString(),
      },
    ];
    return {
      success: true,
      data: msgs.length > 0 ? msgs : fallbackMsgs,
    };
  }

  // 12. Broadcast Messaging
  if (cleanPath.startsWith('admin/broadcasts') || cleanPath.startsWith('broadcasts')) {
    // 12.1 Audience Count
    if (cleanPath.endsWith('/audience-count') && m === 'POST') {
      const filters = (body as { targetFilters?: any })?.targetFilters || {};
      let filteredUsers = [...mockTelegramUsers];
      if (filters.targetType === 'filtered') {
        if (filters.universityId) {
          filteredUsers = filteredUsers.filter((u) => u.universityId === filters.universityId);
        }
        if (filters.campusId) {
          filteredUsers = filteredUsers.filter((u) => u.campusId === filters.campusId);
        }
        if (filters.majorId) {
          filteredUsers = filteredUsers.filter((u) => u.majorId === filters.majorId);
        }
        if (filters.joinedFrom) {
          filteredUsers = filteredUsers.filter((u) => u.createdAt >= filters.joinedFrom);
        }
        if (filters.joinedTo) {
          filteredUsers = filteredUsers.filter((u) => u.createdAt <= filters.joinedTo);
        }
      }
      return {
        success: true,
        data: {
          totalCount: filteredUsers.length,
          sampleUsers: filteredUsers.slice(0, 5).map((u) => ({
            id: u.id,
            firstName: u.firstName || u.displayName,
            lastName: u.lastName || null,
            username: u.username || null,
            universityName: u.universityName || null,
            campusName: u.campusName || null,
            majorName: u.majorName || null,
            createdAt: u.createdAt,
          })),
        },
      };
    }

    // 12.2 Retry Failed
    const matchRetry = cleanPath.match(/(?:admin\/)?broadcasts\/([^/]+)\/retry$/);
    if (matchRetry && m === 'POST') {
      const id = matchRetry[1];
      const camp = mockBroadcastCampaigns.find((c) => c.id === id);
      if (!camp) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'کمپین یافت نشد' } };
      }
      const failedRecipients = mockBroadcastRecipients.filter(
        (r) => (r as any).broadcastId === id || camp.failedCount > 0,
      );
      camp.status = 'completed';
      camp.successfulCount += camp.failedCount;
      camp.failedCount = 0;
      camp.completedAt = new Date().toISOString();
      camp.updatedAt = new Date().toISOString();
      return {
        success: true,
        data: {
          retryingCount: failedRecipients.length || 3,
          status: 'sending',
        },
      };
    }

    // 12.3 Detail & Delete
    const matchDetail = cleanPath.match(/(?:admin\/)?broadcasts\/([^/]+)$/);
    if (matchDetail) {
      const id = matchDetail[1];
      const camp = mockBroadcastCampaigns.find((c) => c.id === id);
      if (!camp) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'کمپین پیام همگانی یافت نشد' } };
      }
      if (m === 'DELETE') {
        mockBroadcastCampaigns = mockBroadcastCampaigns.filter((c) => c.id !== id);
        return { success: true, data: { id, deleted: true } };
      }
      if (m === 'GET') {
        const page = Number(params?.page) || 1;
        const pageSize = Number(params?.pageSize) || 20;
        let recipients = mockBroadcastRecipients;
        if (params?.status) {
          recipients = recipients.filter((r) => r.status === params.status);
        }
        const total = recipients.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        const start = (page - 1) * pageSize;
        return {
          success: true,
          data: {
            campaign: camp,
            recipients: {
              items: recipients.slice(start, start + pageSize),
              total,
              page,
              pageSize,
              totalPages,
            },
          },
        };
      }
    }

    // 12.4 List & Create
    if (m === 'POST') {
      const payload = body as any;
      const now = new Date().toISOString();
      const totalTargets = mockTelegramUsers.length;
      const newCampaign: IBroadcastCampaign = {
        id: `bc-${Date.now()}`,
        title: payload.title || 'پیام همگانی جدید',
        messageText: payload.messageText || '',
        parseMode: payload.parseMode || 'HTML',
        inlineButtons: payload.inlineButtons || [],
        targetFilters: payload.targetFilters || { targetType: 'all' },
        status: 'completed',
        totalTargets,
        successfulCount: totalTargets,
        failedCount: 0,
        createdByAdminId: 'admin-super',
        createdByAdminUsername: 'superadmin',
        startedAt: now,
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      mockBroadcastCampaigns = [newCampaign, ...mockBroadcastCampaigns];
      return { success: true, data: newCampaign };
    }

    if (m === 'GET') {
      let list = [...mockBroadcastCampaigns];
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter(
          (c) => c.title.toLowerCase().includes(q) || c.messageText.toLowerCase().includes(q),
        );
      }
      if (params?.status) {
        list = list.filter((c) => c.status === params.status);
      }
      const page = Number(params?.page) || 1;
      const perPage = Number(params?.pageSize || params?.perPage || params?.limit) || 20;
      const total = list.length;
      const totalPages = Math.ceil(total / perPage) || 1;
      const start = (page - 1) * perPage;
      return {
        success: true,
        data: list.slice(start, start + perPage),
        meta: { page, perPage, pageSize: perPage, limit: perPage, offset: start, total, totalPages },
      };
    }
  }

  // Legacy fallback
  return {
    success: false,
    error: {
      code: 'MOCK_NOT_FOUND',
      message: `مسیر ${cleanPath} در حالت شبیه‌ساز (Mock) یافت نشد.`,
    },
  };
}

// Fallback resolver for serverApiRequest when API_BASE_URL is not set
export async function getMockResponse<T>(
  method: string,
  url: string,
  params?: Record<string, unknown>,
  body?: unknown,
): Promise<T | null> {
  const res = await handleMockApi(method, url, params, body);
  if (res.success && res.data !== undefined) {
    if (res.meta) {
      return {
        items: res.data,
        meta: res.meta,
      } as unknown as T;
    }
    return res.data as unknown as T;
  }
  return null;
}
