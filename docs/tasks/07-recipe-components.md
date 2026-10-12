# 07 — Компоненти: RecipeCard, IngredientList, Steps, MetaInfo

**Епік:** E2 — Перший рецепт
**Розмір:** M (2–3 год)
**Залежності:** 06
**Статус:** ⬜ Todo
**Гілка:** `feat/07-recipe-components`

---

## 🎯 Мета

Після завершення задачі сторінка рецепту розбита на перевикористовувані компоненти. Замість інлайн-розмітки у `page.tsx` — окремі компоненти `RecipeCard`, `IngredientList`, `Steps`, `RecipeMeta`. Сторінка рецепту виглядає так само, але код структурований.

---

## 🔪 Вертикальний слайс

```
app/recipe/[slug]/page.tsx
    ├─→ <RecipeHeader />     (title, description, image)
    ├─→ <RecipeMeta />       (prep, cook, servings, difficulty)
    ├─→ <IngredientList />   (список інгредієнтів)
    └─→ <Steps />            (кроки)
```

**Перевірка:** сторінка рендериться ідентично до задачі 06, але код розбитий.

---

## ✅ Acceptance Criteria

- [ ] Є компонент `components/recipe/RecipeHeader.tsx` (title, description, image)
- [ ] Є компонент `components/recipe/RecipeMeta.tsx` (prep, cook, total, servings, difficulty)
- [ ] Є компонент `components/recipe/IngredientList.tsx` (список інгредієнтів)
- [ ] Є компонент `components/recipe/Steps.tsx` (кроки)
- [ ] Є компонент `components/recipe/RecipeCard.tsx` (компактна картка для списку — поки не використовується, але створена)
- [ ] Є `components/recipe/index.ts` з barrel-експортом
- [ ] `app/recipe/[slug]/page.tsx` використовує ці компоненти, а не інлайн-розмітку
- [ ] Сторінка виглядає так само, як у задачі 06
- [ ] Кожен компонент має типізовані props (без `any`)
- [ ] Кожен компонент — Server Component (без `"use client"`)
- [ ] `pnpm typecheck` — без помилок
- [ ] `pnpm build` — без помилок
- [ ] Lighthouse Accessibility ≥ 90 на сторінці рецепту

---

## 🚫 Що НЕ входить (out of scope)

- ❌ `next/image` (це задача 27)
- ❌ JSON-LD (це задача 12)
- ❌ Використання `RecipeCard` у списку — список буде у задачі 09
- ❌ Схожі рецепти
- ❌ Кнопки дій (зберегти, поділитись)
- ❌ Анімації
- ❌ Dark mode
- ❌ Markdown-рендер для кроків (використовуємо `whitespace-pre-wrap`, як у задачі 06)
- ❌ Кастомні шрифти для рецепту
- ❌ Хлібні крихти
- ❌ Стилізація під mobile окремо (базова адаптивність — ок)

---

## 📁 Файли, які треба створити/змінити

### Створити в `apps/web`

- `components/recipe/RecipeHeader.tsx`
- `components/recipe/RecipeMeta.tsx`
- `components/recipe/IngredientList.tsx`
- `components/recipe/Steps.tsx`
- `components/recipe/RecipeCard.tsx`
- `components/recipe/index.ts`

### Змінити в `apps/web`

- `app/recipe/[slug]/page.tsx` — замінити інлайн на компоненти

### Не чіпати

- `lib/strapi.ts` — типи використовуємо як є
- `components/layout/**`
- `components/ui/**`
- `apps/api/**`
- `apps/cms/**`

---

## 🔧 Технічні деталі

### Загальні правила для компонентів

- **Server Components** — без `"use client"`.
- **Типізовані props** — імпортувати типи з `@/lib/strapi`.
- **Без логіки у компонентах** — тільки рендер.
- **Tailwind** — стилі через класи.
- **Семантичні теги** — `<section>`, `<article>`, `<ol>`, `<dl>` де доречно.
- **Accessibility** — `alt` для зображень, `aria-label` де треба.

### `RecipeHeader.tsx`

```tsx
import type { Recipe } from '@/lib/strapi';
import { env } from '@/lib/env';

interface Props {
  recipe: Recipe;
}

export function RecipeHeader({ recipe }: Props) {
  const imageUrl = recipe.image?.url.startsWith('http')
    ? recipe.image.url
    : `${env.STRAPI_URL}${recipe.image?.url}`;

  return (
    <header>
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="mt-2 text-muted-foreground">{recipe.description}</p>
      {recipe.image && (
        <img
          src={imageUrl}
          alt={recipe.image.alternativeText ?? recipe.title}
          className="mt-6 w-full rounded-lg"
          width={recipe.image.width}
          height={recipe.image.height}
        />
      )}
    </header>
  );
}
```

### `RecipeMeta.tsx`

```tsx
interface Props {
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function RecipeMeta({ prepTime, cookTime, servings, difficulty }: Props) {
  const total = prepTime + cookTime;

  return (
    <dl className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
      <div>
        <dt className="text-muted-foreground">Prep</dt>
        <dd className="font-medium">{prepTime} min</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Cook</dt>
        <dd className="font-medium">{cookTime} min</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Total</dt>
        <dd className="font-medium">{total} min</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Servings</dt>
        <dd className="font-medium">{servings}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Difficulty</dt>
        <dd className="font-medium capitalize">{difficulty}</dd>
      </div>
    </dl>
  );
}
```

**Нотатка:** `<dl>`, `<dt>`, `<dd>` — семантично правильний markup для key-value пар.

### `IngredientList.tsx`

