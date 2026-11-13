
/**
 * LendTrack Authentication Tables
 *
 * Existing admins table is preserved.
 * Old empty admin_sessions table is upgraded.
 */

exports.up = async function (knex) {
    // 1. Create admins table only if it does not exist.
    const adminsExists = await knex.schema.hasTable("admins");

    if (!adminsExists) {
        await knex.schema.createTable("admins", (table) => {
            table.tinyint("id").unsigned().notNullable().defaultTo(1);
            table.string("email", 255).notNullable().unique();
            table.string("password_hash", 255).notNullable();

            table.boolean("is_active").notNullable().defaultTo(true);

            table.tinyint("failed_login_attempts")
                .unsigned()
                .notNullable()
                .defaultTo(0);

            table.dateTime("locked_until").nullable();
            table.dateTime("last_login_at").nullable();
            table.dateTime("password_changed_at").nullable();

            table.timestamp("created_at")
                .notNullable()
                .defaultTo(knex.fn.now());

            table.timestamp("updated_at")
                .notNullable()
                .defaultTo(knex.fn.now());

            table.primary("id");
            table.check("id = 1", [], "only_one_admin");
        });
    }

    // 2. Check existing admin_sessions table.
    const sessionsExists = await knex.schema.hasTable("admin_sessions");

    if (sessionsExists) {
        const hasOldColumn = await knex.schema.hasColumn(
            "admin_sessions",
            "session_id"
        );

        const hasNewColumn = await knex.schema.hasColumn(
            "admin_sessions",
            "session_token_hash"
        );

        // Old session table: ensure it contains no records before replacing.
        if (hasOldColumn && !hasNewColumn) {
            const result = await knex("admin_sessions").count({
                total: "session_id",
            });

            if (Number(result[0].total) > 0) {
                throw new Error(
                    "Cannot upgrade admin_sessions: existing sessions found."
                );
            }

            await knex.schema.dropTable("admin_sessions");
        } else if (!hasNewColumn) {
            throw new Error(
                "Unexpected admin_sessions structure. Manual inspection required."
            );
        }
    }

    // 3. Create final admin_sessions table if needed.
    const finalSessionsExists = await knex.schema.hasTable("admin_sessions");

    if (!finalSessionsExists) {
        await knex.schema.createTable("admin_sessions", (table) => {
            table.specificType("session_token_hash", "CHAR(64)").notNullable();

            table.tinyint("admin_id").unsigned().notNullable();

            table.dateTime("expires_at").notNullable();

            table.timestamp("created_at")
                .notNullable()
                .defaultTo(knex.fn.now());

            table.dateTime("last_seen_at").nullable();
            table.dateTime("revoked_at").nullable();

            table.primary("session_token_hash");

            table.index("admin_id", "idx_sessions_admin_id");
            table.index("expires_at", "idx_sessions_expiry");

            table.foreign("admin_id")
                .references("admins.id")
                .onDelete("CASCADE");
        });
    }
};

// This is a baseline adoption migration.
// Its rollback intentionally does not delete existing authentication tables.
exports.down = async function () {
    // Intentionally left empty to protect existing authentication data.
};
