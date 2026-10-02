'use client';

import { Button } from '@heroui/react';
import { Check, Edit, Eye, GitMerge, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';

export interface TableRowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onMerge?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
  mergeLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  approveLabel?: string;
  rejectLabel?: string;
  viewLabel?: string;
  className?: string;
}

interface ActionButtonProps {
  onPress: () => void;
  label: string;
  icon: LucideIcon;
  className?: string;
}

const ActionButton = ({ onPress, label, icon: Icon, className }: ActionButtonProps) => (
  <Button
    isIconOnly
    size="sm"
    variant="ghost"
    aria-label={label}
    onPress={onPress}
    className={cn('shrink-0', className)}
  >
    <Icon className={ICON_SIZE_CLASS.sm} />
  </Button>
);

/**
 * Standard table row action cluster (view / approve / reject / merge / edit / delete).
 *
 * Extracted from the `case 'actions'` branches that were copy-pasted into every
 * `*-table` module, which previously let labels and colours drift per entity.
 */
export const TableRowActions = ({
  onEdit,
  onDelete,
  onMerge,
  onApprove,
  onReject,
  onView,
  mergeLabel,
  editLabel,
  deleteLabel,
  approveLabel,
  rejectLabel,
  viewLabel,
  className,
}: TableRowActionsProps) => {
  const tCommon = useTranslations('common');

  const hasAnyAction = Boolean(
    onEdit || onDelete || onMerge || onApprove || onReject || onView,
  );

  if (!hasAnyAction) {
    return <span className="text-neutral-400 text-caption">-</span>;
  }

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {onView ? (
        <ActionButton
          onPress={onView}
          label={viewLabel ?? tCommon('actions.view')}
          icon={Eye}
          className="text-neutral-600 hover:bg-neutral-100"
        />
      ) : null}

      {onApprove ? (
        <ActionButton
          onPress={onApprove}
          label={approveLabel ?? tCommon('actions.confirm')}
          icon={Check}
          className="text-success-600 hover:bg-success-50"
        />
      ) : null}

      {onReject ? (
        <ActionButton
          onPress={onReject}
          label={rejectLabel ?? tCommon('actions.delete')}
          icon={X}
          className="text-warning-600 hover:bg-warning-50"
        />
      ) : null}

      {onMerge ? (
        <ActionButton
          onPress={onMerge}
          label={mergeLabel ?? tCommon('actions.merge')}
          icon={GitMerge}
          className="text-primary-600 hover:bg-primary-50"
        />
      ) : null}

      {onEdit ? (
        <ActionButton
          onPress={onEdit}
          label={editLabel ?? tCommon('actions.edit')}
          icon={Edit}
          className="text-neutral-600 hover:bg-primary-50"
        />
      ) : null}

      {onDelete ? (
        <ActionButton
          onPress={onDelete}
          label={deleteLabel ?? tCommon('actions.delete')}
          icon={Trash2}
          className="text-danger-600 hover:bg-danger-50"
        />
      ) : null}
    </div>
  );
};

export default TableRowActions;
