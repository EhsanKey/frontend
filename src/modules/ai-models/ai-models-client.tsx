'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Chip,
  ListBox,
  Select,
  Switch,
} from '@heroui/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { clientAiModelServices } from '@/apis/services/ai-models';
import TableContainer, { type TableHeaderOptions } from '@/containers/table-container';
import { useGetRequest } from '@/hooks';
import { formatPersianDate } from '@/utils';
import { AiModelModal } from './ai-model-modal';
import type { CreateAiModelDto, UpdateAiModelDto } from '@/apis/services/ai-models/_dto';
import type { AiModelScope, IAiModelConfig } from '@/models';

interface AiModelsClientProps {
  initialData?: IAiModelConfig[];
}

type AiModelColumnKey =
  | 'name'
  | 'scope'
  | 'provider'
  | 'model'
  | 'apiKey'
  | 'status'
  | 'limits'
  | 'metrics'
  | 'toggle'
  | 'actions';

export const AiModelsClient = ({ initialData }: AiModelsClientProps) => {
  const t = useTranslations('aiModels');

  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<IAiModelConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: models,
    isLoading,
    refetch,
  } = useGetRequest<IAiModelConfig[]>({
    queryKey: ['ai-models', selectedScope],
    requestFn: (signal) =>
      clientAiModelServices.getAiModels(
        {
          scope:
            selectedScope !== 'all' ? (selectedScope as AiModelScope) : undefined,
        },
        signal,
      ),
    initialData,
  });

  const modelList = useMemo(() => models ?? [], [models]);

  const handleOpenCreate = () => {
    setModelToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (model: IAiModelConfig) => {
    setModelToEdit(model);
    setModalOpen(true);
  };

  const handleToggleStatus = async (model: IAiModelConfig) => {
    try {
      await clientAiModelServices.updateAiModel(model.id, {
        isEnabled: !model.isEnabled,
      });
      await refetch();
    } catch {
      // Handled by toast
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('messages.deleteConfirm'))) return;
    try {
      await clientAiModelServices.deleteAiModel(id);
      await refetch();
    } catch {
      // Handled by toast
    }
  };

  const handleSubmit = async (data: CreateAiModelDto | UpdateAiModelDto) => {
    setIsSubmitting(true);
    try {
      if (modelToEdit) {
        await clientAiModelServices.updateAiModel(modelToEdit.id, data);
      } else {
        await clientAiModelServices.createAiModel(data as CreateAiModelDto);
      }
      setModalOpen(false);
      await refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerCells: TableHeaderOptions<AiModelColumnKey>[] = [
    { id: 'name', label: t('table.name'), isRowHeader: true },
    { id: 'scope', label: t('table.scope') },
    { id: 'provider', label: t('table.provider') },
    { id: 'model', label: t('table.model') },
    { id: 'apiKey', label: t('table.apiKey') },
    { id: 'status', label: t('table.status'), className: 'w-28 text-center' },
    { id: 'limits', label: t('table.limits'), className: 'min-w-[150px]' },
    { id: 'metrics', label: t('table.metrics'), className: 'min-w-[150px]' },
    { id: 'toggle', label: t('table.toggle'), className: 'w-20 text-center' },
    { id: 'actions', label: t('table.actions'), className: 'w-24 text-center' },
  ];

  const renderCell = (item: IAiModelConfig, columnKey: AiModelColumnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <span className="font-semibold text-foreground block">
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground dir-ltr inline-block">
              {item.baseUrl}
            </span>
          </div>
        );
      case 'scope': {
        const isPlan = item.scope === 'plan';
        const isAnswer = item.scope === 'answer';
        return (
          <Chip
            size="sm"
            variant="secondary"
            className={
              isPlan
                ? 'bg-secondary-50 text-secondary-700 font-medium'
                : isAnswer
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'bg-neutral-100 text-neutral-700 font-medium'
            }
          >
            {isPlan ? t('scopes.plan') : isAnswer ? t('scopes.answer') : t('scopes.shared')}
          </Chip>
        );
      }
      case 'provider':
        return (
          <span className="font-medium text-xs uppercase bg-content2 px-2 py-0.5 rounded">
            {item.providerName}
          </span>
        );
      case 'model':
        return (
          <code className="text-xs text-foreground dir-ltr font-mono">
            {item.model}
          </code>
        );
      case 'apiKey':
        return (
          <code className="text-xs bg-content2 text-muted-foreground px-2 py-0.5 rounded dir-ltr inline-block">
            {item.apiKeyMasked}
          </code>
        );
      case 'status': {
        const isLimited = item.status === 'limited' || Boolean(item.limitedUntil);
        const isActive = (item.status === 'active' || item.isEnabled) && !isLimited;
        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold ${
                isActive
                  ? 'bg-success-50 text-success-700'
                  : isLimited
                    ? 'bg-warning-50 text-warning-800'
                    : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {isActive ? t('statuses.active') : isLimited ? t('statuses.limited') : t('statuses.disabled')}
            </span>
          </div>
        );
      }
      case 'limits':
        return (
          <div className="text-caption">
            {item.limitedUntil ? (
              <p className="text-warning-800 font-medium dir-ltr">
                {formatPersianDate(item.limitedUntil)}
              </p>
            ) : item.lastError ? (
              <p className="text-danger-600 truncate max-w-[180px]" title={item.lastError}>
                {item.lastError}
              </p>
            ) : (
              <span className="text-neutral-400">{t('statuses.noLimit')}</span>
            )}
          </div>
        );
      case 'metrics':
        return (
          <div className="text-caption space-y-0.5">
            <div className="font-medium text-neutral-700">
              {t('table.requestsCount', { count: item.requestCount ?? 0 })} | {t('table.errorsCount', { count: item.errorCount ?? 0 })}
            </div>
            {item.lastUsedAt ? (
              <div className="text-[11px] text-neutral-400 dir-ltr">
                {formatPersianDate(item.lastUsedAt)}
              </div>
            ) : null}
          </div>
        );
      case 'toggle':
        return (
          <div className="flex justify-center">
            <Switch
              size="sm"
              isSelected={item.isEnabled}
              onChange={() => handleToggleStatus(item)}
            />
          </div>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="sm"
              isIconOnly
              variant="ghost"
              aria-label={t('table.edit')}
              onPress={() => handleOpenEdit(item)}
            >
              <Edit size={16} />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="danger-soft"
              aria-label={t('table.delete')}
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="sr-only">{t('title')}</h1>

      {/* Controls */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              aria-label={t('filterScope')}
              selectedKey={selectedScope}
              onSelectionChange={(key) => setSelectedScope(key as string)}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all" textValue={t('filterAll')}>
                    {t('filterAll')}
                  </ListBox.Item>
                  <ListBox.Item id="plan" textValue={t('filterPlan')}>
                    {t('filterPlan')}
                  </ListBox.Item>
                  <ListBox.Item id="answer" textValue={t('filterAnswer')}>
                    {t('filterAnswer')}
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          <Button
            variant="primary"
            className="gap-2"
            onPress={handleOpenCreate}
          >
            <Plus size={18} />
            {t('createButton')}
          </Button>
        </div>
      </div>

      {/* Models Table */}
      <TableContainer
        ariaLabel={t('title')}
        headerCells={headerCells}
        items={modelList}
        isLoading={isLoading}
        renderCell={renderCell}
      />

      {/* Modal */}
      <AiModelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        modelToEdit={modelToEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
