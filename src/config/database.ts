import dns from "node:dns"
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB;

        if (!mongoURI) {
            console.error("MONGODB_URI is not defined")
        }

        const conn = await mongoose.connect(mongoURI!)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
    }

}

export default connectDB;
