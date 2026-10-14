import type { Core } from '@strapi/strapi';

const RECIPE_PUBLIC_ACTIONS = ['api::recipe.recipe.find', 'api::recipe.recipe.findOne'];

export async function enablePublicRecipeRead(strapi: Core.Strapi): Promise<void> {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('Public role not found: skipped enabling recipe read access');
    return;
  }

  for (const action of RECIPE_PUBLIC_ACTIONS) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });

    if (existing) continue;

    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    });
  }

  strapi.log.info('Enabled public read access for recipes');
}
