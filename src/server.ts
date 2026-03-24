import express, { type Application } from "express"
import dotenv from "dotenv"

dotenv.config({path : "src/.env"})

import connectDB from "./config/database.js";
import authRouter from "./modules/auth/auth.router.js";
const app = express()
app.use(express.json());

connectDB();

app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Server is running on 3000")
})