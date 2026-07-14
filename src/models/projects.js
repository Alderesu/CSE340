import db from './db.js';

/**
 * Gets all service projects along with the name of the organization
 * that sponsors each one. The INNER JOIN links each project to its
 * organization using the organization_id foreign key.
 */
const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { getAllProjects };
