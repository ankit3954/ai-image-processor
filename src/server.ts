import 'dotenv/config'; 
// dotenv.config()

import express, { type Application } from "express"

import connectDB from "./config/database.js";
import authRouter from "./modules/auth/auth.router.js";
import imageRouter from "./modules/image/image.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express()
app.use(express.json());

connectDB();

app.use("/auth", authRouter);
app.use("/image", imageRouter);


app.use(errorHandler)
app.listen(3000, () => {
    console.log("Server is running on 3000")
})