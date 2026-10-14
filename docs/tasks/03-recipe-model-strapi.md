# 03 — Strapi: модель Recipe + 5 тестових рецептів

**Епік:** E1 — Foundation
**Розмір:** S (1–2 год)
**Залежності:** 02
**Статус:** ⬜ Todo
**Гілка:** `feat/03-recipe-model-strapi`

---

## 🎯 Мета

Після завершення задачі у Strapi Admin (`http://localhost:1337/admin`) є колекція `Recipe` з полями згідно з `00_CONTEXT.md` (розділ 9), заповнена 5 тестовими рецептами. REST API повертає їх через `GET /api/recipes`.

---

## 🔪 Вертикальний слайс

```
Strapi Admin → Content-Type Builder → Recipe model
                                       ↓
                              Postgres (таблиця recipes)
                                       ↓
                       GET http://localhost:1337/api/recipes
                                       ↓
                          JSON з 5 рецептами
```

**Перевірка:** `curl http://localhost:1337/api/recipes` повертає 5 записів.

---

## ✅ Acceptance Criteria

- [ ] У Strapi Admin є колекція `Recipe`
- [ ] `Recipe` має всі поля зі схеми (див. нижче)
- [ ] Є 5 тестових рецептів з різних кухонь (італійська, японська, українська, мексиканська, французька)
- [ ] `GET /api/recipes` повертає `data: [...]` з 5 записами
- [ ] `GET /api/recipes?populate=*` повертає пов'язані сутності
- [ ] Кожен рецепт має `title`, `slug`, `description`, `image`, `ingredients`, `steps`
- [ ] Slug унікальний (Strapi перевіряє)
- [ ] У Postgres є таблиця `recipes` (`psql ... -c "\dt"`)
- [ ] `docker compose down && up -d` — дані зберігаються

---

## 🚫 Що НЕ входить (out of scope)

- ❌ Моделі `Country`, `Cuisine`, `DishType`, `Ingredient`, `Diet` (це задача 04або пізніше — за потреби)
- ❌ Поля nutrition (`calories`, `protein`, etc.) — це задача 23
- ❌ i18n у Strapi (локалі uk/en) — це задача 14
- ❌ Публічний API-токен і налаштування прав доступу — Strapi дає `find`/`findOne` публічно за замовчуванням, цього достатньо
- ❌ Seed-скрипт (заповнюємо через Admin UI вручну)
- ❌ Завантаження реальних фото — використовуємо placeholder з Unsplash

---

## 📁 Файли, які треба створити/змінити

### Змінити в `apps/cms`

- `apps/cms/src/api/recipe/content-types/recipe/schema.json` — Strapi згенерує автоматично через Content-Type Builder, але файл треба закомітити

### Дані

- Завантажити 5 фото у Strapi Media Library (placeholder з Unsplash)
- Створити 5 рецептів через Admin UI

### Не чіпати

- `docker-compose.yml`
- `apps/web/**`
- `apps/api/**`

---

## 🔧 Технічні деталі

### Схема `Recipe` — поля

| Поле | Тип | Опції |
|---|---|---|
| `title` | String (Short text) | required, max 120 |
| `slug` | UID | attached to `title`, required |
| `description` | Text (Long text) | required |
| `image` | Media (Single) | required, images only |
| `ingredients` | Component (repeatable) → `shared.ingredient` | |
| `steps` | Rich text (Markdown) | required |
| `prepTime` | Integer | required, min 0 |
| `cookTime` | Integer | required, min 0 |
| `servings` | Integer | required, min 1 |
| `difficulty` | Enumeration | `easy`, `medium`, `hard`; default `easy` |

### Компонент `shared.ingredient`

Створити окремий component type `shared.ingredient`:

| Поле | Тип | Опції |
|---|---|---|
| `name` | String | required |
| `amount` | Decimal | required, min 0 |
| `unit` | String | required (g, ml, pcs, tsp, tbsp) |

