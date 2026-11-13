
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LendTrack API is running"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.statusCode ? err.message : "Internal server error"
    });
});

module.exports = app;
