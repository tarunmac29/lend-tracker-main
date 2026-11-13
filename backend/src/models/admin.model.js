
const { pool } = require("../config/database");

// Find admin using email
async function findByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT * FROM admins WHERE email = ? LIMIT 1`,
        [email]
    );

    return rows[0] || null;
}

// Find admin using ID
async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM admins WHERE id = ? LIMIT 1`,
        [id]
    );

    return rows[0] || null;
}

// Create admin account
async function createAdmin(email, passwordHash) {
    const [result] = await pool.execute(
        `INSERT INTO admins (id, email, password_hash)
         VALUES (1, ?, ?)`,
        [email, passwordHash]
    );

    return result.insertId;
}

// Update last login time
async function updateLoginSuccess(id) {
    await pool.execute(
        `UPDATE admins
         SET last_login_at = NOW(),
             failed_login_attempts = 0,
             locked_until = NULL
         WHERE id = ?`,
        [id]
    );
}

// Record failed login

// Record failed login and lock account after 5 attempts

async function recordFailedLogin(id) {
    await pool.execute(
        `UPDATE admins
         SET
            failed_login_attempts = CASE
                WHEN locked_until IS NOT NULL
                     AND locked_until <= UTC_TIMESTAMP()
                THEN 1
                ELSE failed_login_attempts + 1
            END,
            locked_until = CASE
                WHEN locked_until IS NOT NULL
                     AND locked_until <= UTC_TIMESTAMP()
                THEN NULL
                WHEN failed_login_attempts >= 5
                THEN DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)
                ELSE locked_until
            END
         WHERE id = ?`,
        [id]
    );
}


// Reset failed attempts
async function resetFailedAttempts(id) {
    await pool.execute(
        `UPDATE admins
         SET failed_login_attempts = 0,
             locked_until = NULL
         WHERE id = ?`,
        [id]
    );
}

module.exports = {
    findByEmail,
    findById,
    createAdmin,
    updateLoginSuccess,
    recordFailedLogin,
    resetFailedAttempts
};
