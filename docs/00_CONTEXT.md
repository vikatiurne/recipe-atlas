Recipe Atlas — пет-проєкт
1. Що це за проєкт
Назва: Recipe Atlas
Тип: Пет-проєкт, SEO-first каталог рецептів
Суть: Веб-каталог рецептів з усього світу, структурований за країнами, кухнями та типами страв. Навколо рецептів — programmatic SEO-сторінки, мультимовність (uk/en), headless CMS, Nest.js-сервіс для важких задач, Redis-кеш та production-інфраструктура.

Мета пет-проєкту: прокачати навички SSR/SSG/ISR, headless CMS, Nest.js, Docker, Redis, CI/CD, monitoring, technical SEO, structured data, Core Web Vitals та programmatic SEO — на реальному продукті, а не на туторіалах.

Бізнес-мета (умовна): органічний трафік з Google → перегляди рецептів → утримання через особисту колекцію.

Відмінність від AI-проєкту: немає витрат на AI, немає платежів — фокус на SEO, рендерингу, інфраструктурі та бекенд-архітектурі.

2. Користувацькі сценарії
Основний flow
Користувач гуглить «італійська паста рецепт» або «low calorie pasta recipe».

Потрапляє на programmatic-сторінку /recipes/italy/pasta або /en/recipes/italy/low-calorie.

Бачить список рецептів з фільтрами та сортуванням.

Клікає на рецепт, читає інгредієнти, кроки, калорії.

Додає в особисту колекцію (опційно).

Вторинні flow
Перегляд рецептів за країною: /recipes/italy.

Перегляд за типом страви: /recipes/dessert.

Перегляд за калоріями: /recipes/low-calorie.

Пошук за інгредієнтами: /search?q=chicken.

Особиста колекція: /my-collection.

Фонові flow (Nest.js)
Cron щоночі синхронізує рецепти з TheMealDB.

Імпорт Kaggle-датасету (60K рецептів) через чергу.

Збагачення калорій через USDA FoodData Central.

Генерація sitemap для 60K+ сторінок.

Перебудова кешу трендів і ZSET-ів у Redis.

Прогрів кешу популярних сторінок.

3. Ролі
Роль	Що робить
Гість	Дивиться рецепти, каталог, пошук, сортує за калоріями
Зареєстрований	+ особиста колекція, збереження рецептів
Admin (ти)	Керує контентом через Strapi CMS
System (Nest.js)	Cron, імпорт, збагачення даних, sitemap, rate limiting
4. Функціональні вимоги
4.1 Каталог рецептів
Список рецептів з фільтрами: країна, кухня, тип страви, дієта, калорії.

Фільтри за калоріями:

< 200 ккал

200–400 ккал

400–600 ккал

> 600 ккал

Сортування:

За калоріями ↑ / ↓

За білком ↓

За вуглеводами ↑

За часом приготування ↑

За популярністю (тренди)

Картка рецепту: фото, назва, час, складність, порції, калорії.

Пагінація.

4.2 Сторінка рецепту
Фото, назва, опис.

Інгредієнти (список з мірами).

Покрокові інструкції.

Час приготування, порції, складність.

Харчова цінність: калорії, білки, жири, вуглеводи.

Джерело nutrition: USDA / Kaggle / estimated / manual.

Disclaimer: «Харчова цінність розрахована автоматично і може відрізнятися.»

Схожі рецепти.

JSON-LD Recipe (з nutrition полем).

4.3 Programmatic SEO сторінки
/recipes/[country] — усі рецепти країни.

/recipes/[country]/[cuisine] — рецепти кухні в країні.

/recipes/[country]/[cuisine]/[dish] — конкретний тип страви.

/recipes/[diet] — рецепти за дієтою.

/recipes/low-calorie — рецепти до 300 ккал.

/recipes/high-protein — рецепти з високим білком.

/recipes/low-carb — рецепти з низькими вуглеводами.

/recipes/[country]/low-calorie — низькокалорійна кухня країни.

Кожна сторінка — унікальні title, description, H1, JSON-LD, breadcrumbs.