**Нотатка:** у `00_CONTEXT.md` інгредієнти — окрема модель з relation. Але для задачі 03 достатньо **component** (вбудований об'єкт). Окрему модель з relation зробимо пізніше, коли знадобиться фільтрація за інгредієнтами. **Це свідоме спрощення.**

### Як створити через Content-Type Builder

1. `http://localhost:1337/admin` → Content-Type Builder
2. `+ Create new collection type` → Display name: `Recipe` → Continue
3. Додати поля з таблиці вище
4. Для `ingredients` → `+ Add another field` → `Component` → `Create new component`:
   - Category: `shared`
   - Name: `ingredient`
   - Icon: будь-яка
   - Додати поля `name`, `amount`, `unit`
   - `Save`
5. У `Recipe` → `ingredients` → `Repeatable component` → `shared.ingredient`
6. `Save` → Strapi перезапуститься

### Тестові рецепти — назви для seed

| # | Title | Slug | Cuisine |
|---|---|---|---|
| 1 | Pasta Carbonara | `pasta-carbonara` | італійська |
| 2 | Miso Soup | `miso-soup` | японська |
| 3 | Borscht | `borscht` | українська |
| 4 | Tacos al Pastor | `tacos-al-pastor` | мексиканська |
| 5 | Ratatouille | `ratatouille` | французька |

**Мова контенту:** англійська (щоб уникнути плутанини з i18n пізніше). Локалізацію додамо в задачі 14.

### Мінімальні дані для кожного рецепту

- `title`, `slug`, `description` (2–3 речення)
- `image` (placeholder з Unsplash — знайти за назвою)
- `ingredients` (5–10 позицій)
- `steps` (3–7 кроків)
- `prepTime` (10–30 хв), `cookTime` (15–60 хв)
- `servings` (2–6)
- `difficulty` (`easy` або `medium`)

### Перевірка API

```bash
curl -s http://localhost:1337/api/recipes | jq '.data | length'
# Очікується: 5

curl -s "http://localhost:1337/api/recipes?populate=*" | jq '.data[0].attributes.title'
# Очікується: "Pasta Carbonara" (або інший)
```

### Перевірка в Postgres

```bash
psql postgres://recipe:recipe@localhost:5432/recipe_atlas -c "SELECT id, title, slug FROM recipes;"
# Очікується: 5 рядків
```

### Права доступу

Strapi 5 за замовчуванням **не дає публічного доступу** до нових колекцій. Треба:

1. Settings → Users & Permissions Plugin → Roles → Public
2. Увімкнути `find` і `findOne` для `Recipe`
3. Save

**Без цього `curl` поверне 403.**

---

## 🧪 Як перевірити

1. `docker compose up -d` — дочекатись healthy.
2. Відкрити `http://localhost:1337/admin`.
3. Content Manager → Recipe → перевірити, що є 5 записів.
4. `curl -s http://localhost:1337/api/recipes | jq '.data | length'` → `5`.
5. `curl -s "http://localhost:1337/api/recipes?populate=*" | jq '.data[0]'` → повний об'єкт з `image`, `ingredients`, `steps`.
6. `psql ... -c "SELECT count(*) FROM recipes;"` → `5`.
7. `docker compose down && docker compose up -d` → дані залишились.

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| 403 на `GET /api/recipes` | Увімкнути `find`/`findOne` для Public role |
| Slug не генерується | Перевірити, що поле `slug` типу UID і attached to `title` |
| `image` не завантажується | Перевірити `strapi_uploads` volume і права |
| Component не створюється | Перевірити, що category `shared` існує |
| `prepTime` приймає від'ємні | У полі вказати `min: 0` |
| Postgres не бачить таблицю `recipes` | Перевірити, що Strapi застосував міграції (у логах) |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 4.2 (Сторінка рецепту)
- `00_CONTEXT.md` → розділ 9 (Моделі даних → Recipe)
- `01_ROADMAP.md` → E1 — Foundation
- `docs/tasks/02-docker-compose.md`

---

## 💬 Commit message

```
feat(cms): add Recipe collection type with 5 seed recipes

- add recipe schema with title, slug, description, image, ingredients, steps, timing, difficulty
- add shared.ingredient component (name, amount, unit)
- seed 5 recipes: pasta-carbonara, miso-soup, borscht, tacos-al-pastor, ratatouille
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/03-recipe-model-strapi

# ... робота в Strapi Admin ...

git add apps/cms/src/api/recipe apps/cms/src/components
git commit -m "feat(cms): add Recipe collection type with 5 seed recipes"
git push origin feat/03-recipe-model-strapi
```

**PR:**
- Назва: `feat(cms): add Recipe collection type with 5 seed recipes`
- Опис: Acceptance Criteria + скріншот Content Manager
- Після merge — видалити гілку

**Нотатка:** дані з Admin UI зберігаються в Postgres, а не в git. У репозиторій комітяться тільки:
- `apps/cms/src/api/recipe/content-types/recipe/schema.json`
- `apps/cms/src/components/shared/ingredient.json`

Це важливо: дані — не код. Якщо треба відтворити seed на іншій машині — пізніше зробимо seed-скрипт (окрема задача, якщо знадобиться).

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи були проблеми з правами доступу?
- Чи зручно було через Content-Type Builder vs редагування `schema.json`?
- Чи треба винести seed-скрипт в окрему задачу?
- Що винести в задачу 04 (моделі Country/Cuisine/Diet)?

### Postgres-драйвер уже встановлено

`pg` уже додано в `apps/cms/package.json` під час задачі 02. Нічого встановлювати не треба.