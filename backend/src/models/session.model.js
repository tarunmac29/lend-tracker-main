
const { pool } = require("../config/database");

// Create a new 7-day admin session
async function createSession(sessionTokenHash, adminId) {
    const [result] = await pool.execute(
        `INSERT INTO admin_sessions
            (session_token_hash, admin_id, expires_at)
         VALUES
            (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))`,
        [sessionTokenHash, adminId]
    );

    return result.affectedRows === 1;
}

// Find a valid, non-expired session
async function findActiveSession(sessionTokenHash) {
    const [rows] = await pool.execute(
        `SELECT
            s.session_token_hash,
            s.admin_id,
            s.expires_at,
            a.email,
            a.is_active
         FROM admin_sessions s
         INNER JOIN admins a ON a.id = s.admin_id
         WHERE s.session_token_hash = ?
           AND s.revoked_at IS NULL
           AND s.expires_at > UTC_TIMESTAMP()
           AND a.is_active = TRUE
         LIMIT 1`,
        [sessionTokenHash]
    );

    return rows[0] || null;
}

// Update session activity
async function updateLastSeen(sessionTokenHash) {
    await pool.execute(
        `UPDATE admin_sessions
         SET last_seen_at = UTC_TIMESTAMP()
         WHERE session_token_hash = ?
           AND revoked_at IS NULL`,
        [sessionTokenHash]
    );
}

// Revoke one session (logout from current device)
async function revokeSession(sessionTokenHash) {
    const [result] = await pool.execute(
        `UPDATE admin_sessions
         SET revoked_at = UTC_TIMESTAMP()
         WHERE session_token_hash = ?
           AND revoked_at IS NULL`,
        [sessionTokenHash]
    );

    return result.affectedRows === 1;
}

// Revoke all sessions for an admin
async function revokeAllSessions(adminId) {
    const [result] = await pool.execute(
        `UPDATE admin_sessions
         SET revoked_at = UTC_TIMESTAMP()
         WHERE admin_id = ?
           AND revoked_at IS NULL`,
        [adminId]
    );

    return result.affectedRows;
}

module.exports = {
    createSession,
    findActiveSession,
    updateLastSeen,
    revokeSession,
    revokeAllSessions
};
