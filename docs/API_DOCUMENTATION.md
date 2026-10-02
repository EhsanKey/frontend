# مستندات جامع REST API پلتفرم دستیار دانشگاهی (نسخه ۱.۱.۰)

> ویژه تیم توسعه فرانت‌اند (Next.js / React)

این مستندات شامل تمامی اطلاعات مورد نیاز برای اتصال داشبورد فرانت‌اند به بک‌اند سیستم است، از جمله ساختار استاندارد درخواست/پاسخ، احراز هویت با JWT، کنترل دسترسی مبتنی بر نقش (RBAC)، اندپوینت‌های مانیتورینگ خطا، تحلیل آمار و صرفه‌جویی توکن، مدیریت بازخوردها و منابع، و ره‌گیری سوالات دانشجویان.

---

## ۱. اطلاعات کلی سرور و اتصال (Connection & CORS)

- **آدرس پایه در محیط لوکال:** `http://localhost:3001` (یا پورت تعریف‌شده در `API_PORT`)
- **محیط تعاملی Swagger OpenAPI:** `http://localhost:3001/docs` (شامل دکمه Authorize برای JWT Bearer، پارامترهای صفحه‌بندی `page`/`pageSize`/`limit`/`offset`، شمای بدنه درخواست‌ها و تست زنده اندپوینت‌ها)
- **پشتیبانی از CORS:** تمامی اندپوینت‌ها از `Origin` دلخواه (تنظیم‌شده در `CORS_ORIGIN` یا باز `*`) و متدهای `GET, POST, PUT, PATCH, DELETE, OPTIONS` به همراه `Credentials: true` پشتیبانی می‌کنند.

---

## ۲. ساختار استاندارد پاسخ‌ها (Standard Response Envelope)

تمامی پاسخ‌های سرور از یک ساختار ثابت و پیش‌بینی‌پذیر پیروی می‌کنند:

### الف) پاسخ موفق (Success Envelope)

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 120,
    "page": 1,
    "pageSize": 25,
    "totalPages": 5
  },
  "total": 120,
  "page": 1,
  "pageSize": 25,
  "totalPages": 5
}
```

> **قرارداد جامع صفحه‌بندی و جستجو در سواگر:**
> تمام اندپوینت‌های `/api/v1` که خروجی لیست بازمی‌گردانند، از پارامترهای زیر در Query پشتیبانی می‌کنند:
>
> - `page`: شماره صفحه (عدد صحیح مثبت، پیش‌فرض: ۱)
> - `pageSize`: تعداد آیتم در هر صفحه (حداکثر ۱۰۰، پیش‌فرض: ۲۵)
> - `search` یا `q`: عبارت جستجو در فیلدهای نام، عنوان، متن و رکوردهای وابسته
> - فیلترهای اختصاصی هر موجودیت (مانند `universityId`, `campusId`, `majorId`, `status`, `scope`, `degreeLevel` و ...)
>
> خروجی لیست همواره شامل شیء استاندارد `meta` (حاوی `total`, `page`, `pageSize`, `totalPages`) و داده‌های فیلترشده در آرایه `data` است. همچنین جهت سهولت فرانت‌اند، فیلدهای `total` و `page` در ریشه پاسخ نیز در دسترس هستند.

### ب) پاسخ خطا (Error Envelope)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "اطلاعات ورودی نامعتبر است.",
    "details": [
      {
        "path": ["username"],
        "message": "نام کاربری الزامی است"
      }
    ]
  }
}
```

### کدهای خطای استاندارد (`error.code`):

| کد خطا                  | وضعیت HTTP         | توضیح                                                                    |
| :---------------------- | :----------------- | :----------------------------------------------------------------------- |
| `VALIDATION_ERROR`      | `400 Bad Request`  | فیلدهای ورودی طبق شمای Zod نامعتبر هستند. جزئیات در `details` قرار دارد. |
| `UNAUTHORIZED`          | `401 Unauthorized` | توکن JWT ارسال نشده، منقضی شده یا نامعتبر است.                           |
| `FORBIDDEN`             | `403 Forbidden`    | کاربر به سطح دسترسی (Permission) مربوطه دسترسی ندارد.                    |
| `NOT_FOUND`             | `404 Not Found`    | رکوردی با شناسه درخواستی یافت نشد.                                       |
| `CONFLICT`              | `409 Conflict`     | رکورد تکراری است (مثلاً نام کاربری یا نقش تکراری).                       |
| `DATABASE_ERROR`        | `400/409`          | خطای یکپارچگی یا قیدهای پایگاه داده.                                     |
| `INTERNAL_SERVER_ERROR` | `500 Server Error` | خطای غیرمنتظره در سرور.                                                  |

---

## ۳. سیستم احراز هویت و دسترسی‌ها (Auth & RBAC)

تمامی اندپوینت‌های محافظت‌شده نیازمند هدر زیر هستند:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

### الف) سطوح دسترسی سیستم (Granular Permissions):

سیستم از مدل کنترل دسترسی مبتنی بر مجوزهای خرد و نقش‌ها (RBAC) پشتیبانی می‌کند. علاوه‌بر دسترسی‌های دامنه‌ای (`*:manage`)، مجوزهای ریزدانه‌ای به شرح زیر قابل تفویض هستند:

