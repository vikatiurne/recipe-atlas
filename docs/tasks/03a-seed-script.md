# 03a — Seed-скрипт для Strapi (5 тестових рецептів)

**Епік:** E1 — Foundation (bonus)
**Розмір:** S (1–2 год)
**Залежності:** 03
**Статус:** ⬜ Todo
**Гілка:** `feat/03a-seed-script`

---

## 🎯 Мета

Після завершення задачі при першому старті Strapi (або після `docker compose down -v`) у БД автоматично створюються 5 тестових рецептів у статусі `published`. Повторний старт не створює дублів. Дані можна відтворити однією командою — без ручного введення через Admin UI.

---

## 🔪 Вертикальний слайс

```
Strapi starts
    ↓
src/index.ts → bootstrap()
    ↓
seed/index.ts → seedRecipes(strapi)
    ↓
count() → if 0 → create 5 recipes (status: published)
    ↓
Postgres: таблиця recipes наповнена
    ↓
GET /api/recipes → 5 published рецептів
```

**Перевірка:** `docker compose down -v && up -d` → після старту `curl` повертає 5 рецептів без жодних дій в Admin UI.

---

## ✅ Acceptance Criteria

- [ ] Є `apps/cms/src/seed/recipes.ts` з масивом 5 рецептів
- [ ] Є `apps/cms/src/seed/index.ts` з функцією `seedRecipes(strapi)`
- [ ] `apps/cms/src/index.ts` викликає `seedRecipes` у `bootstrap()`
- [ ] Seed ідемпотентний: якщо рецептів > 0 — нічого не робить
- [ ] Усі 5 рецептів створюються зі `status: 'published'`
- [ ] Після `docker compose down -v && docker compose up -d`:
  - `curl -s http://localhost:1337/api/recipes | jq '.data | length'` → `5`
- [ ] Повторний `docker compose restart strapi` не створює дублів (все ще `5`)
- [ ] `pnpm typecheck` — без помилок
- [ ] `pnpm build` — без помилок
- [ ] У логах Strapi при першому старті — `Seeded 5 recipes`

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Завантаження зображень (фото рецептів) — поки що seed без `image`.
- ❌ Seed для `Country`, `Cuisine`, `DishType`, `Ingredient`, `Diet` — цих моделей ще немає.
- ❌ Імпорт з TheMealDB або Kaggle — це задача 20.
- ❌ Оновлення існуючих рецептів (upsert) — тільки create, якщо порожньо.
- ❌ CLI-команда `pnpm --filter cms seed` — використовуємо bootstrap.
- ❌ Видалення рецептів.
- ❌ Тести для seed.

---

## 📁 Файли, які треба створити/змінити

### Створити в `apps/cms`

- `src/seed/recipes.ts` — масив з 5 об'єктів рецептів
- `src/seed/index.ts` — функція `seedRecipes(strapi)`

### Змінити в `apps/cms`

- `src/index.ts` — викликати `seedRecipes` у `bootstrap`

### Не чіпати

- `apps/web/**`
- `apps/api/**`
- `packages/shared/**`
- `docker-compose.yml`
- `apps/cms/src/api/recipe/**` (схема моделі не змінюється)
- `apps/cms/src/components/**`

---

## 🔧 Технічні деталі

### Схема Recipe — нагадування

```
title, slug, description, ingredients[], steps,
prepTime, cookTime, servings, difficulty
```

`ingredients` — repeatable component `shared.ingredient` з полями `name`, `amount`, `unit`.

`image` — залишаємо `null` у seed.

### `apps/cms/src/seed/recipes.ts`

