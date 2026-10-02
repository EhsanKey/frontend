'use client';

import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
  Switch,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { IReviewSubmission } from '@/models';
import type { UpdateReviewDto } from '@/apis/services/reviews/_dto';
import {
  InputField,
  SelectCampus,
  SelectCourse,
  SelectMajor,
  SelectProfessor,
  SelectUniversity,
} from '@/components/shared';
import { useAuth } from '@/hooks';
import { formatSemesterCode, getRecentAcademicSemesters, hasPermission } from '@/utils';

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateReviewDto) => Promise<void>;
  review: IReviewSubmission | null;
  isPending?: boolean;
}

interface FormValues {
  universityId: string;
  campusId: string;
  majorId: string;
  courseCategory: 'general' | 'specialized';
  degreeLevel: 'bachelor' | 'master' | 'phd';
  semester: string;
  professorId: string;
  professorName: string;
  professorIsNew: boolean;
  courseId: string;
  courseName: string;
  courseIsNew: boolean;
  content: string;
}

export const ReviewEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  review,
  isPending = false,
}: ReviewEditModalProps) => {
  const t = useTranslations('reviews');
  const tCommon = useTranslations('common');
  const { user } = useAuth();

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      universityId: '',
      campusId: '',
      majorId: '',
      courseCategory: 'specialized',
      degreeLevel: 'bachelor',
      semester: '',
      professorId: '',
      professorName: '',
      professorIsNew: false,
      courseId: '',
      courseName: '',
      courseIsNew: false,
      content: '',
    },
  });

  const selectedUniversityId = watch('universityId');
  const isProfessorNew = watch('professorIsNew');
  const isCourseNew = watch('courseIsNew');

  useEffect(() => {
    if (review) {
      const initialDegree = (review.degreeLevelsRaw?.[0] as 'bachelor' | 'master' | 'phd') || 'bachelor';

      reset({
        universityId: review.universityId || '',
        campusId: review.campusId || '',
        majorId: review.majorId || '',
        courseCategory: review.courseCategory || 'specialized',
        degreeLevel: initialDegree,
        semester: review.semester || '',
        professorId: review.professorId || '',
        professorName: review.professorName || '',
        professorIsNew: Boolean(review.professorIsNew),
        courseId: review.courseId || '',
        courseName: review.courseName || '',
        courseIsNew: Boolean(review.courseIsNew),
        content: review.content || '',
      });
    }
  }, [review, reset, isOpen]);

  const handleFormSubmit = async (data: FormValues) => {
    const payload: UpdateReviewDto = {
      universityId: data.universityId || undefined,
      campusId: data.campusId || undefined,
      majorId: data.majorId ? data.majorId : null,
      courseCategory: data.courseCategory,
      degreeLevels: [data.degreeLevel],
      semester: data.semester || null,
      content: data.content,
      professorIsNew: data.professorIsNew,
      courseIsNew: data.courseIsNew,
    };

    if (data.professorIsNew) {
      payload.professorName = data.professorName;
      payload.professorId = null;
    } else {
      payload.professorId = data.professorId || null;
    }

    if (data.courseIsNew) {
      payload.courseName = data.courseName;
      payload.courseId = null;
    } else {
      payload.courseId = data.courseId || null;
    }

    await onSubmit(payload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container className="admin-modal-container w-full !max-w-3xl">
          <Modal.Dialog className="admin-modal-dialog w-full !max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{t('modals.editTitle')}</Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
              <Modal.Body className="flex flex-col gap-4 overflow-y-auto p-6">
                {/* 1. Academic Hierarchy: University, Campus, Major */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
                  <h4 className="text-body-sm font-bold text-neutral-800">
                    {t('edit.academicSectionTitle')}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SelectUniversity
                      label={tCommon('academic.university')}
                      value={watch('universityId')}
                      isDisabled={isPending || !canEditAcademic}
                      onChange={(uId: string) => {
                        setValue('universityId', uId || '');
                        setValue('campusId', '');
                      }}
                    />

                    <SelectCampus
                      label={tCommon('academic.campus')}
                      universityId={selectedUniversityId || undefined}
                      value={watch('campusId')}
                      isDisabled={isPending || !canEditAcademic}
                      onChange={(cId: string) => setValue('campusId', cId || '')}
                    />

                    <div className="md:col-span-2">
                      <SelectMajor
                        label={tCommon('academic.major')}
                        value={watch('majorId')}
                        isDisabled={isPending || !canEditAcademic}
                        onChange={(mId: string) => setValue('majorId', mId || '')}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Course Category, Degree Level & Academic Semester */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Controller
                    name="courseCategory"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-body-sm font-medium text-neutral-700">{tCommon('academic.category')}</Label>
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
                        <Label className="text-body-sm font-medium text-neutral-700">{tCommon('academic.degree')}</Label>
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
                        <Label className="text-body-sm font-medium text-neutral-700">{t('edit.semesterLabel')}</Label>
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

                {/* 3. Professor Information */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-body-sm font-bold text-neutral-800">
                      {t('edit.professorSectionTitle')}
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-caption text-neutral-600">
                      <span>{t('edit.isProfessorNew')}</span>
                      <Switch
                        isSelected={isProfessorNew}
                        onChange={(selected: boolean) => setValue('professorIsNew', selected)}
                        isDisabled={isPending || !canEditProfessors}
                      />
                    </label>
                  </div>

                  {isProfessorNew ? (
                    <InputField
                      label={t('edit.newProfessorName')}
                      registration={register('professorName', {
                        required: isProfessorNew ? t('edit.validation.newProfessorRequired') : false,
                      })}
                      error={errors.professorName?.message}
                      placeholder={t('edit.newProfessorPlaceholder')}
                      isDisabled={isPending || !canEditProfessors}
                    />
                  ) : (
                    <SelectProfessor
                      label={t('edit.existingProfessor')}
                      value={watch('professorId')}
                      isDisabled={isPending || !canEditProfessors}
                      onChange={(pId: string, item) => {
                        setValue('professorId', pId || '');
                        if (item) setValue('professorName', item.name);
                      }}
                    />
                  )}
                </div>

                {/* 4. Course Information */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-body-sm font-bold text-neutral-800">
                      {t('edit.courseSectionTitle')}
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-caption text-neutral-600">
                      <span>{t('edit.isCourseNew')}</span>
                      <Switch
                        isSelected={isCourseNew}
                        onChange={(selected: boolean) => setValue('courseIsNew', selected)}
                        isDisabled={isPending || !canEditCourses}
                      />
                    </label>
                  </div>

                  {isCourseNew ? (
                    <InputField
                      label={t('edit.newCourseName')}
                      registration={register('courseName', {
                        required: isCourseNew ? t('edit.validation.newCourseRequired') : false,
                      })}
                      error={errors.courseName?.message}
                      placeholder={t('edit.newCoursePlaceholder')}
                      isDisabled={isPending || !canEditCourses}
                    />
                  ) : (
                    <SelectCourse
                      label={t('edit.existingCourse')}
                      value={watch('courseId')}
                      isDisabled={isPending || !canEditCourses}
                      onChange={(cId: string, item) => {
                        setValue('courseId', cId || '');
                        if (item) setValue('courseName', item.name);
                      }}
                    />
                  )}
                </div>

                {/* 5. Review Content */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-body-sm font-medium text-neutral-700">
                    {t('edit.reviewContent')}
                  </Label>
                  <textarea
                    {...register('content', { required: t('edit.validation.contentRequired') })}
                    rows={4}
                    className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-body-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-100 transition-colors"
                    placeholder={t('edit.reviewContentPlaceholder')}
                    disabled={isPending || !canEditReview}
                  />
                  {errors.content?.message && (
                    <p className="text-caption text-danger-600 font-medium">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2 border-t border-neutral-100 p-4">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                  isDisabled={!canEditReview}
                >
                  {tCommon('actions.save')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ReviewEditModal;
