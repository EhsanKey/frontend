# راهنمای جامع توسعه با قالب بویلرپلیت داشبورد

این راهنما به شما نشان می‌دهد که چگونه بدون نیاز به تغییر در ساختار هسته پروژه، فیچرهای جدید شامل **صفحه جدید**، **سرویس API**، **جدول داده با فیلترها** و **فرم‌های ایجاد/ویرایش** را به سادگی اضافه کنید.

---

## فهرست مطالب
1. [الگوی ماژول سرور (Server Module Pattern)](#۱-الگوی-ماژول-سرور)
2. [نحوه اضافه کردن یک صفحه جدید](#۲-نحوه-اضافه-کردن-یک-صفحه-جدید)
3. [افزودن آیتم جدید به سایدبار و ناوبری](#۳-افزودن-آیتم-جدید-به-سایدبار-و-ناوبری)
4. [تعریف سرویس API جدید (DTO و Mapper)](#۴-تعریف-سرویس-api-جدید)
5. [پیاده‌سازی جدول داده هوشمند با TableContainer](#۵-پیاده‌سازی-جدول-داده-هوشمند)
6. [ایجاد فرم‌های معتبر با React Hook Form و Zod](#۶-ایجاد-فرم‌های-معتبر-با-zod)
7. [کنترل سطح دسترسی و نقش‌ها با RoleGuard](#۷-کنترل-سطح-دسترسی-با-roleguard)

---

## ۱. الگوی ماژول سرور (Server Module Pattern)

در این معماری، قوانین زیر رعایت می‌شوند:
- فایل‌های `src/app/**/page.tsx` بسیار سبک (Thin) هستند و فقط عنوان صفحه (`generateMetadata`)، کنترل دسترسی (`RoleGuard`) و فراخوانی ماژول مربوطه را انجام می‌دهند. **هیچ واکشی داده مستقیمی در page.tsx انجام نمی‌شود.**
- واکشی داده در سطح کامپوننت سروری ماژول (`src/modules/[feature]/index.tsx`) انجام شده و داخل `<Suspense fallback={<FallbackSkeleton />}>` قرار می‌گیرد.
- کلاینت ماژول (`[feature]-client.tsx`) داده‌های اولیه را از طریق `props` دریافت کرده و با `useGetRequest` و `initialData` آن‌ها را کش و مدیریت می‌کند.

---

## ۲. نحوه اضافه کردن یک صفحه جدید

فرض کنید می‌خواهید صفحه‌ای برای **مدیریت محصولات (`products`)** بسازید:

### گام اول: ایجاد پوشه ماژول
در مسیر `src/modules/products/` فایل‌های زیر را بسازید:
- `products.server.ts` (واکشی داده در سرور)
- `products-client.tsx` (نمایش رابط کاربری و استیت‌های کلاینت)
- `index.tsx` (کامپوننت سروری ماژول)

نمونه کد `src/modules/products/index.tsx`:
```tsx
import { connection } from 'next/server';
import { Suspense } from 'react';
import ProductsClient from './products-client';
import { getProductsInitialData } from './products.server';

type ProductsModuleProps = {
  searchParams: Promise<PageSearchParams>;
};

const ProductsModule = async ({ searchParams }: ProductsModuleProps) => {
  await connection();
  const initialData = await getProductsInitialData(await searchParams);

  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />}>
      <ProductsClient {...initialData} />
    </Suspense>
  );
};

export default ProductsModule;
```

### گام دوم: ایجاد روت در App Router
فایل `src/app/(protected)/dashboard/products/page.tsx` را ایجاد کنید:
```tsx
import { ProductsModule } from '@/modules';
import type { Metadata } from 'next';

type PageProps = {
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'مدیریت محصولات',
  };
}

export default function ProductsPage({ searchParams }: PageProps) {
  return <ProductsModule searchParams={searchParams} />;
}
```

---

## ۳. افزودن آیتم جدید به سایدبار و ناوبری

تنها کافی است فایل `src/layouts/app/navigation/dashboard-navigation.ts` را باز کنید و آیتم خود را به آرایه `dashboardNavigation` اضافه نمایید:

```ts
import { ShoppingBag } from 'lucide-react';

export const dashboardNavigation: DashboardNavigationItem[] = [
  // سایر منوها...
  {
    id: 'products',
    labelKey: 'nav.products',
    href: '/dashboard/products',
    icon: ShoppingBag,
    allowedRoles: ['ADMIN'], // در صورتی که فقط برای مدیر باشد
  },
];
```

و در صورت نیاز، عنوان فارسی آن را در `messages/fa/mainLayout.json` زیر کلید `nav` اضافه کنید:
```json
"nav": {
  "products": "مدیریت محصولات"
}
```

---

## ۴. تعریف سرویس API جدید

برای هر حوزه کاری (مثلاً `products`) یک پوشه داخل `src/apis/services/products/` با ساختار زیر ایجاد کنید:

1. **`_dto.ts`**: تعریف تایپ‌های برگشتی و ارسالی سرور:
```ts
export interface ProductDto {
  id: number;
  title: string;
  price: number;
}
```

2. **`_endpoints.ts`**: آدرس‌های اندپوینت:
```ts
export const PRODUCTS_ENDPOINTS = {
  list: '/products',
  detail: (id: number | string) => `/products/${id}` as const,
};
```

3. **`_mappers.ts`**: تبدیل DTO به مدل فرانت:
```ts
import type { ProductDto } from './_dto';

export const toProductModel = (dto: ProductDto) => ({
  id: dto.id,
  title: dto.title,
  price: dto.price,
});
```

4. **`_services.ts`**: ساخت متدهای فراخوانی:
```ts
export function createProductServices(request: ApiRequestFunction, paginatedRequest: ApiPaginatedRequestFunction) {
  return {
    getProducts: (params) => paginatedRequest({ url: PRODUCTS_ENDPOINTS.list, params }),
    getProductById: (id) => request({ url: PRODUCTS_ENDPOINTS.detail(id) }),
  };
}
```

5. **`client.ts` و `server.ts`**:
- در `client.ts` از `clientApiRequest` استفاده کنید.
- در `server.ts` از `serverApiRequest` استفاده کنید.

---

## ۵. پیاده‌سازی جدول داده هوشمند

کامپوننت `TableContainer` در `src/containers/table-container/index.tsx` به صورت آماده در اختیار شماست.

ویژگی‌های کلیدی:
1. تعریف ستون‌ها با `TableHeaderOptions`:
```tsx
const headerCells: TableHeaderOptions[] = [
  { id: 'id', label: 'شناسه', className: 'w-16 text-center' },
  { id: 'title', label: 'نام محصول' },
  { id: 'price', label: 'قیمت' },
  { id: 'actions', label: 'عملیات', className: 'w-24 text-center' },
];
```

2. هماهنگ‌سازی جستجو و صفحه‌بندی با آدرس مرورگر با هوک `useQueryState`:
```tsx
const { values, updateQueries } = useQueryState();

// تغییر صفحه
const onPageChange = (page: number) => {
  updateQueries({ page });
};

// تغییر جستجو
const onSearch = (search: string) => {
  updateQueries({ search: search || null, page: null });
};
```

3. رندر جدول:
```tsx
<TableContainer
  ariaLabel="لیست محصولات"
  headerCells={headerCells}
  items={data.items}
  pagination={data.meta}
  isLoading={isLoading}
  renderCell={(item, columnKey) => {
    if (columnKey === 'title') return item.title;
    if (columnKey === 'price') return `${item.price.toLocaleString()} تومان`;
    return null;
  }}
/>
```

---

## ۶. ایجاد فرم‌های معتبر با Zod

برای ایجاد فرم‌ها با اعتبارسنجی قوی:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Label, Input, FieldError, Button } from '@heroui/react';

const productSchema = z.object({
  title: z.string().min(2, 'نام محصول الزامی است'),
  price: z.number().min(1000, 'حداقل قیمت ۱۰۰۰ تومان است'),
});

type FormValues = z.infer<typeof productSchema>;

export const ProductForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (values: FormValues) => {
    // ارسال با usePostRequest
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField isInvalid={Boolean(errors.title)}>
        <Label>نام محصول</Label>
        <Input {...register('title')} />
        <FieldError>{errors.title?.message}</FieldError>
      </TextField>
      <Button type="submit">ثبت محصول</Button>
    </form>
  );
};
```

---

## ۷. کنترل سطح دسترسی با RoleGuard

برای محدود کردن دسترسی به صفحات یا المان‌های درون صفحه:

```tsx
import { RoleGuard } from '@/components/shared';

// در سطح صفحه:
export default function AdminOnlyPage() {
  return (
    <RoleGuard adminOnly>
      <AdminContent />
    </RoleGuard>
  );
}

// در سطح دکمه یا کامپوننت:
<RoleGuard allowedRoles={['ADMIN']}>
  <Button variant="danger">حذف کل سیستم</Button>
</RoleGuard>
```

---
💡 **پروژه شما اکنون آماده توسعه نامحدود هرگونه داشبورد مدیریتی است!**