| کد دسترسی                                | توضیح کاربردی                                              |
| :--------------------------------------- | :--------------------------------------------------------- |
| `teachings:create`                       | ثبت تدریس جدید برای یک استاد و درس                         |
| `teachings:update`                       | ویرایش مشخصات تدریس                                        |
| `teachings:delete`                       | حذف تدریس                                                  |
| `professors:create`                      | تعریف استاد جدید                                           |
| `professors:update`                      | ویرایش مشخصات و نام استاد                                  |
| `professors:delete`                      | حذف استاد                                                  |
| `professors:merge`                       | ادغام دو استاد تکراری یا مشابه                             |
| `courses:create`                         | تعریف درس جدید                                             |
| `courses:update`                         | ویرایش نام و مشخصات درس                                    |
| `courses:delete`                         | حذف درس                                                    |
| `courses:merge`                          | ادغام دو درس تکراری                                        |
| `universities:create`                    | ثبت دانشگاه جدید                                           |
| `universities:update`                    | ویرایش دانشگاه                                             |
| `universities:delete`                    | حذف دانشگاه                                                |
| `campuses:create`                        | ثبت دانشکده / واحد جدید                                    |
| `campuses:update`                        | ویرایش دانشکده / واحد                                      |
| `campuses:delete`                        | حذف دانشکده / واحد                                         |
| `majors:create`                          | ثبت رشته تحصیلی جدید                                       |
| `majors:update`                          | ویرایش رشته تحصیلی                                         |
| `majors:delete`                          | حذف رشته تحصیلی                                            |
| `reviews:read`                           | مشاهده لیست و جزئیات بازخوردهای ارسال‌شده دانشجویان        |
| `reviews:create`                         | ثبت مستقیم نظر برای تدریس                                  |
| `reviews:update`                         | ویرایش متن یا مشخصات نظر                                   |
| `reviews:status` / `reviews:approve`     | تایید، رد یا تغییر وضعیت بازخوردها                         |
| `reviews:delete`                         | حذف بازخورد یا نظر                                         |
| `resources:read`                         | مشاهده لیست و جزئیات فایل‌ها و نمونه‌سوالات ارسالی         |
| `resources:create`                       | ثبت مستقیم منبع یا جزوه                                    |
| `resources:update`                       | ویرایش اطلاعات منبع                                        |
| `resources:status` / `resources:approve` | تایید، رد یا انتشار منابع در کانال تلگرام                  |
| `resources:delete`                       | حذف فایل یا منبع ارسالی                                    |
| `audit_logs:read`                        | مشاهده و جستجو در لاگ‌های حسابرسی و عملیات ادمین‌ها        |
| `groups:manage`                          | مدیریت تنظیمات گروه‌های تلگرامی پشتیبانی‌شده               |
| `errors:read`                            | دسترسی به لاگ خطاهای بات و سیستم هوش مصنوعی                |
| `errors:resolve`                         | تغییر وضعیت خطا به «بررسی‌شده / حل‌شده»                    |
| `inquiries:read`                         | مشاهده آمار سوالات دانشجویان درباره اساتید                 |
| `inquiries:trigger`                      | فعال‌سازی دستی کمپین پیام‌های پیگیری ۳ ماهه                |
| `analytics:read`                         | دسترسی به داشبورد آمار، عملکرد کش و توکن‌های صرفه‌جویی‌شده |
| `cache:read`                             | مشاهده لیست کش پاسخ‌های هوش مصنوعی، متن‌ها و آمار          |
| `cache:manage`                           | حذف، ابطال و پاک‌سازی کش پاسخ‌های هوش مصنوعی               |
| `admins:manage`                          | ساخت، ویرایش و مدیریت دسترسی‌های ادمین‌های پنل             |
| `roles:manage`                           | تعریف نقش‌های جدید و انتساب دسترسی‌ها                      |

> **نکته:** مجوزهای جامع با پسوند `:manage` (مانند `teachings:manage`, `professors:manage`, `courses:manage`, `reviews:manage`, `resources:manage`) به صورت خودکار شامل تمام مجوزهای خرد همان دامنه (create, update, delete, merge, status) می‌باشند.

### ب) کنترل محدوده دسترسی چندبُعدی (Multi-dimensional Scoping - ABAC):

علاوه بر داشتن مجوز انجام یک عملیات (مثلاً `teachings:create` یا `reviews:status`)، عملیات ادمین باید در **محدوده جغرافیایی و تحصیلی مجاز** وی قرار داشته باشد. ادمین اصلی (Super Admin) می‌تواند برای هر کاربر ادمین، محدوده‌های دسترسی زیر را تعیین کند:

```json
{
  "allUniversities": false,
  "universityIds": ["uni-uuid-1", "uni-uuid-2"],
  "allCampuses": true,
  "campusIds": [],
  "allMajors": false,
  "majorIds": ["major-uuid-1"]
}
```

#### نحوه اعمال محدوده‌ها در بخش‌های مختلف:

1. **مدیریت تدریس‌ها (`/api/v1/academic/teachings`):**
   - برای افزودن، ویرایش یا حذف تدریس، سیستم ابتدا مجوز ادمین (`teachings:create/update/delete`) را بررسی می‌کند.
   - سپس بررسی می‌شود که آیا دانشگاهِ دانشکده انتخابی در محدوده مجاز ادمین هست یا خیر.
   - همچنین واحد/دانشکده انتخابی و رشته تحصیلی تدریس با محدوده‌های مجاز ادمین تطبیق داده می‌شوند. در صورت عدم تطابق، خطای `403 Forbidden` با پیام دقیق بازگردانده می‌شود.
2. **بررسی بازخوردها و نظرات دانشجویان (`/api/v1/moderation/reviews`):**
   - ادمین تنها مجاز به مشاهده، تایید (`approve`)، رد (`reject`)، ویرایش یا حذف نظراتی است که دانشگاه، واحد و رشتهٔ مربوط به آن بازخورد در محدوده تعریف‌شده برای وی قرار داشته باشد.
3. **بررسی و انتشار منابع و جزوات (`/api/v1/moderation/resources`):**
   - منابع مربوط به تدریس‌هایی که در محدوده دانشگاهی ادمین نیستند، برای وی قابل تایید، رد یا حذف نخواهند بود.
4. **سوپرادمین (`super_admin` یا `isSuperAdmin: true`):**
   - بدون هیچ‌گونه قید و محدودیتی به تمام دانشگاه‌ها، واحدها و رشته‌ها و تمام اندپوینت‌های سیستم دسترسی کامل دارد.

> کاربر اولیه با نام کاربری `admin` و رمز `admin` به صورت خودکار دارای نقش `super_admin` و تمامی دسترسی‌ها و محدوده‌های سراسری است.

---

## ۴. لیست کامل اندپوینت‌ها (API Endpoints)

---

### ۴.۱. احراز هویت و مدیریت کاربران (`/api/v1/auth`)

#### ۱. ورود به سیستم (Login)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/login`
- **دسترسی:** عمومی
- **بدنه درخواست:**

```json
{
  "username": "admin",
  "password": "admin"
}
```

- **نمونه پاسخ موفق (200 OK):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c1f7b8e2-...",
      "username": "admin",
      "email": "admin@chikobot.ir",
      "name": "مدیر ارشد سیستم",
      "isActive": true,
      "isSuperAdmin": true,
      "roles": ["super_admin"],
      "permissions": [
        "reviews:read",
        "reviews:approve",
        "resources:read",
        "resources:approve",
        "professors:manage",
        "courses:manage",
        "groups:manage",
        "errors:read",
        "errors:resolve",
        "inquiries:read",
        "inquiries:trigger",
        "analytics:read",
        "admins:manage",
        "roles:manage"
      ],
      "createdAt": "2026-09-24T05:00:00.000Z"
    }
  }
}
```

#### ۲. مشخصات کاربر جاری (Current Profile)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/me`
- **دسترسی:** نیاز به توکن
- **نمونه پاسخ موفق (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "c1f7b8e2-...",
    "username": "admin",
    "email": "admin@chikobot.ir",
    "name": "مدیر ارشد سیستم",
    "isActive": true,
    "isSuperAdmin": true,
    "roles": ["super_admin"],
    "permissions": ["..."],
    "createdAt": "2026-09-24T05:00:00.000Z"
  }
}
```

#### ۳. لیست کاربران پنل (List Admin Users)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/users`
- **دسترسی:** نیازمند دسترسی `admins:manage` یا `super_admin`
- **پارامترهای Query (اختیاری):**
  - `page`: شماره صفحه (پیش‌فرض ۱)
  - `pageSize`: تعداد در هر صفحه (پیش‌فرض ۵۰، حداکثر ۱۰۰)
  - `search` یا `q`: جستجو در نام، نام کاربری یا ایمیل
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": [
    {
      "id": "usr-1",
      "username": "moderator1",
      "name": "مسئول بررسی محتوا",
      "email": "mod@example.com",
      "isActive": true,
      "isSuperAdmin": false,
      "roles": ["moderator"],
      "permissions": ["reviews:read", "reviews:approve"],
      "createdAt": "2026-09-24T06:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 50,
    "totalPages": 1
  }
}
```

#### ۴. ایجاد ادمین جدید با دسترسی‌ها و محدوده‌ها (Create Admin User)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/users`
- **دسترسی:** فقط `super_admin`
- **بدنه درخواست:**

