# 06 — Сторінка рецепту через SSG

**Епік:** E2 — Перший рецепт
**Розмір:** M (2–3 год)
**Залежності:** 05
**Статус:** ⬜ Todo
**Гілка:** `feat/06-recipe-page-ssg`

---

## 🎯 Мета

Після завершення задачі користувач відкриває `http://localhost:3001/recipe/pasta-carbonara` і бачить повну сторінку рецепту: назву, фото, опис, інгредієнти, кроки, час приготування. Сторінка рендериться статично (SSG).

---

## 🔪 Вертикальний слайс

```
Браузер → /recipe/[slug]
    ↓
app/recipe/[slug]/page.tsx (Server Component)
    ↓
getRecipeBySlug(slug) з lib/strapi.ts
    ↓
Strapi API → Postgres
    ↓
HTML згенеровано на етапі build (SSG)
```

**Перевірка:** `pnpm build` генерує HTML для всіх 5 рецептів; `view-source` показує контент.

---

## ✅ Acceptance Criteria

- [ ] Є сторінка `app/recipe/[slug]/page.tsx`
- [ ] `/recipe/pasta-carbonara` відкривається без помилок
- [ ] Сторінка містить: назву, фото, опис, інгредієнти, кроки, час, порції, складність
- [ ] Використовується `notFound()` для неіснуючих slug → 404
- [ ] Сторінка — Server Component (без `"use client"`)
- [ ] Фото рендериться через звичайний `<img>` (не `next/image` — це задача 27)
- [ ] Інгредієнти відображаються списком з `name`, `amount`, `unit`
- [ ] Кроки відображаються як `<ol>` (нумерований список) або markdown-рендер
- [ ] `pnpm build` генерує HTML-файли для всіх 5 рецептів (перевірити `.next/server/app/recipe/`)
- [ ] `view-source` показує контент (не порожній div)
- [ ] Тимчасова сторінка `/test-recipes` **видалена**
- [ ] `pnpm exec tsc --noEmit` проходить без помилок

---

## 🚫 Що НЕ входить (out of scope)

- ❌ `generateStaticParams` (це задача 08) — поки що SSG «на льоту» через динамічний рендер
- ❌ `generateMetadata` (це задача 08) — поки що title буде дефолтний з layout
- ❌ JSON-LD (це задача 12)
- ❌ Canonical URL (це задача 11)
- ❌ Компоненти RecipeCard, IngredientList, Steps (це задача 07) — поки що все інлайн
- ❌ next/image (це задача 27)
- ❌ Схожі рецепти (пізніше)
- ❌ Хлібні крихти (це задача 12)
- ❌ Кнопка «Додати в колекцію» (це задача 30, опційно)
- ❌ Стилізація під мобільні (базова адаптивність через Tailwind — ок)

---

## 📁 Файли, які треба створити/змінити

### Створити в `apps/web`

- `app/recipe/[slug]/page.tsx`

### Змінити в `apps/web`

- `app/layout.tsx` — нічого не змінювати (залишаємо як є)
- `components/layout/Header.tsx` — нічого не змінювати

### Видалити

- `app/test-recipes/page.tsx` — тимчасова сторінка з задачі 05

### Не чіпати

- `lib/strapi.ts` — використовуємо як є
- `apps/api/**`
- `apps/cms/**`

---

## 🔧 Технічні деталі

### Структура сторінки

```tsx
// app/recipe/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <p className="mt-2 text-muted-foreground">{recipe.description}</p>
      </header>

      {recipe.image && (
        <img
          src={recipe.image.url}
          alt={recipe.image.alternativeText ?? recipe.title}
          className="mt-6 w-full rounded-lg"
          width={recipe.image.width}
          height={recipe.image.height}
        />
      )}

      <section className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <strong>Prep:</strong> {recipe.prepTime} min
        </div>
        <div>
          <strong>Cook:</strong> {recipe.cookTime} min
        </div>
        <div>
          <strong>Total:</strong> {totalTime} min
        </div>
        <div>
          <strong>Servings:</strong> {recipe.servings}
        </div>
        <div>
          <strong>Difficulty:</strong> {recipe.difficulty}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Ingredients</h2>
        <ul className="mt-4 list-disc pl-6 space-y-1">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.amount} {ing.unit} — {ing.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Steps</h2>
        <div className="mt-4 prose prose-slate">
          {recipe.steps}
        </div>
      </section>
    </article>
  );
}
```

### Важливі моменти

**1. `params` — це Promise (Next.js 15)**

У Next.js 15 `params` асинхронний. Обов'язково `await params`. Без цього — TypeScript-помилка.

**2. `notFound()` для неіснуючих рецептів**

Якщо `getRecipeBySlug` повертає `null` — викликаємо `notFound()`. Next.js покаже `404`. Для кастомної 404-сторінки — пізніше, окремо.

**3. `<img>` замість `next/image`**

