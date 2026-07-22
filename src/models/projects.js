import db from './db.js';

/**
 * Gets all service projects along with the name of the sponsoring organization.
 */
const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               p.organization_id, o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Gets the next N upcoming service projects (date today or later),
 * along with the sponsoring organization name.
 */
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               p.organization_id, o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const queryParams = [numberOfProjects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Gets the details of a single service project by its ID,
 * along with the sponsoring organization name.
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date,
               p.organization_id, o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Gets all service projects sponsored by a specific organization.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Creates a new service project and returns its new ID.
 * (The date value is stored in the project_date column.)
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

/**
 * Updates an existing service project (including which organization sponsors it).
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE project
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject
};
