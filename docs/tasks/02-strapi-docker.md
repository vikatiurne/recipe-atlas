# 02 — Docker Compose: Postgres + Redis + Strapi

**Епік:** E1 — Foundation
**Розмір:** M (2–3 год)
**Залежності:** 01
**Статус:** ⬜ Todo
**Гілка:** `feat/02-docker-compose`

---

## 🎯 Мета

Після завершення задачі команда `docker compose up -d` піднімає Postgres, Redis і Strapi. Strapi Admin доступний на `http://localhost:1337/admin`, дані зберігаються у Docker volumes між перезапусками. Next.js продовжує запускатись локально через `pnpm dev:web`.

---

## 🔪 Вертикальний слайс

```
docker compose up -d
    ├─→ postgres:16 (volume: postgres_data)
    ├─→ redis:7      (volume: redis_data)
    └─→ strapi:5     (depends_on postgres, redis)
         └─→ http://localhost:1337/admin
```

**Перевірка:** `docker compose ps` показує 3 healthy контейнери, Strapi Admin відкривається.

---

## ✅ Acceptance Criteria

- [ ] У корені є `docker-compose.yml`
- [ ] Є `docker/redis/redis.conf`
- [ ] Є `apps/cms/Dockerfile` (multistage)
- [ ] Є `.env.example` з усіма потрібними змінними
- [ ] `docker compose up -d` піднімає 3 контейнери без помилок
- [ ] `docker compose ps` показує `postgres` і `redis` у стані `healthy`
- [ ] `http://localhost:1337/admin` відкривається — можна створити першого адміна
- [ ] `redis-cli -h localhost ping` повертає `PONG`
- [ ] `psql` до Postgres працює з хост-машини
- [ ] Після `docker compose down` і `up -d` дані в Postgres зберігаються (volumes)
- [ ] `docker compose logs -f strapi` не показує помилок підключення до БД

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Nest.js у Docker (це задача 19)
- ❌ Next.js у Docker (локально через `pnpm dev:web`)
- ❌ Модель Recipe у Strapi (це задача 03)
- ❌ Redis-клієнт у Next.js (це задача 18)
- ❌ Production-ready образи (multistage для Next.js/Nest.js — пізніше)
- ❌ CI/CD з Docker (це задача 28)
- ❌ Nginx / reverse proxy
- ❌ SSL / HTTPS локально

---

## 📁 Файли, які треба створити/змінити

### Створити в корені

- `docker-compose.yml`
- `.env.example`
- `.env` (локально, у `.gitignore`)
- `docker/redis/redis.conf`

### Створити в `apps/cms`

- `apps/cms/Dockerfile`

### Змінити в `apps/cms`

- `apps/cms/.env` — за потреби (Strapi читає свої env)
- `apps/cms/config/database.ts` — переконатись, що читає env (Strapi 5 робить це за замовчуванням)

### Не чіпати

- `apps/web/**`
- `apps/api/**`
- `packages/shared/**`

---

## 🔧 Технічні деталі

### `.env.example`

```bash
# Postgres
POSTGRES_USER=recipe
POSTGRES_PASSWORD=recipe
POSTGRES_DB=recipe_atlas
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Strapi
STRAPI_PORT=1337
STRAPI_APP_KEYS=toBeModified1,toBeModified2
STRAPI_API_TOKEN_SALT=toBeModified
STRAPI_ADMIN_JWT_SECRET=toBeModified
STRAPI_TRANSFER_TOKEN_SALT=toBeModified
STRAPI_JWT_SECRET=toBeModified

# URLs
DATABASE_URL=postgres://recipe:recipe@localhost:5432/recipe_atlas
REDIS_URL=redis://localhost:6379
STRAPI_URL=http://localhost:1337
```

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server /usr/local/etc/redis/redis.conf
    ports:
      - "${REDIS_PORT}:6379"
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  strapi:
    build:
      context: ./apps/cms
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: ${POSTGRES_DB}
      DATABASE_USERNAME: ${POSTGRES_USER}
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      APP_KEYS: ${STRAPI_APP_KEYS}
      API_TOKEN_SALT: ${STRAPI_API_TOKEN_SALT}
      ADMIN_JWT_SECRET: ${STRAPI_ADMIN_JWT_SECRET}
      TRANSFER_TOKEN_SALT: ${STRAPI_TRANSFER_TOKEN_SALT}
      JWT_SECRET: ${STRAPI_JWT_SECRET}
    ports:
      - "${STRAPI_PORT}:1337"
    volumes:
      - ./apps/cms:/app
      - /app/node_modules
      - strapi_uploads:/app/public/uploads
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
  strapi_uploads:
