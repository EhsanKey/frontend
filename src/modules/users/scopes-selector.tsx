'use client';

import { Button, Chip } from '@heroui/react';
import {
  Building2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Layers,
  School,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SelectCampus, SelectMajor, SelectUniversity } from '@/components/shared';
import type { ICampusLookupItem, ILookupItem } from '@/models';
import type { IUserScopes } from '@/models/user';
import { lookupServices } from '@/apis/services/lookups/client';

interface ScopesSelectorProps {
  value: IUserScopes;
  onChange: (value: IUserScopes) => void;
  isDisabled?: boolean;
}

export const ScopesSelector = ({
  value,
  onChange,
  isDisabled = false,
}: ScopesSelectorProps) => {
  const t = useTranslations('users');
  const [selectedUniLabel, setSelectedUniLabel] = useState<Record<string, string>>({});
  const [selectedCampusLabel, setSelectedCampusLabel] = useState<Record<string, string>>({});
  const [selectedMajorLabel, setSelectedMajorLabel] = useState<Record<string, string>>({});

  useEffect(() => {
    lookupServices
      .lookupUniversities()
      .then((unis) => {
        const map: Record<string, string> = {};
        unis.forEach((u) => {
          map[u.id] = u.name;
        });
        setSelectedUniLabel((prev) => ({ ...map, ...prev }));
      })
      .catch(() => {});

    lookupServices
      .lookupCampuses()
      .then((camps) => {
        const map: Record<string, string> = {};
        camps.forEach((c) => {
          map[c.id] = c.name;
        });
        setSelectedCampusLabel((prev) => ({ ...map, ...prev }));
      })
      .catch(() => {});

    lookupServices
      .lookupMajors()
      .then((mjs) => {
        const map: Record<string, string> = {};
        mjs.forEach((m) => {
          map[m.id] = m.name;
        });
        setSelectedMajorLabel((prev) => ({ ...map, ...prev }));
      })
      .catch(() => {});
  }, []);

  const allUniversities = Boolean(value.allUniversities);
  const universityIds = value.universityIds ?? [];

  const allCampuses = Boolean(value.allCampuses);
  const campusIds = value.campusIds ?? [];

  const allMajors = Boolean(value.allMajors);
  const majorIds = value.majorIds ?? [];

  // Handlers for Universities
  const handleSetUniMode = (all: boolean) => {
    onChange({
      ...value,
      allUniversities: all,
      universityIds: all ? [] : universityIds,
    });
  };

  const handleAddUniversity = (id: string, item?: ILookupItem) => {
    if (!id || universityIds.includes(id)) return;
    if (item) {
      setSelectedUniLabel((prev) => ({ ...prev, [id]: item.name }));
    }
    onChange({
      ...value,
      allUniversities: false,
      universityIds: [...universityIds, id],
    });
  };

  const handleRemoveUniversity = (id: string) => {
    onChange({
      ...value,
      universityIds: universityIds.filter((item) => item !== id),
    });
  };

  // Handlers for Campuses
  const handleSetCampusMode = (all: boolean) => {
    onChange({
      ...value,
      allCampuses: all,
      campusIds: all ? [] : campusIds,
    });
  };

  const handleAddCampus = (id: string, item?: ICampusLookupItem) => {
    if (!id || campusIds.includes(id)) return;
    if (item) {
      setSelectedCampusLabel((prev) => ({ ...prev, [id]: item.name }));
    }
    onChange({
      ...value,
      allCampuses: false,
      campusIds: [...campusIds, id],
    });
  };

  const handleRemoveCampus = (id: string) => {
    onChange({
      ...value,
      campusIds: campusIds.filter((item) => item !== id),
    });
  };

  // Handlers for Majors
  const handleSetMajorMode = (all: boolean) => {
    onChange({
      ...value,
      allMajors: all,
      majorIds: all ? [] : majorIds,
    });
  };

  const handleAddMajor = (id: string, item?: ILookupItem) => {
    if (!id || majorIds.includes(id)) return;
    if (item) {
      setSelectedMajorLabel((prev) => ({ ...prev, [id]: item.name }));
    }
    onChange({
      ...value,
      allMajors: false,
      majorIds: [...majorIds, id],
    });
  };

  const handleRemoveMajor = (id: string) => {
    onChange({
      ...value,
      majorIds: majorIds.filter((item) => item !== id),
    });
  };

  // Quick Presets
  const applyGlobalPreset = () => {
    onChange({
      allUniversities: true,
      universityIds: [],
      allCampuses: true,
      campusIds: [],
      allMajors: true,
      majorIds: [],
    });
  };

  const applyRestrictedPreset = () => {
    onChange({
      allUniversities: false,
      universityIds: universityIds.length > 0 ? universityIds : [],
      allCampuses: true,
      campusIds: [],
      allMajors: true,
      majorIds: [],
    });
  };

  const isFullyGlobal = allUniversities && allCampuses && allMajors;

  return (
    <div className="flex flex-col gap-5">
      {/* Scope Overview Header & Presets */}
      <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            {isFullyGlobal ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900">
                {t('scopesSelector.title')}
              </span>
              <Chip
                size="sm"
                variant="soft"
                className={
                  isFullyGlobal
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'bg-amber-50 text-amber-800 font-semibold'
                }
              >
                {isFullyGlobal
                  ? t('scopesSelector.fullyGlobal')
                  : t('scopesSelector.restricted')}
              </Chip>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t('scopesSelector.desc')}
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Button
            size="sm"
            variant="outline"
            onPress={applyRestrictedPreset}
            isDisabled={isDisabled}
            className="text-xs gap-1.5 bg-white hover:bg-neutral-100"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            {t('scopesSelector.presetRestricted')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={applyGlobalPreset}
            isDisabled={isDisabled}
            className="text-xs gap-1.5 bg-white hover:bg-neutral-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            {t('scopesSelector.presetGlobal')}
          </Button>
        </div>
      </div>

      {/* 1. Universities Scope Card */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <School className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {t('scopesSelector.universitiesTitle')}
                </span>
                <span className="text-xs text-neutral-400">
                  {allUniversities
                    ? t('scopesSelector.globalNotice')
                    : t('scopesSelector.allowedUniversities', {
                        count: universityIds.length,
                      })}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t('scopesSelector.universitiesDesc')}
              </p>
            </div>
          </div>

          {/* Mode Switch Buttons */}
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleSetUniMode(false)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !allUniversities
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              {t('scopesSelector.specificUniversities')}
            </button>
            <button
              type="button"
              onClick={() => handleSetUniMode(true)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                allUniversities
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              {t('scopesSelector.allUniversities')}
            </button>
          </div>
        </div>

        {allUniversities ? (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900">
            <Globe2 className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              {t('scopesSelector.globalUnisBanner')}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-neutral-700">
              {t('scopesSelector.searchUniLabel')}
            </label>
            <SelectUniversity
              value={null}
              onChange={(id, item) => handleAddUniversity(id, item)}
              isDisabled={isDisabled}
              placeholder={t('scopesSelector.searchUniPlaceholder')}
            />

            {/* Selected Universities List */}
            {universityIds.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-2xs font-bold text-neutral-500">
                  {t('scopesSelector.selectedUnisTitle', {
                    count: universityIds.length,
                  })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {universityIds.map((id) => (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-medium animate-in fade-in"
                    >
                      <School className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedUniLabel[id] || id}</span>
                      {!isDisabled && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUniversity(id)}
                          className="hover:bg-blue-200/60 rounded-full p-0.5 text-blue-600 transition-colors"
                          title={t('scopesSelector.deleteUni')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-amber-800 bg-amber-50/60 rounded-xl border border-amber-200/70">
                {t('scopesSelector.emptyUnis')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Campuses / Faculties Scope Card */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {t('scopesSelector.campusesTitle')}
                </span>
                <span className="text-xs text-neutral-400">
                  {allCampuses
                    ? t('scopesSelector.allCampusesLabel')
                    : t('scopesSelector.allowedCampuses', {
                        count: campusIds.length,
                      })}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t('scopesSelector.campusesDesc')}
              </p>
            </div>
          </div>

          {/* Mode Switch Buttons */}
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleSetCampusMode(false)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !allCampuses
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t('scopesSelector.specificCampuses')}
            </button>
            <button
              type="button"
              onClick={() => handleSetCampusMode(true)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                allCampuses
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              {t('scopesSelector.allCampuses')}
            </button>
          </div>
        </div>

        {allCampuses ? (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900">
            <Globe2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {t('scopesSelector.globalCampusesBanner')}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-neutral-700">
              {t('scopesSelector.searchCampusLabel')}
            </label>
            <SelectCampus
              value={null}
              onChange={(id, item) => handleAddCampus(id, item)}
              isDisabled={isDisabled}
              placeholder={t('scopesSelector.searchCampusPlaceholder')}
            />

            {/* Selected Campuses List */}
            {campusIds.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-2xs font-bold text-neutral-500">
                  {t('scopesSelector.selectedCampusesTitle', {
                    count: campusIds.length,
                  })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {campusIds.map((id) => (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-medium animate-in fade-in"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedCampusLabel[id] || id}</span>
                      {!isDisabled && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCampus(id)}
                          className="hover:bg-emerald-200/60 rounded-full p-0.5 text-emerald-600 transition-colors"
                          title={t('scopesSelector.deleteCampus')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-amber-800 bg-amber-50/60 rounded-xl border border-amber-200/70">
                {t('scopesSelector.emptyCampuses')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Majors Scope Card */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {t('scopesSelector.majorsTitle')}
                </span>
                <span className="text-xs text-neutral-400">
                  {allMajors
                    ? t('scopesSelector.allMajorsLabel')
                    : t('scopesSelector.allowedMajors', {
                        count: majorIds.length,
                      })}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t('scopesSelector.majorsDesc')}
              </p>
            </div>
          </div>

          {/* Mode Switch Buttons */}
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleSetMajorMode(false)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !allMajors
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t('scopesSelector.specificMajors')}
            </button>
            <button
              type="button"
              onClick={() => handleSetMajorMode(true)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                allMajors
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              {t('scopesSelector.allMajors')}
            </button>
          </div>
        </div>

        {allMajors ? (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/60 text-xs text-purple-900">
            <Globe2 className="h-4 w-4 text-purple-600 shrink-0" />
            <span>
              {t('scopesSelector.globalMajorsBanner')}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-neutral-700">
              {t('scopesSelector.searchMajorLabel')}
            </label>
            <SelectMajor
              value={null}
              onChange={(id, item) => handleAddMajor(id, item)}
              isDisabled={isDisabled}
              placeholder={t('scopesSelector.searchMajorPlaceholder')}
            />

            {/* Selected Majors List */}
            {majorIds.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-2xs font-bold text-neutral-500">
                  {t('scopesSelector.selectedMajorsTitle', {
                    count: majorIds.length,
                  })}
                </span>
                <div className="flex flex-wrap gap-2">
                  {majorIds.map((id) => (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-medium animate-in fade-in"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      <span>{selectedMajorLabel[id] || id}</span>
                      {!isDisabled && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMajor(id)}
                          className="hover:bg-purple-200/60 rounded-full p-0.5 text-purple-600 transition-colors"
                          title={t('scopesSelector.deleteMajor')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-amber-800 bg-amber-50/60 rounded-xl border border-amber-200/70">
                {t('scopesSelector.emptyMajors')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScopesSelector;