```json
{
  "username": "tehran_admin",
  "name": "ادمین دانشگاه تهران",
  "displayName": "ادمین دانشکده فنی و نرم‌افزار",
  "password": "SecurePassword123!",
  "email": "tehran_admin@example.com",
  "roleIds": ["role-uuid-1"],
  "permissions": [
    "teachings:create",
    "teachings:update",
    "reviews:read",
    "reviews:status"
  ],
  "scopes": {
    "allUniversities": false,
    "universityIds": ["uni-uuid-tehran"],
    "allCampuses": true,
    "campusIds": [],
    "allMajors": false,
    "majorIds": ["major-uuid-soft-eng"]
  }
}
```

- **وضعیت پاسخ:** `201 Created`
- **نمونه داده خروجی:** شامل شناسه کاربر، نام، دسترسی‌های مستقیم و شیء کامل `scopes`.

#### ۵. ویرایش ادمین و به‌روزرسانی دسترسی‌ها و محدوده‌ها (Update Admin User)

- **متد:** `PUT`
- **آدرس:** `/api/v1/auth/users/:id`
- **دسترسی:** فقط `super_admin`
- **بدنه درخواست:** تمام فیلدها اختیاری بوده و موارد ارسال‌شده به‌روزرسانی می‌شوند:

```json
{
  "name": "نام اصلاح‌شده",
  "email": "new_email@example.com",
  "password": "NewSecurePassword123!",
  "isActive": true,
  "roleIds": ["role-uuid-1"],
  "permissions": ["teachings:create", "teachings:update", "teachings:delete"],
  "scopes": {
    "allUniversities": false,
    "universityIds": ["uni-uuid-tehran", "uni-uuid-sharif"],
    "allCampuses": false,
    "campusIds": ["campus-uuid-fanni"],
    "allMajors": true,
    "majorIds": []
  }
}
```

- **وضعیت پاسخ:** `200 OK`

#### ۶. مشخصات کاربر با شناسه (Get User By ID)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/users/:id`
- **دسترسی:** `admins:manage` یا `super_admin`
- **وضعیت پاسخ:** `200 OK` (حاوی نقش‌ها، مجوزهای انتسابی و مستقیم، و محدوده‌ها)

#### ۷. لیست نقش‌ها (List Roles)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/roles`
- **دسترسی:** `roles:manage`
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": [
    {
      "id": "role-1",
      "name": "content_manager",
      "description": "مدیر محتوا و منابع",
      "permissions": [
        "reviews:read",
        "reviews:approve",
        "resources:read",
        "resources:approve"
      ]
    }
  ]
}
```

#### ۸. ایجاد نقش جدید (Create Role)

- **متد:** `POST`
- **آدرس:** `/api/v1/auth/roles`
- **دسترسی:** `roles:manage`
- **بدنه درخواست:**

```json
{
  "name": "data_entry",
  "description": "ثبت اساتید و دروس",
  "permissionCodes": ["professors:manage", "courses:manage"]
}
```

- **وضعیت پاسخ:** `201 Created`

#### ۹. دریافت کلیه دسترسی‌های سیستمی (List Permissions)

- **متد:** `GET`
- **آدرس:** `/api/v1/auth/permissions`
- **دسترسی:** نیاز به توکن
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": [
    {
      "id": "p-1",
      "code": "reviews:read",
      "description": "مشاهده نظرات ارسال‌شده"
    },
    {
      "id": "p-2",
      "code": "reviews:approve",
      "description": "تایید یا رد نظرات"
    }
  ]
}
```

---

### ۴.۲. پایش و ره‌گیری خطاهای سیستم (`/api/v1/admin/errors`)

#### ۱. دریافت لیست خطاها با فیلتر پیشرفته (List Logged Errors)

- **متد:** `GET`
- **آدرس:** `/api/v1/admin/errors`
- **دسترسی:** `errors:read`
- **پارامترهای Query (اختیاری):**
  - `source`: فیلتر بر اساس مبدا: `ai_planner` | `ai_answer` | `database` | `internal_tool` | `telegram` | `system`
  - `level`: فیلتر بر اساس سطح: `error` | `warning` | `fatal`
  - `isResolved`: `true` یا `false`
  - `search`: جستجوی متنی در پیام یا Stack trace خطا
  - `limit`: تعداد در هر صفحه (پیش‌فرض 25، حداکثر 100)
  - `offset`: آفست شروع (پیش‌فرض 0)
- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "err-101",
      "source": "ai_answer",
      "level": "error",
      "message": "AI generation timeout after 12000ms",
      "stack": "Error: AI generation timeout\n    at AnswerGenerator...",
      "context": {
        "userId": "109283",
        "chatId": "-1001928374",
        "intent": "compare_professors_for_course",
        "professors": ["حسن حسنی", "علی محمدی"]
      },
      "isResolved": false,
      "resolvedAt": null,
      "resolvedBy": null,
      "createdAt": "2026-09-24T07:15:30.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 25,
    "offset": 0,
    "totalPages": 1
  }
}
```

#### ۲. حل و بستن خطا (Resolve Error)

- **متد:** `PATCH`
- **آدرس:** `/api/v1/admin/errors/:id/resolve`
- **دسترسی:** `errors:resolve`
- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "err-101",
    "isResolved": true,
    "resolvedAt": "2026-09-24T08:00:00.000Z",
    "resolvedBy": "admin"
  }
}
```

---

### ۴.۳. ره‌گیری پرسش‌های اساتید و کمپین فالوآپ ۳ ماهه (`/api/v1/admin/inquiries`)

هنگامی که دانشجویان در گروه‌ها یا پی‌وی ربات درباره استادی سوال می‌پرسند، سوال آن‌ها ثبت می‌شود. پس از گذشت ۹۰ روز (یک ترم تحصیلی)، این دانشجویان واجد شرایط دریافت پیام نظرخواهی می‌شوند.

