'use client';

import { Button } from '@heroui/react';
import { Menu, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { useAuth } from '@/hooks';
import { ThemeToggle } from '@/components/shared';
import { getMatchedNavigationItem } from '../navigation/dashboard-navigation';
import UserMenu from './user-menu';

export type DashboardHeaderProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleMobileSidebar: () => void;
};

export const DashboardHeader = ({
  collapsed = false,
  onToggleCollapse,
  onToggleMobileSidebar,
}: DashboardHeaderProps) => {
  const pathname = usePathname();
  const tHeader = useTranslations('mainLayout.header');
  const tNav = useTranslations('mainLayout.nav');
  const { user } = useAuth();

  const matchedItem = getMatchedNavigationItem(pathname, user);

  const getPageTitle = (): string => {
    if (!matchedItem) {
      return '-';
    }
    switch (matchedItem.id) {
      case 'dashboard':
        return tNav('dashboard');
      case 'items':
        return tNav('items');
      case 'users':
        return tNav('users');
      case 'profile':
        return tNav('profile');
      default:
        return tNav('dashboard');
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-surface sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 px-4 lg:px-6 transition-colors">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          onPress={onToggleMobileSidebar}
          aria-label={tHeader('toggleSidebar')}
          className="lg:hidden text-neutral-600 dark:text-neutral-300"
        >
          <Menu className={ICON_SIZE_CLASS.md} />
        </Button>

        {onToggleCollapse ? (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={onToggleCollapse}
            aria-label={tHeader('toggleSidebar')}
            className="hidden text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white lg:flex"
          >
            {collapsed ? (
              <PanelRightOpen className={ICON_SIZE_CLASS.md} />
            ) : (
              <PanelRightClose className={ICON_SIZE_CLASS.md} />
            )}
          </Button>
        ) : null}

        <h1 className="text-h3 font-bold text-neutral-900 dark:text-neutral-100">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default DashboardHeader;
