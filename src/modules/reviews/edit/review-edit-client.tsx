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
  GraduationCap,
  MessageSquare,
  School,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { clientReviewServices } from '@/apis/services/reviews/client';
import type { UpdateReviewDto } from '@/apis/services/reviews/_dto';
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
import type { IReviewSubmission, ReviewStatus } from '@/models';
import { formatPersianDate, formatSemesterCode, getRecentAcademicSemesters, hasPermission } from '@/utils';
import { createReviewEditSchema, type ReviewEditFormValues } from './review-edit.schema';

interface ReviewEditClientProps {
  review: IReviewSubmission;
}

export const ReviewEditClient = ({ review }: ReviewEditClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('reviews');
  const tCommon = useTranslations('common');
  const { user } = useAuth();

  const [selectedUniversityName, setSelectedUniversityName] = useState(review.universityName || '');
  const [selectedCampusName, setSelectedCampusName] = useState(review.campusName || '');
  const [selectedMajorName, setSelectedMajorName] = useState(review.majorName || '');

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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

  const canEditReview =
    hasPermission(user, 'reviews:update') ||
    hasPermission(user, 'reviews:manage') ||
    hasPermission(user, '*');

  const canApproveReview =
    hasPermission(user, 'reviews:approve') ||
    hasPermission(user, 'reviews:manage') ||
    hasPermission(user, '*');

  const canEditProfessors =
    hasPermission(user, 'professors:update') ||
    hasPermission(user, 'professors:create') ||
    hasPermission(user, 'professors:manage') ||
    canEditReview;

  const canEditCourses =
    hasPermission(user, 'courses:update') ||
    hasPermission(user, 'courses:create') ||
    hasPermission(user, 'courses:manage') ||
    canEditReview;

  const canEditAcademic =
    hasPermission(user, 'universities:update') ||
    hasPermission(user, 'campuses:update') ||
    hasPermission(user, 'majors:update') ||
    canEditReview;

  const initialDegree = (review.degreeLevelsRaw?.[0] as 'bachelor' | 'master' | 'phd') || 'bachelor';

  const wasProfessorInitiallyNew = Boolean(review.professorIsNew);
  const wasCourseInitiallyNew = Boolean(review.courseIsNew);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewEditFormValues>({
    resolver: zodResolver(
      createReviewEditSchema({
        contentRequired: t('edit.validation.contentRequired'),
        newProfessorRequired: t('edit.validation.newProfessorRequired'),
        newCourseRequired: t('edit.validation.newCourseRequired'),
      }),
    ),
    defaultValues: {
      universityId: review.universityId || '',
      campusId: review.campusId || '',
      majorId: review.majorId || '',
      courseCategory: review.courseCategory || 'specialized',
      degreeLevel: initialDegree,
      semester: review.semester || '',
      professorId: wasProfessorInitiallyNew ? '' : (review.professorId || ''),
      professorName: review.professorName || '',
      professorIsNew: wasProfessorInitiallyNew,
      courseId: wasCourseInitiallyNew ? '' : (review.courseId || ''),
      courseName: review.courseName || '',
      courseIsNew: wasCourseInitiallyNew,
      content: review.content || '',
    },
  });

  const selectedUniversityId = watch('universityId');
  const selectedProfessorId = watch('professorId');
  const selectedCourseId = watch('courseId');

  const invalidateReviewQueries = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.lists });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auditLogs.lists });
  };

  // Update mutation
  const { mutateAsync: updateMutate, isPending: isUpdating } = usePostRequest({
    requestFn: (payload: UpdateReviewDto) =>
      clientReviewServices.updateReview(review.id, payload),
    onSuccess: () => {
      toast.success(t('toast.updated'));
      invalidateReviewQueries();
      router.push('/dashboard/reviews');
    },
  });

  // Approve mutation
  const { mutateAsync: approveMutate, isPending: isApproving } = usePostRequest({
    requestFn: () => clientReviewServices.approveReview(review.id),
    onSuccess: () => {
      toast.success(t('toast.approved'));
      invalidateReviewQueries();
      router.push('/dashboard/reviews');
    },
  });

  // Reject mutation
  const { mutateAsync: rejectMutate, isPending: isRejecting } = usePostRequest({
    requestFn: (payload: { reason: string }) =>
      clientReviewServices.rejectReview(review.id, payload),
    onSuccess: () => {
      toast.success(t('toast.rejected'));
      invalidateReviewQueries();
      setIsRejectModalOpen(false);
      router.push('/dashboard/reviews');
    },
  });

  const isPending = isUpdating || isApproving || isRejecting;

  const handleFormSubmit = async (data: ReviewEditFormValues) => {
    const isProfNew = wasProfessorInitiallyNew ? !Boolean(data.professorId) : false;
    const isCrsNew = wasCourseInitiallyNew ? !Boolean(data.courseId) : false;

    const payload: UpdateReviewDto = {
      universityId: data.universityId || undefined,
      campusId: data.campusId || undefined,
      majorId: data.majorId ? data.majorId : null,
      courseCategory: data.courseCategory,
      degreeLevels: [data.degreeLevel],
      semester: data.semester || null,
      content: data.content,
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

  const renderStatusChip = (status: ReviewStatus) => {
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

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-2xs">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              {t('edit.title')}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t('edit.reviewId', { id: review.id })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onPress={() => router.push('/dashboard/reviews')}
            isDisabled={isPending}
          >
            <ArrowRight className="h-4 w-4" />
            <span>{tCommon('actions.back')}</span>
          </Button>

          {review.status === 'pending' && canApproveReview && (
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
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <User className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.studentSender')}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {review.studentName || t('edit.studentFallback')}
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
                {formatPersianDate(review.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.currentStatus')}</span>
              <div>{renderStatusChip(review.status)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <School className="h-4 w-4" />
            </div>
            <div>
              <span className="text-caption text-neutral-500 block">{t('edit.initialUniversity')}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate block max-w-[150px]">
                {review.universityName || t('edit.unknownUniversity')}
              </span>
            </div>
          </div>
        </div>

        {review.rejectionReason && (
          <div className="mt-4 p-3 rounded-xl bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-900 text-body-sm text-danger-800 dark:text-danger-300 flex items-center gap-2">
            <span className="font-bold">{t('edit.previousRejectionReason')}</span>
            <span>{review.rejectionReason}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        {/* Section 1: Academic Hierarchy */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <School className="h-5 w-5 text-primary-600" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {t('edit.academicSectionTitle')}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t('edit.academicSectionDesc')}
              </p>
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

        {/* Section 2: Course Category, Degree Level & Semester */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t('edit.courseLevelSectionTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    isDisabled={isPending || !canEditReview}
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
                    isDisabled={isPending || !canEditReview}
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

            <Controller
              name="semester"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t('edit.semesterLabel')}
                  </Label>
                  <Select
                    selectedKey={field.value || undefined}
                    onSelectionChange={(key) => field.onChange(String(key))}
                    variant="secondary"
                    className="w-full"
                    placeholder={t('edit.selectSemesterPlaceholder')}
                    isDisabled={isPending || !canEditReview}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={t('edit.semesterLabel')}>
                        {recentSemesters.map((s) => (
                          <ListBox.Item key={s.code} id={s.code} textValue={s.label}>
                            {s.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              )}
            />
          </div>
        </div>

        {/* Section 3: Professor & Course Information */}
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
                initialLabel={review.professorName || undefined}
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
                        setValue('professorName', review.professorName || '');
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
                      setValue('professorName', review.professorName || '');
                    }
                  }}
                  onClear={() => {
                    setValue('professorId', '');
                    setValue('professorIsNew', true);
                    setValue('professorName', review.professorName || '');
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
                initialLabel={review.courseName || undefined}
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
                        setValue('courseName', review.courseName || '');
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
                      setValue('courseName', review.courseName || '');
                    }
                  }}
                  onClear={() => {
                    setValue('courseId', '');
                    setValue('courseIsNew', true);
                    setValue('courseName', review.courseName || '');
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Review Content */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t('edit.reviewContent')}
            </h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <textarea
              {...register('content')}
              rows={5}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 text-body-sm text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-100 dark:disabled:bg-neutral-800/50 transition-colors leading-relaxed"
              placeholder={t('edit.reviewContentPlaceholder')}
              disabled={isPending || !canEditReview}
            />
            {errors.content?.message && (
              <p className="text-caption text-danger-600 font-medium">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center justify-between shadow-xs">
          <Button
            variant="outline"
            onPress={() => router.push('/dashboard/reviews')}
            isDisabled={isPending}
          >
            {tCommon('actions.cancel')}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              isPending={isUpdating}
              isDisabled={!canEditReview || isPending}
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

export default ReviewEditClient;