```tsx
import type { Ingredient } from '@/lib/strapi';

interface Props {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: Props) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">Ingredients</h2>
      <ul className="mt-4 list-disc pl-6 space-y-1">
        {ingredients.map((ing, idx) => (
          <li key={idx}>
            <span className="font-medium">
              {ing.amount} {ing.unit}
            </span>{' '}
            — {ing.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `Steps.tsx`

```tsx
interface Props {
  steps: string;
}

export function Steps({ steps }: Props) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">Steps</h2>
      <div className="mt-4 whitespace-pre-wrap leading-relaxed">
        {steps}
      </div>
    </section>
  );
}
```

**Нотатка:** поки що `whitespace-pre-wrap`. Якщо у Strapi `steps` — Markdown, це пізніше можна замінити на `react-markdown`. **Це окрема задача, не входить у 07.**

### `RecipeCard.tsx` (для списку, поки не використовується)

```tsx
import Link from 'next/link';
import type { Recipe } from '@/lib/strapi';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-md transition">
      <Link href={`/recipe/${recipe.slug}`} className="block">
        <div className="aspect-video bg-muted" />
        <div className="p-4">
          <h3 className="font-semibold">{recipe.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {recipe.prepTime + recipe.cookTime} min · {recipe.difficulty}
          </p>
        </div>
      </Link>
    </article>
  );
}
```

**Нотатки:**
- Фото поки що не рендериться — тільки заглушка `bg-muted`. Це щоб не тягнути `next/image` (задача 27).
- `line-clamp-2` — Tailwind утиліта для обрізання тексту (потребує `@tailwindcss/line-clamp` — у Tailwind 3.3+ вже вбудовано).
- Компонент створюється «на майбутнє» — щоб у задачі 09 не відволікатись.

### `index.ts` (barrel export)

```ts
export { RecipeHeader } from './RecipeHeader';
export { RecipeMeta } from './RecipeMeta';
export { IngredientList } from './IngredientList';
export { Steps } from './Steps';
export { RecipeCard } from './RecipeCard';
```

### `app/recipe/[slug]/page.tsx` — оновлена версія

```tsx
import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/lib/strapi';
import {
  RecipeHeader,
  RecipeMeta,
  IngredientList,
  Steps,
} from '@/components/recipe';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <RecipeHeader recipe={recipe} />
      <RecipeMeta
        prepTime={recipe.prepTime}
        cookTime={recipe.cookTime}
        servings={recipe.servings}
        difficulty={recipe.difficulty}
      />
      <IngredientList ingredients={recipe.ingredients} />
      <Steps steps={recipe.steps} />
    </article>
  );
}
```

**Що змінилось:**
- Інлайн-розмітка → компоненти.
- Логіка `totalTime` переїхала в `RecipeMeta`.
- URL-обробка зображення переїхала в `RecipeHeader`.

### Перевірка «нічого не зламалось»

Після рефакторингу сторінка має виглядати **ідентично** до задачі 06. Якщо є візуальні відмінності — щось пішло не так.

---

## 🧪 Як перевірити

1. `pnpm dev:web`.
2. Відкрити `http://localhost:3001/recipe/pasta-carbonara`.
3. Порівняти з тим, як виглядало після задачі 06 — має бути ідентично.
4. Перевірити всі 5 рецептів.
5. `view-source` — перевірити, що HTML містить семантичні теги:
   - `<article>`
   - `<header>`
   - `<section>`
   - `<dl>`, `<dt>`, `<dd>`
   - `<ul>`
6. Chrome DevTools → Lighthouse → Accessibility ≥ 90.
7. `pnpm typecheck` — без помилок.
8. `pnpm build` — без помилок.

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `recipe.image` null → помилка | Перевірити `recipe.image?.url` з optional chaining |
| Фото не рендериться | Перевірити, чи URL відносний (тоді префікс `STRAPI_URL`) |
| `line-clamp-2` не працює | Перевірити Tailwind 3.3+ (там вбудовано) |
| TS скаржиться на props | Імпортувати типи з `@/lib/strapi` |
| Сторінка виглядає інакше | Порівняти класи Tailwind з задачею 06 |
| Barrel export не резолвиться | Перевірити `index.ts` і alias `@/` у `tsconfig.json` |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 4.2 (Сторінка рецепту)
- `00_CONTEXT.md` → розділ 8 (Структура репозиторію → components/recipe/)
- `01_ROADMAP.md` → E2 — Перший рецепт
- `docs/tasks/06-recipe-page-ssg.md`

---

## 💬 Commit message

```
refactor(web): extract recipe page into reusable components

- add RecipeHeader, RecipeMeta, IngredientList, Steps components
- add RecipeCard for future list page (not used yet)
- add components/recipe/index.ts barrel export
- simplify app/recipe/[slug]/page.tsx to compose components
- use semantic dl/dt/dd for recipe meta
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/07-recipe-components

# ... робота ...

git add apps/web
git commit -m "refactor(web): extract recipe page into reusable components"
git push origin feat/07-recipe-components
```

**PR:**
- Назва: `refactor(web): extract recipe page into reusable components`
- Опис: Acceptance Criteria + скріншот до/після
- Після merge — видалити гілку

**Нотатка:** `refactor`, а не `feat` — бо поведінка не змінюється, тільки структура коду.

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи знадобились додаткові компоненти (наприклад, `RecipeImage` окремо)?
- Чи `RecipeCard` виглядає так, як треба для задачі 09?
- Чи потрібен `react-markdown` для кроків (окрема задача)?
- Що винести в задачу 08 (generateStaticParams)?