Це свідоме спрощення. `next/image` вимагає налаштування `remotePatterns` для Strapi-URL, і це окрема задача (27). Поки що `<img>` з явними `width`/`height` (щоб не було layout shift).

**4. `recipe.steps` — це Markdown або HTML?**

Залежить від того, як налаштовано поле в Strapi. Якщо Rich Text (Markdown) → треба рендерити. Варіанти:
- Простий варіант: `<div className="whitespace-pre-wrap">{recipe.steps}</div>` — збереже переноси рядків.
- Складніший: `react-markdown` (потребує встановлення).

**Для задачі 06 — використовувати найпростіший варіант:** `<div className="whitespace-pre-wrap">`. Якщо треба красиво — окрема задача.

**5. Strapi image URL**

Strapi повертає `image.url` як відносний шлях (`/uploads/pasta.jpg`) або абсолютний (`http://localhost:1337/uploads/...`). Треба перевірити через `curl`.

**Якщо відносний:**
```tsx
src={`${env.STRAPI_URL}${recipe.image.url}`}
```

**Якщо абсолютний** — залишити як є.

### Перевірка через curl

```bash
curl -s "http://localhost:1337/api/recipes?filters[slug][\$eq]=pasta-carbonara&populate=*" | jq '.data[0].image.url'
```

Подивитись, чи URL починається з `/` чи з `http`.

### Видалення тимчасової сторінки

```bash
rm -rf apps/web/app/test-recipes
```

### Перевірка SSG

Після `pnpm build`:

```bash
ls .next/server/app/recipe/
```

**Що очікується:** поки що там може не бути HTML-файлів, бо `generateStaticParams` ще немає (це задача 08). Сторінка буде рендеритись на сервері при першому запиті (SSR-like), поки не додамо `generateStaticParams`.

**Важливо:** у задачі 06 ми робимо сторінку, яка **працює**, але повноцінний SSG буде у задачі 08. Це нормально.

**Що перевірити в 06:**
- `pnpm build` проходить без помилок.
- Сторінка відкривається в `pnpm dev`.
- `view-source` показує HTML.

### Sitemap для зображень

Поки що не робити. У задачі 27 (CWV) додамо `next/image` + `sizes` + `priority` для hero.

---

## 🧪 Як перевірити

1. `docker compose up -d` — Strapi працює.
2. `pnpm dev:web`.
3. Відкрити `http://localhost:3001/recipe/pasta-carbonara`.
4. Перевірити:
   - Є назва «Pasta Carbonara»
   - Є фото
   - Є опис
   - Є інгредієнти списком
   - Є кроки
   - Є prepTime, cookTime, servings, difficulty
5. Відкрити `http://localhost:3001/recipe/nonexistent` — має бути 404.
6. `view-source` → перевірити, що в HTML є назва рецепту (не порожній div).
7. Перевірити всі 5 рецептів:
   - `/recipe/pasta-carbonara`
   - `/recipe/miso-soup`
   - `/recipe/borscht`
   - `/recipe/tacos-al-pastor`
   - `/recipe/ratatouille`
8. `pnpm build` — без помилок.
9. Переконатись, що `/test-recipes` більше не існує (404).

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `params.slug` undefined | У Next.js 15 `params` — Promise, треба `await params` |
| 404 на існуючому рецепті | Перевірити `getRecipeBySlug` через `curl` |
| Фото не показується | Перевірити URL (відносний vs абсолютний), додати `STRAPI_URL` префікс |
| `ingredients` порожні | Перевірити `populate=*` у `lib/strapi.ts` |
| TypeScript скаржиться на `params` | Оновити тип: `params: Promise<{ slug: string }>` |
| Сторінка порожня в `view-source` | Перевірити, що це Server Component, а не Client |
| `recipe.steps` рендериться як HTML-теги | Використати `whitespace-pre-wrap` або `react-markdown` |
| Забув видалити `/test-recipes` | Видалити папку, перевірити 404 |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 4.2 (Сторінка рецепту)
- `00_CONTEXT.md` → розділ 9 (Моделі даних → Recipe)
- `01_ROADMAP.md` → E2 — Перший рецепт
- `docs/tasks/05-strapi-client.md`

---

## 💬 Commit message

```
feat(web): add recipe page with SSG

- add app/recipe/[slug]/page.tsx as Server Component
- render title, image, description, ingredients, steps, timing
- handle 404 via notFound() for missing slugs
- remove temporary /test-recipes page
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/06-recipe-page-ssg

# ... робота ...

git add apps/web
git commit -m "feat(web): add recipe page with SSG"
git push origin feat/06-recipe-page-ssg
```

**PR:**
- Назва: `feat(web): add recipe page with SSG`
- Опис: Acceptance Criteria + скріншот сторінки рецепту
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи були проблеми з `params` у Next.js 15?
- Як виглядає `recipe.steps` у Strapi — Markdown, HTML, plain text?
- Чи URL зображення відносний чи абсолютний?
- Чи треба винести рендер markdown в окрему задачу?
- Що винести в задачу 07 (компоненти)?