4.4 Мультимовність
Українська (/uk/...) та англійська (/en/...).

hreflang для всіх сторінок.

Перемикач мови.

Default locale: uk.

4.5 Пошук
За назвою, інгредієнтами, кухнею.

SSR (динамічний запит).

Debounced input.

Rate limiting через Nest.js + Redis.

4.6 Особиста колекція (опційно)
Авторизація через NextAuth.js.

Збереження рецептів.

SSR-сторінка /my-collection.

4.7 CMS
Strapi для керування рецептами.

Моделі: Recipe, Country, Cuisine, DishType, Ingredient, Diet.

REST/GraphQL API.

4.8 Фонові задачі (Nest.js)
Cron: щоденна синхронізація з TheMealDB.

Queue: імпорт Kaggle-датасету через BullMQ.

Nutrition enrichment: доповнення калорій через USDA API.

Sitemap generation: для 60K+ URL.

Cache warming: прогрів кешу популярних сторінок.

Trends calculation: перерахунок топ-10 рецептів тижня.

ZSET rebuild: перебудова Redis Sorted Sets для сортування.

5. Нефункціональні вимоги
Вимога	Цільове значення
Lighthouse Performance	≥ 95
LCP	< 2.0s
CLS	< 0.05
INP	< 150ms
Індексація	100% сторінок у sitemap
Кількість сторінок	500+ (programmatic), до 60K
Час збірки	< 5 хв
Uptime	99% (Vercel + Nest.js)
Бюджет	$0/міс (тільки free tiers)
Rate limit	60 req/min на IP
Nutrition coverage	> 80% рецептів з калоріями
6. Технічний стек
Frontend
Next.js 15 (App Router), React 19

TypeScript

Tailwind CSS + shadcn/ui

next/image, next/font

Server Components за замовчуванням, "use client" тільки для інтерактиву

Backend / CMS
Strapi 5 (headless CMS) — у Docker

PostgreSQL — у Docker (для Strapi + Nest.js)

Next.js API Routes — для легких задач (пошук, колекція)

Nest.js 11 — окремий сервіс для важких задач — у Docker

Prisma — ORM для Nest.js

NextAuth.js — авторизація у Next.js

Кеш та черги
Redis 7 — у Docker

Кеш відповідей Strapi API (TTL 5–10 хв)

Кеш списків рецептів для programmatic-сторінок

Rate limiting для /api/search (Nest.js + @nestjs/throttler)

Сесії NextAuth (Redis adapter)

Sorted Sets для сортування за калоріями

Sorted Sets для «Топ-10 рецептів тижня»

BullMQ для черг імпорту

BullMQ — черги в Nest.js

Nest.js модулі
ImportModule — синхронізація з TheMealDB

KaggleModule — імпорт датасетів через черги

NutritionModule — збагачення калорій через USDA

SitemapModule — генерація sitemap для 60K+ URL

TrendsModule — розрахунок трендів

CacheModule — прогрів кешу + ZSET rebuild

HealthModule — health checks для всіх сервісів

SEO
Metadata API Next.js

hreflang-forge або app/sitemap.ts з alternate

JSON-LD: Recipe, BreadcrumbList, FAQPage, ItemList

next-sitemap (опційно)

Інфраструктура
Vercel — хостинг фронтенду

Railway / Fly.io — хостинг Nest.js (free tier)

GitHub Actions — lint, test, type-check

Docker + docker-compose — локальна розробка (Next.js + Strapi + Nest.js + Postgres + Redis)

Sentry — error tracking (Next.js + Nest.js)

Vercel Analytics + PostHog — продуктова аналітика

Lighthouse CI — перевірка CWV у CI

Upstash Redis — production Redis (free tier)

Контент і дані
Strapi — основна CMS

TheMealDB API — джерело початкових даних

Kaggle datasets — для масштабування

USDA FoodData Central — джерело калорій та нутрієнтів

