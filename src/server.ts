import express, { type Application } from "express"
import dotenv from "dotenv"

dotenv.config({path : "src/.env"})

import connectDB from "./config/database.js";
const app: Application = express()

connectDB();

app.listen(3000, () => {
    console.log("Server is running on 3000")
})