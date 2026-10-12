# 01 — Monorepo + pnpm workspaces + базові apps

**Епік:** E1 — Foundation
**Розмір:** M (2–3 год)
**Залежності:** —
**Статус:** ⬜ Todo
**Гілка:** `feat/01-monorepo-setup`

---

## 🎯 Мета

Після завершення задачі в корені репозиторію працює pnpm workspace з трьома apps (`web`, `api`, `cms`) і одним спільним пакетом (`shared`). Команда `pnpm install` встановлює все, команда `pnpm dev:web` запускає Next.js на `localhost:3001`. У `packages/shared` є базові єнуми проєкту.

---

## 🔪 Вертикальний слайс

```
Корінь репо → pnpm-workspace.yaml → apps/web (Next.js)
                                  → apps/api (Nest.js)
                                  → apps/cms (Strapi)
                                  → packages/shared/
                                       ├── enums/     (Locale, Difficulty, ...)
                                       └── index.ts
```

**Перевірка:** `pnpm install` проходить без помилок, `pnpm dev:web` піднімає Next.js на `localhost:3001`.

---

## ✅ Acceptance Criteria

- [ ] У корені є `package.json`, `pnpm-workspace.yaml`, `.gitignore`, `.nvmrc`, `.editorconfig`, `tsconfig.base.json`, `README.md`, `LICENSE`
- [ ] `.nvmrc` містить `24`
- [ ] `pnpm install` проходить без помилок
- [ ] `pnpm dev:web` запускає Next.js на `http://localhost:3001` — видно стартову сторінку
- [ ] `pnpm build:web` проходить без помилок
- [ ] `apps/api` містить Nest.js-скелет
- [ ] `apps/cms` містить Strapi-скелет
- [ ] `packages/shared` містить `package.json`, `tsconfig.json`, `src/index.ts`
- [ ] `packages/shared/src/enums/` містить 6 файлів єнумів + `index.ts`
- [ ] Усі apps імпортують `@recipe-atlas/shared` без помилок
- [ ] У `apps/web/app/page.tsx` тимчасово імпортовано `LOCALE` і `DIFFICULTY` — `pnpm build:web` проходить

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Docker Compose (це задача 02)
- ❌ Модель Recipe у Strapi (це задача 03)
- ❌ Layout, Tailwind, shadcn (це задача 04)
- ❌ Підключення до Postgres / Redis
- ❌ Будь-який код фіч (рецепти, каталог, пошук)
- ❌ Налаштування CI/CD (це задача 28)
- ❌ ESLint / Prettier конфіги (окрема задача, якщо треба)
- ❌ Тести (Jest, Vitest) — пізніше
- ❌ Єнуми, яких немає в списку нижче (не додавати «на майбутнє»)

---

## 📁 Файли, які треба створити/змінити

### Створити в корені

- `package.json` — root, зі скриптами `dev:web`, `build:web`, `dev:api`, `dev:cms`
- `pnpm-workspace.yaml` — `apps/*`, `packages/*`
- `.gitignore` — node_modules, .next, dist, .env*, .strapi, build
- `.nvmrc` — `24`
- `.editorconfig` — базові правила
- `tsconfig.base.json` — спільні compilerOptions
- `README.md` — короткий опис + команди
- `LICENSE` — MIT

### Створити як пакет

- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts`
- `packages/shared/src/enums/index.ts`
- `packages/shared/src/enums/locale.ts`
- `packages/shared/src/enums/difficulty.ts`
- `packages/shared/src/enums/calorie-level.ts`
- `packages/shared/src/enums/nutrition-source.ts`
- `packages/shared/src/enums/nutrition-confidence.ts`
- `packages/shared/src/enums/job-status.ts`

### Згенерувати через CLI

- `apps/web` — `pnpm create next-app`
- `apps/api` — `pnpm dlx @nestjs/cli new`
- `apps/cms` — `pnpm dlx create-strapi-app`

### Не чіпати

- Не редагувати `.next/`, `node_modules/`, згенеровані CLI файли — тільки те, що явно вказано
- Не додавати єнуми поза списком вище
- Не створювати `packages/shared/src/types/` (це пізніше)

---

## 🔧 Технічні деталі

### Версії

- Node.js: `24.x` (LTS)
- pnpm: `9.x`
- Next.js: `15.x` (App Router, TypeScript, Tailwind, ESLint, без src/)
- Nest.js: остання стабільна
- Strapi: `5.x`

### Root `package.json`

```json
{
  "name": "recipe-atlas",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api start:dev",
    "dev:cms": "pnpm --filter cms develop",
    "build:web": "pnpm --filter web build",
    "build:api": "pnpm --filter api build",
    "build:cms": "pnpm --filter cms build"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### `.gitignore`

```
node_modules/
.next/
dist/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.turbo/
.strapi/
```

### CLI команди

```bash
# web
pnpm create next-app@latest apps/web \
  --ts --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*" --use-pnpm

# api
pnpm dlx @nestjs/cli@latest new api \
  --package-manager pnpm --skip-git --strict

# cms
pnpm dlx create-strapi-app@latest apps/cms \
  --quickstart --no-run --skip-cloud --typescript
```

**Якщо CLI не підтримує non-interactive — роби інтерактивно, але з тими самими відповідями.**

### `packages/shared/package.json`

```json
{
  "name": "@recipe-atlas/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {}
}
```

### `packages/shared/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### `packages/shared/src/index.ts`

```ts
export * from './enums';
```

### `packages/shared/src/enums/index.ts`

```ts
export * from './locale';
export * from './difficulty';
export * from './calorie-level';
export * from './nutrition-source';
export * from './nutrition-confidence';
export * from './job-status';
```

### `packages/shared/src/enums/locale.ts`

```ts
export const LOCALE = {
  UK: 'uk',
  EN: 'en',
} as const;

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];

export const LOCALES = Object.values(LOCALE) as Locale[];

export const DEFAULT_LOCALE: Locale = LOCALE.UK;
```

### `packages/shared/src/enums/difficulty.ts`

```ts
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export const DIFFICULTY_VALUES = Object.values(DIFFICULTY) as Difficulty[];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Легко',
  medium: 'Середньо',
  hard: 'Складно',
};
```

**Нотатка:** значення `easy` / `medium` / `hard` мають співпадати зі Strapi-схемою, яку створимо в задачі 03. **Не змінюй їх потім без міграції.**

### `packages/shared/src/enums/calorie-level.ts`

```ts
export const CALORIE_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type CalorieLevel = (typeof CALORIE_LEVEL)[keyof typeof CALORIE_LEVEL];

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

### `packages/shared/src/enums/nutrition-source.ts`

```ts
export const NUTRITION_SOURCE = {
  USDA: 'usda',
  KAGGLE: 'kaggle',
  ESTIMATED: 'estimated',
  MANUAL: 'manual',
} as const;

export type NutritionSource =
  (typeof NUTRITION_SOURCE)[keyof typeof NUTRITION_SOURCE];
```

### `packages/shared/src/enums/nutrition-confidence.ts`

```ts
export const NUTRITION_CONFIDENCE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type NutritionConfidence =
  (typeof NUTRITION_CONFIDENCE)[keyof typeof NUTRITION_CONFIDENCE];
```

### `packages/shared/src/enums/job-status.ts`

```ts
export const JOB_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const JOB_STATUS_VALUES = Object.values(JOB_STATUS) as JobStatus[];
```

### Тимчасова перевірка в `apps/web/app/page.tsx`

Замінити вміст на:

```tsx
import { LOCALE, DIFFICULTY, getCalorieLevel } from '@recipe-atlas/shared';

export default function HomePage() {
  return (
    <div>
      <h1>Recipe Atlas</h1>
      <p>Locale: {LOCALE.UK}</p>
      <p>Difficulty: {DIFFICULTY.EASY}</p>
      <p>Calorie level for 250 kcal: {getCalorieLevel(250)}</p>
    </div>
  );
}
```

**Це тимчасово** — у задачі 04 замінимо на нормальну сторінку.

### Як Next.js знайде `@recipe-atlas/shared`

Next.js 16 підтримує pnpm workspaces з коробки, якщо `packages/shared/package.json` має `main` і `types`. Якщо виникнуть проблеми з резолвом — додати в `apps/web/next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ['@recipe-atlas/shared'],
};

export default nextConfig;
```

**Це стандартна практика для монорепо з Next.js.**

---

## 🧪 Як перевірити

1. Клонувати репо з нуля (або `rm -rf node_modules apps/*/node_modules packages/*/node_modules`).
2. `pnpm install` — має пройти без помилок, створити один `pnpm-lock.yaml` у корені.
3. `pnpm dev:web` — відкрити `http://localhost:3001`.
4. Перевірити, що видно:
   - `Locale: uk`
   - `Difficulty: easy`
   - `Calorie level for 250 kcal: low`
5. Зупинити (`Ctrl+C`).
6. `pnpm build:web` — без помилок.
7. `pnpm typecheck` — без помилок.
8. Перевірити, що `apps/api` і `apps/cms` існують і мають `package.json` з іменами `api` і `cms`.
9. Перевірити, що `packages/shared/src/enums/` містить 7 файлів (6 єнумів + `index.ts`).

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `@recipe-atlas/shared` не резолвиться | Додати `transpilePackages` у `next.config.ts` |
| `pnpm install` падає на Strapi | Використати `--ignore-scripts` для Strapi, потім окремо `pnpm --filter cms install` |
| TypeScript не бачить типи з shared | Перевірити `main` і `types` у `packages/shared/package.json` |
| Next.js стартує на 3000, а не 3001 | Перевірити, чи є `-p 3001` у `apps/web/package.json` |
| Nest.js CLI ставить npm-лок | Використати `--package-manager pnpm` |
| Strapi CLI не підтримує non-interactive | Запустити інтерактивно, але з тими самими відповідями |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 6 (Технічний стек)
- `00_CONTEXT.md` → розділ 8 (Структура репозиторію)
- `AGENT_RULES.md` → секція 7.2 (Єнуми та константи)
- `01_ROADMAP.md` → E1 — Foundation

---

## 💬 Commit message

```
chore(repo): initialize pnpm workspaces with web, api, cms apps

- add root package.json with workspace scripts
- add pnpm-workspace.yaml with apps/* and packages/*
- add tsconfig.base.json, .nvmrc (24), .editorconfig, .gitignore
- add README.md and MIT LICENSE
- scaffold apps/web with create-next-app on port 3001
- scaffold apps/api with @nestjs/cli
- scaffold apps/cms with create-strapi-app
- add packages/shared with enums: Locale, Difficulty, CalorieLevel, NutritionSource, NutritionConfidence, JobStatus
- wire @recipe-atlas/shared into web app
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/01-monorepo-setup

# ... робота ...

git add .
git commit -m "chore(repo): initialize pnpm workspaces with web, api, cms apps"
git push -u origin feat/01-monorepo-setup
```

**PR:**
- Base: `dev`
- Назва: `chore(repo): initialize pnpm workspaces with web, api, cms apps`
- Опис: Acceptance Criteria
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи спрацювали CLI команди non-interactive?
- Чи виникли конфлікти версій Node/pnpm?
- Чи знадобився `transpilePackages` у `next.config.ts`?
- Чи все ок з резолвом `@recipe-atlas/shared`?
- Що винести в окрему задачу?