'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
} from '@heroui/react';
import type { CreateAiModelDto, UpdateAiModelDto } from '@/apis/services/ai-models/_dto';
import type { AiModelScope, IAiModelConfig } from '@/models';
import { InputField, PasswordField, SwitchField } from '@/components/shared';

interface AiModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAiModelDto | UpdateAiModelDto) => Promise<void>;
  modelToEdit: IAiModelConfig | null;
  isSubmitting: boolean;
}

interface AiModelFormValues {
  name: string;
  scope: AiModelScope;
  providerName: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  structuredOutputMode: string;
  maxTokensParameter: string;
  isEnabled: boolean;
  includeTemperature: boolean;
  requireParameters: boolean;
}

const DEFAULT_FORM_VALUES: AiModelFormValues = {
  name: '',
  scope: 'answer',
  providerName: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  apiKey: '',
  structuredOutputMode: 'json_schema',
  maxTokensParameter: 'max_tokens',
  isEnabled: true,
  includeTemperature: true,
  requireParameters: false,
};

export const AiModelModal = ({
  isOpen,
  onClose,
  onSubmit,
  modelToEdit,
  isSubmitting,
}: AiModelModalProps) => {
  const t = useTranslations('aiModels');

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<AiModelFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (modelToEdit) {
      reset({
        name: modelToEdit.name ?? '',
        scope: modelToEdit.scope ?? 'answer',
        providerName: modelToEdit.providerName ?? 'openai',
        baseUrl: modelToEdit.baseUrl ?? 'https://api.openai.com/v1',
        model: modelToEdit.model ?? 'gpt-4o-mini',
        apiKey: '',
        structuredOutputMode: modelToEdit.structuredOutputMode ?? 'json_schema',
        maxTokensParameter: modelToEdit.maxTokensParameter ?? 'max_tokens',
        isEnabled: modelToEdit.isEnabled ?? true,
        includeTemperature: modelToEdit.includeTemperature ?? true,
        requireParameters: modelToEdit.requireParameters ?? false,
      });
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [modelToEdit, reset, isOpen]);

  const handleFormSubmit = async (values: AiModelFormValues) => {
    const payload: CreateAiModelDto | UpdateAiModelDto = {
      name: values.name,
      scope: values.scope,
      providerName: values.providerName,
      baseUrl: values.baseUrl,
      model: values.model,
      structuredOutputMode: values.structuredOutputMode,
      maxTokensParameter: values.maxTokensParameter,
      isEnabled: values.isEnabled,
      includeTemperature: values.includeTemperature,
      requireParameters: values.requireParameters,
      ...(values.apiKey ? { apiKey: values.apiKey } : {}),
    };
    await onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl max-h-[90vh] flex flex-col">
            <Modal.CloseTrigger />
            <Modal.Header className="border-b border-divider pb-3 shrink-0">
              <Modal.Heading className="text-lg font-bold">
                {modelToEdit ? t('modal.editTitle') : t('modal.createTitle')}
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col min-h-0 flex-1">
              <Modal.Body className="py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label={t('modal.name')}
                    placeholder={t('modal.namePlaceholder')}
                    {...register('name', { required: true })}
                    required
                  />

                  <Controller
                    name="scope"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label>{t('modal.scope')}</Label>
                        <Select
                          value={field.value}
                          onChange={(key) => field.onChange(String(key) as AiModelScope)}
                          variant="secondary"
                          className="w-full"
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label={t('modal.scope')}>
                              <ListBox.Item id="shared" textValue={t('scopes.shared')}>
                                {t('scopes.shared')}
                              </ListBox.Item>
                              <ListBox.Item id="answer" textValue={t('scopes.answer')}>
                                {t('scopes.answer')}
                              </ListBox.Item>
                              <ListBox.Item id="plan" textValue={t('scopes.plan')}>
                                {t('scopes.plan')}
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  />

                  <InputField
                    label={t('modal.provider')}
                    placeholder="openai / deepseek"
                    {...register('providerName', { required: true })}
                    required
                  />

                  <InputField
                    label={t('modal.model')}
                    placeholder="gpt-4o-mini"
                    {...register('model', { required: true })}
                    required
                  />
                </div>

                <InputField
                  label={t('modal.baseUrl')}
                  placeholder="https://api.openai.com/v1"
                  className="text-left dir-ltr"
                  {...register('baseUrl', { required: true })}
                  required
                />

                <PasswordField
                  label={t('modal.apiKey')}
                  placeholder={
                    modelToEdit
                      ? t('modal.apiKeyMaskedNote')
                      : t('modal.apiKeyPlaceholder')
                  }
                  registration={register('apiKey', { required: !modelToEdit })}
                  showPasswordLabel={t('modal.showApiKey')}
                  hidePasswordLabel={t('modal.hideApiKey')}
                  isDisabled={isSubmitting}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="structuredOutputMode"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label>{t('modal.structuredOutput')}</Label>
                        <Select
                          value={field.value}
                          onChange={(key) => field.onChange(String(key))}
                          variant="secondary"
                          className="w-full"
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label={t('modal.structuredOutput')}>
                              <ListBox.Item id="json_schema" textValue="JSON Schema">
                                JSON Schema
                              </ListBox.Item>
                              <ListBox.Item id="json_object" textValue="JSON Object">
                                JSON Object
                              </ListBox.Item>
                              <ListBox.Item id="off" textValue={t('modal.structuredOff')}>
                                {t('modal.structuredOff')}
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  />

                  <InputField
                    label={t('modal.maxTokens')}
                    className="text-left dir-ltr"
                    {...register('maxTokensParameter')}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Controller
                    name="isEnabled"
                    control={control}
                    render={({ field }) => (
                      <SwitchField
                        label={t('modal.isEnabled')}
                        description={t('modal.isEnabledDesc')}
                        isSelected={Boolean(field.value)}
                        onChange={field.onChange}
                        activeLabel={t('table.active')}
                        inactiveLabel={t('table.inactive')}
                      />
                    )}
                  />

                  <Controller
                    name="includeTemperature"
                    control={control}
                    render={({ field }) => (
                      <SwitchField
                        label={t('modal.includeTemperature')}
                        description={t('modal.includeTempDesc')}
                        isSelected={Boolean(field.value)}
                        onChange={field.onChange}
                        activeLabel={t('modal.send')}
                        inactiveLabel={t('modal.dontSend')}
                      />
                    )}
                  />

                  <Controller
                    name="requireParameters"
                    control={control}
                    render={({ field }) => (
                      <SwitchField
                        label={t('modal.requireParameters')}
                        description={t('modal.requireParamsDesc')}
                        isSelected={Boolean(field.value)}
                        onChange={field.onChange}
                        activeLabel={t('modal.mandatory')}
                        inactiveLabel={t('modal.optional')}
                      />
                    )}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer className="border-t border-divider pt-3 flex justify-end gap-2 shrink-0">
                <Button variant="outline" onPress={onClose} isDisabled={isSubmitting}>
                  {t('modal.cancel')}
                </Button>
                <Button variant="primary" type="submit" isPending={isSubmitting}>
                  {t('modal.submit')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AiModelModal;