#### ۱. دریافت لیست دانشجویان واجد شرایط فالوآپ (Eligible Inquiries)

- **متد:** `GET`
- **آدرس:** `/api/v1/admin/inquiries/eligible`
- **دسترسی:** `inquiries:read`
- **پارامترهای Query (اختیاری):**
  - `limit`: تعداد آیتم‌ها (پیش‌فرض 50)
  - `offset`: آفست صفحه‌بندی
  - `onlyEligible`: پیش‌فرض `true` (فقط مواردی که ۹۰ روز از تاریخ آن‌ها گذشته است)
- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "inquiry": {
        "id": "inq-12",
        "telegramUserId": "12345678",
        "professorId": "prof-1",
        "professorName": "دکتر حسنی",
        "courseName": "ریاضی ۱",
        "channel": "group",
        "telegramChatId": "-1002345678",
        "inquiredAt": "2026-06-20T10:00:00.000Z",
        "followUpEligibleAt": "2026-09-18T10:00:00.000Z",
        "notificationStatus": "pending",
        "notificationSentAt": null
      },
      "user": {
        "id": "12345678",
        "username": "student_account",
        "firstName": "رضا",
        "lastName": "احمدی"
      },
      "professor": {
        "id": "prof-1",
        "name": "حسن حسنی"
      },
      "course": {
        "id": "course-1",
        "name": "ریاضی ۱"
      }
    }
  ],
  "meta": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "totalPages": 1
  }
}
```

#### ۲. ارسال دستی نوتیفیکیشن پیگیری تلگرامی (Trigger Follow-Up Notifications)

- **متد:** `POST`
- **آدرس:** `/api/v1/admin/inquiries/trigger-notifications`
- **دسترسی:** `inquiries:trigger`
- **بدنه درخواست (اختیاری):**

```json
{
  "inquiryIds": ["inq-12"],
  "customMessage": "سلام رضا جان! حدود ۳ ماه پیش درباره دکتر حسنی پرسیده بودی. اگر این ترم با ایشون کلاس داشتی، ممنون می‌شیم نظرت رو ثبت کنی 👇"
}
```

_(در صورت خالی بودن `inquiryIds`، به تمامی موارد واجد شرایط جاری با پیام استاندارد و دکمه شیشه‌ای ثبت نظر ارسال می‌شود)_

- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": {
    "triggeredCount": 1,
    "sentInquiryIds": ["inq-12"],
    "failedCount": 0
  }
}
```

---

### ۴.۴. داشبورد و آمار تحلیلی (`/api/v1/admin/analytics`)

#### ۱. نمای کلی آمار سیستم و عملکرد هوش مصنوعی (Analytics Overview)

- **متد:** `GET`
- **آدرس:** `/api/v1/admin/analytics/overview`
- **دسترسی:** `analytics:read`
- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": {
    "caching": {
      "totalEntries": 45,
      "totalHits": 312,
      "estimatedTokensSaved": 374400
    },
    "errors": {
      "total": 8,
      "unresolved": 2
    },
    "submissions": {
      "reviews": {
        "total": 150,
        "pending": 12,
        "approved": 130
      },
      "resources": {
        "total": 80,
        "pending": 5,
        "approved": 70
      }
    },
    "inquiries": {
      "total": 450,
      "pendingFollowUps": 38
    }
  }
}
```

#### ۲. اساتید پرمخاطب و کمبود اطلاعات (Professor Analytics)

- **متد:** `GET`
- **آدرس:** `/api/v1/admin/analytics/professors?limit=10`
- **دسترسی:** `analytics:read`
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": {
    "topInquired": [
      {
        "professorId": "p-1",
        "professorName": "دکتر حسنی",
        "inquiryCount": 85
      }
    ],
    "missingCoverage": [
      {
        "professorId": "p-9",
        "professorName": "دکتر رضوانی",
        "inquiryCount": 42,
        "reviewCount": 0
      }
    ]
  }
}
```

---

### ۴.۵. مدیریت بازخوردها و منابع ارسالی (`/api/v1/moderation` و `/admin-data`)

تمامی موجودیت‌های این بخش به صورت شیءهای تودرتو و استاندارد (`Nested Domain Objects`) بازگردانده می‌شوند تا فرانت‌اند نیازی به پردازش فیلدهای فلت نداشته باشد.

#### بازخوردها (Review Submissions):

- **لیست بازخوردها:** `GET /api/v1/moderation/reviews` (یا مسیر سنتی `GET /admin-data/review-submissions`)
  - پارامترها: `status` (`pending` | `approved` | `rejected`), `page`, `pageSize`, `q`, `universityId`, `campusId`, `majorId`, `professorId`, `courseId`, `courseCategory`, `degreeLevel`
- **مشاهده جزئیات بازخورد با شناسه:** `GET /api/v1/moderation/reviews/:id`
- **ویرایش مشخصات بازخورد قبل از تایید:** `PATCH /api/v1/moderation/reviews/:id`
  - بدنه: فیلدهای قابل اصلاح مانند `professorId`, `courseId`, `degreeLevels`, `content`
- **تایید نهایی بازخورد:** `POST /api/v1/moderation/reviews/:id/approve`
  - _نکته کلیدی: با تایید بازخورد، کش پاسخ‌های هوش مصنوعی مرتبط با این استاد به صورت خودکار باطل می‌شود تا پاسخ‌های بعدی بات به‌روز باشند._
- **رد بازخورد:** `POST /api/v1/moderation/reviews/:id/reject`
  - بدنه: `{ "reason": "علت رد" }`
- **حذف بازخورد:** `DELETE /api/v1/moderation/reviews/:id`

##### ساختار بازگشتی آبجکت بازخورد (Clean Domain Object):

```json
{
  "id": "uuid",
  "status": "pending",
  "content": "استاد بسیار مسلط و با حوصله هستند.",
  "courseCategory": "specialized",
  "degreeLevels": ["bachelor"],
  "rejectionReason": null,
  "createdAt": "2026-09-24T12:00:00.000Z",
  "updatedAt": "2026-09-24T12:00:00.000Z",
  "university": {
    "id": "uuid",
    "name": "دانشگاه صنعتی شریف"
  },
  "campus": {
    "id": "uuid",
    "name": "دانشکده کامپیوتر"
  },
  "major": {
    "id": "uuid",
    "name": "مهندسی نرم‌افزار"
  },
  "professor": {
    "id": "uuid",
    "name": "دکتر علوی",
    "isNew": false
  },
  "course": {
    "id": "uuid",
    "name": "ساختمان داده‌ها",
    "isNew": false
  },
  "user": {
    "id": "tg-12345",
    "displayName": "علی رضایی",
    "username": "ali_rezaei",
    "firstName": "علی",
    "lastName": "رضایی"
  }
}
```

