'use client';

import React, { useEffect } from 'react';
import {
  Tabs,
  Input,
  Spinner,
  Chip,
  Button,
} from '@heroui/react';
import {
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  SelectUniversity,
  SelectCampus,
  SelectMajor,
} from '@/components/shared';
import { clientBroadcastsServices } from '@/apis/services/broadcasts';
import type { BroadcastTargetFilters, IBroadcastAudienceCountResult } from '@/models';

interface AudienceFilterCardProps {
  filters: BroadcastTargetFilters;
  onChange: (filters: BroadcastTargetFilters) => void;
  onAudienceCountChange?: (count: number) => void;
}

export const AudienceFilterCard: React.FC<AudienceFilterCardProps> = ({
  filters,
  onChange,
  onAudienceCountChange,
}) => {
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');

  // Calculate live audience count
  const {
    data: audienceData,
    isLoading: isCalculating,
    refetch: refetchAudience,
  } = useQuery<IBroadcastAudienceCountResult>({
    queryKey: ['broadcasts', 'audience-count', filters],
    queryFn: () =>
      clientBroadcastsServices.calculateAudienceCount({
        targetFilters: filters,
      }),
    staleTime: 10_000,
  });

  useEffect(() => {
    if (audienceData && onAudienceCountChange) {
      onAudienceCountChange(audienceData.totalCount);
    }
  }, [audienceData, onAudienceCountChange]);

  const handleTargetTypeChange = (type: string) => {
    onChange({
      ...filters,
      targetType: type as 'all' | 'filtered',
    });
  };

  const handleFieldChange = (field: keyof BroadcastTargetFilters, value: string | null) => {
    const updated = {
      ...filters,
      [field]: value || null,
    };
    if (field === 'universityId') {
      updated.campusId = null;
    }
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-divider bg-content1 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t('audienceFilter.title')}
            </h3>
            <p className="text-xs text-default-500">
              {t('audienceFilter.description')}
            </p>
          </div>
        </div>

        {/* Live Audience Counter Badge */}
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/40 border border-primary-200/60 px-3 py-1.5 rounded-lg">
          {isCalculating ? (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Spinner size="sm" />
              <span>{t('audienceFilter.calculating')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-default-600">{t('audienceFilter.targetCount')}</span>
              <span className="text-sm font-bold text-primary">
                {t('audienceFilter.usersCount', { count: (audienceData?.totalCount ?? 0).toLocaleString('fa-IR') })}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 min-w-6 text-primary"
                onPress={() => refetchAudience()}
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Target Type Selector */}
      <Tabs
        selectedKey={filters.targetType}
        onSelectionChange={(k) => handleTargetTypeChange(k as string)}
        variant="secondary"
      >
        <Tabs.List className="border-b border-divider gap-2">
          <Tabs.Tab id="all">
            <span>{t('audienceFilter.allUsers')}</span>
          </Tabs.Tab>
          <Tabs.Tab id="filtered">
            <span>{t('audienceFilter.advancedFilter')}</span>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Filter Controls when targetType is filtered */}
      {filters.targetType === 'filtered' && (
        <div className="flex flex-col gap-4 p-3 rounded-lg border border-divider/60 bg-default-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* University Selection */}
            <SelectUniversity
              label={tCommon('academic.university')}
              placeholder={t('audienceFilter.universityPlaceholder')}
              value={filters.universityId}
              onChange={(id) => handleFieldChange('universityId', id || null)}
              onClear={() => handleFieldChange('universityId', null)}
              isClearable
              size="sm"
            />

            {/* Campus Selection */}
            <SelectCampus
              label={tCommon('academic.campus')}
              placeholder={t('audienceFilter.campusPlaceholder')}
              universityId={filters.universityId || undefined}
              value={filters.campusId}
              onChange={(id) => handleFieldChange('campusId', id || null)}
              onClear={() => handleFieldChange('campusId', null)}
              isClearable
              size="sm"
            />

            {/* Major Selection */}
            <SelectMajor
              label={tCommon('academic.major')}
              placeholder={t('audienceFilter.majorPlaceholder')}
              value={filters.majorId}
              onChange={(id) => handleFieldChange('majorId', id || null)}
              onClear={() => handleFieldChange('majorId', null)}
              isClearable
              size="sm"
            />
          </div>

          {/* Join Date Range Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-divider/50">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-default-500" />
                <span>{t('audienceFilter.joinedFrom')}</span>
              </label>
              <Input
                type="date"
                value={filters.joinedFrom ? filters.joinedFrom.split('T')[0] : ''}
                onChange={(e) =>
                  handleFieldChange(
                    'joinedFrom',
                    e.target.value ? new Date(e.target.value).toISOString() : null,
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-default-500" />
                <span>{t('audienceFilter.joinedTo')}</span>
              </label>
              <Input
                type="date"
                value={filters.joinedTo ? filters.joinedTo.split('T')[0] : ''}
                onChange={(e) =>
                  handleFieldChange(
                    'joinedTo',
                    e.target.value ? new Date(e.target.value).toISOString() : null,
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Sample Recipients Preview */}
      {audienceData?.sampleUsers && audienceData.sampleUsers.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-default-500 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t('audienceFilter.sampleRecipients')}</span>
          {audienceData.sampleUsers.map((u) => (
            <Chip key={u.id} size="sm" variant="secondary" className="text-xs">
              {u.firstName} {u.lastName || ''} {u.universityName ? `(${u.universityName})` : ''}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};
