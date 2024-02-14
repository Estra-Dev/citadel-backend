import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
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
