
const adminModel = require("../models/admin.model");
const sessionModel = require("../models/session.model");

const {
    hashPassword,
    verifyPassword
} = require("../utils/password.util");

const {
    createSessionToken
} = require("../utils/session.util");

// Create the single admin account
async function createAdmin(email, password) {
    if (!email || typeof email !== "string") {
        throw new Error("Valid email is required");
    }

    if (!password || typeof password !== "string" || password.length < 10) {
        throw new Error("Password must be at least 10 characters long");
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
        throw new Error("Password cannot exceed 72 bytes");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await adminModel.findById(1);

    if (existingAdmin) {
        throw new Error("Admin account already exists");
    }

    const passwordHash = await hashPassword(password);

    await adminModel.createAdmin(normalizedEmail, passwordHash);

    return {
        message: "Admin account created successfully"
    };
}

// Admin login
async function loginAdmin(email, password) {
    if (!email || typeof email !== "string" ||
        !password || typeof password !== "string") {
        throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await adminModel.findByEmail(normalizedEmail);

    if (!admin || !admin.is_active) {
        throw new Error("Invalid email or password");
    }

    if (admin.locked_until &&
        new Date(admin.locked_until).getTime() > Date.now()) {
        throw new Error("Account temporarily locked. Try again later.");
    }

    const passwordIsValid = await verifyPassword(
        password,
        admin.password_hash
    );

    if (!passwordIsValid) {
        await adminModel.recordFailedLogin(admin.id);
        throw new Error("Invalid email or password");
    }

    await adminModel.updateLoginSuccess(admin.id);

    const { token, tokenHash } = createSessionToken();

    await sessionModel.createSession(tokenHash, admin.id);

    return {
        token,
        admin: {
            id: admin.id,
            email: admin.email
        }
    };
}

module.exports = {
    createAdmin,
    loginAdmin
};