#### منابع و جزوات (Resource Submissions):

- **لیست منابع:** `GET /api/v1/moderation/resources` (یا `GET /admin-data/resource-submissions`)
  - پارامترها: `status`, `resourceKind` (`lecture_note` | `exam_sample`), `page`, `pageSize`, `q`
- **مشاهده جزئیات منبع با شناسه:** `GET /api/v1/moderation/resources/:id`
- **ویرایش منبع:** `PATCH /api/v1/moderation/resources/:id`
- **تایید و انتشار در کانال:** `POST /api/v1/moderation/resources/:id/approve`
- **رد منبع:** `POST /api/v1/moderation/resources/:id/reject`
- **حذف منبع:** `DELETE /api/v1/moderation/resources/:id`

##### ساختار آبجکت منبع ارسالی:

```json
{
  "id": "uuid",
  "status": "pending",
  "resourceKind": "lecture_note",
  "degreeLevel": "bachelor",
  "courseCategory": "specialized",
  "rejectionReason": null,
  "createdAt": "2026-09-24T12:00:00.000Z",
  "updatedAt": "2026-09-24T12:00:00.000Z",
  "fileCount": 1,
  "files": [
    {
      "id": "uuid",
      "fileType": "document",
      "telegramFileId": "BAACAgQAAxkBA...",
      "checkMessageId": "123",
      "publishedMessageId": null
    }
  ],
  "university": { "id": "uuid", "name": "دانشگاه صنعتی شریف" },
  "campus": { "id": "uuid", "name": "دانشکده کامپیوتر" },
  "major": { "id": "uuid", "name": "مهندسی نرم‌افزار" },
  "professor": { "id": "uuid", "name": "دکتر علوی", "isNew": false },
  "course": { "id": "uuid", "name": "ساختمان داده‌ها", "isNew": false },
  "user": {
    "id": "tg-12345",
    "displayName": "علی رضایی",
    "username": "ali_rezaei"
  }
}
```

---

### ۴.۶. ساختار پایه دانشگاهی (Academic Data)

تمامی موجودیت‌های آکادمیک هم در مسیر استاندارد RESTful `/api/v1/academic/*` و هم در مسیرهای اصلی در دسترس هستند:

| موجودیت      | مسیر مدرن v1                    | پارامترهای صفحه‌بندی و جستجو در Swagger | فیلترهای اختصاصی در Swagger                                                                                   |
| :----------- | :------------------------------ | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| دانشگاه‌ها   | `/api/v1/academic/universities` | `page`, `pageSize`, `search`, `q`       | —                                                                                                             |
| دانشکده‌ها   | `/api/v1/academic/campuses`     | `page`, `pageSize`, `search`, `q`       | `universityId`                                                                                                |
| اساتید       | `/api/v1/academic/professors`   | `page`, `pageSize`, `search`, `q`       | —                                                                                                             |
| دروس         | `/api/v1/academic/courses`      | `page`, `pageSize`, `search`, `q`       | —                                                                                                             |
| رشته‌ها      | `/api/v1/academic/majors`       | `page`, `pageSize`, `search`, `q`       | —                                                                                                             |
| تدریس‌ها     | `/api/v1/academic/teachings`    | `page`, `pageSize`, `search`, `q`       | `universityId`, `campusId`, `majorId`, `professorId`, `courseId`, `degreeLevel`                               |
| نظرات مستقیم | `/api/v1/academic/reviews`      | `page`, `pageSize`, `search`, `q`       | `teachingId`, `universityId`, `campusId`, `majorId`, `professorId`, `courseId`, `degreeLevel`                 |
| منابع مستقیم | `/api/v1/academic/resources`    | `page`, `pageSize`, `search`, `q`       | `teachingId`, `universityId`, `campusId`, `majorId`, `professorId`, `courseId`, `degreeLevel`, `resourceKind` |

> کلیه اندپوینت‌های فوق در سواگر ساختار خروجی استاندارد با فیلد `data` و شیء `meta` حاوی `total`, `page`, `pageSize`, `totalPages` دارند. جستجو در `search` یا `q` به صورت هوشمند روی نام فارسی و نام نرمال‌شده انجام می‌پذیرد.

#### ساختار دانشگاه (University Object with Campuses Count):

پاسخ لیست و جزئیات دانشگاه‌ها (`/api/v1/academic/universities`) علاوه بر اطلاعات پایه و نرمال‌شده، شامل **تعداد واحدهای فعال** آن دانشگاه (`campusesCount` و نام مستعار `campusCount`) است:

```json
{
  "id": "63af8cb7-cb79-4b69-8fd2-5383e491df0e",
  "name": "دانشگاه آزاد اسلامی",
  "normalizedName": "دانشگاه آزاد اسلامی",
  "campusesCount": 3,
  "campusCount": 3
}
```

#### ساختار دانشکده / واحد (Campus Object with Majors Count):

پاسخ لیست و جزئیات دانشکده‌ها (`/api/v1/academic/campuses`) علاوه بر اطلاعات دانشگاه مرجع، شامل **تعداد رشته‌های فعال آن واحد** (`majorsCount` و نام مستعار `majorCount`) است:

```json
{
  "id": "e4088287-853e-49e1-9782-0a2762cb1a9f",
  "name": "واحد تهران مرکز",
  "normalizedName": "واحد تهران مرکز",
  "universityId": "63af8cb7-cb79-4b69-8fd2-5383e491df0e",
  "majorsCount": 8,
  "majorCount": 8,
  "university": {
    "id": "63af8cb7-cb79-4b69-8fd2-5383e491df0e",
    "name": "دانشگاه آزاد اسلامی"
  }
}
```

#### ساختار تدریس (Teaching Object):

پاسخ اندپوینت تدریس‌ها (`/api/v1/academic/teachings`) شامل اطلاعات کامل اتصال موجودیت‌ها است:

```json
{
  "id": "uuid",
  "degreeLevel": "bachelor",
  "professor": { "id": "uuid", "name": "دکتر علوی" },
  "course": { "id": "uuid", "name": "ساختمان داده‌ها" },
  "campus": {
    "id": "uuid",
    "name": "دانشکده کامپیوتر",
    "university": { "id": "uuid", "name": "دانشگاه صنعتی شریف" }
  },
  "major": { "id": "uuid", "name": "مهندسی نرم‌افزار" }
}
```

#### ادغام رکوردهای تکراری (Merge Duplicate Records):

هنگامی که دو استاد یا دو درس با اسامی مشابه به اشتباه ایجاد شده‌اند:

- **متد:** `POST`
- **آدرس:** `/api/v1/academic/<entity>/:id/merge` (شناسه مبدا در URL قرار می‌گیرد)
- **بدنه درخواست:**

