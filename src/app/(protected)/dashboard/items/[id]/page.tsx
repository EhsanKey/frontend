import { ArrowRight, Calendar, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { serverItemServices } from '@/apis/services/items/server';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { formatPersianDate } from '@/utils';
import type { Metadata } from 'next';

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ItemDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('items.detail');
  try {
    const item = await serverItemServices.getItemById(id);
    return {
      title: item.title,
    };
  } catch {
    return {
      title: t('title'),
    };
  }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations('items.detail');
  let item;

  try {
    item = await serverItemServices.getItemById(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.items}
          className="bg-surface hover:bg-neutral-100 flex size-9 items-center justify-center rounded-lg border border-neutral-200 transition-colors"
        >
          <ArrowRight className={ICON_SIZE_CLASS.sm} />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">{item.title}</h1>
          <p className="text-caption text-neutral-500">
            {t('recordId', { id: item.id })}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-neutral-200/80 p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-neutral-500 text-caption">
              <Tag className={ICON_SIZE_CLASS.sm} />
              <span>{t('category')}</span>
            </div>
            <p className="mt-1 font-semibold text-neutral-900">{item.category}</p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-neutral-500 text-caption">
              <Calendar className={ICON_SIZE_CLASS.sm} />
              <span>{t('createdAt')}</span>
            </div>
            <p className="mt-1 font-semibold text-neutral-900">
              {formatPersianDate(item.createdAt)}
            </p>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-neutral-500 text-caption">
              <User className={ICON_SIZE_CLASS.sm} />
              <span>{t('creator')}</span>
            </div>
            <p className="mt-1 font-semibold text-neutral-900">
              {item.authorName || t('system')}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-title font-bold text-neutral-900 mb-2">
            {t('description')}
          </h2>
          <p className="text-body-sm text-neutral-600 leading-relaxed">
            {item.description || t('noDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
