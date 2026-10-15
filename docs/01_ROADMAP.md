Recipe Atlas — Roadmap
Версія: 1.0
Оновлено: 2026-10-12
Пов'язані документи: 00_CONTEXT.md

## 📌 Правила роботи з задачами

1. Задачі створюються **по мірі виконання**, а не всі одразу.
2. На старті готові задачі: 01–06 (E1 + початок E2).
3. Після завершення задачі N — писати задачу N+1 на основі реального стану коду.
4. Агенту дається **тільки `00_CONTEXT.md` + одна задача**. Не давати весь roadmap.
5. Після кожної задачі — оновлювати статус у цьому файлі.

🎯 Як користуватись цим документом
Обери наступну задачу зі списку нижче (за прогресом і залежностями).

Відкрий відповідний файл у docs/tasks/[ID]-[slug].md.

Дай агенту контекст (00_CONTEXT.md) + цю задачу.

Після завершення — постав [x] тут і онови статус у файлі задачі.

Не починай задачу, якщо її залежності не виконані.

Правила:

Одна задача = одна сесія з агентом = ≤ 3 години.

Якщо задача L — розбий на дві перед початком.

Один PR на задачу.

Acceptance Criteria перевіряються в браузері, а не «на око».

📊 Загальна статистика
Метрика Значення
Всього епіків 7
Всього задач 30
Оціночний час 8 тижнів
Задач на тиждень ~4
Розмір S (1–2 год) 13
Розмір M (2–3 год) 14
Розмір L (3+ год) 3
🗺️ Епіки
ID Епік Задач Тиждень
E1 Foundation 4 1
E2 Перший рецепт 4 1–2
E3 Каталог + SEO-база 5 2–3
E4 i18n + Programmatic SEO 4 3–4
E5 Redis + Nest.js 5 5
E6 Nutrition + калорії 4 6
E7 Infra + якість 4 7–8
📦 E1 — Foundation
Мета: робочий монорепо з трьома apps, Docker-оточенням і першою моделлю в Strapi.

Deliverable: pnpm dev піднімає Next.js, Strapi, Postgres і Redis; у Strapi є модель Recipe з 5 тестовими рецептами.

ID Задача Розмір Залежності Статус
01 Monorepo + pnpm workspaces + базові apps M — ✅
02 Docker Compose: Postgres + Redis + Strapi M 01 ✅
03 Strapi: модель Recipe + 5 тестових рецептів S 02 ✅
| 03a | Seed-скрипт для Strapi (5 тестових рецептів) | S | 03 | ✅ |
04 Next.js: layout, Tailwind, shadcn, навігація S 01 ✅
Done, коли:

pnpm install працює без помилок.

docker compose up піднімає Postgres, Redis, Strapi.

pnpm dev запускає Next.js на localhost:3001 і Strapi на localhost:1337.

У Strapi Admin (localhost:1337/admin) є 5 рецептів.

### E1 — Foundation ✅ завершено

- Монорепо з pnpm workspaces
- Docker Compose: Postgres + Redis + Strapi
- Strapi з моделлю Recipe + 5 рецептів
- Next.js з базовим layout

📦 E2 — Перший рецепт
Мета: рендеринг одного рецепту через SSG з усіма компонентами.

Deliverable: /uk/recipe/pasta-carbonara рендериться статично, має правильні метадані.

ID Задача Розмір Залежності Статус
05 Strapi-клієнт + типи Recipe у Next.js S 03 ✅
06 Сторінка /recipe/[slug] через SSG M 05, 04 ⬜
07 Компоненти: RecipeCard, IngredientList, Steps M 06 ⬜
08 generateStaticParams + generateMetadata S 06 ⬜
Done, коли:

/recipe/[slug] рендериться для всіх 5 рецептів.

У <head> є унікальні title і description.

Сторінка має фото, інгредієнти, кроки.

Lighthouse не скаржиться на критичні помилки.