```json
{
  "targetId": "uuid-of-target-canonical-record"
}
```

تمام تدریس‌ها، نظرات، منابع و پرسش‌های رکورد مبدا به رکورد مقصد منتقل شده و رکورد مبدا بدون خطا حذف می‌گردد.

---

### ۴.۷. مدیریت تلگرام (`/api/v1/telegram` و `/admin-data`)

این اندپوینت‌ها برای مانیتورینگ کاربران، گروه‌های تلگرامی و مکالمات زنده بات تلگرام طراحی شده‌اند.

#### کاربران تلگرام (Telegram Users):

- **لیست کاربران:** `GET /api/v1/telegram/users` (یا `GET /admin-data/telegram-users`)
  - پارامترها: `page` (پیش‌فرض ۱), `pageSize` (پیش‌فرض ۵۰), `search` (جستجو در یوزرنیم و نام)
- **مشاهده مشخصات یک کاربر:** `GET /api/v1/telegram/users/:id`
- **نمونه ساختار بازگشتی کاربر:**

```json
{
  "id": "123456789",
  "displayName": "علی رضایی",
  "username": "ali_rezaei",
  "firstName": "علی",
  "lastName": "رضایی",
  "isBot": false,
  "spamViolationCount": 0,
  "spamBlockedUntil": null,
  "spamUpdatedAt": null,
  "createdAt": "2026-09-20T10:00:00.000Z",
  "updatedAt": "2026-09-24T14:30:00.000Z"
}
```

#### گروه‌های تلگرام (Telegram Group Configs):

- **لیست گروه‌ها:** `GET /api/v1/telegram/groups` (یا `GET /admin-data/group-configs`)
  - پارامترها: `page` (پیش‌فرض ۱), `pageSize` (پیش‌فرض ۵۰), `search` یا `q` (جستجو در نام دانشگاه، دانشکده و عنوان چت), `universityId`, `campusId`, `majorId`, `degreeLevel`, `isEnabled`
- **مشاهده مشخصات گروه:** `GET /api/v1/telegram/groups/:id`
- **نمونه ساختار گروه (دارای موجودیت‌های تودرتوی حوزه دانشگاهی):**

```json
{
  "id": "uuid",
  "telegramChatId": "-1001234567890",
  "chatTitle": "دانشجویان کامپیوتر ۱۴۰۱",
  "degreeLevel": "bachelor",
  "isEnabled": true,
  "configuredByDisplayName": "علی رضایی",
  "createdAt": "2026-09-20T10:00:00.000Z",
  "updatedAt": "2026-09-24T14:30:00.000Z",
  "university": {
    "id": "univ-uuid",
    "name": "دانشگاه صنعتی شریف"
  },
  "campus": {
    "id": "campus-uuid",
    "name": "دانشکده مهندسی کامپیوتر"
  },
  "major": {
    "id": "major-uuid",
    "name": "مهندسی نرم‌افزار"
  }
}
```

#### مکالمات و پیام‌های تلگرام (Conversations & Chat History):

- **لیست مکالمات اخیر:** `GET /api/v1/telegram/conversations` (یا `GET /admin-data/conversations`)
  - پارامترها: `page`, `pageSize`, `search`
  - ساختار بازگشتی شامل مشخصات کاربر، چت و متن آخرین پیام است.
- **مشاهده پیام‌های یک مکالمه (نمای چت ادمین):** `GET /api/v1/telegram/conversations/:id/messages`
  - ساختار بازگشتی:

```json
{
  "success": true,
  "data": [
    {
      "id": "msg-1",
      "conversationId": "conv-uuid",
      "role": "user",
      "content": "استاد درس ساختمان داده کیه؟",
      "createdAt": "2026-09-24T15:00:00.000Z"
    },
    {
      "id": "msg-2",
      "conversationId": "conv-uuid",
      "role": "assistant",
      "content": "دکتر علوی و دکتر رضوانی این ترم درس ساختمان داده را ارائه می‌دهند.",
      "createdAt": "2026-09-24T15:00:02.000Z"
    }
  ]
}
```

---

### ۴.۸. پیکربندی مدل‌های هوش مصنوعی (`/api/v1/ai-models` و `/ai-model-configs`)

این بخش امکان مدیریت استخر کلیدها و مدل‌های LLM مورد استفاده بات (تولید نقشه و تولید پاسخ) را فراهم می‌کند:

- **لیست مدل‌ها:** `GET /api/v1/ai-models`
  - پارامترها: `page` (پیش‌فرض ۱), `pageSize` (پیش‌فرض ۲۰), `search` یا `q` (جستجو در نام مدل و ارائه‌دهنده), `scope` (`plan` | `answer`), `status` (`active` | `disabled`), `isEnabled` (`true` | `false`)
- **مشاهده یک مدل:** `GET /api/v1/ai-models/:id`
- **ایجاد مدل جدید:** `POST /api/v1/ai-models`
  - بدنه درخواست:

```json
{
  "name": "OpenAI GPT-4o-mini Answer",
  "scope": "answer",
  "providerName": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-xxxxxxxxxxxxxxxxxxxx",
  "model": "gpt-4o-mini",
  "structuredOutputMode": "json_schema",
  "maxTokensParameter": "max_tokens",
  "requireParameters": false,
  "includeTemperature": true,
  "isEnabled": true
}
```

- **ویرایش مدل:** `PATCH /api/v1/ai-models/:id`
  - در حالت ویرایش، در صورت عدم نیاز به تغییر `apiKey` می‌توانید این فیلد را ارسال نکنید.
- **حذف مدل:** `DELETE /api/v1/ai-models/:id`

_نکته امنیتی: در کلیه پاسخ‌های دریافتی، مقدار `apiKeyMasked` به صورت `sk-p...xxxx` نمایش داده می‌شود و کلید واقعی هرگز افشا نمی‌گردد._

---

### ۴.۹. مدیریت و پایش کش پاسخ‌های هوش مصنوعی (`/api/v1/ai-cache`)

پلتفرم برای بهینه‌سازی سرعت پاسخ‌دهی به دانشجویان و کاهش چشمگیر هزینه‌های API هوش مصنوعی، پاسخ‌های تحلیلی اساتید و دروس را در پایگاه داده کش می‌کند (`ai_answer_caches`). این اندپوینت‌ها به پنل ادمین اجازه می‌دهند تا پاسخ‌های کش‌شده را مشاهده، پایش، ویرایش یا باطل کند.

> **ابطال خودکار کش:** با تایید هر نظر جدید در بخش اعتدال (`POST /api/v1/moderation/reviews/:id/approve`)، کش مربوط به آن استاد به طور خودکار باطل می‌شود تا پاسخ‌های بعدی بات به‌روز باشند.

