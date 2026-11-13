
const sessionModel = require("../models/session.model");
const { hashSessionToken } = require("../utils/session.util");

const COOKIE_NAME = "lendtrack_session";

async function authenticateAdmin(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Hash the cookie token before database lookup
        const tokenHash = hashSessionToken(token);

        // Check whether session is valid
        const session = await sessionModel.findActiveSession(tokenHash);

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired or invalid. Please login again."
            });
        }

        // Attach admin details to request
        req.admin = {
            id: session.admin_id,
            email: session.email
        };

        await sessionModel.updateLastSeen(tokenHash);

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { authenticateAdmin };
