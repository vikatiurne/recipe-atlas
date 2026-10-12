# 01 — Monorepo + pnpm workspaces + базові apps

**Епік:** E1 — Foundation
**Розмір:** M (2–3 год)
**Залежності:** —
**Статус:** ⬜ Todo
**Гілка:** `feat/01-monorepo-setup`

---

## 🎯 Мета

Після завершення задачі в корені репозиторію працює pnpm workspace з трьома apps (`web`, `api`, `cms`) і одним спільним пакетом (`shared`). Команда `pnpm install` встановлює все, команда `pnpm dev:web` запускає Next.js на `localhost:3001`.

---

## 🔪 Вертикальний слайс

```
Корінь репо → pnpm-workspace.yaml → apps/web (Next.js)
                                  → apps/api (Nest.js)
                                  → apps/cms (Strapi)
                                  → packages/shared (типи)
```

**Перевірка:** `pnpm install` проходить без помилок, `pnpm dev:web` піднімає Next.js.

---

## ✅ Acceptance Criteria

- [ ] У корені є `package.json`, `pnpm-workspace.yaml`, `.gitignore`, `.nvmrc`, `.editorconfig`, `tsconfig.base.json`, `README.md`
- [ ] `pnpm install` проходить без помилок
- [ ] `pnpm dev:web` запускає Next.js на `http://localhost:3001` — видно стартову сторінку
- [ ] `pnpm build:web` проходить без помилок
- [ ] `apps/api` містить Nest.js-скелет (можна запустити окремо, але це не входить у критерії)
- [ ] `apps/cms` містить Strapi-скелет (можна запустити окремо, але це не входить у критерії)
- [ ] `packages/shared` містить `package.json`, `tsconfig.json`, `src/index.ts`
- [ ] Усі apps імпортують `@recipe-atlas/shared` без помилок

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Docker Compose (це задача 02)
- ❌ Модель Recipe у Strapi (це задача 03)
- ❌ Layout, Tailwind, shadcn (це задача 04)
- ❌ Підключення до Postgres / Redis
- ❌ Будь-який код фіч (рецепти, каталог, пошук)
- ❌ Налаштування CI/CD (це задача 28)
- ❌ ESLint / Prettier конфіги (окрема задача, якщо треба)

---

## 📁 Файли, які треба створити/змінити

### Створити в корені

- `package.json` — root, з скриптами `dev:web`, `build:web`, `dev:api`, `dev:cms`
- `pnpm-workspace.yaml` — `apps/*`, `packages/*`
- `.gitignore` — node_modules, .next, dist, .env*, .strapi, build
- `.nvmrc` — `22`
- `.editorconfig` — базові правила
- `tsconfig.base.json` — спільні compilerOptions
- `README.md` — короткий опис + команди

### Створити як пакет

- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts` — експорт порожнього типу `export type Locale = 'uk' | 'en';`

### Згенерувати через CLI (не писати вручну)

- `apps/web` — `pnpm create next-app`
- `apps/api` — `pnpm dlx @nestjs/cli new`
- `apps/cms` — `pnpm dlx create-strapi-app`

### Не чіпати

- Не редагувати `.next/`, `node_modules/`, згенеровані CLI файли — тільки те, що явно вказано

---

## 🔧 Технічні деталі

### Версії

- Node.js: `22.x` (LTS)
- pnpm: `9.x`
- Next.js: `15.x` (App Router, TypeScript, Tailwind, ESLint, src/ — НІ)
- Nest.js: остання стабільна
- Strapi: `5.x`

### Root `package.json` — приблизна структура

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

### `.gitignore` (скорочено)

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

### CLI команди (non-interactive)

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

### `packages/shared/src/index.ts`

```ts
export type Locale = 'uk' | 'en';
```

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

---

## 🧪 Як перевірити

1. Клонувати репо з нуля (або `rm -rf node_modules apps/*/node_modules packages/*/node_modules`).
2. `pnpm install` — має пройти без помилок, створити один `pnpm-lock.yaml` у корені.
3. `pnpm dev:web` — відкрити `http://localhost:3001` — побачити стартову сторінку Next.js.
4. Зупинити (`Ctrl+C`).
5. `pnpm build:web` — має пройти без помилок.
6. Перевірити, що `apps/api` і `apps/cms` існують і мають `package.json` з іменами `api` і `cms`.
7. Перевірити, що `packages/shared` існує і має `src/index.ts`.
8. У `apps/web/app/page.tsx` тимчасово додати:
   ```ts
   import type { Locale } from '@recipe-atlas/shared';
   const l: Locale = 'uk';
   console.log(l);
   ```
   Якщо `pnpm build:web` проходить — тип резолвиться.

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 6 (Технічний стек)
- `00_CONTEXT.md` → розділ 8 (Структура репозиторію)
- `01_ROADMAP.md` → E1 — Foundation

---

## 💬 Commit message

```
chore(repo): initialize pnpm workspaces with web, api, cms apps

- add root package.json with workspace scripts
- add pnpm-workspace.yaml with apps/* and packages/*
- add tsconfig.base.json, .nvmrc, .editorconfig, .gitignore
- scaffold apps/web with create-next-app (Next.js 15, App Router, TS)
- scaffold apps/api with @nestjs/cli
- scaffold apps/cms with create-strapi-app
- add packages/shared with Locale type
- wire @recipe-atlas/shared into web app
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/01-monorepo-setup

# ... робота ...

git add .
git commit -m "chore(repo): initialize pnpm workspaces with web, api, cms apps"
git push origin feat/01-monorepo-setup
```

**PR:**
- Назва: `chore(repo): initialize pnpm workspaces with web, api, cms apps`
- Опис: скопіювати Acceptance Criteria
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи спрацювали CLI команди non-interactive?
- Чи виникли конфлікти версій Node/pnpm?
- Чи знадобилось щось додати в `.gitignore`?
- Що винести в окрему задачу?