#### ۱. لیست پاسخ‌های کش‌شده (List Cached Answers)

- **متد:** `GET`
- **آدرس:** `/api/v1/ai-cache`
- **دسترسی:** `cache:read` یا `analytics:read`
- **پارامترهای Query (اختیاری):**
  - `page`: شماره صفحه (پیش‌فرض ۱)
  - `pageSize`: تعداد در صفحه (پیش‌فرض ۲۰، حداکثر ۱۰۰)
  - `search` یا `q`: جستجو در متن پاسخ، کلید کش یا نام استاد
  - `professorId`: فیلتر بر اساس شناسه استاد
  - `courseId`: فیلتر بر اساس شناسه درس
  - `intent`: فیلتر بر اساس نوع درخواست (مثلاً `teaching_details`, `search_professors`, `compare_professors_for_course`)
  - `sortBy`: فیلد مرتب‌سازی (`hitCount` | `updatedAt` | `createdAt` | `lastHitAt`، پیش‌فرض `updatedAt`)
  - `sortOrder`: جهت مرتب‌سازی (`asc` | `desc`، پیش‌فرض `desc`)

- **نمونه پاسخ موفق (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-cache-1",
      "cacheKey": "prof:p-1|course:c-2|scope:unscoped|intent:teaching_details",
      "intent": "teaching_details",
      "scopeKey": "unscoped",
      "hitCount": 48,
      "lastHitAt": "2026-09-24T16:20:00.000Z",
      "createdAt": "2026-09-20T10:00:00.000Z",
      "updatedAt": "2026-09-24T16:20:00.000Z",
      "answerPreview": "دکتر حسنی استاد بسیار منظم و خوش‌اخلاقی هستند. در تدریس درس ریاضی ۱ تمرکز بالایی روی مفاهیم دارند...",
      "answerText": "دکتر حسنی استاد بسیار منظم و خوش‌اخلاقی هستند. در تدریس درس ریاضی ۱ تمرکز بالایی روی مفاهیم دارند و بارم‌بندی امتحانات ایشان استاندارد است.",
      "resources": [
        {
          "id": "res-1",
          "label": "جزوه کلاسی ریاضی ۱",
          "link": "https://t.me/c/123/45"
        }
      ],
      "resourceCount": 1,
      "professor": {
        "id": "p-1",
        "name": "دکتر حسنی"
      },
      "course": {
        "id": "c-2",
        "name": "ریاضی ۱"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### ۲. آمار تحلیلی کش و توکن‌های ذخیره‌شده (Cache Statistics)

- **متد:** `GET`
- **آدرس:** `/api/v1/ai-cache/stats`
- **دسترسی:** `cache:read` یا `analytics:read`
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": {
    "totalCachedEntries": 45,
    "totalHits": 312,
    "estimatedTokensSaved": 374400,
    "topProfessors": [
      {
        "professorId": "p-1",
        "professorName": "دکتر حسنی",
        "hitCount": 85
      },
      {
        "professorId": "p-2",
        "professorName": "دکتر علوی",
        "hitCount": 64
      }
    ]
  }
}
```

#### ۳. مشاهده جزئیات یک پاسخ کش‌شده با شناسه (Get Cache Entry Details)

- **متد:** `GET`
- **آدرس:** `/api/v1/ai-cache/:id`
- **دسترسی:** `cache:read` یا `analytics:read`
- **نمونه پاسخ:** ساختار کامل شیء کش‌شده همراه با متن کامل و منابع.

#### ۴. حذف یک رکورد از کش (Delete Single Cache Entry)

- **متد:** `DELETE`
- **آدرس:** `/api/v1/ai-cache/:id`
- **دسترسی:** `cache:manage`
- **نمونه پاسخ (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-cache-1",
    "deleted": true
  }
}
```

#### ۵. ابطال هوشمند کش بر اساس معیار (Invalidate Cache by Criteria)

هنگامی که اطلاعات یا تدریس‌های یک استاد یا درس تغییر می‌کند، با فراخوانی این اندپوینت می‌توان تمام پاسخ‌های کش‌شده مربوط به آن را بدون دست زدن به سایر پاسخ‌ها پاک کرد:

- **متد:** `POST`
- **آدرس:** `/api/v1/ai-cache/invalidate`
- **دسترسی:** `cache:manage`
- **بدنه درخواست (حداقل یکی از موارد الزامی است):**

```json
{
  "professorId": "uuid-of-professor"
}
```

یا

```json
{
  "courseId": "uuid-of-course"
}
```

یا

```json
{
  "all": true
}
```

- **نمونه پاسخ موفق:**

```json
{
  "success": true,
  "data": {
    "deletedCount": 4,
    "scope": "professor",
    "targetId": "uuid-of-professor"
  }
}
```

#### ۶. پاک‌سازی کامل کلیه رکوردهای کش (Flush Entire Cache)

