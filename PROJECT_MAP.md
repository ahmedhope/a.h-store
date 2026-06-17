# PROJECT_MAP — a&h srre (متجر ملابس)

## TECH_STACK

| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui (Radix UI) | 4.11.0 |
| Icons | Lucide React | latest |
| ORM | Prisma | 7.8.0 |
| Database | SQLite (via libSQL adapter) | — |
| Validation | Zod | latest |
| Auth | NextAuth.js | 4.24.14 |
| Cloudinary | next-cloudinary | 6.17.5 |
| Logging | Custom async JSON logger | — |

## SYSTEM_FLOW

```
User Browser                 Next.js Server                SQLite
    │                           │                            │
    ├─► Page Request ──────────►├─► RSC / Server Component   │
    │   (/?q=search)            │   └─► prisma.products ────►├─► Query
    │   (/?category=slug)       │       .findMany() ◄────────┘
    │◄── HTML Response ◄───────┤                            │
    │                           │                            │
    ├─► Add to Cart (Client)   │                            │
    │   (cookie: cart=[])       │                            │
    │                           │                            │
    ├─► Checkout ─────────────►├─► Server Action            │
    │   (form submit)          │   ├─► Zod validation        │
    │                           │   ├─► Stock check          │
    │                           │   ├─► prisma.order.create ─►├─► INSERT
    │                           │   ├─► prisma.product ──────►├─► UPDATE stock
    │                           │   │   .update(stock -= qty) │
    │                           │   └─► Clear cart cookie     │
    │◄── wa.me/...?text=... ◄──┤   └─► logger.info()         │
    │   (رقم من .env)           │                            │
    │                           │                            │
    ├─► Admin Login ──────────►├─► NextAuth (Credentials)   │
    │                           │   └─► JWT Session          │
    │◄── Dashboard ◄───────────┤                            │
    │                           │                            │
    ├─► Admin CRUD Product ───►├─► Server Action            │
    │   (Cloudinary Upload)    │   └─► prisma.product ──────►├─► SQL
    │◄── Revalidate Path ◄─────┤       .upsert() / .delete() │
```

## ARCHITECTURE

```
a&h-srre/
├── prisma/
│   ├── schema.prisma        # 5 models: AdminUser, Category, Product, Order, OrderItem
│   └── seed.ts              # 1 admin + 5 categories + 18 products
├── src/
│   ├── app/
│   │   ├── (store)/         # Storefront (RSC by default)
│   │   │   ├── page.tsx     # الرئيسية + بحث + تصفح فئات
│   │   │   ├── products/[slug]/page.tsx  # تفاصيل المنتج + generateMetadata
│   │   │   └── cart/page.tsx             # سلة الشراء + إتمام الطلب
│   │   ├── admin/
│   │   │   ├── login/       # تسجيل الدخول (Client)
│   │   │   └── (dashboard)/ # Protected admin pages
│   │   │       ├── layout.tsx    # Sidebar + requireAdmin
│   │   │       ├── dashboard/    # الإحصائيات
│   │   │       ├── products/     # CRUD products + Cloudinary
│   │   │       ├── categories/   # CRUD categories
│   │   │       └── orders/       # عرض + تحديث حالة الطلبات
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth endpoint
│   │       └── admin/products/[id]/delete/   # Delete handler
│   ├── components/
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── store/        # Navbar, Footer, ProductCard, Cart, AddToCart
│   │   └── admin/        # AdminSidebar, ProductForm, CloudinaryUpload, OrderStatusDropdown
│   ├── actions/          # Server Actions
│   │   ├── products.ts   # getProducts (cat+search), getProduct, getCategories, CRUD
│   │   ├── orders.ts     # createOrder (stock validation), getOrders, updateOrderStatus
│   │   └── categories.ts # createCategory, deleteCategory
│   ├── lib/
│   │   ├── prisma.ts     # PrismaClient singleton + libSQL adapter
│   │   ├── logger.ts     # Async JSON logger (4 levels)
│   │   ├── utils.ts      # cn(), slugify(), formatPrice(), parseImages()
│   │   └── auth.ts       # getSession(), requireAdmin()
│   └── types/
│       ├── index.ts      # ProductWithCategory, OrderWithItems, CartItem
│       └── next-auth.d.ts# Session augmentation
```

## ORPHANS & PENDING

### يتطلب من المستخدم (User Action Required)
| البند | الحالة | الإجراء المطلوب |
|-------|--------|----------------|
| **Cloudinary Upload Preset** | ⚠️ مستخدم | أنشئ `ah_srre` upload preset (unsigned) في Cloudinary Dashboard |
| **Cloudinary Cloud Name** | ⚠️ مستخدم | عبّئ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` في `.env` |
| **WhatsApp Number** | ⚠️ مستخدم | عدّل `NEXT_PUBLIC_WHATSAPP_NUMBER` في `.env` لرقم المتجر الحقيقي |
| **Admin Password** | ⚠️ مستخدم | غيّر كلمة المرور الافتراضية `admin123` بعد أول دخول |

### تم الإنجاز ✅
| البند | الحالة |
|-------|--------|
| ~~SEO / Metadata~~ | ✅ تحسين SEO لكل الصفحات + generateMetadata للمنتجات |
| ~~Search Feature~~ | ✅ بحث نصي في Navbar + معالجة في Server Action (بحث بالاسم/الوصف/التاجات) |
| ~~WhatsApp hardcoded~~ | ✅ جعل الرقم قابل للتكوين عبر `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| ~~Stock validation at checkout~~ | ✅ التحقق من المخزون قبل إنشاء الطلب |
| ~~Error handling~~ | ✅ معالجة أخطاء + try/catch + Logging في كل Server Action |
| ~~Logging~~ | ✅ تسجيل إنشاء الطلب وتحديث الحالة |
