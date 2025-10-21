import express from "express";
import cors from "cors";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/repoRoutes.js";

const app = express();
app.use(express.json()); // parse JSON request bodies
app.use(cors()); //allows requests from the frontend

// Setting mini routers
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Initial route
app.get("/", (req, res) => res.send("GitHub Repo Explorer"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

app.listen(8000, console.log("server connected on port 8000"));
