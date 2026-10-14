import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Recipe Atlas
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/recipes">Recipes</Link>
            </li>
            <li>
              <Link href="/recipes/low-calorie">Low-calorie</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className="border px-3 py-1 text-sm rounded"
          aria-label="Language switcher"
        >
          EN
        </button>
      </div>
    </header>
  );
}
