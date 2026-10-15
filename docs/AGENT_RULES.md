# AGENT_RULES.md — Правила роботи з AI-агентом

> Цей файл **завжди** додається до контексту разом із `00_CONTEXT.md` та поточною задачею.
> Агент має прочитати його **перед** початком роботи.

---

## 1. Мова спілкування

- **Українська** — у відповідях тобі.
- **Англійська** — у коді, коментарях, назвах змінних, комітах, документації файлів.
- **Коментарі в коді** — англійською (стандарт індустрії).
- **README, docs/** — українською (для тебе).

---

## 2. Git — критично важливо

### Що робить агент:

- ✅ Пропонує текст коміту у форматі Conventional Commits.
- ✅ Показує, які файли треба додати.
- ✅ Нагадує про оновлення статусу в `01_ROADMAP.md`.

### Що агент **НЕ робить**:

- ❌ **Не робить `git add`** — ти робиш вручну.
- ❌ **Не робить `git commit`** — ти робиш вручну.
- ❌ **Не робить `git push`** — ти робиш вручну.
- ❌ **Не створює гілки** — ти створюєш вручну.
- ❌ **Не робить `git reset`, `git rebase`, `git checkout`** — тільки ти.

### Формат коміту:

```
<type>(<scope>): <subject>

<body>
```

Приклади типів: `feat`, `fix`, `docs`, `refactor`, `perf`, `build`, `chore`, `ci`.

---

## 3. Якщо щось незрозуміло — **СПИТАЙ, НЕ ДОДУМУЙ**

### Правило:

Якщо у задачі або контексті немає чіткої відповіді — **зупинись і спитай**.

### Приклади, коли треба спитати:

- У задачі не вказано, яку версію бібліотеки використовувати.
- API Strapi повертає дані інакше, ніж описано в контексті.
- Треба створити файл, якого немає у списку.
- Виникає спокуса «покращити» код поза межами задачі.
- Не зрозуміло, у якому форматі рендерити `steps` (Markdown? HTML? plain?).

### Що НЕ робити:

- ❌ Не вигадувати структуру БД, якої немає в контексті.
- ❌ Не додавати бібліотеки, яких немає у стеку.
- ❌ Не робити «як краще», якщо в задачі сказано «як простіше».
- ❌ Не коментувати, що «цей код можна покращити» — тільки якщо спитають.

---

## 4. Out of scope — святе

У кожній задачі є секція «🚫 Що НЕ входить (out of scope)».

**Правило:** якщо щось у цій секції — **не робити, навіть якщо «треба»**.

### Що робити, якщо здається, що це треба:

- Зупинитись.
- Написати: «Це в out of scope. Винести в окрему задачу?»
- Не робити.

---

## 5. Одна задача — один фокус

- Не переходити до наступної задачі, поки поточна не завершена.
- Не читати `01_ROADMAP.md` — він не в контексті сесії.
- Не «заглядати» в задачі 07, 08, 09.
- Не додавати фічі, які «логічно випливають», але не описані.

---

## 6. Розмір змін

- **≤ 7 файлів** на задачу. Якщо більше — попередити, що задача завелика.
- **Одна логічна зміна** — один коміт.
- **Без «покращень»** коду, який не стосується задачі.
- **Без рефакторингу** того, що не просили.

---

## 7. Стиль коду

- **TypeScript** — строгий режим, без `any` (якщо не уникнути — коментар чому).
- **Server Components** — за замовчуванням. `"use client"` — тільки якщо треба інтерактив.
- **Tailwind** — для стилів. Без CSS-модулів, styled-components.
- **shadcn/ui** — для UI-компонентів. Не додавати інші UI-бібліотеки.
- **Named exports** — для компонентів (`export function Foo`), не default.
- **Файли** — kebab-case для папок (`app/recipe/[slug]/`), PascalCase для компонентів (`RecipeCard.tsx`).

## 7.1. Чисті компоненти

### Принцип

Компонент — це **функція від props до JSX**. Все інше — поза компонентом.

### Що має бути в компоненті

- ✅ Рендер JSX на основі props.
- ✅ Мінімальна логіка для відображення (форматування, обчислення похідних значень).
- ✅ Умовний рендер (`if`, тернарники) — якщо це частина відображення.

### Що НЕ має бути в компоненті

- ❌ `fetch` / запити до API.
- ❌ Прямий доступ до `process.env` (окрім явних випадків, типу URL зображення).
- ❌ Бізнес-логіка (розрахунки, трансформації даних).
- ❌ Робота з БД, Redis, файловою системою.
- ❌ `console.log` (окрім тимчасового дебагу — прибрати перед комітом).
- ❌ Мутації props (props — read-only).
- ❌ Складна логіка в JSX (якщо > 3 рівнів вкладеності — винести).

### Правила

**1. Один компонент — одна відповідальність.**
Якщо компонент рендерить header + meta + ingredients + steps — це **чотири компоненти**, а не один.

**2. Props — типізовані та мінімальні.**
Компонент отримує **тільки те, що рендерить**, а не весь об'єкт «про запас».

```tsx
// ❌ Погано — компонент отримує весь рецепт, а використовує тільки title
function Title({ recipe }: { recipe: Recipe }) {
  return <h1>{recipe.title}</h1>;
}

// ✅ Добре — компонент отримує тільки те, що треба
function Title({ title }: { title: string }) {
  return <h1>{title}</h1>;
}
```

**3. Логіка — назовні.**
Обчислення, форматування, трансформації — окремі функції у `lib/` або `utils/`.

```tsx
// ❌ Погано — логіка всередині компонента
function RecipeMeta({ prepTime, cookTime }: Props) {
  const total = prepTime + cookTime;
  const formatted = `${Math.floor(total / 60)}h ${total % 60}m`;
  return <span>{formatted}</span>;
}

// ✅ Добре — логіка у lib/formatters.ts
import { formatDuration } from "@/lib/formatters";

function RecipeMeta({ prepTime, cookTime }: Props) {
  return <span>{formatDuration(prepTime + cookTime)}</span>;
}
```

**4. Без side effects.**
Компонент не має змінювати щось поза собою. Ніяких `localStorage.setItem`, `document.cookie`, мутацій глобальних змінних.

**5. Server Components за замовчуванням.**
`"use client"` — тільки якщо компонент справді інтерактивний (обробники подій, useState, useEffect).

**6. Ніяких «розумних» компонентів.**
Якщо компонент починає «знати» про бізнес-логіку (наприклад, «якщо калорій > 500, показати червоне») — це сигнал винести логіку назовні або передати готове значення через props.

```tsx
// ❌ Погано — компонент знає про бізнес-правила
function CalorieBadge({ calories }: { calories: number }) {
  const color = calories > 500 ? "red" : calories > 300 ? "yellow" : "green";
  return <span className={color}>{calories} kcal</span>;
}

// ✅ Добре — компонент отримує готовий варіант
type CalorieLevel = "low" | "medium" | "high";

function CalorieBadge({
  calories,
  level,
}: {
  calories: number;
  level: CalorieLevel;
}) {
  return <span data-level={level}>{calories} kcal</span>;
}
```

**7. Без умовної логіки в JSX, якщо вона складна.**

```tsx
// ❌ Погано — важко читати
{
  recipe.image &&
    recipe.image.url &&
    !recipe.image.url.includes("placeholder") && <img src={recipe.image.url} />;
}

// ✅ Добре — обчислити заздалегідь
const imageUrl = getImageUrl(recipe);
{
  imageUrl && <img src={imageUrl} />;
}
```

**8. Компонент не знає про роутинг.**
`useRouter`, `usePathname` — тільки якщо це справді потрібно. У більшості випадків — `<Link href>` достатньо.

**9. Форматування даних — не в JSX.**
Дати, числа, валюти — через `Intl` або `lib/formatters.ts`, не інлайн.

```tsx
// ❌ Погано
<span>{new Date(recipe.createdAt).toLocaleDateString("uk-UA")}</span>;

// ✅ Добре
import { formatDate } from "@/lib/formatters";
<span>{formatDate(recipe.createdAt)}</span>;
```

**10. Тест на чистоту.**
Запитай себе: «Чи можу я протестувати цей компонент, передавши props і отримавши JSX?» Якщо ні — компонент брудний.

### Структура чистого компонента

```tsx
// 1. Імпорти типів
import type { Recipe } from "@/lib/strapi";

// 2. Імпорти компонентів
import { Button } from "@/components/ui/button";

// 3. Типи props
interface Props {
  title: string;
  onAction?: () => void;
}

// 4. Компонент — чиста функція
export function RecipeTitle({ title, onAction }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {onAction && <Button onClick={onAction}>Action</Button>}
    </div>
  );
}
```

### Чек-ліст перед комітом

Перед завершенням задачі перевір кожен компонент:

- [ ] Немає `fetch` / API-запитів.
- [ ] Немає `console.log`.
- [ ] Props — мінімальні та типізовані.
- [ ] Логіка — у `lib/` або передана через props.
- [ ] Немає side effects.
- [ ] Server Component (якщо не потрібен `"use client"`).
- [ ] JSX читабельний (без глибокої вкладеності).
- [ ] Немає мутацій props.

### Що робити, якщо компонент виходить «брудним»

1. **Зупинитись.**
2. **Розбити на менші компоненти.**
3. **Винести логіку в `lib/`.**
4. **Передати готові значення через props.**
5. **Якщо не виходить — спитати в тебе.**

## **Компонент, який робить багато — це не «ефективно», це борг на завтра.**

## 7.2. Єнуми та константи

### Головне правило

**Не використовувати `enum` з TypeScript. Використовувати `as const` об'єкти або string literal unions.**

### Чому не `enum`

1. **`enum` — legacy TypeScript.** Команда TS не рекомендує для нових проєктів.
2. **`enum` не tree-shakeable.** Потрапляє в бандл повністю.
3. **`enum` погано працює з `isolatedModules`** (який увімкнений у Next.js).
4. **`enum` не працює в Server Components** без хаков.
5. **`enum` не читається з JSON** (Strapi, API) — треба мапити.

### Що використовувати замість `enum`

**Варіант 1: `as const` об'єкт (коли треба ітерувати, мапити, рендерити список)**

```ts
// ✅ Добре
export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
// → 'easy' | 'medium' | 'hard'
```

**Варіант 2: String literal union (коли треба тільки тип)**

```ts
// ✅ Добре
export type Difficulty = "easy" | "medium" | "hard";
```

**Варіант 3: Масив + тип (коли треба ітерувати)**

```ts
// ✅ Добре
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
```

### Де зберігати єнуми

**Правило:** усі спільні єнуми — **тільки** в `packages/shared`.

```
packages/shared/src/
├── enums/
│   ├── difficulty.ts
│   ├── locale.ts
│   ├── nutrition-source.ts
│   ├── nutrition-confidence.ts
│   ├── calorie-level.ts
│   └── job-status.ts
└── index.ts
```

**`packages/shared/src/index.ts`:**

```ts
export * from "./enums/difficulty";
export * from "./enums/locale";
export * from "./enums/nutrition-source";
export * from "./enums/nutrition-confidence";
export * from "./enums/calorie-level";
export * from "./enums/job-status";
```

**Імпорт у web / api:**

```ts
import { DIFFICULTY, type Difficulty } from "@recipe-atlas/shared";
```

### Приклад: `Difficulty`

```ts
// packages/shared/src/enums/difficulty.ts

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export const DIFFICULTY_VALUES = Object.values(DIFFICULTY) as Difficulty[];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Легко",
  medium: "Середньо",
  hard: "Складно",
};
```

**Використання:**

```tsx
import {
  DIFFICULTY,
  DIFFICULTY_LABELS,
  type Difficulty,
} from "@recipe-atlas/shared";

function DifficultyBadge({ value }: { value: Difficulty }) {
  return <span>{DIFFICULTY_LABELS[value]}</span>;
}

// Валідація
if (value === DIFFICULTY.EASY) {
  // ...
}
```

### Синхронізація зі Strapi

**Проблема:** Strapi-схема має свої enum values (`easy` / `medium` / `hard`). TypeScript-типи мають ті самі значення. Вони можуть розійтись.

**Правила:**

1. **Значення у Strapi та в `packages/shared` мають бути ідентичні** (той самий регістр, ті самі слова).
2. **У `packages/shared` — джерело істини.** Якщо додаєш значення — додаєш у трьох місцях:
   - `packages/shared/src/enums/*.ts`
   - Strapi schema (`schema.json`)
   - За потреби — міграція БД
3. **У web — типи зі `shared`**, не локальні.
4. **Ніколи не використовувати рядки напряму** (`'easy'`), тільки через константи.

### Приклад зі Strapi

**`packages/shared/src/enums/difficulty.ts`** — джерело істини.

**Strapi `apps/cms/src/api/recipe/content-types/recipe/schema.json`:**

```json
{
  "attributes": {
    "difficulty": {
      "type": "enumeration",
      "enum": ["easy", "medium", "hard"],
      "default": "easy",
      "required": true
    }
  }
}
```

**Значення мають співпадати.** Якщо додаєш `expert` — додаєш у двох місцях одразу.

### Приклад: `Locale`

```ts
// packages/shared/src/enums/locale.ts

export const LOCALE = {
  UK: "uk",
  EN: "en",
} as const;

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];

export const LOCALES = Object.values(LOCALE) as Locale[];

export const DEFAULT_LOCALE: Locale = LOCALE.UK;
```

### Приклад: `CalorieLevel` (бізнес-логіка)

```ts
// packages/shared/src/enums/calorie-level.ts

export const CALORIE_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type CalorieLevel = (typeof CALORIE_LEVEL)[keyof typeof CALORIE_LEVEL];

// Пороги — теж у shared, щоб web і api використовували однакові
export const CALORIE_THRESHOLDS = {
  LOW_MAX: 300,
  MEDIUM_MAX: 600,
} as const;

export function getCalorieLevel(calories: number): CalorieLevel {
  if (calories < CALORIE_THRESHOLDS.LOW_MAX) return CALORIE_LEVEL.LOW;
  if (calories < CALORIE_THRESHOLDS.MEDIUM_MAX) return CALORIE_LEVEL.MEDIUM;
  return CALORIE_LEVEL.HIGH;
}
```

**Використання у компоненті:**

```tsx
import { CALORIE_LEVEL, type CalorieLevel } from "@recipe-atlas/shared";

function CalorieBadge({
  calories,
  level,
}: {
  calories: number;
  level: CalorieLevel; // ← компонент отримує готовий рівень, не рахує сам
}) {
  return <span data-level={level}>{calories} kcal</span>;
}
```

**Логіка `getCalorieLevel()` — у `lib/` або в Server Component, не в компоненті.**

### Чек-ліст для єнумів

- [ ] Немає `enum` з TypeScript.
- [ ] Єнум — у `packages/shared/src/enums/`.
- [ ] Є `as const` об'єкт + тип + масив значень.
- [ ] Є `LABELS` (якщо є UI-відображення).
- [ ] Значення співпадають зі Strapi (якщо є в Strapi).
- [ ] У компонентах — тільки імпорт констант, не рядки.
- [ ] Немає дублювання значень у web/api.
- [ ] Якщо є бізнес-логіка (пороги, мапінги) — теж у `shared`.

### Чого НЕ робити

```ts
// ❌ TypeScript enum
enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
}

// ❌ Магічні рядки
if (recipe.difficulty === 'easy') { ... }

// ❌ Локальний тип у web
type Difficulty = 'easy' | 'medium' | 'hard';  // у web, не в shared

// ❌ Дублювання значень
// у web: type Difficulty = 'easy' | 'medium' | 'hard';
// у api: type Difficulty = 'easy' | 'medium' | 'hard';
// у shared: нічого

// ❌ Єнум для того, що не є єнумом
type Status = 'active' | 'inactive' | 'pending' | 'archived' | ...;  // 10+ значень — це не єнум, це стан
```

### Коли єнум — не єнум

Якщо значень **більше 7–10** або вони **часто змінюються** — це не єнум, а окрема сутність у БД.

Приклад: `JobStatus` має 4 значення — єнум. Але якщо додаси `retrying`, `paused`, `cancelled`, `timeout`, `partial` — це вже стан, треба окрема таблиця.

### Що робити, якщо треба нове значення

1. **Зупинитись.**
2. **Додати у `packages/shared/src/enums/`** — джерело істини.
3. **Оновити Strapi schema** — якщо є в Strapi.
4. **Оновити `LABELS`** — якщо є UI.
5. **Перевірити, чи не зламались існуючі дані** (якщо значення видаляється).
6. **Спитати в тебе**, якщо треба міграція БД.

### Правило про магічні рядки

**Будь-який рядок, який представляє стан/категорію/тип, має бути єнумом.**

```tsx
// ❌ Погано
{
  recipe.difficulty === "easy" && <EasyBadge />;
}

// ✅ Добре
import { DIFFICULTY } from "@recipe-atlas/shared";
{
  recipe.difficulty === DIFFICULTY.EASY && <EasyBadge />;
}
```

**Виняток:** рядки для відображення (текст кнопок, назви) — звичайні рядки або з `messages/`.

## 8. Формат відповіді

Після виконання задачі агент має показати:

### 1. Що зроблено

Короткий список (2–5 пунктів).

### 2. Які файли створено/змінено

Список шляхів.

### 3. Як перевірити

Команди для запуску + що очікувати.

### 4. Commit message

Готовий текст для копіювання.

### 5. Що НЕ зроблено (out of scope)

Явно перелічити, що не робив — щоб було видно, що не забув.

### 6. Питання (якщо є)

Якщо щось незрозуміло — тут.

---

## 9. Чого НЕ робити ніколи

- ❌ Не вигадувати назви змінних, яких немає в контексті.
- ❌ Не додавати залежності без згадки в задачі.
- ❌ Не змінювати `00_CONTEXT.md` — він стабільний.
- ❌ Не змінювати `AGENT_RULES.md` — він стабільний.
- ❌ Не видаляти файли без явної вказівки.
- ❌ Не робити `console.log` у фінальному коді (тільки тимчасово для дебагу).
- ❌ Не залишати `TODO` без пояснення.
- ❌ Не ігнорувати помилки TypeScript.
- ❌ Не коментувати код, який очевидний (`// returns the user`).
- ❌ Не використовувати `npm` або `yarn` — **тільки `pnpm`**.

---

## 10. Коли задача завершена

Задача вважається завершеною, коли:

- ✅ Усі Acceptance Criteria виконані.
- ✅ `pnpm typecheck` проходить без помилок.
- ✅ `pnpm build` проходить (якщо застосовно).
- ✅ Немає зайвих файлів, `console.log`, `TODO`.
- ✅ Commit message готовий.
- ✅ Out of scope не зачеплено.

### 10.1. Самоперевірка перед звітом

**Перед тим як сказати «готово», обов'язково запусти:**

```bash
pnpm typecheck
pnpm build
```

**Якщо задача змінювала `apps/cms` — додатково:**

```bash
docker compose logs strapi --tail=50
```

Перевір, що немає помилок типу `error TS`, `Found X errors`, `Cannot find module`.

**Якщо задача змінювала `apps/api`:**

```bash
pnpm --filter api build
```

**Правило:**

- Якщо є помилки TypeScript — виправ.
- Якщо build падає — виправ.
- Якщо Strapi не стартує — виправ.
- **Тільки після цього** пиши звіт.
- Якщо виправити не можеш — не кажи «готово». Напиши: «Задача не завершена, проблема: [опис]».

**У звіті вкажи:**

- Результат `pnpm typecheck` (✓ / ✗).
- Результат `pnpm build` (✓ / ✗).
- Якщо задача зі Strapi — результат перевірки логів.

### 10.2. Runtime-перевірка (обов'язково)

Після `pnpm typecheck` і `pnpm build` — **перевір, що код реально запускається**.

### Для задач, які торкаються `apps/web`:

1. Запусти `pnpm dev:web`.
2. Відкрий сторінку, яку створив/змінив — в браузері.
3. Перевір **консоль Next.js** — не має бути помилок типу:
   - `fetch failed`
   - `ECONNRESET`
   - `500 Internal Server Error`
   - `TypeError`
   - `Unhandled Runtime Error`
4. Перевір **консоль браузера** — не має бути помилок.
5. Перевір **сторінку** — має бути очікуваний контент.

**У звіті вкажи:**

- Чи відкривається сторінка (✓ / ✗).
- Чи є помилки в консолі Next.js (✓ / ✗).
- URL для перевірки користувачем.

### Для задач, які торкаються `apps/api`:

1. Запусти `pnpm dev:api`.
2. `curl` до створеного endpoint.
3. Перевір логи Nest.js.

### Для задач, які торкаються `apps/cms`:

1. `docker compose logs strapi --tail=50` — без помилок.
2. `curl http://127.0.0.1:1337/api/<endpoint>` — 200 OK.

### Правило

**Якщо не можеш перевірити — не кажи «готово». Напиши:**

> «Код готовий, але я не можу перевірити runtime. Перевір будь ласка:
>
> - `pnpm dev:web` → відкрий http://localhost:3001/<path>
> - У консолі Next.js не має бути помилок
> - У консолі браузера не має бути помилок»

## **Це не «не зроблено». Це «потребує перевірки користувачем».**

## 11. Пріоритети

1. **Простіше** > краще. Якщо в задачі сказано «простий варіант» — роби простий.
2. **Працює** > ідеально. Краще працюючий код, ніж ідеальний, але не готовий.
3. **Явне** > неявне. Краще довший код, але зрозумілий.
4. **Спитати** > додумати. Краще зупинитись, ніж зробити не те.

---

## 12. Контекст сесії

На початку кожної сесії агент отримує:

1. `AGENT_RULES.md` (цей файл) — правила.
2. `00_CONTEXT.md` — контекст проєкту.
3. `docs/tasks/NN-*.md` — поточна задача.

**Більше нічого.** Не `01_ROADMAP.md`, не інші задачі, не старі чати.

Якщо агент просить щось додаткове — зупинитись і спитати в тебе.

---

## 13. Що робити, якщо правило конфліктує з задачею

**Задача > правила > здоровий глузд.**

### Винятки

Ліміт «≤ 7 файлів» не застосовується до **інфраструктурних задач**:

- Задача 01 (monorepo setup)
- Задача 02 (Docker Compose)
- Задача 19 (Nest.js skeleton)
- Задача 28 (CI/CD)

Для цих задач файлів може бути 20–30+. Це нормально — вони створюють скелет, а не фічу.

Якщо задача каже щось, що суперечить цьому файлу — виконувати задачу, але попередити про конфлікт.

## 14. Дані та volumes

- **Ніколи** не пропонувати `docker compose down -v` без явного попередження.
- Якщо задача торкається даних у БД — нагадати зробити backup:
  `docker compose exec postgres pg_dump -U recipe recipe_atlas > backup.sql`
- Seed-скрипти — обов'язкові для всіх даних, які треба відтворювати.
