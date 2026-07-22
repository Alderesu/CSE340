import db from './db.js';

/**
 * Gets all organizations from the database.
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Gets the details of a single organization by its ID.
 * Uses a parameterized query ($1) to prevent SQL injection.
 */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Return the first row, or null if no organization was found
    return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllOrganizations, getOrganizationDetails };