📦 E3 — Каталог + SEO-база
Мета: список рецептів, базові SEO-елементи, sitemap, JSON-LD.

Deliverable: /uk/recipes показує всі рецепти; є sitemap.xml, robots.txt, JSON-LD.

ID Задача Розмір Залежності Статус
09 Сторінка /recipes — список усіх рецептів (SSG) S 07 ⬜
10 Сторінка /recipes/[country] — ISR (revalidate 1h) M 09 ⬜
11 Metadata API: title, description, canonical S 06 ⬜
12 JSON-LD Recipe + BreadcrumbList M 06 ⬜
13 app/sitemap.ts + app/robots.ts S 10 ⬜
Done, коли:

/uk/recipes показує всі рецепти.

/uk/recipes/italy рендериться через ISR.

sitemap.xml містить усі URL.

Google Rich Results Test бачить Recipe і BreadcrumbList.

📦 E4 — i18n + Programmatic SEO
Мета: мультимовність і дерево programmatic-сторінок.

Deliverable: /uk/... і /en/... працюють; є 100+ programmatic-сторінок з hreflang.

ID Задача Розмір Залежності Статус
14 i18n: [locale], словники uk/en M 04 ⬜
15 hreflang + alternate в sitemap M 14, 13 ⬜
16 Сторінки /recipes/[country]/[cuisine] — ISR M 14 ⬜
17 Сторінки /recipes/[country]/[cuisine]/[dish] — ISR M 16 ⬜
Done, коли:

Перемикач мови працює.

hreflang є на кожній сторінці.

Sitemap містить alternate для uk/en.

generateStaticParams генерує 100+ URL.

📦 E5 — Redis + Nest.js
Мета: кеш, фонові задачі, rate limiting.

Deliverable: Strapi-відповіді кешуються в Redis; Nest.js імпортує рецепти з TheMealDB через cron.

ID Задача Розмір Залежності Статус
18 Redis: cache-aside для Strapi-клієнта M 05, 02 ⬜
19 Nest.js: skeleton у монорепо + HealthModule M 01 ⬜
20 Nest.js: ImportModule (TheMealDB → Postgres) L 19 ⬜
21 Nest.js: CacheModule + ZSET rebuild M 18, 19 ⬜
22 Rate limiting: @nestjs/throttler + Redis M 19 ⬜
Done, коли:

redis-cli KEYS "strapi:\*" показує кешовані ключі.

Cron в Nest.js щодня імпортує рецепти.

/health повертає статус усіх сервісів.

61-й запит за хвилину отримує 429.

Нотатка: задачу 20 (L) можна розбити на 20a (skeleton модуля + endpoint) і 20b (cron + інвалідація кешу).

📦 E6 — Nutrition + калорії
Мета: калорії, фільтри, сортування.

Deliverable: кожен рецепт має калорії; можна сортувати й фільтрувати за ними.

ID Задача Розмір Залежності Статус
23 Strapi: поля nutrition у Recipe + індекси S 03 ⬜
24 Nest.js: NutritionModule + USDA-клієнт L 19, 23 ⬜
25 UI: відображення калорій на сторінці рецепту M 23, 06 ⬜
26 UI: фільтри та сортування за калоріями M 25, 21 ⬜
Done, коли:

80% рецептів мають calories.

На сторінці рецепту видно калорії + disclaimer.

/uk/recipes?sort=calories:asc працює.

/uk/recipes/low-calorie показує рецепти < 300 ккал.

Нотатка: задачу 24 (L) можна розбити на 24a (USDA-клієнт + один рецепт) і 24b (batch + cron).

📦 E7 — Infra + якість
Мета: продуктивність, CI/CD, моніторинг, A/B.

Deliverable: Lighthouse ≥ 95, автодеплой, Sentry, PostHog.

ID Задача Розмір Залежності Статус
27 Core Web Vitals: next/image, next/font, Lighthouse ≥ 95 M 17 ⬜
28 CI/CD: GitHub Actions (lint, type-check, build) M 01 ⬜
29 Sentry + Vercel Analytics S 28 ⬜
30 PostHog + A/B-флаг на CTA M 29 ⬜
Done, коли:

