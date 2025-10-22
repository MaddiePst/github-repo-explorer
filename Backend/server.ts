// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./Routes/authRoutes";
import userRoutes from "./Routes/repoRoutes";

dotenv.config(); // run once, immediately
const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => res.send("GitHub Repo Explorer API"));

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
