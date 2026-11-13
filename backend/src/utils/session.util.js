
const crypto = require("crypto");

// Generate a secure random session token
function generateSessionToken() {
    return crypto.randomBytes(32).toString("hex");
}

// Convert raw token into SHA-256 hash
function hashSessionToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

// Generate token and its hash together
function createSessionToken() {
    const token = generateSessionToken();

    return {
        token,
        tokenHash: hashSessionToken(token)
    };
}

module.exports = {
    generateSessionToken,
    hashSessionToken,
    createSessionToken
};
