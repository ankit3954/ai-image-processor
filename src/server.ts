import 'dotenv/config'; 
// dotenv.config()
import cors from "cors";
import express, { type Application } from "express"

import connectDB from "./config/database.js";
import authRouter from "./modules/auth/auth.router.js";
import imageRouter from "./modules/image/image.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectQueue } from './config/rabbitmq.js';
const app = express()
app.use(cors())
app.use(express.json());

connectDB();

app.use("/auth", authRouter);
app.use("/image", imageRouter);


app.use(errorHandler)
app.listen(3000, async() => {
    console.log("Server is running on 3000")
    try {
        await connectQueue();
    } catch (error) {
        console.log("Could not boot RabbitMQ. Server shutting down.");
        process.exit(1);
    }
})