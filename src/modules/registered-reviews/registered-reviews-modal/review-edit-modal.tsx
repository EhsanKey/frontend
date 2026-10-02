'use client';

import { Button, Chip, ListBox, Modal, Select } from '@heroui/react';
import { Bot, GraduationCap, MessageSquareQuote, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SelectTeaching } from '@/components/shared';
import type { IRegisteredReview, ITeachingLookupItem } from '@/models';
import { formatSemesterCode, getRecentAcademicSemesters } from '@/utils';

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: IRegisteredReview | null;
  onSubmit: (values: { content: string; teachingId?: string; semester?: string | null }) => Promise<void>;
  isPending?: boolean;
}

interface FormValues {
  content: string;
  teachingId: string;
  semester: string;
}

export const ReviewEditModal = ({
  isOpen,
  onClose,
  review,
  onSubmit,
  isPending = false,
}: ReviewEditModalProps) => {
  const t = useTranslations('registeredReviews');
  const tEdit = useTranslations('registeredReviews.editModal');
  const tCommon = useTranslations('common');

  const [selectedTeachingLabel, setSelectedTeachingLabel] = useState<string>('');

  const recentSemesters = useMemo(() => {
    const list = getRecentAcademicSemesters(8);
    if (review?.semester && !list.some((s) => s.code === review.semester)) {
      list.unshift({
        code: review.semester,
        term: ((parseInt(review.semester, 10) % 10) || 1) as 1 | 2 | 3,
        academicYear: Math.floor(parseInt(review.semester, 10) / 10),
        label: formatSemesterCode(review.semester),
      });
    }
    return list;
  }, [review?.semester]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      content: '',
      teachingId: '',
      semester: '',
    },
  });

  const watchedTeachingId = watch('teachingId');

  useEffect(() => {
    if (review) {
      reset({
        content: review.content || '',
        teachingId: review.teachingId || review.teaching?.id || '',
        semester: review.semester || '',
      });
      if (review.teaching) {
        setSelectedTeachingLabel(
          `${review.teaching.course?.name || ''} - ${review.teaching.professor?.name || ''} (${review.teaching.campus?.name || ''})`,
        );
      }
    } else {
      reset({
        content: '',
        teachingId: '',
        semester: '',
      });
      setSelectedTeachingLabel('');
    }
  }, [review, reset, isOpen]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit({
      content: data.content.trim(),
      teachingId: data.teachingId !== review?.teachingId ? data.teachingId : undefined,
      semester: data.semester || null,
    });
    onClose();
  };

  if (!review) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="flex items-center gap-2 text-neutral-800">
                <MessageSquareQuote className="w-5 h-5 text-primary-600" />
                {tEdit('title')}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="space-y-4">
              {/* Channel / Source Origin Banner */}
              <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-medium text-neutral-700">
                    {tEdit('sourceInfo')}:
                  </span>
                  {review.source === 'student' ? (
                    <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
                      <User className="w-3 h-3 inline me-1" />
                      {t('table.sourceBadgeStudent')}
                    </Chip>
                  ) : review.source === 'admin' ? (
                    <Chip size="sm" variant="secondary" className="bg-amber-50 text-amber-700 font-medium">
                      {t('table.sourceBadgeAdmin')}
                    </Chip>
                  ) : (
                    <Chip size="sm" variant="secondary" className="bg-neutral-200 text-neutral-700 font-medium">
                      <Bot className="w-3 h-3 inline me-1" />
                      {t('table.sourceBadgeSystem')}
                    </Chip>
                  )}
                </div>

                {review.student && (
                  <span className="text-caption text-neutral-500">
                    {review.student.firstName
                      ? `${review.student.firstName} ${review.student.lastName || ''}`
                      : review.student.username
                        ? `@${review.student.username}`
                        : ''}
                  </span>
                )}
              </div>

              {/* Current Teaching Overview */}
              {review.teaching && (
                <div className="rounded-lg bg-primary-50/50 p-3.5 border border-primary-100 flex flex-col gap-1.5">
                  <span className="text-caption font-semibold text-primary-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-primary-600" />
                    {tEdit('currentTeaching')}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-body-sm text-neutral-800">
                    <span className="font-bold">{review.teaching.professor?.name}</span>
                    <span>•</span>
                    <span className="font-medium text-primary-700">{review.teaching.course?.name}</span>
                    <span>•</span>
                    <span className="text-neutral-500">
                      {review.teaching.campus?.name} ({review.teaching.campus?.university?.name})
                    </span>
                    {review.teaching.major?.name && (
                      <>
                        <span>•</span>
                        <span className="text-neutral-500">{review.teaching.major.name}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Teaching Autocomplete Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-neutral-700">
                  {tEdit('changeTeaching')}
                </label>
                <SelectTeaching
                  value={watchedTeachingId}
                  initialLabel={selectedTeachingLabel}
                  onChange={(val: string, item?: ITeachingLookupItem) => {
                    setValue('teachingId', val, { shouldDirty: true });
                    if (item) {
                      setSelectedTeachingLabel(item.title);
                    }
                  }}
                  searchPlaceholder={tEdit('searchTeachingPlaceholder')}
                  size="md"
                />
              </div>

              {/* Academic Semester Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-neutral-700">
                  {tEdit('semesterLabel')}
                </label>
                <Controller
                  name="semester"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value || undefined}
                      onSelectionChange={(key) => field.onChange(String(key))}
                      variant="secondary"
                      className="w-full"
                      placeholder={tEdit('selectSemesterPlaceholder')}
                      isDisabled={isPending}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox aria-label={tEdit('semesterLabel')}>
                          {recentSemesters.map((s) => (
                            <ListBox.Item key={s.code} id={s.code} textValue={s.label}>
                              {s.label}
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                />
              </div>

              {/* Review Content Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-neutral-700">
                  {tEdit('contentLabel')}
                </label>
                <textarea
                  {...register('content', {
                    required: tEdit('contentRequired'),
                    minLength: 2,
                  })}
                  rows={4}
                  placeholder={tEdit('contentPlaceholder')}
                  className="w-full rounded-xl border border-neutral-300 p-3 text-body-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 leading-relaxed transition-all"
                  dir="auto"
                />
                {errors.content && (
                  <span className="text-caption text-danger-600">
                    {errors.content.message}
                  </span>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                {tCommon('actions.cancel')}
              </Button>
              <Button
                variant="primary"
                isPending={isPending}
                onPress={() => handleSubmit(handleFormSubmit)()}
                className="font-medium shadow-2xs"
              >
                {tEdit('save')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