- **متد:** `DELETE`
- **آدرس:** `/api/v1/ai-cache`
- **دسترسی:** `cache:manage`
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": {
    "deletedCount": 45,
    "scope": "all"
  }
}
```

---

### ۴.۸. اندپوینت‌های Lookup سریع جهت جستجو و Autocomplete (`/api/v1/lookups`)

این اندپوینت‌ها اختصاصاً برای استفاده در کامپوننت‌های رابط کاربری نظیر فیلدهای جستجو، اتوکامپلیت (Autocomplete)، دراپ‌داون‌ها و مودال‌های انتخابگر (مثلاً در زمان افزودن تدریس جدید، ثبت نظر یا انتخاب استاد/درس) بهینه‌سازی شده‌اند:

- **ویژگی‌های کلیدی:**
  - **سریع و سبک:** فقط فیلدهای کلیدی و مورد نیاز کلاینت را برمی‌گرداند.
  - **سقف ۱۰ رکورد:** خروجی هر درخواست حداکثر ۱۰ آیتم است تا سربار شبکه و کلاینت به حداقل برسد.
  - **جستجوی هوشمند فارسی:** پارامتر `q` یا `search` با الگوریتم نرمال‌سازی متون فارسی و جستجوی چندبخشی مطابقت داده می‌شود.
  - **بدون محدودیت اسکوپ:** جهت تسهیل انتخاب توسط اپراتورها و رابط‌های کاربری، این اندپوینت‌ها با احراز هویت ادمین فعال هستند و دسترسی عمومی به موجودیت‌های پایه را فراهم می‌کنند.

#### ۱. جستجوی دانشگاه‌ها (Lookup Universities)

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/universities?q=تهران`
- **دسترسی:** نیاز به توکن
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uni-uuid-1",
      "name": "دانشگاه تهران"
    }
  ]
}
```

#### ۲. جستجوی دانشکده‌ها / واحدها (Lookup Campuses)

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/campuses?q=فنی&universityId=uni-uuid-1`
- **دسترسی:** نیاز به توکن
- **پارامترهای Query:**
  - `q` یا `search`: عبارت جستجو در نام دانشکده
  - `universityId`: شناسه دانشگاه (اختیاری؛ جهت فیلتر کردن دانشکده‌های یک دانشگاه مشخص)
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "campus-uuid-1",
      "name": "دانشکده فنی",
      "universityId": "uni-uuid-1",
      "universityName": "دانشگاه تهران"
    }
  ]
}
```

#### ۳. جستجوی رشته‌ها (Lookup Majors)

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/majors?q=کامپیوتر`
- **دسترسی:** نیاز به توکن
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "major-uuid-1",
      "name": "مهندسی کامپیوتر"
    }
  ]
}
```

#### ۴. جستجوی اساتید (Lookup Professors)

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/professors?q=حسنی`
- **دسترسی:** نیاز به توکن
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "prof-uuid-1",
      "name": "دکتر حسن حسنی"
    }
  ]
}
```

#### ۵. جستجوی دروس (Lookup Courses)

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/courses?q=ریاضی`
- **دسترسی:** نیاز به توکن
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "course-uuid-1",
      "name": "ریاضی عمومی ۱"
    }
  ]
}
```

#### ۶. جستجوی تدریس‌ها با عنوان ترکیبی (Lookup Teachings with Composite Title)

این اندپوینت برای اتوکامپلیت و انتخاب سریع تدریس موجود در فرم‌ها و فیلترها تعبیه شده است. جستجو همزمان روی نام استاد، درس، دانشگاه، دانشکده و رشته اعمال می‌شود.

- **متد:** `GET`
- **آدرس:** `/api/v1/lookups/teachings?q=ریاضی+حسنی`
- **دسترسی:** نیاز به توکن
- **فرمت عنوان ترکیبی (Composite Title):**
  `دانشگاه + واحد + رشته + درس + استاد + مقطع`
  _مثال:_ `دانشگاه تهران - دانشکده فنی - مهندسی کامپیوتر - ریاضی عمومی ۱ - دکتر حسن حسنی (کارشناسی)`
- **نمونه خروجی:**

```json
{
  "success": true,
  "data": [
    {
      "id": "teaching-uuid-1",
      "title": "دانشگاه تهران - دانشکده فنی - مهندسی کامپیوتر - ریاضی عمومی ۱ - دکتر حسن حسنی (کارشناسی)",
      "professorId": "prof-uuid-1",
      "professorName": "دکتر حسن حسنی",
      "courseId": "course-uuid-1",
      "courseName": "ریاضی عمومی ۱",
      "campusId": "campus-uuid-1",
      "campusName": "دانشکده فنی",
      "universityId": "uni-uuid-1",
      "universityName": "دانشگاه تهران",
      "majorId": "major-uuid-1",
      "majorName": "مهندسی کامپیوتر",
      "degreeLevel": "bachelor"
    }
  ]
}
```

---

### ۴.۹. ره‌گیری وقایع و لاگ حسابرسی ادمین‌ها (`/api/v1/admin/audit-logs`)

کلیه عملیات تغییردهنده (ایجاد، ویرایش، حذف، ادغام، تغییر وضعیت، تایید و رد) که توسط کاربران ادمین در پنل انجام می‌پذیرد، به همراه مشخصات ادمین، آی‌پی، User-Agent، نوع موجودیت و جزئیات دقیق تغییرات در جدول لاگ حسابرسی ذخیره می‌شود.

#### دریافت لیست لاگ‌های حسابرسی (List Audit Logs)

- **متد:** `GET`
- **آدرس:** `/api/v1/admin/audit-logs`
- **دسترسی:** `audit_logs:read` یا `super_admin`
- **پارامترهای Query (اختیاری):**
  - `page`: شماره صفحه (پیش‌فرض: ۱)
  - `pageSize`: تعداد در صفحه (پیش‌فرض: ۵۰، حداکثر: ۱۰۰)
  - `action`: فیلتر بر اساس نوع عملیات (مانند `TEACHING_CREATE`, `REVIEW_APPROVE`, `PROFESSOR_UPDATE`, `COURSE_MERGE`, ...)
  - `adminUserId`: فیلتر بر اساس شناسه کاربری ادمین
  - `adminUsername`: فیلتر بر اساس نام کاربری ادمین
  - `entityType`: نوع موجودیت (مانند `teaching`, `review_submission`, `professor`, `course`, `resource_submission`, ...)
  - `entityId`: شناسه موجودیت مورد تغییر
  - `from`: فیلتر تاریخ شروع (ISO 8601)
  - `to`: فیلتر تاریخ پایان (ISO 8601)
- **نمونه پاسخ:**

```json
{
  "success": true,
  "data": [
    {
      "id": "audit-uuid-1",
      "adminUserId": "usr-uuid-scoped",
      "adminUsername": "scoped_admin",
      "action": "TEACHING_CREATE",
      "entityType": "teaching",
      "entityId": "teaching-uuid-99",
      "details": {
        "professorId": "prof-1",
        "courseId": "course-1",
        "campusId": "campus-1",
        "majorId": "major-1",
        "degreeLevel": "bachelor"
      },
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0 ...",
      "createdAt": "2026-09-25T01:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 50,
    "totalPages": 1
  }
}
```

---

## ۵. نمونه کلاینت آماده برای Next.js (TypeScript)

کد زیر را می‌توانید مستقیماً در پروژه Next.js خود به عنوان یک سرویس ارتباطی استاندارد قرار دهید:

```typescript
// src/services/api-client.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    offset?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// اضافه کردن توکن به هدر درخواست‌ها
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// مدیریت متمرکز پاسخ‌ها و خطاهای احراز هویت
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }

    // بازگرداندن متن خطای سرور در قالب استاندارد
    const serverError = error.response?.data?.error;
    return Promise.reject(
      new Error(
        serverError?.message || 'خطایی در برقراری ارتباط با سرور رخ داد.',
      ),
    );
  },
);
```

### نمونه فراخوانی در صفحه Next.js:

```typescript
import { apiClient } from '@/services/api-client';

// ۱. ورود
export async function login(username: string, password: string) {
  const res = await apiClient.post('/api/v1/auth/login', {
    username,
    password,
  });
  localStorage.setItem('admin_token', res.data.token);
  return res.data.user;
}

// ۲. دریافت آمار داشبورد
export async function getDashboardOverview() {
  const res = await apiClient.get('/api/v1/admin/analytics/overview');
  return res.data;
}

// ۳. دریافت لیست خطاها
export async function getErrors(params?: {
  source?: string;
  isResolved?: boolean;
  page?: number;
}) {
  const res = await apiClient.get('/api/v1/admin/errors', { params });
  return { items: res.data, meta: res.meta };
}
```