```

**Нотатки:**
- Без `version:` — застаріле поле у Compose v2.
- `strapi_uploads` — щоб завантажені зображення не зникали при пересборці.
- Volume `- /app/node_modules` — щоб не перезаписувати контейнерні node_modules хостовими.

### ⚠️ Нотатка про pnpm workspace

Dockerfile використовує `context: .` (корінь репо), а не `./apps/cms`.
Причина: pnpm workspaces вимагають доступу до `pnpm-lock.yaml` і `pnpm-workspace.yaml` у корені.
Це відхилення від літерального тексту задачі — і це правильно.

### `docker/redis/redis.conf`

```
maxmemory 256mb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
save 900 1
save 300 10
```

### `apps/cms/Dockerfile` (multistage, для dev з hot-reload)

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 1337
CMD ["pnpm", "develop"]
```

**Нотатка:** це dev-варіант. Production Dockerfile — пізніше, окремою задачею.

---

## 🧪 Як перевірити

1. Скопіювати `.env.example` → `.env`.
2. `docker compose up -d`.
3. `docker compose ps` — дочекатись `healthy` для postgres і redis.
4. `docker compose logs -f strapi` — дочекатись повідомлення про готовність.
5. Відкрити `http://localhost:1337/admin` — створити першого адміна.
6. `redis-cli -h localhost -p 6379 ping` → `PONG`.
7. `psql postgres://recipe:recipe@localhost:5432/recipe_atlas -c "\dt"` → список таблиць Strapi.
8. `docker compose down`.
9. `docker compose up -d`.
10. Перевірити, що адмін і дані залишились (volumes працюють).

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| Порт 5432/6379/1337 зайнятий | Змінити в `.env` |
| Strapi не стартує — `APP_KEYS` | Перевірити, що всі `STRAPI_*` змінні заповнені в `.env` |
| `pnpm-lock.yaml` не знайдено в `apps/cms` | Згенерувати локально: `cd apps/cms && pnpm install --lockfile-only` |
| `permission denied` на `docker/redis/redis.conf` | `chmod 644 docker/redis/redis.conf` |
| Postgres volume займає місце | `docker compose down -v` (видалить дані!) |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 6 (Технічний стек)
- `00_CONTEXT.md` → розділ 7 (Архітектура)
- `00_CONTEXT.md` → розділ 8 (Структура репозиторію)
- `00_CONTEXT.md` → розділ 11 (Redis — ключі та структури)
- `01_ROADMAP.md` → E1 — Foundation
- `docs/tasks/01-monorepo-setup.md`

---

## 💬 Commit message

```
build(docker): add compose with postgres, redis, strapi

- add docker-compose.yml with healthchecks and named volumes
- add docker/redis/redis.conf with LRU policy and AOF
- add apps/cms/Dockerfile for dev hot-reload
- add .env.example with all required env vars
- add .env to .gitignore
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/02-docker-compose

# ... робота ...

git add .
git commit -m "build(docker): add compose with postgres, redis, strapi"
git push origin feat/02-docker-compose
```

**PR:**
- Назва: `build(docker): add compose with postgres, redis, strapi`
- Опис: Acceptance Criteria + інструкція запуску
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи довелось змінювати `config/database.ts` у Strapi?
- Скільки часу займає перший білд `apps/cms/Dockerfile`?
- Чи є проблеми з правами на `public/uploads`?
- Що винести в окрему задачу (наприклад, production Dockerfile)?