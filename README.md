# Recipe Atlas

SEO-first каталог рецептів з усього світу: країни, кухні, типи страв, калорії,
programmatic SEO-сторінки та мультимовність (uk/en).

## Стек

- **apps/web** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **apps/api** — Nest.js 11 (фонові задачі, cron, черги)
- **apps/cms** — Strapi 5 (headless CMS)
- **packages/shared** — спільні типи та єнуми

Монорепо на pnpm workspaces.

## Вимоги

- Node.js 24.x (див. `.nvmrc`)
- pnpm 12.x

## Встановлення

```bash
pnpm install
```

## Команди

```bash
pnpm dev:web     # Next.js на http://localhost:3001
pnpm dev:api     # Nest.js у watch-режимі
pnpm dev:cms     # Strapi у watch-режимі

pnpm build:web
pnpm build:api
pnpm build:cms
```

## Структура

```
recipe-atlas/
├── apps/
│   ├── web/       # Next.js
│   ├── api/       # Nest.js
│   └── cms/       # Strapi
└── packages/
    └── shared/    # спільні єнуми та типи
```

## Ліцензія

MIT — див. `LICENSE`.
