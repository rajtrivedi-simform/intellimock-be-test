import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import userRoutes from "./routes/user.auth.routes";

dotenv.config(); // Load .env variables

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Routes
app.use("/api/v1/users/", userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 IntelliMock API is running...");
});

export default app;
