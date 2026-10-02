import {
  AlertTriangle,
  BellRing,
  BookOpen,
  Bot,
  Building,
  Compass,
  Database,
  FileText,
  GraduationCap,
  History,
  Landmark,
  LayoutDashboard,
  Megaphone,
  MessageSquareQuote,
  MessageSquareText,
  Presentation,
  Send,
  ShieldCheck,
  User,
  Workflow,
} from 'lucide-react';
import { canAccessRoute } from '@/utils';
import type { IUser, UserRole } from '@/models';
import type { LucideIcon } from 'lucide-react';

export type NavigationSectionKey = 'main' | 'moderation' | 'academic' | 'ai' | 'system';

export type DashboardNavigationItem = {
  id: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
  section: NavigationSectionKey;
  badge?: string;
  allowedRoles?: UserRole[];
  adminOnly?: boolean;
  permission?: string;
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  // 1. General
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    section: 'main',
  },

  // 2. Moderation
  {
    id: 'reviews',
    labelKey: 'nav.reviews',
    href: '/dashboard/reviews',
    icon: MessageSquareText,
    permission: 'reviews:read',
    section: 'moderation',
  },
  {
    id: 'resources',
    labelKey: 'nav.resources',
    href: '/dashboard/resources',
    icon: FileText,
    permission: 'resources:read',
    section: 'moderation',
  },
  {
    id: 'crawler-channels',
    labelKey: 'nav.crawlerChannels',
    href: '/dashboard/crawler/channels',
    icon: Send,
    permission: 'crawler:read',
    section: 'moderation',
  },
  {
    id: 'crawler-reviews',
    labelKey: 'nav.crawlerReviews',
    href: '/dashboard/crawler/reviews',
    icon: MessageSquareQuote,
    permission: 'crawler:read',
    section: 'moderation',
  },

  // 3. Academic
  {
    id: 'universities',
    labelKey: 'nav.universities',
    href: '/dashboard/universities',
    icon: Landmark,
    permission: 'universities:read',
    section: 'academic',
  },
  {
    id: 'campuses',
    labelKey: 'nav.campuses',
    href: '/dashboard/campuses',
    icon: Building,
    permission: 'campuses:read',
    section: 'academic',
  },
  {
    id: 'majors',
    labelKey: 'nav.majors',
    href: '/dashboard/majors',
    icon: Compass,
    permission: 'majors:read',
    section: 'academic',
  },
  {
    id: 'professors',
    labelKey: 'nav.professors',
    href: '/dashboard/professors',
    icon: GraduationCap,
    permission: 'professors:read',
    section: 'academic',
  },
  {
    id: 'courses',
    labelKey: 'nav.courses',
    href: '/dashboard/courses',
    icon: BookOpen,
    permission: 'courses:read',
    section: 'academic',
  },
  {
    id: 'teachings',
    labelKey: 'nav.teachings',
    href: '/dashboard/teachings',
    icon: Presentation,
    permission: 'teachings:read',
    section: 'academic',
  },
  {
    id: 'registered-reviews',
    labelKey: 'nav.registeredReviews',
    href: '/dashboard/registered-reviews',
    icon: MessageSquareQuote,
    permission: 'reviews:read',
    section: 'academic',
  },

  // 4. Bot & AI
  {
    id: 'ai-models',
    labelKey: 'nav.aiModels',
    href: '/dashboard/ai-models',
    icon: Bot,
    permission: 'ai_models:read',
    section: 'ai',
  },
  {
    id: 'telegram',
    labelKey: 'nav.telegram',
    href: '/dashboard/telegram',
    icon: Send,
    permission: 'groups:read',
    section: 'ai',
  },
  {
    id: 'broadcasts',
    labelKey: 'nav.broadcasts',
    href: '/dashboard/broadcasts',
    icon: Megaphone,
    permission: 'broadcasts:read',
    section: 'ai',
  },
  {
    id: 'cache',
    labelKey: 'nav.cache',
    href: '/dashboard/cache',
    icon: Database,
    permission: 'cache:read',
    section: 'ai',
  },
  {
    id: 'bot-flow',
    labelKey: 'nav.botFlow',
    href: '/dashboard/bot-flow',
    icon: Workflow,
    permission: 'system_pipeline:read',
    section: 'ai',
  },
  {
    id: 'errors',
    labelKey: 'nav.errors',
    href: '/dashboard/errors',
    icon: AlertTriangle,
    permission: 'errors:read',
    section: 'ai',
  },
  {
    id: 'inquiries',
    labelKey: 'nav.inquiries',
    href: '/dashboard/inquiries',
    icon: BellRing,
    permission: 'inquiries:read',
    section: 'ai',
  },

  // 5. System
  {
    id: 'users',
    labelKey: 'nav.users',
    href: '/dashboard/users',
    icon: ShieldCheck,
    permission: 'admins:manage',
    section: 'system',
  },
  {
    id: 'audit-logs',
    labelKey: 'nav.auditLogs',
    href: '/dashboard/audit-logs',
    icon: History,
    permission: 'audit_logs:read',
    section: 'system',
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    href: '/dashboard/profile',
    icon: User,
    section: 'system',
  },
];

export const isNavigationItemActive = (
  item: DashboardNavigationItem,
  pathname: string,
): boolean => {
  if (item.href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

export const getFilteredNavigation = (
  items: DashboardNavigationItem[],
  user: IUser | null,
): DashboardNavigationItem[] => {
  return items.filter((item) =>
    canAccessRoute(user, {
      allowedRoles: item.allowedRoles,
      adminOnly: item.adminOnly,
      permission: item.permission,
    }),
  );
};

export const getMatchedNavigationItem = (
  pathname: string,
  user: IUser | null,
): DashboardNavigationItem | undefined => {
  const accessibleItems = getFilteredNavigation(dashboardNavigation, user);

  return accessibleItems
    .filter((item) => isNavigationItemActive(item, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0];
};
