import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set. Exiting.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

app.use("/api/auth", authRouter);

app.get("/", (_req, res) => res.send("Auth server is running"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});