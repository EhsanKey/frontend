'use client';

import { Button, Modal, Spinner } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, BookOpen, Check, MessageSquare, Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AcademicScopeFields } from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { usePostRequest } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { DegreeLevel } from '@/models';
import {
  clientCrawlerServices,
  type ApproveCrawlerReviewDto,
  type CrawlerMessageDto,
} from '@/apis/services/crawler';
import {
  formatPersianDate,
  formatSemesterCode,
  getRecentAcademicSemesters,
} from '@/utils';
import {
  crawlerModerationSchema,
  type CrawlerModerationFormValues,
} from '../schemas/crawler-moderation.schema';
import { ModerationProfessorSection } from './components/moderation-professor-section';
import { ModerationCourseSection } from './components/moderation-course-section';
import { ModerationDegreeSemesterSection } from './components/moderation-degree-semester-section';

interface CrawlerReviewModerationModalProps {
  message: CrawlerMessageDto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRejectRequest?: (message: CrawlerMessageDto) => void;
}

export const CrawlerReviewModerationModal = ({
  message,
  isOpen,
  onOpenChange,
  onRejectRequest,
}: CrawlerReviewModerationModalProps) => {
  const t = useTranslations('crawler.reviews.moderationModal');
  const tToast = useTranslations('crawler.reviews.toast');
  const queryClient = useQueryClient();

  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(0);
  const [additionalCoursesToInclude, setAdditionalCoursesToInclude] = useState<Record<number, boolean>>({});

  const recentSemesters = useMemo(() => {
    const list = getRecentAcademicSemesters(8);
    if (message?.semester && !list.some((s) => s.code === message.semester)) {
      list.unshift({
        code: message.semester,
        term: ((parseInt(message.semester, 10) % 10) || 1) as 1 | 2 | 3,
        academicYear: Math.floor(parseInt(message.semester, 10) / 10),
        label: formatSemesterCode(message.semester),
      });
    }
    return list;
  }, [message?.semester]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CrawlerModerationFormValues>({
    resolver: zodResolver(crawlerModerationSchema) as any,
    defaultValues: {
      content: '',
      universityId: '',
      campusId: '',
      majorId: null,
      isProfessorNew: false,
      professorId: null,
      professorName: '',
      isCourseNew: false,
      courseId: null,
      courseName: '',
      courseCategory: 'specialized',
      degreeLevel: 'bachelor',
      semester: null,
    },
    mode: 'onChange',
  });

  const universityId = watch('universityId');
  const campusId = watch('campusId');
  const majorId = watch('majorId') ?? '';
  const isProfessorNew = watch('isProfessorNew');
  const professorId = watch('professorId') ?? '';
  const professorName = watch('professorName');
  const isCourseNew = watch('isCourseNew');
  const courseId = watch('courseId') ?? '';
  const courseName = watch('courseName');
  const courseCategory = watch('courseCategory');
  const degreeLevel = watch('degreeLevel');
  const semester = watch('semester') ?? '';

  useEffect(() => {
    if (message) {
      const extraction = (message.rawMetadata as any)?.extraction;
      const initialContent = extraction?.cleanedContent || message.content || '';

      const profRes = extraction?.professorResolution;
      const courseRes = extraction?.courseResolution;

      // Professor pre-selection:
      // 100% database match or high confidence DB match (score >= 80) with valid ID -> select dropdown (isProfessorNew: false)
      // Otherwise -> text input (isProfessorNew: true)
      const profDbId =
        message.professorId ||
        (profRes?.matchType === 'database' && profRes?.matchedId ? profRes.matchedId : null);
      const isProfExactDb =
        Boolean(profDbId) &&
        profRes?.matchType === 'database' &&
        (profRes?.score === 100 || profRes?.isExactMatch);
      const hasDbProf =
        Boolean(profDbId) &&
        (isProfExactDb ||
          (profRes?.matchType === 'database' && (profRes?.score ?? 0) >= 80) ||
          Boolean(message.professorId));
      const isNewProf = !hasDbProf;
      const profId = hasDbProf ? profDbId : null;
      const profName =
        message.existingProfessorName || profRes?.matchedName || message.professorName || '';

      // Course pre-selection:
      // 100% database match without ambiguity with valid ID -> select dropdown (isCourseNew: false)
      // If ambiguous, catalog-only, or new -> text input (isCourseNew: true)
      const isCourseAmbiguous = Boolean(courseRes?.isAmbiguous);
      const crsDbId =
        message.courseId ||
        (courseRes?.matchType === 'database' && courseRes?.matchedId ? courseRes.matchedId : null);
      const isCourseExactDb =
        Boolean(crsDbId) &&
        courseRes?.matchType === 'database' &&
        (courseRes?.score === 100 || courseRes?.isExactMatch) &&
        !isCourseAmbiguous;
      const hasDbCourse =
        Boolean(crsDbId) &&
        !isCourseAmbiguous &&
        (isCourseExactDb ||
          (courseRes?.matchType === 'database' && (courseRes?.score ?? 0) >= 80) ||
          Boolean(message.courseId));
      const isNewCrs = !hasDbCourse;
      const crsId = hasDbCourse ? crsDbId : null;
      const crsName =
        message.existingCourseName || courseRes?.matchedName || message.courseName || '';

      // Multi-course setup:
      const allCourses: any[] = extraction?.allExtractedCourses || [];
      setSelectedCourseIndex(0);
      const initialIncludes: Record<number, boolean> = {};
      allCourses.forEach((_, idx) => {
        if (idx !== 0) initialIncludes[idx] = true;
      });
      setAdditionalCoursesToInclude(initialIncludes);

      reset({
        content: initialContent,
        universityId: message.universityId || '',
        campusId: message.campusId || '',
        majorId: message.majorId || null,
        isProfessorNew: isNewProf,
        professorId: profId,
        professorName: profName,
        isCourseNew: isNewCrs,
        courseId: crsId,
        courseName: crsName,
        courseCategory: 'specialized',
        degreeLevel: (message.degreeLevel as DegreeLevel) || 'bachelor',
        semester: message.semester || (recentSemesters[0]?.code ?? null),
      });
    }
  }, [message, recentSemesters, reset]);

  const extraction = (message?.rawMetadata as any)?.extraction;
  const allExtractedCourses: any[] = extraction?.allExtractedCourses || [];
  const activeExtractedCourse = allExtractedCourses[selectedCourseIndex] || null;
  const activeCourseResolution = activeExtractedCourse?.courseResolution || extraction?.courseResolution;
  const activeRawCourseName = activeExtractedCourse?.rawName || extraction?.rawCourseName;

  const handleSelectPrimaryCourse = (idx: number) => {
    setSelectedCourseIndex(idx);
    const targetCourse = allExtractedCourses[idx];
    if (!targetCourse) return;

    const res = targetCourse.courseResolution;
    const isCourseAmbiguous = Boolean(res?.isAmbiguous);
    const crsDbId = res?.matchType === 'database' && res?.matchedId ? res.matchedId : null;
    const isCourseExactDb =
      Boolean(crsDbId) &&
      res?.matchType === 'database' &&
      (res?.score === 100 || res?.isExactMatch) &&
      !isCourseAmbiguous;
    const hasDbCourse =
      Boolean(crsDbId) &&
      !isCourseAmbiguous &&
      (isCourseExactDb || (res?.matchType === 'database' && (res?.score ?? 0) >= 80));

    setValue('isCourseNew', !hasDbCourse, { shouldValidate: true });
    setValue('courseId', hasDbCourse ? crsDbId : null, { shouldValidate: true });
    setValue(
      'courseName',
      hasDbCourse
        ? (res?.matchedName || targetCourse.courseName)
        : (targetCourse.courseName || targetCourse.rawName),
      { shouldValidate: true },
    );

    setAdditionalCoursesToInclude((prev) => {
      const next = { ...prev };
      delete next[idx];
      if (selectedCourseIndex !== idx) {
        next[selectedCourseIndex] = true;
      }
      return next;
    });
  };

  const handleToggleAdditionalCourse = (idx: number) => {
    setAdditionalCoursesToInclude((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const { mutateAsync: approveReview, isPending: isApproving } = usePostRequest<
    { id: string; data: ApproveCrawlerReviewDto },
    unknown
  >({
    requestFn: ({ id, data }) => clientCrawlerServices.approveCrawlerReview(id, data),
    getSuccessDescription: () => tToast('approved'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.crawler.messages });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.registeredReviews.lists });
    },
  });

  if (!message) return null;

  const isAlreadyApproved = message.status === 'approved';

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = async (values: CrawlerModerationFormValues) => {
    const additionalCoursesPayload = allExtractedCourses
      .filter((_, idx) => idx !== selectedCourseIndex && additionalCoursesToInclude[idx])
      .map((item) => {
        const isDb =
          Boolean(item.courseResolution?.matchedId) &&
          item.courseResolution?.matchType === 'database';
        return {
          courseId: isDb ? item.courseResolution.matchedId : null,
          courseName: (
            item.courseResolution?.matchedName ||
            item.courseName ||
            item.rawName
          ).trim(),
          isNew: !isDb,
        };
      });

    await approveReview({
      id: message.id,
      data: {
        universityId: values.universityId,
        campusId: values.campusId,
        majorId: values.majorId || null,
        courseCategory: values.courseCategory,
        professorId: values.isProfessorNew ? null : values.professorId || null,
        professorName: values.professorName.trim(),
        professorIsNew: values.isProfessorNew,
        courseId: values.isCourseNew ? null : values.courseId || null,
        courseName: values.courseName.trim(),
        courseIsNew: values.isCourseNew,
        additionalCourses:
          additionalCoursesPayload.length > 0 ? additionalCoursesPayload : undefined,
        degreeLevel: values.degreeLevel,
        semester: values.semester || null,
        content: values.content.trim(),
      },
    });

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="cover" className="max-w-4xl w-full p-2 sm:p-4 my-auto">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <MessageSquare className={ICON_SIZE_CLASS.md} />
                <div>
                  <Modal.Heading>{t('title')}</Modal.Heading>
                  <p className="text-caption text-neutral-500 font-normal mt-0.5">
                    {t('channelInfo', {
                      title: message.channelTitle || t('telegramDefault'),
                      date: formatPersianDate(message.messageDate),
                    })}
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-1">
              {/* 1. Original Raw Post */}
              <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 flex flex-col gap-1.5">
                <span className="text-caption font-bold text-neutral-600">
                  {t('originalPostTitle')}
                </span>
                <p className="text-body-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-wrap select-all">
                  {message.content}
                </p>
              </div>

              {/* AI Extraction Confidence Card */}
              {(message.rawMetadata as any)?.extraction && (
                <div className="p-3 rounded-xl border border-primary-200 bg-primary-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-bold text-primary-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary-600" />
                      استخراج و پالایش خودکار هوش مصنوعی (قطعیت کل: {((message.rawMetadata as any).extraction.overallConfidence) ?? 90}٪)
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(message.rawMetadata as any).extraction.professorResolution?.score > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          (message.rawMetadata as any).extraction.professorResolution?.matchType === 'database'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          استاد: {(message.rawMetadata as any).extraction.professorResolution.matchType === 'database' ? 'دیتابیس' : 'کاتالوگ'} ({((message.rawMetadata as any).extraction.professorResolution.score)}٪)
                        </span>
                      )}
                      {(message.rawMetadata as any).extraction.courseResolution?.score > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          (message.rawMetadata as any).extraction.courseResolution?.matchType === 'database'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          درس: {(message.rawMetadata as any).extraction.courseResolution.matchType === 'database' ? 'دیتابیس' : 'کاتالوگ'} ({((message.rawMetadata as any).extraction.courseResolution.score)}٪)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    متن در کادر زیر به طور خودکار بازنویسی، پالایش و برای هوش مصنوعی آماده شده است. می‌توانید در صورت نیاز آن را ویرایش کنید.
                  </p>
                </div>
              )}

              {/* Evaluation Dimensions Tags */}
              {(message.rawMetadata as any)?.extraction?.evaluationDimensions && (
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/80 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-neutral-700">
                    ابعاد ارزیابی استخراج‌شده از پیام:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(
                      (message.rawMetadata as any).extraction.evaluationDimensions as Record<
                        string,
                        string | null
                      >,
                    )
                      .filter(([_, val]) => Boolean(val))
                      .map(([key, val]) => {
                        const labels: Record<string, string> = {
                          examType: 'نوع امتحان',
                          research: 'تحقیق/پروژه',
                          presentation: 'ارائه',
                          attendance: 'حضور و غیاب',
                          midterm: 'امکان میان‌ترم',
                          examSource: 'منبع امتحان',
                          gradingQuality: 'کیفیت نمره‌دهی',
                        };
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-800 shadow-2xs"
                          >
                            <span className="text-neutral-500 font-medium">
                              {labels[key] || key}:
                            </span>
                            <span className="font-bold text-primary-900">{val}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Multi-Course Extracted Selector */}
              {allExtractedCourses.length > 1 && (
                <div className="p-3.5 rounded-xl border border-primary-200 bg-primary-50/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-bold text-primary-900 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary-600" />
                      شناسایی چندین درس در این نظر ({allExtractedCourses.length} درس)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      یک درس را برای ثبت این نظر انتخاب کنید؛ سایر دروس در سوابق تدریس استاد ذخیره می‌شوند.
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-neutral-700">
                      انتخاب درس اصلی این نظر (جهت ثبت دیدگاه):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allExtractedCourses.map((c, idx) => {
                        const isSelected = selectedCourseIndex === idx;
                        const res = c.courseResolution;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectPrimaryCourse(idx)}
                            disabled={isApproving || isAlreadyApproved}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary-600 text-white border-primary-600 shadow-sm ring-2 ring-primary-500/20'
                                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                            <span>{c.rawName || c.courseName}</span>
                            {res?.score > 0 && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  isSelected
                                    ? 'bg-primary-700/50 text-primary-100'
                                    : res.matchType === 'database'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {res.score}٪ {res.matchType === 'database' ? 'دیتابیس' : 'کاتالوگ'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-primary-100">
                    <span className="text-[11px] font-bold text-neutral-700">
                      سایر دروس جهت ثبت در سوابق تدریس این استاد (Teachings):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allExtractedCourses.map((c, idx) => {
                        if (idx === selectedCourseIndex) return null;
                        const isIncluded = Boolean(additionalCoursesToInclude[idx]);
                        return (
                          <label
                            key={idx}
                            className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs cursor-pointer border select-none transition-colors ${
                              isIncluded
                                ? 'bg-white border-emerald-300 text-emerald-900 shadow-2xs'
                                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => handleToggleAdditionalCourse(idx)}
                              disabled={isApproving || isAlreadyApproved}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="font-medium">
                              {c.courseResolution?.matchedName || c.courseName || c.rawName}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              ({c.courseResolution?.matchType === 'database' ? 'درس موجود' : 'درس جدید'})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Homonym / Ambiguity Warning Box */}
              {(message.rawMetadata as any)?.extraction?.courseResolution?.isAmbiguous && (
                <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/90 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-caption">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>هشدار درس همنام / هم‌پوشان</span>
                  </div>
                  <p className="text-body-sm text-amber-800 leading-relaxed font-normal">
                    {((message.rawMetadata as any).extraction.courseResolution.ambiguityReason) ||
                      `عنوان «${(message.rawMetadata as any).extraction.courseResolution.matchedName || message.courseName}» ممکن است با چند درس دیگر همنام باشد. لطفاً نام دقیق را مشخص کنید.`}
                  </p>
                  {((message.rawMetadata as any).extraction.courseResolution.ambiguousCandidates)?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center mt-1">
                      <span className="text-[11px] text-amber-900 font-medium">عناوین پیشنهادی همنام:</span>
                      {((message.rawMetadata as any).extraction.courseResolution.ambiguousCandidates as string[]).map((cand) => (
                        <button
                          key={cand}
                          type="button"
                          onClick={() => {
                            setValue('courseName', cand, { shouldValidate: true });
                            setValue('isCourseNew', true, { shouldValidate: true });
                            setValue('courseId', null, { shouldValidate: true });
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors font-medium shadow-2xs cursor-pointer"
                        >
                          {cand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Editable Content Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-bold text-neutral-700">
                  {t('editContentTitle')}
                </label>
                <Controller
                  control={control}
                  name="content"
                  render={({ field, fieldState }) => (
                    <div>
                      <textarea
                        value={field.value}
                        onChange={field.onChange}
                        rows={5}
                        disabled={isApproving || isAlreadyApproved}
                        className="w-full p-3 rounded-xl border border-neutral-200 text-body-sm text-neutral-800 leading-relaxed focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-hidden transition-all resize-y disabled:opacity-60 disabled:bg-neutral-100"
                      />
                      {fieldState.error?.message && (
                        <span className="text-[11px] text-danger-600 mt-1 block">
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* 3. Academic Scope Fields */}
              <div className="flex flex-col gap-1.5">
                <AcademicScopeFields
                  universityId={universityId}
                  universityName={message.universityName || ''}
                  campusId={campusId}
                  campusName={message.campusName || ''}
                  majorId={majorId}
                  majorName={message.majorName || ''}
                  onUniversityChange={(uId) =>
                    setValue('universityId', uId, { shouldValidate: true })
                  }
                  onCampusChange={(cId) =>
                    setValue('campusId', cId, { shouldValidate: true })
                  }
                  onMajorChange={(mId) => setValue('majorId', mId || null)}
                  title={`${t('academicScopeTitle')} (تنظیم‌شده بر اساس کانال: ${message.channelTitle || t('telegramDefault')})`}
                  isDisabled={isApproving || isAlreadyApproved}
                />
              </div>

              {/* 4. Professor Section */}
              <div className="flex flex-col gap-2">
                <ModerationProfessorSection
                  isNew={isProfessorNew}
                  onIsNewChange={(next) => {
                    setValue('isProfessorNew', next, { shouldValidate: true });
                    if (next) setValue('professorId', null, { shouldValidate: true });
                  }}
                  professorId={professorId}
                  onProfessorSelect={(pId, item) => {
                    setValue('professorId', pId || null, { shouldValidate: true });
                    if (item) setValue('professorName', item.name, { shouldValidate: true });
                  }}
                  professorName={professorName}
                  onProfessorNameChange={(name) =>
                    setValue('professorName', name, { shouldValidate: true })
                  }
                  isDisabled={isApproving || isAlreadyApproved}
                  errorMessage={errors.professorName?.message || errors.professorId?.message}
                />

                {/* Professor: Extracted vs Database comparison when not 100% */}
                {((message.rawMetadata as any)?.extraction?.professorResolution?.score ?? 0) < 100 &&
                  ((message.rawMetadata as any)?.extraction?.rawProfessorName ||
                    (message.rawMetadata as any)?.extraction?.professorName) && (
                    <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500 font-medium">استخراج‌شده از متن نظر:</span>
                        <span className="text-neutral-800 font-bold bg-white px-2 py-0.5 rounded border border-neutral-200">
                          {(message.rawMetadata as any).extraction.rawProfessorName ||
                            (message.rawMetadata as any).extraction.professorName}
                        </span>
                      </div>
                      {(message.rawMetadata as any).extraction.professorResolution?.matchedName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 font-medium">
                            پیشنهاد دیتابیس ({(message.rawMetadata as any).extraction.professorResolution.score}٪):
                          </span>
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {(message.rawMetadata as any).extraction.professorResolution.matchedName}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 font-medium">تطبیق با دیتابیس:</span>
                          <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            موردی یافت نشد (استاد جدید یا تعریف‌نشده)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                {/* Professor 100% Match confirmation badge */}
                {((message.rawMetadata as any)?.extraction?.professorResolution?.score ?? 0) === 100 &&
                  (message.rawMetadata as any)?.extraction?.professorResolution?.matchType === 'database' && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                      <Check className="h-3.5 w-3.5" />
                      <span>تطبیق ۱۰۰٪ با استاد دیتابیس (انتخاب شده در منوی بالا)</span>
                    </div>
                  )}
              </div>

              {/* 5. Course Section */}
              <div className="flex flex-col gap-2">
                <ModerationCourseSection
                  isNew={isCourseNew}
                  onIsNewChange={(next) => {
                    setValue('isCourseNew', next, { shouldValidate: true });
                    if (next) setValue('courseId', null, { shouldValidate: true });
                  }}
                  courseId={courseId}
                  onCourseSelect={(cId, item) => {
                    setValue('courseId', cId || null, { shouldValidate: true });
                    if (item) setValue('courseName', item.name, { shouldValidate: true });
                  }}
                  courseName={courseName}
                  onCourseNameChange={(name) =>
                    setValue('courseName', name, { shouldValidate: true })
                  }
                  category={courseCategory}
                  onCategoryChange={(cat) =>
                    setValue('courseCategory', cat, { shouldValidate: true })
                  }
                  isDisabled={isApproving || isAlreadyApproved}
                  errorMessage={errors.courseName?.message || errors.courseId?.message}
                />

                {/* Course: Extracted vs Database/Catalog comparison when not 100% */}
                {((activeCourseResolution?.score ?? 0) < 100) &&
                  (activeRawCourseName || (message.rawMetadata as any)?.extraction?.courseName) && (
                    <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-500 font-medium">استخراج‌شده از متن نظر:</span>
                        <span className="text-neutral-800 font-bold bg-white px-2 py-0.5 rounded border border-neutral-200">
                          {activeRawCourseName ||
                            (message.rawMetadata as any)?.extraction?.rawCourseName ||
                            (message.rawMetadata as any)?.extraction?.courseName}
                        </span>
                      </div>
                      {activeCourseResolution?.matchedName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 font-medium">
                            {activeCourseResolution.matchType === 'database'
                              ? 'پیشنهاد دیتابیس'
                              : 'پیشنهاد کاتالوگ جامع'}{' '}
                            ({activeCourseResolution.score}٪):
                          </span>
                          <span className="text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {activeCourseResolution.matchedName}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 font-medium">تطبیق دیتابیس/کاتالوگ:</span>
                          <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            موردی یافت نشد (درس جدید یا تعریف‌نشده)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                {/* Course 100% Match confirmation badge */}
                {((activeCourseResolution?.score ?? 0) === 100) &&
                  activeCourseResolution?.matchType === 'database' && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                      <Check className="h-3.5 w-3.5" />
                      <span>تطبیق ۱۰۰٪ با درس دیتابیس (انتخاب شده در منوی بالا)</span>
                    </div>
                  )}
              </div>

              {/* 6. Degree and Semester */}
              <ModerationDegreeSemesterSection
                degreeLevel={degreeLevel}
                onDegreeLevelChange={(deg) =>
                  setValue('degreeLevel', deg, { shouldValidate: true })
                }
                semester={semester}
                onSemesterChange={(sem) => setValue('semester', sem || null)}
                recentSemesters={recentSemesters}
                isDisabled={isApproving || isAlreadyApproved}
              />
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-between gap-2">
              <div>
                {onRejectRequest && !isAlreadyApproved && (
                  <Button
                    variant="danger"
                    onPress={() => {
                      handleClose();
                      onRejectRequest(message);
                    }}
                    isDisabled={isApproving}
                    className="gap-1.5"
                  >
                    <X className={ICON_SIZE_CLASS.sm} />
                    <span>{t('reject')}</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onPress={handleClose}
                  isDisabled={isApproving}
                >
                  {t('cancel')}
                </Button>

                {!isAlreadyApproved && (
                  <Button
                    variant="primary"
                    onPress={() => void handleSubmit(onSubmit)()}
                    isDisabled={!isValid || isApproving}
                    className="gap-1.5"
                  >
                    {isApproving ? (
                      <Spinner size="sm" />
                    ) : (
                      <Check className={ICON_SIZE_CLASS.sm} />
                    )}
                    <span>{t('submitApprove')}</span>
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
