# 04 — Next.js: layout, Tailwind, shadcn, навігація

**Епік:** E1 — Foundation
**Розмір:** S (1–2 год)
**Залежності:** 01
**Статус:** ⬜ Todo
**Гілка:** `feat/04-layout-tailwind-shadcn`

---

## 🎯 Мета

Після завершення задачі в `apps/web` є базовий layout з header, footer, навігацією і готовими компонентами shadcn/ui. Tailwind налаштований під дизайн-систему. На `http://localhost:3001` видно робочу сторінку з навігацією.

---

## 🔪 Вертикальний слайс

```
http://localhost:3001
    ↓
app/layout.tsx (root layout)
    ↓
<Header /> <main>{children}</main> <Footer />
    ↓
Tailwind + shadcn/ui + next/font
```

**Перевірка:** сторінка рендериться з header, main, footer; навігація працює.

---

## ✅ Acceptance Criteria

- [ ] Tailwind налаштований (`tailwind.config.ts`, `app/globals.css` з CSS-змінними)
- [ ] shadcn/ui ініціалізовано (`components.json`)
- [ ] Встановлено базові компоненти shadcn: `button`, `card`, `input`, `dropdown-menu`
- [ ] Є `app/layout.tsx` з `<Header />`, `<main>`, `<Footer />`
- [ ] Є `components/layout/Header.tsx` з навігацією (logo, links, перемикач мови — без логіки)
- [ ] Є `components/layout/Footer.tsx` з copyright і посиланнями
- [ ] Є `components/ui/` з компонентами shadcn
- [ ] Шрифт підключено через `next/font` (Inter або Geist)
- [ ] `pnpm dev:web` → `http://localhost:3001` показує робочу сторінку
- [ ] `pnpm build:web` проходить без помилок
- [ ] Навігація використовує `next/link`, не `<a href>`
- [ ] Семантичні теги: `<header>`, `<main>`, `<footer>`, `<nav>`

---

## 🚫 Що НЕ входить (out of scope)

- ❌ i18n / перемикач мови з логікою (це задача 14)
- ❌ Сторінка рецепту (це задача 06)
- ❌ Список рецептів (це задача 09)
- ❌ Підключення до Strapi (це задача 05)
- ❌ Dark mode toggle (можна додати пізніше, окремо)
- ❌ Мобільне меню з hamburger (можна пізніше)
- ❌ SEO metadata у layout (це задача 11)
- ❌ Логотип / брендінг (заглушка текстом)

---

## 📁 Файли, які треба створити/змінити

### Створити в `apps/web`

- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/Nav.tsx` (опційно, якщо хочеш винести навігацію окремо)
- `components.json` (згенерує shadcn CLI)
- `lib/utils.ts` (згенерує shadcn CLI — `cn()` helper)

### Змінити в `apps/web`

- `app/layout.tsx` — замінити дефолтний на свій
- `app/globals.css` — Tailwind-директиви + CSS-змінні
- `app/page.tsx` — тимчасова заглушка «Recipe Atlas — coming soon»
- `tailwind.config.ts` — якщо треба розширити theme (шрифт, кольори)

### Згенерувати через CLI (не писати вручну)

- `components/ui/button.tsx` — `pnpm dlx shadcn@latest add button`
- `components/ui/card.tsx` — `... add card`
- `components/ui/input.tsx` — `... add input`
- `components/ui/dropdown-menu.tsx` — `... add dropdown-menu`

### Не чіпати

- `docker-compose.yml`
- `apps/api/**`
- `apps/cms/**`
- `packages/shared/**`

---

## 🔧 Технічні деталі

### Ініціалізація shadcn

```bash
cd apps/web
pnpm dlx shadcn@latest init
```

Відповіді на питання CLI:
- Style: `New York`
- Base color: `Slate` (або `Zinc`)
- CSS variables: `Yes`

### Встановлення компонентів

```bash
pnpm dlx shadcn@latest add button card input dropdown-menu
```

### Шрифт через `next/font`

```ts
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});
```

**Важливо:** підключити `cyrillic` subset — для української мови.

### Структура `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Recipe Atlas',
    template: '%s | Recipe Atlas',
  },
  description: 'Recipes from around the world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Нотатка:** `lang="uk"` — поки що. У задачі 14, коли додамо i18n, `lang` буде динамічним.

### `components/layout/Header.tsx` — приблизна структура

```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Recipe Atlas
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6">
            <li><Link href="/recipes">Recipes</Link></li>
            <li><Link href="/recipes/low-calorie">Low-calorie</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>
        <Button variant="outline" size="sm">
          🌐 EN
        </Button>
      </div>
    </header>
  );
}
```

**Нотатки:**
- `<nav aria-label="Main navigation">` — для accessibility.
- Посилання ведуть на сторінки, яких ще немає — це нормально, вони створяться пізніше. Next.js покаже 404, це ОК.
- Кнопка перемикача мови — заглушка без логіки.

### `components/layout/Footer.tsx` — приблизна структура

```tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Recipe Atlas
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex gap-4 text-sm">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
```

### `app/page.tsx` — заглушка

```tsx
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Recipe Atlas</h1>
      <p className="mt-4 text-muted-foreground">
        Recipes from around the world. Coming soon.
      </p>
    </div>
  );
}
```

### `app/globals.css`

Після `shadcn init` там будуть CSS-змінні. Переконатись, що є:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... решта змінних від shadcn ... */
  }
}
```

---

## 🧪 Як перевірити

1. `cd apps/web && pnpm dev`.
2. Відкрити `http://localhost:3001`.
3. Перевірити:
   - Вгорі header з логотипом і навігацією
   - Посередині main з текстом «Recipe Atlas»
   - Внизу footer з copyright
4. Клікнути на «Recipes» — перейти на `/recipes` — 404 (це ОК, сторінка ще не створена).
5. Клікнути на логотип — повернутись на головну.
6. `view-source` — перевірити, що є `<header>`, `<main>`, `<footer>`, `<nav>`.
7. `pnpm build` — має пройти без помилок.
8. Chrome DevTools → Lighthouse → Accessibility ≥ 90.

---

## ⚠️ Що може піти не так

| Проблема | Рішення |
|---|---|
| `shadcn init` не знаходить Tailwind | Переконатись, що Tailwind встановлено (create-next-app з `--tailwind`) |
| Компонент shadcn не імпортується | Перевірити alias `@/` у `tsconfig.json` |
| Шрифт не завантажується | Перевірити, що `subsets: ['latin', 'cyrillic']` |
| Стилі не застосовуються | Перевірити `import './globals.css'` у layout |
| `cn()` не знаходиться | Перевірити `lib/utils.ts` — його створює shadcn |

---

## 📎 Контекст

- `00_CONTEXT.md` → розділ 6 (Технічний стек → Frontend)
- `00_CONTEXT.md` → розділ 8 (Структура репозиторію)
- `01_ROADMAP.md` → E1 — Foundation
- `docs/tasks/01-monorepo-setup.md`

---

## 💬 Commit message

```
feat(web): add base layout with tailwind and shadcn

- init tailwind with css variables via shadcn
- add shadcn components: button, card, input, dropdown-menu
- add root layout with header, main, footer
- add Header with next/link navigation and aria-label
- add Footer with copyright and links
- add Inter font via next/font with cyrillic subset
- add temporary home page placeholder
```

---

## 🔀 Git workflow

```bash
git checkout -b feat/04-layout-tailwind-shadcn

# ... робота ...

git add apps/web
git commit -m "feat(web): add base layout with tailwind and shadcn"
git push origin feat/04-layout-tailwind-shadcn
```

**PR:**
- Назва: `feat(web): add base layout with tailwind and shadcn`
- Опис: Acceptance Criteria + скріншот сторінки
- Після merge — видалити гілку

---

## 📝 Нотатки

Заповнюється після завершення.

- Чи знадобилось розширювати `tailwind.config.ts`?
- Чи сподобався набір компонентів shadcn за замовчуванням?
- Чи треба винести dark mode toggle в окрему задачу?
- Які ще компоненти shadcn знадобляться в E2/E3?