export interface SeedRecipe {
  title: string;
  slug: string;
  description: string;
  ingredients: { name: string; amount: number; unit: string }[];
  steps: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const seedRecipes: SeedRecipe[] = [
  {
    title: 'Pasta Carbonara',
    slug: 'pasta-carbonara',
    description: 'Classic Italian pasta with eggs, cheese, guanciale and black pepper.',
    ingredients: [
      { name: 'Spaghetti', amount: 200, unit: 'g' },
      { name: 'Guanciale', amount: 100, unit: 'g' },
      { name: 'Egg yolks', amount: 4, unit: 'pcs' },
      { name: 'Pecorino Romano', amount: 50, unit: 'g' },
      { name: 'Black pepper', amount: 1, unit: 'tsp' },
    ],
    steps:
      '1. Boil pasta. 2. Fry guanciale. 3. Mix eggs with cheese. 4. Combine off heat. 5. Serve with pepper.',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'medium',
  },
  {
    title: 'Miso Soup',
    slug: 'miso-soup',
    description: 'Traditional Japanese soup with miso paste, tofu and seaweed.',
    ingredients: [
      { name: 'Miso paste', amount: 2, unit: 'tbsp' },
      { name: 'Dashi stock', amount: 600, unit: 'ml' },
      { name: 'Tofu', amount: 100, unit: 'g' },
      { name: 'Wakame', amount: 5, unit: 'g' },
      { name: 'Green onions', amount: 2, unit: 'pcs' },
    ],
    steps: '1. Heat dashi. 2. Add tofu and wakame. 3. Dissolve miso. 4. Garnish with onions.',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
  },
  {
    title: 'Borscht',
    slug: 'borscht',
    description: 'Traditional Ukrainian beetroot soup with cabbage and sour cream.',
    ingredients: [
      { name: 'Beets', amount: 3, unit: 'pcs' },
      { name: 'Cabbage', amount: 300, unit: 'g' },
      { name: 'Potatoes', amount: 4, unit: 'pcs' },
      { name: 'Beef broth', amount: 2, unit: 'l' },
      { name: 'Sour cream', amount: 100, unit: 'g' },
    ],
    steps:
      '1. Boil broth. 2. Add potatoes and cabbage. 3. Add grated beets. 4. Simmer 20 min. 5. Serve with sour cream.',
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    difficulty: 'medium',
  },
  {
    title: 'Tacos al Pastor',
    slug: 'tacos-al-pastor',
    description: 'Mexican tacos with marinated pork, pineapple and cilantro.',
    ingredients: [
      { name: 'Pork shoulder', amount: 500, unit: 'g' },
      { name: 'Pineapple', amount: 200, unit: 'g' },
      { name: 'Corn tortillas', amount: 8, unit: 'pcs' },
      { name: 'Cilantro', amount: 20, unit: 'g' },
      { name: 'Onion', amount: 1, unit: 'pcs' },
    ],
    steps:
      '1. Marinate pork. 2. Grill with pineapple. 3. Chop finely. 4. Warm tortillas. 5. Assemble with cilantro and onion.',
    prepTime: 30,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
  },
  {
    title: 'Ratatouille',
    slug: 'ratatouille',
    description: 'French vegetable stew with zucchini, eggplant, peppers and tomatoes.',
    ingredients: [
      { name: 'Zucchini', amount: 2, unit: 'pcs' },
      { name: 'Eggplant', amount: 1, unit: 'pcs' },
      { name: 'Bell pepper', amount: 2, unit: 'pcs' },
      { name: 'Tomatoes', amount: 4, unit: 'pcs' },
      { name: 'Olive oil', amount: 3, unit: 'tbsp' },
    ],
    steps: '1. Slice vegetables. 2. Sauté separately. 3. Combine in pot. 4. Simmer 30 min.',
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    difficulty: 'easy',
  },
];
