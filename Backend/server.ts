import dotenv from "dotenv"; // reads env file
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./Routes/authRoutes";
import repoRoutes from "./Routes/repoRoutes";

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(cors());
app.use(express.json()); // parses incoming JSON request bodies
app.use(morgan("dev")); // logs requests to the console

app.use("/auth", authRoutes);
app.use("/repo", repoRoutes);

app.get("/", (req, res) => res.send("GitHub Repo Explorer API"));

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
