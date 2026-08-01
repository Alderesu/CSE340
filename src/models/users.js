import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Creates a new user with the default 'user' role and returns the new user ID.
 * The role_id is looked up by name via a subquery.
 */
const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id;
    `;
    const queryParams = [name, email, passwordHash, defaultRole];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
};

/**
 * Finds a user by email, including their role name (joined from roles).
 * Returns the row (with password_hash) or null.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email + password.
 * Returns the user object (WITHOUT password_hash) on success, or null.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);
    if (!passwordMatches) {
        return null;
    }

    // Never keep the hash on the object we hand back to the app/session
    delete user.password_hash;
    return user;
};

/**
 * Gets all registered users with their role name (for the admin users page).
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };
