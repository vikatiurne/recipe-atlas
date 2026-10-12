# 05 — Strapi-клієнт + типи Recipe у Next.js

**Епік:** E2 — Перший рецепт
**Розмір:** S (1–2 год)
**Залежності:** 03, 04
**Статус:** ⬜ Todo
**Гілка:** `feat/05-strapi-client`

---

## 🎯 Мета

Після завершення задачі в `apps/web` є типізований клієнт для Strapi API з функціями `getRecipes()` і `getRecipeBySlug(slug)`. Тип `Recipe` описано в `lib/strapi.ts` і відповідає схемі зі Strapi. Можна викликати функції з Server Component і отримати типізовані дані.

---

## 🔪 Вертикальний слайс

```
Server Component
    ↓
lib/strapi.ts → getRecipes() / getRecipeBySlug()
    ↓
fetch(process.env.STRAPI_URL + '/api/recipes?populate=*')
    ↓
Strapi API → Postgres
    ↓
Типізований Recipe[]
```

**Перевірка:** тимчасова сторінка `/test-recipes` рендерить назви 5 рецептів зі Strapi.

---

## ✅ Acceptance Criteria

- [ ] У `apps/web/.env.local` є `STRAPI_URL=http://localhost:1337`
- [ ] `.env.local` у `.gitignore`
- [ ] Є `.env.example` з `STRAPI_URL`
- [ ] Є `apps/web/lib/strapi.ts` з типами `Recipe`, `Ingredient`, `StrapiResponse<T>`
- [ ] Є функції `getRecipes()`, `getRecipeBySlug(slug)`
- [ ] Функції повертають типізовані дані (не `any`)
- [ ] Є `apps/web/lib/env.ts` з валідацією env через Zod
- [ ] Тимчасова сторінка `app/test-recipes/page.tsx` рендерить назви всіх рецептів
- [ ] `pnpm dev:web` → `http://localhost:3001/test-recipes` показує 5 назв
- [ ] `pnpm build:web` проходить без помилок
- [ ] `pnpm typecheck` проходить без помилок

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Сторінка рецепту (це задача 06)
- ❌ Компоненти RecipeCard, IngredientList (це задача 07)
- ❌ generateStaticParams (це задача 08)
- ❌ Кеш Redis (це задача 18)
- ❌ ISR / revalidate (це задача 10)
- ❌ Обробка помилок з UI (toast, error boundary) — тільки `throw new Error`
- ❌ Пагінація, фільтри, сортування
- ❌ Локалізація (`?locale=en`) — це задача 14
- ❌ GraphQL — тільки REST

---

## 📁 Файли, які треба створити/змінити

### Створити в `apps/web`

- `lib/strapi.ts` — клієнт + типи
- `lib/env.ts` — валідація env
- `.env.local` — локальні змінні (у `.gitignore`)
- `.env.example` — шаблон
- `app/test-recipes/page.tsx` — тимчасова сторінка для перевірки

### Змінити в `apps/web`

- `.gitignore` — додати `.env.local` (якщо ще немає)
- `package.json` — додати `zod` у залежності

### Не чіпати

- `apps/api/**`
- `apps/cms/**`
- `packages/shared/**` (типи поки що локальні для web)
- `docker-compose.yml`

---

## 🔧 Технічні деталі

### Встановлення залежностей

```bash
cd apps/web
pnpm add zod
```

### `.env.local`

```bash
STRAPI_URL=http://localhost:1337
```

### `.env.example` (у корені `apps/web`)

```bash
STRAPI_URL=http://localhost:1337
```

### `lib/env.ts`

```ts
import { z } from 'zod';

const envSchema = z.object({
  STRAPI_URL: z.string().url(),
});

export const env = envSchema.parse({
  STRAPI_URL: process.env.STRAPI_URL,
});
```

**Нотатка:** валідація при імпорті — якщо `STRAPI_URL` відсутній, застосунок впаде з чіткою помилкою на старті, а не десь у рантаймі.

### `lib/strapi.ts` — структура

```ts
import { env } from './env';

// ---------- Types ----------

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeImage {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface Recipe {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  image: RecipeImage | null;
  ingredients: Ingredient[];
  steps: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

interface StrapiEntity<T> {
  id: number;
  documentId: string;
  attributes?: T; // Strapi 4
  // Strapi 5 — поля на верхньому рівні
}

// ---------- Client ----------

async function fetchStrapi<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${env.STRAPI_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

// ---------- Public API ----------

export async function getRecipes(): Promise<Recipe[]> {
  const res = await fetchStrapi<StrapiResponse<Recipe[]>>(
    '/api/recipes?populate=*'
  );
  return res.data;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const res = await fetchStrapi<StrapiResponse<Recipe[]>>(
    `/api/recipes?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return res.data[0] ?? null;
}
```

**Нотатки:**
- Strapi 5 повертає поля на верхньому рівні (без `attributes`). Якщо у вас Strapi 4 — треба змінити тип і мапінг. Перевірте через `curl`.
- `documentId` — нове поле Strapi 5, замінює `id` для публічних URL.
- `populate=*` — щоб отримати `image` та `ingredients`.
- `encodeURIComponent` — захист від ін'єкцій у slug.

### Тимчасова сторінка `app/test-recipes/page.tsx`

```tsx
import { getRecipes } from '@/lib/strapi';