7. Архітектура (високорівнева)
text
┌─────────────────────────────────────────────────┐
│                   Vercel Edge                    │
│  ┌───────────────────────────────────────────┐  │
│  │           Next.js App Router              │  │
│  │  SSG / ISR / SSR                          │  │
│  │  /api/search  /api/collection  (легкі)    │  │
│  └───────────────────────────────────────────┘  │
└────────────┬──────────────────┬─────────────────┘
             │                  │
             │           ┌──────▼──────────┐
             │           │   Nest.js API   │
             │           │    (Docker)     │
             │           │  - cron jobs    │
             │           │  - import 60K   │
             │           │  - nutrition    │
             │           │  - sitemap gen  │
             │           │  - rate limit   │
             │           │  - trends       │
             │           │  - ZSET rebuild │
             │           └──────┬──────────┘
             │                  │
      ┌──────▼──────┐    ┌──────▼──────┐
      │   Strapi    │    │ PostgreSQL  │
      │  (Docker)   │    │  (Docker)   │
      └─────────────┘    └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │    Redis    │
                         │  (Docker)   │
                         └─────────────┘
                                │
                         ┌──────▼──────┐
                         │ USDA API    │
                         │ (external)  │
                         └─────────────┘
Принцип розподілу:

Next.js — усе, що стосується рендерингу, SEO та швидких API

Nest.js — усе, що довге, фонове, потребує черг або cron

Strapi — контент і CMS

Redis — кеш, черги, rate limiting, сесії, сортування

USDA — збагачення nutrition-даних

8. Структура репозиторію
text
recipe-atlas/
├── apps/
│   ├── web/                              # Next.js
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx              # SSG — головна
│   │   │   │   ├── recipes/
│   │   │   │   │   ├── page.tsx          # SSG — каталог
│   │   │   │   │   ├── low-calorie/
│   │   │   │   │   │   └── page.tsx      # ISR — < 300 ккал
│   │   │   │   │   ├── high-protein/
│   │   │   │   │   │   └── page.tsx      # ISR — високий білок
│   │   │   │   │   ├── low-carb/
│   │   │   │   │   │   └── page.tsx      # ISR — низькі вуглеводи
│   │   │   │   │   ├── [country]/
│   │   │   │   │   │   ├── page.tsx      # ISR — країна
│   │   │   │   │   │   ├── low-calorie/
│   │   │   │   │   │   │   └── page.tsx  # ISR — країна + калорії
│   │   │   │   │   │   └── [cuisine]/
│   │   │   │   │   │       ├── page.tsx  # ISR — кухня
│   │   │   │   │   │       └── [dish]/
│   │   │   │   │   │           └── page.tsx  # ISR — страва
│   │   │   │   │   └── [diet]/
│   │   │   │   │       └── page.tsx      # ISR — дієта
│   │   │   │   ├── recipe/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx      # SSG — рецепт
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx          # SSR — пошук
│   │   │   │   └── my-collection/
│   │   │   │       └── page.tsx          # SSR — колекція
│   │   │   ├── api/
│   │   │   │   ├── search/route.ts
│   │   │   │   ├── collection/route.ts
│   │   │   │   └── auth/[...nextauth]/route.ts
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── seo/
│   │   │   ├── recipe/
│   │   │   │   ├── NutritionBadge.tsx    # калорії, білки
│   │   │   │   ├── CalorieFilter.tsx     # фільтри
│   │   │   │   └── SortDropdown.tsx      # сортування
│   │   │   └── layout/
│   │   ├── lib/
│   │   │   ├── strapi.ts
│   │   │   ├── auth.ts
│   │   │   ├── seo.ts
│   │   │   ├── redis.ts
│   │   │   ├── cache.ts
│   │   │   └── i18n.ts
│   │   ├── messages/
│   │   │   ├── uk.json
│   │   │   └── en.json
│   │   ├── instrumentation.ts
│   │   └── instrumentation-client.ts
│   │
│   ├── api/                              # Nest.js
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── import/
│   │   │   │   ├── kaggle/
│   │   │   │   ├── nutrition/
│   │   │   │   │   ├── nutrition.module.ts
│   │   │   │   │   ├── nutrition.service.ts
│   │   │   │   │   ├── usda.client.ts
│   │   │   │   │   └── nutrition.cron.ts
│   │   │   │   ├── sitemap/
│   │   │   │   ├── trends/
│   │   │   │   ├── cache/
│   │   │   │   │   ├── cache.module.ts
│   │   │   │   │   ├── cache.service.ts
│   │   │   │   │   └── zset.builder.ts   # rebuild ZSET-ів
│   │   │   │   └── health/
│   │   │   ├── common/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   └── prisma/
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── cms/                              # Strapi
│       ├── config/
│       ├── src/
│       │   └── api/
│       │       ├── recipe/
│       │       ├── country/
│       │       ├── cuisine/
│       │       ├── dish-type/
│       │       ├── ingredient/
│       │       └── diet/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared/
│       └── src/
│           ├── types.ts
│           └── nutrition.ts              # типи для калорій
│
├── docker/
│   ├── docker-compose.yml
│   └── redis/
│       └── redis.conf
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── lighthouse.yml
│
├── package.json
├── pnpm-workspace.yaml
└── PROJECT_CONTEXT.md
Монорепо з pnpm workspaces.

