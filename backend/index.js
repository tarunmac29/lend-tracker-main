
require("dotenv").config();

const app = require("./src/app");
const { testDatabaseConnection } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Check MySQL connection first
        await testDatabaseConnection();

        // Start Express server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`LendTrack server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();
