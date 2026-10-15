import { getRecipes, type Recipe } from '@/lib/strapi';

export const instant = false;

export default async function TestRecipesPage() {
  let recipes: Recipe[] = [];
  let error: string | null = null;

  try {
    recipes = await getRecipes();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch from Strapi';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Test Recipes ({recipes.length})</h1>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          Error connecting to Strapi: {error}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {recipes.map((r) => (
          <li key={r.documentId}>
            <strong>{r.title}</strong> — {r.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}