9. Моделі даних (Strapi)
Recipe
text
- id
- title (string, localized)
- slug (uid)
- description (text, localized)
- image (media)
- ingredients (relation → Ingredient)
- steps (richtext, localized)
- prepTime (number, minutes)
- cookTime (number, minutes)
- servings (number)
- difficulty (enum: easy, medium, hard)
- country (relation → Country)
- cuisine (relation → Cuisine)
- dishType (relation → DishType)
- diets (relation → Diet, multiple)

# Nutrition — топ-рівень для сортування
- calories (integer)              ← індексоване
- protein (decimal)
- fat (decimal)
- carbs (decimal)
- fiber (decimal, optional)
- sugar (decimal, optional)
- sodium (integer, optional)
- nutritionSource (enum: usda, kaggle, estimated, manual)
- nutritionUpdatedAt (datetime)
- nutritionConfidence (enum: high, medium, low)

- createdAt, updatedAt, publishedAt
Country
text
- id
- name (string, localized)
- slug (uid)
- code (string, ISO)
- flag (media)
- recipes (relation → Recipe)
Cuisine
text
- id
- name (string, localized)
- slug (uid)
- description (text, localized)
- recipes (relation → Recipe)
DishType
text
- id
- name (string, localized)
- slug (uid)
- recipes (relation → Recipe)
Ingredient
text
- id
- name (string, localized)
- slug (uid)
- unit (string)
- usdaFdcId (string, optional)    ← для мапінгу з USDA
- caloriesPer100g (decimal, optional)
- proteinPer100g (decimal, optional)
- fatPer100g (decimal, optional)
- carbsPer100g (decimal, optional)
- recipes (relation → Recipe)
Diet
text
- id
- name (string, localized)
- slug (uid)
- recipes (relation → Recipe)
Prisma (Nest.js — для користувацьких даних і черг)
prisma
model User {
  id          String       @id @default(uuid())
  email       String       @unique
  collections Collection[]
  createdAt   DateTime     @default(now())
}

model Collection {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  recipeId  String
  createdAt DateTime @default(now())
}

model ImportJob {
  id        String   @id @default(uuid())
  source    String
  status    String   @default("pending")
  total     Int      @default(0)
  processed Int      @default(0)
  failed    Int      @default(0)
  startedAt DateTime?
  endedAt   DateTime?
}

