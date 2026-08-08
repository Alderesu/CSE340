import db from './db.js';

/**
 * Signs a user up as a volunteer for a project.
 * ON CONFLICT DO NOTHING prevents an error if they already volunteered.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Removes a user's volunteer signup from a project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Returns true if the user is currently volunteering for the project.
 */
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Gets all projects a user has volunteered for (with organization name).
 */
const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.project_date, p.location,
               o.name AS organization_name
        FROM project_volunteer AS pv
        INNER JOIN project AS p ON pv.project_id = p.project_id
        INNER JOIN organization AS o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.project_date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isUserVolunteering, getProjectsByVolunteer };
