import mongoose from 'mongoose';
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionProcess = await mongoose.connect(`${process.env.MongoDB_URL}/${DB_NAME}`);
        console.log(`\nMongoDB Connection successful!!! DB host: ${connectionProcess.connection.host}`);
    } catch (err) {
        console.log("MongoDB connection error:", err);
        process.exit(1);
    }
}
export default connectDB;
