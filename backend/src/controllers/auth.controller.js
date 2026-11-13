
const authService = require("../services/auth.service");
const sessionModel = require("../models/session.model");
const { hashSessionToken } = require("../utils/session.util");
const crypto = require("crypto");
const COOKIE_NAME = "lendtrack_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Cookie security settings
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE
};

// Create admin account

async function setupAdmin(req, res, next) {
    try {
        const configuredSecret = process.env.ADMIN_SETUP_SECRET;
        const providedSecret = req.get("x-admin-setup-secret");

        if (!configuredSecret || !providedSecret) {
            return res.status(403).json({
                success: false,
                message: "Admin setup is not authorized"
            });
        }

        const expected = Buffer.from(configuredSecret);
        const received = Buffer.from(providedSecret);

        if (
            expected.length !== received.length ||
            !crypto.timingSafeEqual(expected, received)
        ) {
            return res.status(403).json({
                success: false,
                message: "Admin setup is not authorized"
            });
        }

        const { email, password } = req.body;

        const result = await authService.createAdmin(email, password);

        return res.status(201).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
}


// Admin login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const result = await authService.loginAdmin(email, password);

        res.cookie(COOKIE_NAME, result.token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            admin: result.admin
        });
    } catch (error) {
        next(error);
    }
}

// Admin logout
async function logout(req, res, next) {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (token) {
            const tokenHash = hashSessionToken(token);
            await sessionModel.revokeSession(tokenHash);
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
}


function getCurrentAdmin(req, res) {
    return res.status(200).json({
        success: true,
        admin: req.admin
    });
}


module.exports = {
    setupAdmin,
    login,
    logout,
    getCurrentAdmin
};