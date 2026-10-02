'use client';

import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
} from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  InputField,
  SelectCampus,
  SelectCourse,
  SelectMajor,
  SelectProfessor,
} from '@/components/shared';
import type { CreateTeachingDto, UpdateTeachingDto } from '@/apis/services/teachings/_dto';
import type { DegreeLevel, ICampus, ICourse, IMajor, IProfessor, ITeaching } from '@/models';

interface TeachingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTeachingDto | UpdateTeachingDto) => Promise<void>;
  teaching: ITeaching | null;
  professors: IProfessor[];
  courses: ICourse[];
  campuses: ICampus[];
  majors: IMajor[];
  isPending?: boolean;
}

interface FormValues {
  professorId: string;
  courseId: string;
  campusId: string;
  majorId: string;
  degreeLevel: DegreeLevel;
  semester: string;
}

const DEGREES: DegreeLevel[] = ['associate', 'bachelor', 'master', 'doctorate'];

export const TeachingFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  teaching,
  professors,
  courses,
  campuses,
  majors,
  isPending = false,
}: TeachingFormModalProps) => {
  const t = useTranslations('teachings');
  const tDegrees = useTranslations('teachings.degrees');
  const tCommon = useTranslations('common');
  const isEdit = Boolean(teaching);

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      professorId: '',
      courseId: '',
      campusId: '',
      majorId: '',
      degreeLevel: 'bachelor',
      semester: '',
    },
  });

  useEffect(() => {
    if (teaching) {
      reset({
        professorId: teaching.professorId || teaching.professor?.id || '',
        courseId: teaching.courseId || teaching.course?.id || '',
        campusId: teaching.campusId || teaching.campus?.id || '',
        majorId: teaching.majorId || teaching.major?.id || '',
        degreeLevel: teaching.degreeLevel || 'bachelor',
        semester: teaching.semester || '',
      });
    } else {
      reset({
        professorId: professors[0]?.id || '',
        courseId: courses[0]?.id || '',
        campusId: campuses[0]?.id || '',
        majorId: majors[0]?.id || '',
        degreeLevel: 'bachelor',
        semester: '',
      });
    }
  }, [teaching, professors, courses, campuses, majors, reset, isOpen]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {isEdit ? t('modals.editTitle') : t('modals.createTitle')}
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Modal.Body className="flex flex-col gap-4">
                {/* Professor */}
                <Controller
                  control={control}
                  name="professorId"
                  rules={{ required: t('validation.professorRequired') }}
                  render={({ field, fieldState }) => (
                    <SelectProfessor
                      value={field.value}
                      onChange={field.onChange}
                      initialLabel={teaching?.professor?.name}
                      label={t('fields.professor')}
                      placeholder={t('fields.professor')}
                      isDisabled={isPending}
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                {/* Course */}
                <Controller
                  control={control}
                  name="courseId"
                  rules={{ required: t('validation.courseRequired') }}
                  render={({ field, fieldState }) => (
                    <SelectCourse
                      value={field.value}
                      onChange={field.onChange}
                      initialLabel={teaching?.course?.name}
                      label={t('fields.course')}
                      placeholder={t('fields.course')}
                      isDisabled={isPending}
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Campus */}
                  <Controller
                    control={control}
                    name="campusId"
                    rules={{ required: t('validation.campusRequired') }}
                    render={({ field, fieldState }) => (
                      <SelectCampus
                        value={field.value}
                        onChange={field.onChange}
                        initialLabel={teaching?.campus?.name}
                        label={t('fields.campus')}
                        placeholder={t('fields.campus')}
                        isDisabled={isPending}
                        isInvalid={Boolean(fieldState.error)}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* Major */}
                  <Controller
                    control={control}
                    name="majorId"
                    rules={{ required: t('validation.majorRequired') }}
                    render={({ field, fieldState }) => (
                      <SelectMajor
                        value={field.value}
                        onChange={field.onChange}
                        initialLabel={teaching?.major?.name}
                        label={t('fields.major')}
                        placeholder={t('fields.major')}
                        isDisabled={isPending}
                        isInvalid={Boolean(fieldState.error)}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />
                </div>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Degree Level */}
                  <Controller
                    control={control}
                    name="degreeLevel"
                    rules={{ required: t('validation.degreeRequired') }}
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label>{t('fields.degreeLevel')}</Label>
                        <Select
                          selectedKey={field.value}
                          onSelectionChange={(key) => field.onChange(String(key) as DegreeLevel)}
                          isDisabled={isPending}
                          className="w-full"
                          aria-label={t('fields.degreeLevel')}
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label={t('fields.degreeLevel')}>
                              {DEGREES.map((deg) => (
                                <ListBox.Item
                                  key={deg}
                                  id={deg}
                                  textValue={tDegrees(deg as Parameters<typeof tDegrees>[0])}
                                >
                                  {tDegrees(deg as Parameters<typeof tDegrees>[0])}
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                        {fieldState.error ? (
                          <p className="text-caption text-danger-500">
                            {fieldState.error.message}
                          </p>
                        ) : null}
                      </div>
                    )}
                  />

                  {/* Semester */}
                  <InputField
                    label={t('fields.semester')}
                    placeholder={t('fields.semesterPlaceholder')}
                    isDisabled={isPending}
                    {...register('semester')}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isPending={isPending}
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
