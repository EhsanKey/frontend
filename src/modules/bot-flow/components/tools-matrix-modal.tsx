'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Search, Wrench, Sparkles, Check, Database } from 'lucide-react';

interface ToolsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MatrixItem {
  intent: string;
  intentTitle: string;
  tool: string | null;
  toolTitle: string;
  inputs: string;
  tables: string;
  description: string;
}

export const ToolsMatrixModal = ({ isOpen, onClose }: ToolsMatrixModalProps) => {
  const t = useTranslations('botFlow');
  const [searchTerm, setSearchTerm] = useState('');

  const matrixItems: MatrixItem[] = useMemo(
    () => [
      {
        intent: 'professor_lookup',
        intentTitle: t('matrix.items.professor_lookup.title'),
        tool: 'get_professor_teachings',
        toolTitle: t('matrix.items.professor_lookup.tool'),
        inputs: t('matrix.items.professor_lookup.inputs'),
        tables: t('matrix.items.professor_lookup.tables'),
        description: t('matrix.items.professor_lookup.desc'),
      },
      {
        intent: 'professor_courses',
        intentTitle: t('matrix.items.professor_courses.title'),
        tool: 'get_professor_teachings',
        toolTitle: t('matrix.items.professor_courses.tool'),
        inputs: t('matrix.items.professor_courses.inputs'),
        tables: t('matrix.items.professor_courses.tables'),
        description: t('matrix.items.professor_courses.desc'),
      },
      {
        intent: 'course_professors',
        intentTitle: t('matrix.items.course_professors.title'),
        tool: 'get_course_professors',
        toolTitle: t('matrix.items.course_professors.tool'),
        inputs: t('matrix.items.course_professors.inputs'),
        tables: t('matrix.items.course_professors.tables'),
        description: t('matrix.items.course_professors.desc'),
      },
      {
        intent: 'professor_course_review',
        intentTitle: t('matrix.items.professor_course_review.title'),
        tool: 'get_teaching_details',
        toolTitle: t('matrix.items.professor_course_review.tool'),
        inputs: t('matrix.items.professor_course_review.inputs'),
        tables: t('matrix.items.professor_course_review.tables'),
        description: t('matrix.items.professor_course_review.desc'),
      },
      {
        intent: 'compare_professors_for_course',
        intentTitle: t('matrix.items.compare_professors_for_course.title'),
        tool: 'compare_professors_for_course',
        toolTitle: t('matrix.items.compare_professors_for_course.tool'),
        inputs: t('matrix.items.compare_professors_for_course.inputs'),
        tables: t('matrix.items.compare_professors_for_course.tables'),
        description: t('matrix.items.compare_professors_for_course.desc'),
      },
      {
        intent: 'get_resources',
        intentTitle: t('matrix.items.get_resources.title'),
        tool: 'get_teaching_resources',
        toolTitle: t('matrix.items.get_resources.tool'),
        inputs: t('matrix.items.get_resources.inputs'),
        tables: t('matrix.items.get_resources.tables'),
        description: t('matrix.items.get_resources.desc'),
      },
      {
        intent: 'general_conversation',
        intentTitle: t('matrix.items.general_conversation.title'),
        tool: null,
        toolTitle: t('matrix.noTool'),
        inputs: t('matrix.items.general_conversation.inputs'),
        tables: t('matrix.items.general_conversation.tables'),
        description: t('matrix.items.general_conversation.desc'),
      },
      {
        intent: 'out_of_scope',
        intentTitle: t('matrix.items.out_of_scope.title'),
        tool: null,
        toolTitle: t('matrix.noTool'),
        inputs: t('matrix.items.out_of_scope.inputs'),
        tables: t('matrix.items.out_of_scope.tables'),
        description: t('matrix.items.out_of_scope.desc'),
      },
    ],
    [t],
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return matrixItems;
    const q = searchTerm.toLowerCase();
    return matrixItems.filter(
      (item) =>
        item.intent.toLowerCase().includes(q) ||
        item.intentTitle.includes(q) ||
        (item.tool && item.tool.toLowerCase().includes(q)) ||
        item.description.includes(q),
    );
  }, [matrixItems, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-default-200/60 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-default-200/50 flex items-center justify-between gap-3 bg-default-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-default-900">
                {t('matrix.title')}
              </h2>
              <p className="text-xs text-default-400 mt-0.5">
                {t('matrix.subtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-default-400 hover:text-default-700 hover:bg-default-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-default-200/40 bg-default-50/20">
          <div className="relative">
            <Search className="w-4 h-4 text-default-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('matrix.searchPlaceholder')}
              className="w-full text-xs bg-default-100/70 border border-default-200/60 rounded-xl pr-9 pl-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-xl border border-default-200/80 dark:border-default-700 overflow-hidden">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-default-200/80 dark:bg-default-800 border-b border-default-300 dark:border-default-700 text-default-900 dark:text-default-100 font-bold">
                  <th className="p-3">{t('matrix.intentCol')}</th>
                  <th className="p-3">{t('matrix.toolCol')}</th>
                  <th className="p-3">{t('matrix.parametersCol')}</th>
                  <th className="p-3">{t('matrix.descriptionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-200/60 dark:divide-default-800">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-default-100/60 dark:hover:bg-default-800/50 transition-colors"
                  >
                    <td className="p-3 align-top">
                      <div className="font-bold text-default-950 dark:text-white">
                        {item.intentTitle}
                      </div>
                      <div dir="ltr" className="font-mono text-[10.5px] text-purple-700 dark:text-purple-300 font-semibold mt-0.5">
                        {item.intent}
                      </div>
                    </td>

                    <td className="p-3 align-top">
                      {item.tool ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{item.toolTitle}</span>
                          </div>
                          <div dir="ltr" className="font-mono text-[10.5px] text-default-600 dark:text-default-400 font-medium mt-0.5">
                            {item.tool}
                          </div>
                        </div>
                      ) : (
                        <span className="text-default-500 italic text-[11px] font-medium">
                          {item.toolTitle}
                        </span>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <div
                        dir="ltr"
                        className="font-mono text-[10.5px] font-semibold text-default-900 dark:text-default-100 bg-default-100 dark:bg-default-800 px-2.5 py-1 rounded-md border border-default-300 dark:border-default-700 inline-block"
                      >
                        {item.inputs}
                      </div>
                      <div className="flex items-center gap-1 text-[10.5px] text-default-600 dark:text-default-400 font-medium mt-1">
                        <Database className="w-3 h-3 text-default-500" />
                        <span>{item.tables}</span>
                      </div>
                    </td>

                    <td className="p-3 align-top text-default-800 dark:text-default-200 leading-relaxed text-[11.5px] max-w-xs font-medium">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-default-200/60 dark:border-default-700 bg-default-50/60 dark:bg-default-900/40 flex items-center justify-between text-xs text-default-600 dark:text-default-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('syncNotice.desc')}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-default-200 hover:bg-default-300 text-default-800 font-semibold transition-colors"
          >
            {t('matrix.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
