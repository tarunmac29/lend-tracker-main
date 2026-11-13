
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

// Hash password before saving it in database
async function hashPassword(password) {
    if (!password || typeof password !== "string") {
        throw new Error("Valid password is required");
    }

    return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify entered password during login
async function verifyPassword(password, hashedPassword) {
    if (
        !password ||
        typeof password !== "string" ||
        !hashedPassword
    ) {
        return false;
    }

    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    verifyPassword
};
