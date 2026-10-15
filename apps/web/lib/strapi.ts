import { env } from './env';

// ---------- Types ----------

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeImage {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface Recipe {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  image: RecipeImage | null;
  ingredients: Ingredient[];
  steps: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// ---------- Client ----------

async function fetchStrapi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${env.STRAPI_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

// ---------- Public API ----------

export async function getRecipes(): Promise<Recipe[]> {
  const res = await fetchStrapi<StrapiResponse<Recipe[]>>('/api/recipes?populate=*');
  return res.data;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const res = await fetchStrapi<StrapiResponse<Recipe[]>>(
    `/api/recipes?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
  );
  return res.data[0] ?? null;
}