export default async function TestRecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Test Recipes ({recipes.length})</h1>
      <ul className="mt-4 space-y-2">
        {recipes.map((r) => (
          <li key={r.documentId}>
            <strong>{r.title}</strong> — {r.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Ця сторінка буде видалена в задачі 06** — вона тільки для перевірки клієнта.

### Як перевірити формат відповіді Strapi

Перед тим як писати типи, перевір, як саме Strapi повертає дані:

```bash
curl -s "http://localhost:1337/api/recipes?populate=*&pagination[limit]=1" | jq '.data[0]'
```

**Якщо побачиш:**
```json
{
  "id": 1,
  "documentId": "abc123",
  "title": "...",
  "slug": "...",
  "image": { "url": "..." },
  "ingredients": [...]
}
```
→ це Strapi 5, тип вище правильний.

**Якщо побачиш:**
```json
{
  "id": 1,
  "attributes": {
    "title": "...",
    "image": { "data": { "attributes": { "url": "..." } } }
  }
}
```
→ це Strapi 4, треба інші типи й мапінг. У такому разі **зупинись і повідом мені** — я оновлю задачу.

### Правила роботи з типами

- `Recipe` — точна копія структури відповіді Strapi.
- **Не використовувати `any`** — якщо TypeScript скаржиться, це сигнал, що тип не відповідає реальності.
- Якщо якесь поле опційне у Strapi — позначити `?`.
- **Не додавати поля, яких немає в API.** Наприклад, `calories` поки що немає в Strapi — не додавати в тип.

---

## 🧪 Як перевірити

1. `docker compose up -d` — Strapi працює.
2. Перевірити, що `.env.local` існує з `STRAPI_URL`.
3. `pnpm dev:web`.
4. Відкрити `http://localhost:3001/test-recipes`.
5. Перевірити:
   - Видно «Test Recipes (5)»
   - Список з 5 назв: Pasta Carbonara, Miso Soup, Borscht, Tacos al Pastor, Ratatouille
   - Кожен рядок має `title — slug`
6. `pnpm typecheck` — без помилок.
7. `pnpm build` — без помилок.
8. **Перевірка типів:** спробувати звернутись до `recipe.calories` у `page.tsx` — має бути помилка TypeScript (бо поля немає). Видалити.

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `STRAPI_URL is undefined` | Перевірити `.env.local`, перезапустити `pnpm dev` |
| 403 від Strapi | Увімкнути `find`/`findOne` для Public role (задача 03) |
| `image: null` | Перевірити `populate=*` у URL |
| `ingredients` порожні | Перевірити `populate=*` або `populate[ingredients]=*` |
| Сторінка порожня | Перевірити, чи це Server Component (без `"use client"`) |
| TypeScript скаржиться на `data[0]` | Перевірити, що `data` — масив; Strapi завжди повертає масив для list |
| Strapi 5 vs 4 | Перевірити `curl` перед написанням типів |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 6 (Технічний стек)
- `00_CONTEXT.md` → розділ 9 (Моделі даних → Recipe)
- `01_ROADMAP.md` → E2 — Перший рецепт
- `docs/tasks/03-recipe-model-strapi.md`
- `docs/tasks/04-layout-tailwind-shadcn.md`

---

## 💬 Commit message

```
feat(web): add typed strapi client with Recipe types

- add lib/env.ts with zod validation for STRAPI_URL
- add lib/strapi.ts with Recipe, Ingredient, StrapiResponse types
- add getRecipes() and getRecipeBySlug() functions
- add temporary /test-recipes page to verify client
- add .env.example with STRAPI_URL
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/05-strapi-client

# ... робота ...

git add apps/web
git commit -m "feat(web): add typed strapi client with Recipe types"
git push origin feat/05-strapi-client
```

**PR:**
- Назва: `feat(web): add typed strapi client with Recipe types`
- Опис: Acceptance Criteria + скріншот `/test-recipes`
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Яка версія Strapi — 5 чи 4?
- Чи знадобилось коригувати типи після реальної відповіді API?
- Чи є поля, яких не вистачає в типі Recipe?
- Чи треба винести типи в `packages/shared` (це задача для i18n)?
- Що винести в окрему задачу (наприклад, типізація помилок)?