model NutritionJob {
  id          String   @id @default(uuid())
  recipeId    String
  status      String   @default("pending")
  source      String   @default("usda")
  attempts    Int      @default(0)
  lastError   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
Індекси в Postgres
sql
CREATE INDEX idx_recipe_calories ON recipes(calories);
CREATE INDEX idx_recipe_protein ON recipes(protein);
CREATE INDEX idx_recipe_carbs ON recipes(carbs);
CREATE INDEX idx_recipe_country_calories ON recipes(country_id, calories);
CREATE INDEX idx_recipe_cuisine_calories ON recipes(cuisine_id, calories);
CREATE INDEX idx_ingredient_usda ON ingredients(usda_fdc_id);
10. Nest.js модулі — детально
ImportModule
Призначення: синхронізація рецептів з TheMealDB.

Cron: @Cron('0 3 * * *') — щодня о 3:00.

Логіка: fetch → transform → upsert у Postgres → інвалідація кешу → тригер NutritionModule.

Endpoint: POST /import/mealdb (захищений API-ключем).

KaggleModule
Призначення: імпорт 60K рецептів з CSV.

Черга: BullMQ → kaggle-import queue.

Логіка: stream CSV → batch insert → progress у Redis → тригер NutritionModule.

Endpoint: POST /kaggle/import + GET /kaggle/status/:jobId.

NutritionModule
Призначення: збагачення калорій та нутрієнтів.

Cron: @Cron('0 6 * * *') — щодня о 6:00.

Логіка:

Знайти рецепти без calories або з nutritionSource: estimated.
Для кожного — розпарсити інгредієнти.
Замапити інгредієнти на USDA FDC ID (через Ingredient.usdaFdcId).
Запросити USDA FoodData Central API.
Порахувати суму калорій на порцію.
Оновити Recipe: calories, protein, fat, carbs, nutritionSource: usda.
Інвалідувати Redis-кеш + оновити ZSET-и.
Endpoint: POST /nutrition/enrich (batch), GET /nutrition/status/:jobId.

Fallback: якщо USDA не знайшов — nutritionSource: estimated, nutritionConfidence: low.

SitemapModule
Призначення: генерація sitemap для 60K+ URL.

Cron: @Cron('0 4 * * *') — щодня о 4:00.

Логіка: витягти всі slug → згенерувати XML → зберегти у Redis/S3.

Endpoint: GET /sitemap/:locale.xml.

TrendsModule
Призначення: розрахунок топ-10 рецептів тижня.

Cron: @Cron('0 5 * * 1') — щопонеділка о 5:00.

Логіка: Redis ZSET trending:recipes:weekly → топ-10 → кеш.

Endpoint: GET /trends/weekly.

CacheModule
Призначення: прогрів кешу + перебудова ZSET-ів.

Cron: @Cron('0 */6 * * *') — кожні 6 годин.

Логіка:

Топ-100 URL → fetch → set у Redis.

Rebuild ZSET-ів для сортування за калоріями.

ZSET-и:

text
recipes:calories:all
recipes:calories:{country}
recipes:calories:{cuisine}
recipes:protein:{cuisine}
recipes:carbs:{cuisine}
HealthModule
Призначення: health checks для всіх сервісів.

Endpoint: GET /health → перевіряє Postgres, Redis, Strapi, USDA API.

Використання: Railway/Fly.io health checks + Sentry.

Загальні елементи Nest.js
@nestjs/throttler + Redis storage → rate limiting.

@nestjs/swagger → автогенерація OpenAPI.

@nestjs/schedule → cron.

@nestjs/bull + BullMQ → черги.

@nestjs/terminus → health checks.

@nestjs/axios → HTTP-клієнт для USDA.

Guards → API key для admin endpoints.

Interceptors → логування, трансформація відповідей.

Pipes → class-validator + DTO.

11. Redis — ключі та структури
Кеш Strapi API
text
strapi:recipes:list:{country}:{cuisine}   → JSON, TTL 600s
strapi:recipe:{slug}                       → JSON, TTL 600s
strapi:countries                           → JSON, TTL 3600s
strapi:cuisines                            → JSON, TTL 3600s
Rate limiting
text
ratelimit:search:{ip}                      → counter, TTL 60s
ratelimit:collection:{userId}              → counter, TTL 60s
ratelimit:nutrition:{ip}                   → counter, TTL 60s
Сесії
text
nextauth:session:{sessionId}               → JSON, TTL 30d
Сортування за калоріями (ZSET)
text
recipes:calories:all                       → ZSET, score = calories
recipes:calories:{country}                 → ZSET
recipes:calories:{cuisine}                 → ZSET
recipes:protein:{cuisine}                  → ZSET
recipes:carbs:{cuisine}                    → ZSET

# Фільтри-діапазони (окремі ZSET-и для швидкості)
recipes:calories:low                       → ZSET (score < 300)
recipes:calories:medium                    → ZSET (300–600)
recipes:calories:high                      → ZSET (> 600)
Тренди
text
trending:recipes:weekly                    → ZSET, score = views
trending:recipes:daily                     → ZSET
Черги (BullMQ)
text
bull:kaggle-import:waiting
bull:kaggle-import:active
bull:kaggle-import:completed
bull:nutrition-enrich:waiting
bull:nutrition-enrich:active
Progress імпорту
text
import:kaggle:progress:{jobId}             → JSON, TTL 24h
import:nutrition:progress:{jobId}          → JSON, TTL 24h
12. SEO-стратегія
Рівні сторінок
Тип	URL	Рендеринг	Кількість
Головна	/[locale]	SSG	2
Каталог	/[locale]/recipes	SSG	2
Країна	/[locale]/recipes/[country]	ISR (1h)	~50
Кухня	/[locale]/recipes/[country]/[cuisine]	ISR (1h)	~200
Страва	/[locale]/recipes/[country]/[cuisine]/[dish]	ISR (1h)	~500
Дієта	/[locale]/recipes/[diet]	ISR (1h)	~20
Low-calorie	/[locale]/recipes/low-calorie	ISR (1h)	2
High-protein	/[locale]/recipes/high-protein	ISR (1h)	2
Low-carb	/[locale]/recipes/low-carb	ISR (1h)	2
Країна + калорії	/[locale]/recipes/[country]/low-calorie	ISR (1h)	~100
Рецепт	/[locale]/recipe/[slug]	SSG	~1000
Пошук	/[locale]/search	SSR	1
Колекція	/[locale]/my-collection	SSR	1
Разом: ~1900+ сторінок на старті, до 60K з Kaggle.

Обов'язкові елементи кожної сторінки
Унікальний <title>

Унікальний <meta description>

<link rel="canonical">

hreflang (uk/en + x-default)

JSON-LD: Recipe + BreadcrumbList + ItemList

Semantic markup: <article>, <nav>, <main>, <section>

Open Graph + Twitter Card

Breadcrumbs (візуальні + JSON-LD)

JSON-LD Recipe — обов'язково з nutrition
json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "...",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "245 kcal",
    "proteinContent": "12 g",
    "fatContent": "8 g",
    "carbohydrateContent": "30 g"
  }
}
Sitemap
Автогенерація через Nest.js SitemapModule (для 60K+ URL).