Lighthouse Performance ≥ 95 на 3 ключових сторінках.

PR не мержиться без зелених CI-чеків.

Sentry ловить помилки з Next.js і Nest.js.

A/B-флаг на CTA повертає 2 варіанти.

📅 Тижневий план
Тиждень Епіки Задачі Deliverable
1 E1 01–04 Монорепо + Docker + Strapi + Next.js
2 E2, E3 (старт) 05–09 Перший рецепт + список рецептів
3 E3, E4 (старт) 10–14 SEO-база + i18n
4 E4 15–17 Programmatic SEO: 100+ сторінок
5 E5 18–22 Redis + Nest.js + rate limiting
6 E6 23–26 Nutrition + калорії
7 E7 (старт) 27–28 CWV + CI/CD
8 E7 29–30 Sentry + PostHog + A/B
🔗 Граф залежностей
text
01 ──┬─→ 02 ─→ 03 ─→ 05 ─→ 06 ─┬─→ 07 ─→ 09 ─→ 10 ─→ 13
│ │
└─→ 04 ─→ 14 ─→ 15 ├─→ 08
│ │
└─→ 16 ─→ 17 └─→ 11
│
└─→ 12

01 ─→ 19 ─┬─→ 20
├─→ 21 ─→ 26
└─→ 22

03 ─→ 23 ─→ 24
│
└─→ 25 ─→ 26

01 ─→ 28 ─→ 29 ─→ 30

17 ─→ 27
Правило: не починай задачу, якщо хоч одна залежність у статусі ⬜.

🏁 Критерії готовності всього проєкту
□ Всі 30 задач у статусі ✅
□ Lighthouse Performance ≥ 95 на головній, каталозі, рецепті
□ Sitemap містить 500+ URL з hreflang
□ > 80% рецептів мають калорії
□ Nest.js cron працює щодня
□ Redis кешує Strapi-відповіді
□ CI/CD зелений
□ Sentry і PostHog підключені
□ A/B-флаг на CTA працює
□ README + docs/ актуальні
📝 Позначки статусів
Символ Значення
⬜ Todo
🟡 In progress
🔴 Blocked
✅ Done
⏸️ Paused
🔄 Як оновлювати цей документ
Після завершення задачі — зміни ⬜ на ✅ у таблиці епіку.

Якщо задача заблокована — 🔴 + причина в файлі задачі.

Якщо додаєш нову задачу — додай у відповідний епік + онови статистику вгорі.

Раз на тиждень — перевір, чи не з'їхав план.

📎 Пов'язані документи
00_CONTEXT.md — повний контекст проєкту

docs/tasks/[ID]-[slug].md — деталі кожної задачі

docs/epics/[E]-[slug].md — деталі епіків

docs/templates/TASK_TEMPLATE.md — шаблон задачі

## 📝 Нотатки

Заповнено після завершення.

**Відхилення від тексту задачі (усі — правильні):**

- `context: .` замість `./apps/cms` — pnpm workspace вимагає корінь.
- `.dockerignore` — без нього `COPY . .` тягне хостовий `node_modules`.
- `pg` — обов'язковий драйвер для Postgres у Strapi.
- `ENCRYPTION_KEY` — `config/admin.ts` його читає.
- Прибрано named volume `strapi_uploads` — bind-mount зберігає uploads на хості.

**Висновок:** задача 02 була написана наївно, без урахування pnpm workspaces і особливостей Strapi 5. Реальна реалізація вимагала 5 відхилень — усі виправдані.

- `steps` — Strapi richtext (у Strapi 5 немає окремого markdown-типу).
- Права `find`/`findOne` увімкнено вручну — у Strapi 5 колекції приватні за замовчуванням.
- 5 рецептів створено вручну через Admin UI.
- Seed-скрипт — out of scope, буде в задачі 20 (Nest.js ImportModule).
