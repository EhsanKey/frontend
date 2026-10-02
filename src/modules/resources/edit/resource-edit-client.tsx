'use client';

import {
  Button,
  Chip,
  Label,
  ListBox,
  Modal,
  Select,
  toast,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Download,
  FileText,
  GraduationCap,
  School,
  Send,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { clientResourceServices } from '@/apis/services/resources/client';
import type { UpdateResourceDto } from '@/apis/services/resources/_dto';
import {
  InputField,
  SelectCampus,
  SelectCourse,
  SelectMajor,
  SelectProfessor,
  SelectUniversity,
} from '@/components/shared';
import { QUERY_KEYS } from '@/constants';
import { useAuth, usePostRequest } from '@/hooks';
import type { IResourceSubmission, ResourceKind, ResourceStatus } from '@/models';
import { formatPersianDate, hasPermission } from '@/utils';
import {
  createResourceEditSchema,
  type ResourceEditFormValues,
} from './resource-edit.schema';

interface ResourceEditClientProps {
  resource: IResourceSubmission;
}

export const ResourceEditClient = ({ resource }: ResourceEditClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('resources');
  const tCommon = useTranslations('common');
  const { user } = useAuth();

  const [selectedUniversityName, setSelectedUniversityName] = useState(resource.universityName || '');
  const [selectedCampusName, setSelectedCampusName] = useState(resource.campusName || '');
  const [selectedMajorName, setSelectedMajorName] = useState(resource.majorName || '');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const canEditResource =
    hasPermission(user, 'resources:update') ||
    hasPermission(user, 'resources:manage') ||
    hasPermission(user, '*');

  const canApproveResource =
    hasPermission(user, 'resources:status') ||
    hasPermission(user, 'resources:approve') ||
    hasPermission(user, 'resources:manage') ||
    hasPermission(user, '*');

  const canEditProfessors =
    hasPermission(user, 'professors:update') ||
    hasPermission(user, 'professors:create') ||
    hasPermission(user, 'professors:manage') ||
    canEditResource;

  const canEditCourses =
    hasPermission(user, 'courses:update') ||
    hasPermission(user, 'courses:create') ||
    hasPermission(user, 'courses:manage') ||
    canEditResource;

  const canEditAcademic =
    hasPermission(user, 'universities:update') ||
    hasPermission(user, 'campuses:update') ||
    hasPermission(user, 'majors:update') ||
    canEditResource;

  const initialDegree =
    (resource.degreeLevel as 'bachelor' | 'master' | 'phd') || 'bachelor';

  const wasProfessorInitiallyNew = Boolean(resource.professorIsNew);
  const wasCourseInitiallyNew = Boolean(resource.courseIsNew);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResourceEditFormValues>({
    resolver: zodResolver(
      createResourceEditSchema({
        titleRequired: t('edit.validation.titleRequired'),
        newProfessorRequired: t('edit.validation.newProfessorRequired'),
        newCourseRequired: t('edit.validation.newCourseRequired'),
      }),
    ),
    defaultValues: {
      title: resource.title || '',
      resourceKind: resource.resourceKind || 'lecture_note',
      universityId: resource.universityId || '',
      campusId: resource.campusId || '',
      majorId: resource.majorId || '',
      courseCategory: resource.courseCategory || 'specialized',
      degreeLevel: initialDegree,
      professorId: wasProfessorInitiallyNew ? '' : (resource.professorId || ''),
      professorName: resource.professorName || '',
      professorIsNew: wasProfessorInitiallyNew,
      courseId: wasCourseInitiallyNew ? '' : (resource.courseId || ''),
      courseName: resource.courseName || '',
      courseIsNew: wasCourseInitiallyNew,
    },
  });

  const selectedUniversityId = watch('universityId');
  const selectedProfessorId = watch('professorId');
  const selectedCourseId = watch('courseId');

  const invalidateResourceQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources.lists });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.lists });
  };

  // Update mutation
  const { mutateAsync: updateMutate, isPending: isUpdating } = usePostRequest({
    requestFn: (payload: UpdateResourceDto) =>
      clientResourceServices.updateResource(resource.id, payload),
    onSuccess: () => {
      toast.success(t('toast.updated'));
      invalidateResourceQueries();
      router.push('/dashboard/resources');
    },
  });

  // Approve mutation
  const { mutateAsync: approveMutate, isPending: isApproving } = usePostRequest({
    requestFn: () => clientResourceServices.approveResource(resource.id),
    onSuccess: () => {
      toast.success(t('toast.approved'));
      invalidateResourceQueries();
      router.push('/dashboard/resources');
    },
  });

  // Reject mutation
  const { mutateAsync: rejectMutate, isPending: isRejecting } = usePostRequest({
    requestFn: (payload: { reason: string }) =>
      clientResourceServices.rejectResource(resource.id, payload),
    onSuccess: () => {
      toast.success(t('toast.rejected'));
      invalidateResourceQueries();
      setIsRejectModalOpen(false);
      router.push('/dashboard/resources');
    },
  });

  const isPending = isUpdating || isApproving || isRejecting;

  const handleFormSubmit = async (data: ResourceEditFormValues) => {
    const isProfNew = wasProfessorInitiallyNew ? !Boolean(data.professorId) : false;
    const isCrsNew = wasCourseInitiallyNew ? !Boolean(data.courseId) : false;

    const payload: UpdateResourceDto = {
      title: data.title,
      resourceKind: data.resourceKind,
      universityId: data.universityId || undefined,
      campusId: data.campusId || undefined,
      majorId: data.majorId ? data.majorId : null,
      courseCategory: data.courseCategory,
      degreeLevel: data.degreeLevel,
      professorIsNew: isProfNew,
      courseIsNew: isCrsNew,
    };

    if (isProfNew) {
      payload.professorName = data.professorName;
      payload.professorId = null;
    } else {
      payload.professorId = data.professorId || null;
      payload.professorName = data.professorName;
    }

    if (isCrsNew) {
      payload.courseName = data.courseName;
      payload.courseId = null;
    } else {
      payload.courseId = data.courseId || null;
      payload.courseName = data.courseName;
    }

    await updateMutate(payload);
  };

  const renderStatusChip = (status: ResourceStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 font-medium">
            {t('filters.approved')}
          </Chip>
        );
      case 'rejected':
        return (
          <Chip size="sm" variant="secondary" className="bg-danger-50 text-danger-700 font-medium">
            {t('filters.rejected')}
          </Chip>
        );
      case 'pending':
      default:
        return (
          <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 font-medium">
            {t('filters.pending')}
          </Chip>
        );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-2xs">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t('edit.title')}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t('edit.resourceId', { id: resource.id })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onPress={() => router.push('/dashboard/resources')}
            isDisabled={isPending}
          >
            <ArrowRight className="h-4 w-4" />
            <span>{tCommon('actions.back')}</span>
          </Button>

          {resource.status === 'pending' && canApproveResource && (
            <>
              <Button
                variant="outline"
                className="gap-1.5 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/30"
                onPress={() => setIsRejectModalOpen(true)}
                isDisabled={isPending}
              >
                <X className="h-4 w-4" />
                <span>{t('actions.reject')}</span>
              </Button>

              <Button
                variant="primary"
                className="gap-1.5 bg-success-600 hover:bg-success-700 text-white"
                onPress={() => approveMutate()}
                isPending={isApproving}
                isDisabled={isPending}
              >
                <Check className="h-4 w-4" />
                <span>{t('actions.approve')}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Submission Metadata Information Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <User className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.studentSender')}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {resource.studentName || t('edit.studentFallback')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.submissionDate')}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatPersianDate(resource.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.currentStatus')}</span>
              <div>{renderStatusChip(resource.status)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <School className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.initialUniversity')}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate block max-w-[150px]">
                {resource.universityName || t('edit.unknownUniversity')}
              </span>
            </div>
          </div>
        </div>

        {/* Attached Files List */}
        {resource.files && resource.files.length > 0 && (
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-caption text-neutral-500 block mb-2 font-medium">
              {t('edit.attachedFiles')} ({resource.files.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {resource.files.map((file, idx) => (
                <div
                  key={file.fileId || idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-body-sm text-neutral-800 dark:text-neutral-200"
                >
                  <FileText className="h-4 w-4 text-primary-500" />
                  <span className="font-medium">{file.fileName}</span>
                  <span className="text-caption text-neutral-400">
                    ({formatFileSize(file.fileSize)})
                  </span>
                  {file.fileUrl && (
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 p-0.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {resource.rejectionReason && (
          <div className="p-3 rounded-xl bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-900 text-body-sm text-danger-800 dark:text-danger-300 flex items-center gap-2">
            <span className="font-bold">{t('edit.previousRejectionReason')}</span>
            <span>{resource.rejectionReason}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        {/* Section 1: Title, Resource Kind & Degree Level */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <FileText className="h-5 w-5 text-primary-600" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              مشخصات عنوان و نوع منبع
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField
                label={t('edit.resourceTitle')}
                registration={register('title')}
                error={errors.title?.message}
                placeholder={t('edit.resourceTitlePlaceholder')}
                isDisabled={isPending || !canEditResource}
                required
              />
            </div>

            <Controller
              name="resourceKind"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('edit.kind')}
                  </Label>
                  <Select
                    selectedKey={field.value}
                    onSelectionChange={(key) => field.onChange(String(key) as ResourceKind)}
                    variant="secondary"
                    className="w-full"
                    isDisabled={isPending || !canEditResource}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={t('edit.kind')}>
                        <ListBox.Item id="lecture_note" textValue={t('edit.lectureNote')}>
                          {t('edit.lectureNote')}
                        </ListBox.Item>
                        <ListBox.Item id="exam_sample" textValue={t('edit.examSample')}>
                          {t('edit.examSample')}
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="degreeLevel"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {tCommon('academic.degree')}
                  </Label>
                  <Select
                    selectedKey={field.value}
                    onSelectionChange={(key) => field.onChange(String(key))}
                    variant="secondary"
                    className="w-full"
                    isDisabled={isPending || !canEditResource}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={tCommon('academic.degree')}>
                        <ListBox.Item id="bachelor" textValue={tCommon('academic.bachelor')}>
                          {tCommon('academic.bachelor')}
                        </ListBox.Item>
                        <ListBox.Item id="master" textValue={tCommon('academic.master')}>
                          {tCommon('academic.master')}
                        </ListBox.Item>
                        <ListBox.Item id="phd" textValue={tCommon('academic.phd')}>
                          {tCommon('academic.phd')}
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        {/* Section 2: Academic Hierarchy */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <School className="h-5 w-5 text-primary-600" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {t('edit.academicSection')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectUniversity
              label={tCommon('academic.university')}
              value={watch('universityId')}
              initialLabel={selectedUniversityName || undefined}
              isDisabled={isPending || !canEditAcademic}
              onChange={(uId: string, item) => {
                setValue('universityId', uId || '');
                setSelectedUniversityName(item?.name || '');
                setValue('campusId', '');
                setSelectedCampusName('');
              }}
            />

            <SelectCampus
              label={tCommon('academic.campus')}
              universityId={selectedUniversityId || undefined}
              value={watch('campusId')}
              initialLabel={selectedCampusName || undefined}
              isDisabled={isPending || !canEditAcademic}
              onChange={(cId: string, item) => {
                setValue('campusId', cId || '');
                setSelectedCampusName(item?.name || '');
              }}
            />

            <div className="md:col-span-2">
              <SelectMajor
                label={tCommon('academic.major')}
                value={watch('majorId')}
                initialLabel={selectedMajorName || undefined}
                isDisabled={isPending || !canEditAcademic}
                onChange={(mId: string, item) => {
                  setValue('majorId', mId || '');
                  setSelectedMajorName(item?.name || '');
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Course Category */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              نوع درس
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="courseCategory"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {tCommon('academic.category')}
                  </Label>
                  <Select
                    selectedKey={field.value}
                    onSelectionChange={(key) => field.onChange(String(key))}
                    variant="secondary"
                    className="w-full"
                    isDisabled={isPending || !canEditResource}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={tCommon('academic.category')}>
                        <ListBox.Item id="specialized" textValue={tCommon('academic.specialized')}>
                          {tCommon('academic.specialized')}
                        </ListBox.Item>
                        <ListBox.Item id="general" textValue={tCommon('academic.general')}>
                          {tCommon('academic.general')}
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        {/* Section 4: Professor & Course Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professor Section */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('edit.professorSectionTitle')}
                </h2>
              </div>
              <Chip
                size="sm"
                variant="secondary"
                className={
                  wasProfessorInitiallyNew
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 text-xs'
                    : 'bg-neutral-100 text-neutral-700 text-xs'
                }
              >
                {wasProfessorInitiallyNew ? 'استاد جدید پیشنهادی' : 'استاد موجود در سامانه'}
              </Chip>
            </div>

            {!wasProfessorInitiallyNew ? (
              /* Case 1: User chose an existing professor -> ONLY render SelectProfessor */
              <SelectProfessor
                label={t('edit.existingProfessor')}
                value={selectedProfessorId}
                initialLabel={resource.professorName || undefined}
                isDisabled={isPending || !canEditProfessors}
                onChange={(pId: string, item) => {
                  setValue('professorId', pId || '');
                  if (item) setValue('professorName', item.name);
                }}
              />
            ) : (
              /* Case 2: User entered a new professor -> Render BOTH text field and SelectProfessor (initially empty) */
              <div className="flex flex-col gap-3">
                <InputField
                  label="نام استاد جدید (پیشنهادی دانشجو)"
                  registration={register('professorName', {
                    onChange: () => {
                      if (selectedProfessorId) {
                        setValue('professorId', '');
                        setValue('professorIsNew', true);
                      }
                    },
                  })}
                  error={errors.professorName?.message}
                  placeholder={t('edit.newProfessorPlaceholder')}
                  isDisabled={isPending || !canEditProfessors || Boolean(selectedProfessorId)}
                  required={!selectedProfessorId}
                />

                {selectedProfessorId && (
                  <div className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
                    <span>استاد موجود از فهرست زیر انتخاب شد و جایگزین استاد جدید خواهد شد.</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-amber-900 dark:text-amber-300 font-bold hover:bg-amber-100"
                      onPress={() => {
                        setValue('professorId', '');
                        setValue('professorIsNew', true);
                        setValue('professorName', resource.professorName || '');
                      }}
                    >
                      لغو و استفاده از نام جدید
                    </Button>
                  </div>
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
                  <span className="flex-shrink mx-2 text-[11px] text-neutral-400 font-medium">
                    یا انتساب به استاد موجود در سیستم
                  </span>
                  <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
                </div>

                <SelectProfessor
                  label="انتخاب از اساتید موجود"
                  placeholder="جستجو و انتخاب استاد موجود..."
                  value={selectedProfessorId}
                  isClearable
                  isDisabled={isPending || !canEditProfessors}
                  onChange={(pId: string, item) => {
                    if (pId) {
                      setValue('professorId', pId);
                      setValue('professorIsNew', false);
                      if (item) setValue('professorName', item.name);
                    } else {
                      setValue('professorId', '');
                      setValue('professorIsNew', true);
                      setValue('professorName', resource.professorName || '');
                    }
                  }}
                  onClear={() => {
                    setValue('professorId', '');
                    setValue('professorIsNew', true);
                    setValue('professorName', resource.professorName || '');
                  }}
                />
              </div>
            )}
          </div>

          {/* Course Section */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t('edit.courseSectionTitle')}
                </h2>
              </div>
              <Chip
                size="sm"
                variant="secondary"
                className={
                  wasCourseInitiallyNew
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 text-xs'
                    : 'bg-neutral-100 text-neutral-700 text-xs'
                }
              >
                {wasCourseInitiallyNew ? 'درس جدید پیشنهادی' : 'درس موجود در سامانه'}
              </Chip>
            </div>

            {!wasCourseInitiallyNew ? (
              /* Case 1: User chose an existing course -> ONLY render SelectCourse */
              <SelectCourse
                label={t('edit.existingCourse')}
                value={selectedCourseId}
                initialLabel={resource.courseName || undefined}
                isDisabled={isPending || !canEditCourses}
                onChange={(cId: string, item) => {
                  setValue('courseId', cId || '');
                  if (item) setValue('courseName', item.name);
                }}
              />
            ) : (
              /* Case 2: User entered a new course -> Render BOTH text field and SelectCourse (initially empty) */
              <div className="flex flex-col gap-3">
                <InputField
                  label="نام درس جدید (پیشنهادی دانشجو)"
                  registration={register('courseName', {
                    onChange: () => {
                      if (selectedCourseId) {
                        setValue('courseId', '');
                        setValue('courseIsNew', true);
                      }
                    },
                  })}
                  error={errors.courseName?.message}
                  placeholder={t('edit.newCoursePlaceholder')}
                  isDisabled={isPending || !canEditCourses || Boolean(selectedCourseId)}
                  required={!selectedCourseId}
                />

                {selectedCourseId && (
                  <div className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
                    <span>درس موجود از فهرست زیر انتخاب شد و جایگزین درس جدید خواهد شد.</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-amber-900 dark:text-amber-300 font-bold hover:bg-amber-100"
                      onPress={() => {
                        setValue('courseId', '');
                        setValue('courseIsNew', true);
                        setValue('courseName', resource.courseName || '');
                      }}
                    >
                      لغو و استفاده از نام جدید
                    </Button>
                  </div>
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
                  <span className="flex-shrink mx-2 text-[11px] text-neutral-400 font-medium">
                    یا انتساب به درس موجود در سیستم
                  </span>
                  <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800" />
                </div>

                <SelectCourse
                  label="انتخاب از دروس موجود"
                  placeholder="جستجو و انتخاب درس موجود..."
                  value={selectedCourseId}
                  isClearable
                  isDisabled={isPending || !canEditCourses}
                  onChange={(cId: string, item) => {
                    if (cId) {
                      setValue('courseId', cId);
                      setValue('courseIsNew', false);
                      if (item) setValue('courseName', item.name);
                    } else {
                      setValue('courseId', '');
                      setValue('courseIsNew', true);
                      setValue('courseName', resource.courseName || '');
                    }
                  }}
                  onClear={() => {
                    setValue('courseId', '');
                    setValue('courseIsNew', true);
                    setValue('courseName', resource.courseName || '');
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center justify-between shadow-xs">
          <Button
            variant="outline"
            onPress={() => router.push('/dashboard/resources')}
            isDisabled={isPending}
          >
            {tCommon('actions.cancel')}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              isPending={isUpdating}
              isDisabled={!canEditResource || isPending}
              className="px-6"
            >
              {tCommon('actions.save')}
            </Button>
          </div>
        </div>
      </form>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>{t('modals.rejectTitle')}</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-3 py-4">
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400">
                  {t('edit.rejectPrompt')}
                </p>
                <InputField
                  label={t('modals.rejectReason')}
                  placeholder={t('modals.rejectReasonPlaceholder')}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <Button
                  variant="outline"
                  onPress={() => setIsRejectModalOpen(false)}
                  isDisabled={isRejecting}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  variant="primary"
                  className="bg-danger-600 hover:bg-danger-700 text-white"
                  isPending={isRejecting}
                  isDisabled={!rejectReason.trim()}
                  onPress={() => rejectMutate({ reason: rejectReason.trim() })}
                >
                  {t('edit.confirmRejectTitle')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default ResourceEditClient;