Next.js app/sitemap.ts для базових сторінок.

Alternate для кожної локалі.

Sitemap index, якщо > 50k URL.

robots.txt через app/robots.ts.

Внутрішня перелінковка
Рецепт → країна, кухня, тип страви, дієта, категорія калорій.

Країна → кухні, популярні рецепти, low-calorie версія.

Кухня → рецепти, сусідні кухні.

Схожі рецепти за калоріями на сторінці рецепту.

13. Продуктові метрики
Воронка
Органічний трафік (Google Search Console)

Перегляд каталогу → клік на рецепт

Перегляд рецепту → перегляд другого рецепту

Повернення на 7-й день

Реєстрація → додавання в колекцію

Технічні
Core Web Vitals (LCP, CLS, INP)

Кількість проіндексованих сторінок (GSC)

Error rate (Sentry — Next.js + Nest.js)

Час збірки (Vercel)

Build size

Nest.js: час імпорту, довжина черг, cache hit ratio

Redis: memory usage, hit/miss ratio, evicted keys

Nutrition: % рецептів з калоріями, % з nutritionSource: usda

A/B тести (PostHog)
Розташування CTA «Додати в колекцію»

Кількість рецептів на сторінці каталогу

Формат картки рецепту

Показ калорій на картці vs тільки на сторінці рецепту

