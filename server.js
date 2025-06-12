// server.js

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
  origin: "https://ai-insurance-analyser-frontend-6jfh.vercel.app", // frontend origin
  credentials: true,              // allow cookies & auth headers
}));

// Middleware to parse JSON
app.use(express.json());

// Import routes
import summarizerRoutes from "./routes/summarizerRoutes.js";
import comparatorRoutes from "./routes/comparatorRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Route Mounting
app.use("/api", summarizerRoutes);            // POST /api/summarize
app.use("/api/compare", comparatorRoutes);    // POST /api/compare
app.use("/api", chatbotRoutes);       // POST /api/chatbot
app.use("/api/reviews", reviewRoutes);        // GET/POST /api/reviews
app.use("/api/auth", authRoutes);             // POST /api/auth/login, signup

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
