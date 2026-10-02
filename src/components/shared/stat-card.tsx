'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export type StatCardVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: StatCardVariant;
  description?: string;
  className?: string;
  formatNumber?: boolean;
}

const VARIANT_STYLES: Record<
  StatCardVariant,
  {
    iconBg: string;
    iconColor: string;
    valueColor: string;
    badgeBg?: string;
  }
> = {
  primary: {
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
    valueColor: 'text-primary-700',
  },
  success: {
    iconBg: 'bg-success-50',
    iconColor: 'text-success-600',
    valueColor: 'text-success-700',
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    valueColor: 'text-amber-700',
  },
  danger: {
    iconBg: 'bg-danger-50',
    iconColor: 'text-danger-600',
    valueColor: 'text-danger-700',
  },
  neutral: {
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-600',
    valueColor: 'text-neutral-900',
  },
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = 'neutral',
  description,
  className,
  formatNumber = true,
}: StatCardProps) => {
  const styles = VARIANT_STYLES[variant];

  const formattedValue =
    typeof value === 'number' && formatNumber
      ? value.toLocaleString('fa-IR')
      : value;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:shadow-sm transition-shadow flex items-center gap-3.5',
        className,
      )}
    >
      <div className={cn('p-3 rounded-xl shrink-0', styles.iconBg, styles.iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-caption text-neutral-500 font-medium truncate">
          {title}
        </span>
        <p className={cn('text-title-lg font-bold font-mono mt-0.5 truncate', styles.valueColor)}>
          {formattedValue}
        </p>
        {description && (
          <span className="text-[11px] text-neutral-400 mt-0.5 truncate">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
