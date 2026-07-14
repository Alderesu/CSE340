import db from './db.js';

/**
 * Gets all service project categories from the database.
 */
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { getAllCategories };