14. Дорожня карта (8 тижнів)
Тиждень	Deliverable
1	Next.js + Strapi + Postgres + Redis у Docker + seed 20 рецептів
2	SSG рецептів + ISR каталогу + SSR пошуку + кеш Strapi API в Redis
3	SEO: metadata, sitemap, robots, JSON-LD, hreflang
4	Programmatic SEO: 500+ сторінок + внутрішня перелінковка
5	Nest.js: ImportModule + CacheModule + HealthModule + rate limiting
6	Nest.js: KaggleModule + черги + NutritionModule + USDA
7	Nest.js: TrendsModule + SitemapModule + ZSET rebuild
8	CWV + CI/CD + Dockerfile + Sentry + PostHog + деплой
15. Джерела даних
Старт
TheMealDB API — безкоштовний, без ключа, сотні рецептів, структурований JSON.

Apify scraper — готовий скрапер TheMealDB.

Масштаб
Kaggle: Food.com Recipes (~231,000 рецептів, частково з nutrition).

Kaggle: 60K Dishes (~64,000 рецептів).

Nutrition
USDA FoodData Central — офіційне джерело калорій та нутрієнтів.

API: https://api.nal.usda.gov/fdc/v1/

Free tier: 1000 запитів/годину на API-ключ.

Ключ безкоштовний після реєстрації.

Nutritionix API — fallback, 500 запитів/день.

Парсинг
recipe-scrapers (JS) — для вилучення з Schema.org розмітки.

Стратегія
Старт: TheMealDB → 100–200 рецептів у Strapi.

Масштаб: Kaggle dataset → 60K рецептів у Postgres через Nest.js.

Nutrition: USDA enrichment → > 80% рецептів з калоріями.

Розмітка: JSON-LD Recipe з nutrition для кожної сторінки.

16. Обмеження та припущення
Бюджет: $0/міс, тільки free tiers.

Один розробник: монорепо з 3 apps (web, api, cms).

Мови: українська + англійська.

Контент: відкриті джерела (TheMealDB, Kaggle, USDA).

Юридика: Privacy Policy, Terms, attribution для джерел, nutrition disclaimer.

Зображення: з TheMealDB / Kaggle, оптимізація через next/image.

Nest.js: тільки для фонових задач, не для CRUD і не для auth.

Nutrition: розрахунок приблизний, завжди показуємо disclaimer.

17. Що НЕ робимо (out of scope)
AI-генерація рецептів.

Платежі та підписки.

Мобільний застосунок.

Real-time колаборація.

Власна ML-модель.

Kubernetes, мікросервіси (Nest.js — монолит).

Соціальні фічі (коментарі, лайки).

Переписування Next.js API Routes на Nest.js.

Заміна NextAuth на Nest.js auth.

Точний розрахунок калорій з урахуванням способу приготування.

18. Принципи розподілу Next.js vs Nest.js
Задача	Де робити	Чому
SSR/SSG/ISR сторінок	Next.js	Це його робота
SEO metadata	Next.js	Metadata API
Пошук (швидкий)	Next.js API Route	Ближче до фронту
Авторизація	NextAuth.js	Готове рішення
Сортування за калоріями (UI)	Next.js + Redis	Читання ZSET
Cron-джоби	Nest.js	@nestjs/schedule
Черги	Nest.js + BullMQ	@nestjs/bull
Імпорт 60K рецептів	Nest.js	Довга задача
Збагачення nutrition	Nest.js	Batch + cron + API
Sitemap 60K URL	Nest.js	Не влізе в edge
Rate limiting	Nest.js + @nestjs/throttler	Централізовано
Health checks	Nest.js + Terminus	Стандарт
Тренди	Nest.js	Sorted Sets + cron
Прогрів кешу	Nest.js	Cron + batch
Rebuild ZSET-ів	Nest.js	Після імпорту/nutrition
Правило: якщо задача довша за 10 секунд, має розклад або batch — Nest.js. Якщо це рендеринг або швидкий API — Next.js.

19. Дисклеймер про калорії
На кожній сторінці рецепту та в JSON-LD:

«Харчова цінність розрахована автоматично на основі середніх значень інгредієнтів і може відрізнятися залежно від конкретних продуктів, порцій та способу приготування.»

Це захищає від претензій і відповідає практиці сайтів з рецептами.