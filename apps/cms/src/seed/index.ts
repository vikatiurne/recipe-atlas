import type { Core } from '@strapi/strapi';
import { seedRecipes as recipes } from './recipes';

export { enablePublicRecipeRead } from './permissions';

export async function seedRecipes(strapi: Core.Strapi): Promise<void> {
  const count = await strapi.documents('api::recipe.recipe').count({});

  if (count > 0) {
    strapi.log.info(`Seed skipped: ${count} recipes already exist`);
    return;
  }

  for (const recipe of recipes) {
    await strapi.documents('api::recipe.recipe').create({
      data: recipe,
      status: 'published',
    });
  }

  strapi.log.info(`Seeded ${recipes.length} recipes`);
}