```ts
export interface SeedRecipe {
  title: string;
  slug: string;
  description: string;
  ingredients: { name: string; amount: number; unit: string }[];
  steps: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const seedRecipes: SeedRecipe[] = [
  {
    title: 'Pasta Carbonara',
    slug: 'pasta-carbonara',
    description: 'Classic Italian pasta with eggs, cheese, guanciale and black pepper.',
    ingredients: [
      { name: 'Spaghetti', amount: 200, unit: 'g' },
      { name: 'Guanciale', amount: 100, unit: 'g' },
      { name: 'Egg yolks', amount: 4, unit: 'pcs' },
      { name: 'Pecorino Romano', amount: 50, unit: 'g' },
      { name: 'Black pepper', amount: 1, unit: 'tsp' },
    ],
    steps: '1. Boil pasta. 2. Fry guanciale. 3. Mix eggs with cheese. 4. Combine off heat. 5. Serve with pepper.',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'medium',
  },
  {
    title: 'Miso Soup',
    slug: 'miso-soup',
    description: 'Traditional Japanese soup with miso paste, tofu and seaweed.',
    ingredients: [
      { name: 'Miso paste', amount: 2, unit: 'tbsp' },
      { name: 'Dashi stock', amount: 600, unit: 'ml' },
      { name: 'Tofu', amount: 100, unit: 'g' },
      { name: 'Wakame', amount: 5, unit: 'g' },
      { name: 'Green onions', amount: 2, unit: 'pcs' },
    ],
    steps: '1. Heat dashi. 2. Add tofu and wakame. 3. Dissolve miso. 4. Garnish with onions.',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
  },
  {
    title: 'Borscht',
    slug: 'borscht',
    description: 'Traditional Ukrainian beetroot soup with cabbage and sour cream.',
    ingredients: [
      { name: 'Beets', amount: 3, unit: 'pcs' },
      { name: 'Cabbage', amount: 300, unit: 'g' },
      { name: 'Potatoes', amount: 4, unit: 'pcs' },
      { name: 'Beef broth', amount: 2, unit: 'l' },
      { name: 'Sour cream', amount: 100, unit: 'g' },
    ],
    steps: '1. Boil broth. 2. Add potatoes and cabbage. 3. Add grated beets. 4. Simmer 20 min. 5. Serve with sour cream.',
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    difficulty: 'medium',
  },
  {
    title: 'Tacos al Pastor',
    slug: 'tacos-al-pastor',
    description: 'Mexican tacos with marinated pork, pineapple and cilantro.',
    ingredients: [
      { name: 'Pork shoulder', amount: 500, unit: 'g' },
      { name: 'Pineapple', amount: 200, unit: 'g' },
      { name: 'Corn tortillas', amount: 8, unit: 'pcs' },
      { name: 'Cilantro', amount: 20, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
    ],
    steps: '1. Marinate pork. 2. Grill with pineapple. 3. Chop finely. 4. Warm tortillas. 5. Assemble with cilantro and onion.',
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
  },
  {
    title: 'Ratatouille',
    slug: 'ratatouille',
    description: 'French vegetable stew with zucchini, eggplant, peppers and tomatoes.',
    ingredients: [
      { name: 'Zucchini', amount: 2, unit: 'pcs' },
      { name: 'Eggplant', amount: 1, unit: 'pcs' },
      { name: 'Bell pepper', amount: 2, unit: 'pcs' },
      { name: 'Tomatoes', amount: 4, unit: 'pcs' },
      { name: 'Olive oil', amount: 3, unit: 'tbsp' },
    ],
    steps: '1. Slice vegetables. 2. Sauté separately. 3. Combine in pot. 4. Simmer 30 min.',
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: 'easy',
  },
];
```

### `apps/cms/src/seed/index.ts`

