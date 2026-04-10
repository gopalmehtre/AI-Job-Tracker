import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import aiRoutes from "./routes/aiRoutes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch(console.error);

export default app;
