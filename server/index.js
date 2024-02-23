import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(statusCode, message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

try {
  const connetDB = await mongoose.connect(process.env.MONGO_URL);
  if (connetDB) {
    console.log("MongoDB is Connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
} catch (error) {
  console.log(error);
}