```ts
import type { Core } from '@strapi/strapi';
import { seedRecipes } from './recipes';

export async function seedRecipesIfEmpty(strapi: Core.Strapi): Promise<void> {
  const count = await strapi.documents('api::recipe.recipe').count();

  if (count > 0) {
    strapi.log.info(`Seed skipped: ${count} recipes already exist`);
    return;
  }

  for (const recipe of seedRecipes) {
    await strapi.documents('api::recipe.recipe').create({
      data: recipe,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${seedRecipes.length} recipes`);
}
```

### `apps/cms/src/index.ts` — оновлена версія

```ts
import type { Core } from '@strapi/strapi';
import { seedRecipesIfEmpty } from './seed';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedRecipesIfEmpty(strapi);
  },
};
```

### ⚠️ Важливі моменти

**1. `status: 'published'`**

У Strapi 5 без цього поля запис створюється як Draft. API його не поверне.

**2. Ідемпотентність**

`count() > 0` → return. Це захищає від дублів при кожному перезапуску Strapi.

**3. `strapi.documents()` — новий API Strapi 5**

Старий `strapi.entityService` ще працює, але в Strapi 5 рекомендують `strapi.documents()`.

**4. `difficulty: 'medium'` — типізація**

Якщо TypeScript скаржиться — треба явно типізувати `SeedRecipe.difficulty` як `'easy' | 'medium' | 'hard'` (це вже зроблено в інтерфейсі).

**5. Components (`ingredients`)**

Створюються разом із рецептом — окремо їх не треба seed'ити.

**6. Images — НЕ чіпаємо**

Фото у seed немає. Якщо треба — завантаж вручну в Admin UI після seed. Це out of scope.

---

## 🧪 Як перевірити

### 1. Перевір, що seed не запускається, якщо рецепти є

```bash
docker compose restart strapi
docker compose logs strapi --tail=20 | grep -i seed
# Очікується: "Seed skipped: 5 recipes already exist"
```

### 2. Перевір, що seed запускається після clean DB

```bash
docker compose down -v
docker compose up -d
docker compose logs -f strapi
# Дочекайся "Strapi started successfully" і "Seeded 5 recipes"
```

### 3. Перевір через API

```bash
curl -s http://localhost:1337/api/recipes | jq '.data | length'
# Очікується: 5

curl -s http://localhost:1337/api/recipes | jq '.data[0].title'
# Очікується: "Pasta Carbonara" (або інший)
```

### 4. Перевір у БД

```bash
docker compose exec postgres psql -U recipe -d recipe_atlas -c "SELECT COUNT(*) FROM recipes;"
# Очікується: 5
```

### 5. Перевір, що немає дублів

```bash
docker compose restart strapi
sleep 15
curl -s http://localhost:1337/api/recipes | jq '.data | length'
# Очікується: 5 (не 10)
```

### 6. Typecheck + build

```bash
pnpm typecheck
pnpm build
```

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `strapi.documents is not a function` | Оновити Strapi до 5.x, або використати `strapi.entityService.create` |
| Рецепти створюються, але API повертає 0 | Перевірити `status: 'published'` у `create()` |
| `TS2345 api::recipe.recipe not assignable` | `pnpm --filter cms exec strapi ts:generate-types` |
| Seed запускається двічі → 10 рецептів | Перевірити `count()` — має бути `> 0 → return` |
| `Cannot find module './seed'` | Перевірити, що `src/seed/index.ts` існує |
| Strapi не стартує після змін | `docker compose logs strapi` — дивитись помилку |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 9 (Моделі даних → Recipe)
- `01_ROADMAP.md` → E1 — Foundation
- `docs/tasks/03-recipe-model-strapi.md`
- Strapi 5 docs: https://docs.strapi.io/dev-docs/api/document-service

---

## 💬 Commit message

```
feat(cms): add bootstrap seed script with 5 test recipes

- add src/seed/recipes.ts with 5 recipes (pasta-carbonara, miso-soup, borscht, tacos-al-pastor, ratatouille)
- add src/seed/index.ts with idempotent seedRecipesIfEmpty()
- call seed in bootstrap() of src/index.ts
- create recipes with status: published
- skip seeding if recipes already exist
```

---

## 🔀 Git workflow

```bash
git checkout dev
git pull origin dev
git checkout -b feat/03a-seed-script

# ... робота ...

git add apps/cms/src/seed apps/cms/src/index.ts
git commit -m "feat(cms): add bootstrap seed script with 5 test recipes"
git push -u origin feat/03a-seed-script
```

**PR:**
- Base: `dev`
- Title: `feat(cms): add bootstrap seed script with 5 test recipes`
- Body: Acceptance Criteria
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи спрацював `strapi.documents()` без помилок?
- Скільки часу зайняв перший seed?
- Чи співпали slug'и з тими, що використовуєш у тестах?
- Що винести в окрему задачу (наприклад, seed зображень)?